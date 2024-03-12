class HTMLTrigger {

    #canOptions;
    #currentSelectedRadioRegistry;
    #triggerRegistry;

    constructor() {
        this.#triggerRegistry = new Map();
        this.#currentSelectedRadioRegistry = new Map();
        this.#canOptions = false;
        this.checkOptions();
    }

    checkOptions() {
        try {
            const callback = () => { };
            const options = { capture: true };
            document.addEventListener('click', callback, options);
            document.removeEventListener('click', callback, options);
            this.#canOptions = true;
        }
        catch (error) {
            // do nothing
        }
    }

    registerUIEvent(message, clickEventCallback, keyMap, options) {
        const uiEventId = message.registerTrigger.uiEventId;
        if (!this.#triggerRegistry.has(uiEventId)) {
            const controlType = message.registerTrigger.uiEventRequest.uiobjectControlType;
            var element = this.getElementByXpath(message.registerTrigger.uiEventRequest.selectionCriteria.DOMXPath.value.string);
            const action = this.parseAction(message.registerTrigger.uiEventRequest.uiobjectTriggerEvent.action, controlType);
            var listenerType = HTMLTriggerListenerType.Element;
            if (element) {
                this.addElementEventListener(element, action, clickEventCallback, options, controlType);
            } else {
                this.addDocumentEventListener(action, clickEventCallback, options);
                listenerType = HTMLTriggerListenerType.Document;
            }
            const selectionCriterion = this.generateSearchCriterionMAP(message.registerTrigger.uiEventRequest);
            this.#triggerRegistry.set(uiEventId, new TriggerData(message.registerTrigger, selectionCriterion, action, keyMap, listenerType));
            console.log(`UiEventId ${uiEventId} registered`);
        } else {
            console.log(`UiEventId ${uiEventId} is already registered`);
        }
    }

    unregisterUIEvent(message, clickEventCallback, options) {
        var uiEventId = message.unregisterTrigger.uiEventId;
        if (this.#triggerRegistry.has(uiEventId)) {
            const controlType = this.#triggerRegistry.get(uiEventId).request.uiEventRequest.uiobjectControlType;
            var action = this.#triggerRegistry.get(uiEventId).action;
            var element = this.getElementByXpath(this.#triggerRegistry.get(uiEventId).request.uiEventRequest.selectionCriteria.DOMXPath.value.string);
            this.#triggerRegistry.delete(uiEventId);
            this.removeListeners(action, clickEventCallback, element, options, controlType);
            console.log(`UiEventId ${uiEventId} removed`);
        } else {
            console.log(`UiEventId ${uiEventId} not found for unregister event`);
        }
    }

    addElementEventListener(element, action, clickEventCallback, options, controlType) {

        // Radio buttons are represented by a group, identified by name. To support 'Lost Selection' and 'Selection Changed' events, its required to register
        // and handle event for all radio button because when radio button loses selection, its actually one of other radio button which is selected and is
        // passed to event.target
        if (controlType == 'RADIO') {
            var radios = document.querySelectorAll(`input[type=radio][name="${element.name}"]`);
            if (radios) {
                var selectedRadio = this.getSelectedRadioButton(element.name);
                this.#currentSelectedRadioRegistry.set(element.name, selectedRadio);
                Array.from(radios).forEach((radio) => {
                    radio.removeEventListener(action, clickEventCallback);
                    radio.addEventListener(action, clickEventCallback);
                });
            } else {
                console.log(`No radio button group found for ${element.name}`);
            }
        } else {
            // Make sure event listener isn't registered multiple times.
            element.removeEventListener(action, clickEventCallback, this.getOptions(options));
            element.addEventListener(action, clickEventCallback, this.getOptions(options));
        }
    }

    getMatchedUIEventIds(event) {
        var matchedEventIds = []
        const listenerType = event.currentTarget.nodeName === '#document' ? HTMLTriggerListenerType.Document : HTMLTriggerListenerType.Element;
        this.#triggerRegistry.forEach((triggerData, uiEventId) => {
            const destAction = triggerData.action;
            const destListenerType = triggerData.listenerType;
            if (event.type === triggerData.action && listenerType === destListenerType) {
                switch (destAction) {
                    case 'keydown':
                        if (this.verifyKeypressEvent(event, triggerData)) {
                            matchedEventIds.push(uiEventId);
                        }
                        break;
                    case 'change': {
                        const controlType = triggerData.request.uiEventRequest.uiobjectControlType;
                        if (controlType == 'RADIO' && this.getRadioButtonEventIsValid(event, triggerData)) {
                            matchedEventIds.push(uiEventId);
                        } else if ((controlType == 'COMBOBOX' || controlType == 'LISTVIEW') && this.verifyClickEvent(event, triggerData)) {
                            matchedEventIds.push(uiEventId);
                        }
                    }
                        break;
                    case 'contextmenu':
                    case 'focusout':
                    case 'focus':
                    case 'click':
                        if (this.verifyClickEvent(event, triggerData)) {
                            matchedEventIds.push(uiEventId);
                        }
                        break;
                    default:
                        console.log(`action ${destAction} not matched`);
                        break;
                }
            }
        });
        this.checkAndSetSelectedRadioButtonRegistry(event);
        return matchedEventIds;
    }

    verifyClickEvent(event, triggerData) {
        const destSelectionCriterion = this.generateElementMap(event.currentTarget, triggerData.selectionCriterion);
        const destStringifyAttr = TriggerData.stringifySelectionCriteria(destSelectionCriterion);
        if (triggerData.hasMatch(destSelectionCriterion, destStringifyAttr)) {
            const action = triggerData.request.uiEventRequest.uiobjectTriggerEvent.action;
            // Check for Checked/Unchecked Event
            if (action == 'CHECK' || action == 'UNCHECK') {
                return this.getCheckboxEventIsValid(event, action);
            } else {
                return true;
            }
        }
        return false;
    }

    verifyKeypressEvent(event, triggerData) {
        const destSelectionCriterion = this.generateElementMap(event.target, triggerData.selectionCriterion);
        const destStringifyAttr = TriggerData.stringifySelectionCriteria(destSelectionCriterion);
        if (triggerData.hasMatch(destSelectionCriterion, destStringifyAttr)) {
            const modifierKeys = TriggerData.stringifySelectionCriteria(TriggerData.getModifierKeys(event));
            const keyCode = event.which || event.keyCode;
            if (triggerData.hasHotkeyMatch(modifierKeys, keyCode)) {
                return true;
            }
        }
        return false;
    }

    getRadioButtonEventIsValid(event, triggerData) {
        const action = triggerData.request.uiEventRequest.uiobjectTriggerEvent.action;
        if (action == 'SELECT' && event.target.checked) {
            return this.getRadioButtonSelectionIsValid(event, triggerData);
        } else if (action == 'DESELECT' && this.#currentSelectedRadioRegistry.has(event.target.name)) {
            return this.getRadioButtonLostSelectionIsValid(event, triggerData);
        } else if (action == 'SELECTIONCHANGED') {
            return this.getRadioButtonSelectionIsValid(event, triggerData) || this.getRadioButtonLostSelectionIsValid(event, triggerData);
        }
        return false;
    }

    getRadioButtonSelectionIsValid(event, triggerData) {
        const destSelectionCriterion = this.generateElementMap(event.target, triggerData.selectionCriterion);
        const destStringifyAttr = TriggerData.stringifySelectionCriteria(destSelectionCriterion);
        if (triggerData.hasMatch(destSelectionCriterion, destStringifyAttr)) {
            return true;
        } else {
            return false;
        }
    }

    getRadioButtonLostSelectionIsValid(event, triggerData) {
        const lastSelectedRadio = this.#currentSelectedRadioRegistry.get(event.target.name);
        const lastSelectedRadioSelectionCriterion = this.generateElementMap(lastSelectedRadio, triggerData.selectionCriterion);
        const lastSelectedRadioStringifyAttr = TriggerData.stringifySelectionCriteria(lastSelectedRadioSelectionCriterion);
        if (triggerData.hasMatch(lastSelectedRadioSelectionCriterion, lastSelectedRadioStringifyAttr)) {
            return true;
        } else {
            return false;
        }
    }

    getCheckboxEventIsValid(event, action) {
        if (action == 'CHECK' && event.target.checked) {
            return true;
        } else if (action == 'UNCHECK' && !event.target.checked) {
            return true;
        } else {
            return false;
        }
    }

    checkAndSetSelectedRadioButtonRegistry(event) {
        if (event.target.type == 'radio') {
            this.#currentSelectedRadioRegistry.set(event.target.name, this.getSelectedRadioButton(event.target.name));
        }
    }

    addDocumentEventListener(action, clickEventCallback, options) {
        document.removeEventListener(action, clickEventCallback, this.getOptions(options));
        document.addEventListener(action, clickEventCallback, this.getOptions(options));
    }

    removeListeners(action, clickEventCallback, element, options, controlType) {
        if (element) {
            if (controlType == 'RADIO') {
                var radios = document.querySelectorAll(`input[type=radio][name="${element.name}"]`);
                Array.from(radios).forEach(radio => radio.removeEventListener(action, clickEventCallback));
                this.#currentSelectedRadioRegistry.delete(element.name);
            } else {
                element.removeEventListener(action, clickEventCallback, this.getOptions(options));
            }
        }
    }

    getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    parseAction(action, controlType) {

        switch (action) {
            case 'RIGHTCLICK':
                return 'contextmenu';
            case 'LOSTFOCUS':
                return 'focusout';
            case 'SETFOCUS_WITH_HOT_KEY':
            case 'CLICK_WITH_HOT_KEY':
                return 'keydown';
            case 'SETFOCUS':
                return 'focus';
            case 'DESELECT':
            case 'SELECT':
                return 'change';
            case 'SELECTIONCHANGED': {
                if (controlType == 'RADIO' || controlType == 'COMBOBOX' || controlType == 'LISTVIEW') {
                    return 'change';
                } else {
                    return 'click';
                }
            }
            case 'CHECK':
            case 'UNCHECK':
            case 'CLICK':
            default:
                return 'click';
        }
    }

    getSelectedRadioButton(radioGroupName) {
        return document.querySelector(`input[name="${radioGroupName}"]:checked`);
    }

    generateSearchCriterionMAP(uiEventRequest) {
        var attrMap = {};
        if (uiEventRequest
            && uiEventRequest.selectionCriteria) {
            for (let criterion in HTMLSelectionCriterion) {
                if (this.isSupportedSelectionCriterion(criterion)
                    && uiEventRequest.selectionCriteria[HTMLSelectionCriterion[criterion]] !== undefined
                    && uiEventRequest.selectionCriteria[HTMLSelectionCriterion[criterion]].enabled) {
                    attrMap[HTMLSelectionCriterion[criterion]] = uiEventRequest.selectionCriteria[HTMLSelectionCriterion[criterion]].value.string;
                }
            }
        }
        return attrMap;
    }

    generateElementMap(htmlElement, attrMap) {
        var elementAttributesMap = {};
        var htmlCommon = new HTMLCommon(htmlElement);

        for (let criterion in attrMap) {
            switch (criterion) {
                case HTMLSelectionCriterion.DOMXPath: {
                    elementAttributesMap[HTMLSelectionCriterion.DOMXPath] = htmlCommon.GetDOMXPath();
                    break;
                }
                case HTMLSelectionCriterion.HTMLTag: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLTag] = htmlCommon.GetHTMLTag();
                    break;
                }
                case HTMLSelectionCriterion.HTMLID: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLID] = htmlCommon.GetHTMLID();
                    break;
                }
                case HTMLSelectionCriterion.HTMLType: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLType] = htmlCommon.GetHTMLType();
                    break;
                }
                case HTMLSelectionCriterion.Path: {
                    // If element is at root level, the Create method will return integer value however selection criteria will return string always, this will generate differet strings when stringify
                    // E.g. HTML path can be simply -1 when its first control in the <body> tag. when returned as it is, it will be casted as integer as compared to other controls for which generally path
                    // is composed as pipe separated integers i.e. "4|2|1|1|1|-1|6|-3|2|4|1|1|1|2|1|-1|1" for normal textbox inside well designed Salseforce page.
                    const path = new HTMLObjectPath().Create(htmlElement);
                    elementAttributesMap[HTMLSelectionCriterion.Path] = path.toString();
                    break;
                }
                case HTMLSelectionCriterion.HTMLName: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLName] = htmlCommon.GetHTMLName();
                    break;
                }
                case HTMLSelectionCriterion.HTMLHref: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLHref] = htmlCommon.GetHTMLHref();
                    break;
                }
                case HTMLSelectionCriterion.HTMLInnerText: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLInnerText] = htmlCommon.GetHTMLInnerText();
                    break;
                }
                case HTMLSelectionCriterion.HTMLFrameName: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLFrameName] = htmlCommon.GetFrameName();
                    break;
                }
                case HTMLSelectionCriterion.OuterHTML: {
                    elementAttributesMap[HTMLSelectionCriterion.outerHTML] = htmlCommon.GetOuterHTML();
                    break;
                }
                case HTMLSelectionCriterion.HTMLClass: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLClass] = htmlCommon.GetHTMLClass();
                    break;
                }
                case HTMLSelectionCriterion.HTMLSourceIndex: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLSourceIndex] = htmlCommon.GetHTMLSourceIndex();
                    break;
                }
                case HTMLSelectionCriterion.IsVisible: {
                    elementAttributesMap[HTMLSelectionCriterion.IsVisible] = HTMLCommon.IsVisible(htmlElement);
                    break;
                }
                case HTMLSelectionCriterion.Role: {
                    elementAttributesMap[HTMLSelectionCriterion.Role] = htmlCommon.GetRole();
                    break;
                }
                case HTMLSelectionCriterion.InnerHTML: {
                    elementAttributesMap[HTMLSelectionCriterion.InnerHTML] = htmlCommon.GetInnerHTML();
                    break;
                }
                case HTMLSelectionCriterion.Left: {
                    elementAttributesMap[HTMLSelectionCriterion.Left] = Math.round(htmlCommon.GetHTMLIELeft(0, false), 0);
                    break;
                }
                case HTMLSelectionCriterion.HTMLTop: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLTop] = Math.round(htmlCommon.GetHTMLIETop(0, false), 0);
                    break;
                }
                case HTMLSelectionCriterion.HTMLLeft: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLLeft] = Math.round(htmlCommon.GetHTMLIELeft(0, false), 0);
                    break;
                }
                case HTMLSelectionCriterion.Parent: {
                    elementAttributesMap[HTMLSelectionCriterion.Parent] = htmlCommon.GetHTMLOffsetParent();
                    break;
                }
                case HTMLSelectionCriterion.Index: {
                    elementAttributesMap[HTMLSelectionCriterion.Index] = htmlCommon.GetHTMLTagIndex();
                    break;
                }
                case HTMLSelectionCriterion.Name: {
                    elementAttributesMap[HTMLSelectionCriterion.Name] = htmlCommon.GetName();
                    break;
                }
                case HTMLSelectionCriterion.States: {
                    elementAttributesMap[HTMLSelectionCriterion.States] = htmlCommon.GetStates();
                    break;
                }
                case HTMLSelectionCriterion.HTMLAlt: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLAlt] = htmlCommon.GetHTMLAlt();
                    break;
                }
                case HTMLSelectionCriterion.Height: {
                    elementAttributesMap[HTMLSelectionCriterion.Height] = Math.round(htmlCommon.GetHTMLHeight() * window.devicePixelRatio);;
                    break;
                }
                case HTMLSelectionCriterion.Width: {
                    elementAttributesMap[HTMLSelectionCriterion.Width] = Math.round(htmlCommon.GetHTMLWidth() * window.devicePixelRatio);
                    break;
                }
                case HTMLSelectionCriterion.HTMLHeight: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLHeight] = Math.round(htmlCommon.GetHTMLHeight() * window.devicePixelRatio);;
                    break;
                }
                case HTMLSelectionCriterion.HTMLTagIndex: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLTagIndex] = htmlCommon.GetHTMLTagIndexRecording(htmlElement);
                    break;
                }
                case HTMLSelectionCriterion.Top: {
                    elementAttributesMap[HTMLSelectionCriterion.Top] = Math.round(htmlCommon.GetHTMLIETop(0, false), 0);
                    break;
                }
                case HTMLSelectionCriterion.HTMLClassId: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLClassId] = htmlCommon.GetHTMLClassID();
                    break;
                }
                case HTMLSelectionCriterion.HTMLWidth: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLWidth] = Math.round(htmlCommon.GetHTMLWidth() * window.devicePixelRatio);
                    break;
                }
                case HTMLSelectionCriterion.Value: {
                    elementAttributesMap[HTMLSelectionCriterion.Value] = htmlCommon.GetHTMLValue();
                    break;
                }
                case HTMLSelectionCriterion.HTMLFrameSrc: {
                    elementAttributesMap[HTMLSelectionCriterion.HTMLFrameSrc] = htmlCommon.GetFrameSource();
                    break;
                }
                case HTMLSelectionCriterion.HTMLValue:
                case HTMLSelectionCriterion.Description:
                case HTMLSelectionCriterion.WindowTitle:
                case HTMLSelectionCriterion.DefaultAction:
                case HTMLSelectionCriterion.ItemName:
                case HTMLSelectionCriterion.HTMLFramePath:
                case HTMLSelectionCriterion.ID:
                case HTMLSelectionCriterion.HTMLTitle:
                case HTMLSelectionCriterion.Class:
                case HTMLSelectionCriterion.ItemValue:
                case HTMLSelectionCriterion.HTMLHasFrame:
                default: {
                    break;
                }
            }
        }
        return elementAttributesMap;
    }

    isSupportedSelectionCriterion(criterion) {
        switch (HTMLSelectionCriterion[criterion]) {
            case HTMLSelectionCriterion.HTMLValue:
            case HTMLSelectionCriterion.Description:
            case HTMLSelectionCriterion.WindowTitle:
            case HTMLSelectionCriterion.DefaultAction:
            case HTMLSelectionCriterion.ItemName:
            case HTMLSelectionCriterion.HTMLFramePath:
            case HTMLSelectionCriterion.ID:
            case HTMLSelectionCriterion.HTMLTitle:
            case HTMLSelectionCriterion.Class:
            case HTMLSelectionCriterion.ItemValue:
            case HTMLSelectionCriterion.HTMLHasFrame: {
                return false;
            }
        }
        return true;
    }

    getOptions(options) {
        if (this.canOptions) {
            if (options && typeof options === 'object') {
                return options;
            }
            return options ? OPTIONS_CAPTURE : OPTIONS;
        }
        if (options && typeof options === 'object') {
            return Boolean(options.capture);
        }
        return Boolean(options);
    }
}

class TriggerData {

    #registerRequest;
    #selectionCriterion;
    #stringifyAttr;
    #action;
    #listenerType;
    #stringifyModifierKeys;
    #keyCode;

    constructor(registerRequest, selectionCriterion, action, keyMap, listenerType) {
        this.#registerRequest = registerRequest;
        this.#selectionCriterion = selectionCriterion;
        this.#stringifyAttr = TriggerData.stringifySelectionCriteria(selectionCriterion);
        this.#action = action;
        this.#listenerType = listenerType;
        this.#stringifyModifierKeys = TriggerData.stringifySelectionCriteria(registerRequest.uiEventRequest.uiobjectTriggerEvent.modifierKeys);
        if (registerRequest.uiEventRequest.uiobjectTriggerEvent.shortcutKeyLabels) {
            this.#keyCode = TriggerData.shortcutKeyLabelsToCode(registerRequest.uiEventRequest.uiobjectTriggerEvent.shortcutKeyLabels, keyMap);
        }
    }

    get request() {
        return this.#registerRequest;
    }

    get selectionCriterion() {
        return this.#selectionCriterion;
    }

    get stringifyAttr() {
        return this.#stringifyAttr;
    }

    get action() {
        return this.#action;
    }

    get listenerType() {
        return this.#listenerType;
    }

    static stringifySelectionCriteria(selectionCriterion) {
        if (!selectionCriterion) {
            return '';
        }
        const keyValues = Object.entries(selectionCriterion);
        keyValues.sort((a, b) => a[0].localeCompare(b[0]));
        return JSON.stringify(keyValues);
    }

    static getModifierKeys(event) {
        var modifierKeys = [];
        if (event.shiftKey) {
            modifierKeys.push('SHIFT');
        }
        if (event.altKey) {
            modifierKeys.push('ALT');
        }
        if (event.ctrlKey) {
            modifierKeys.push('CTRL');
        }
        if (event.metaKey) {
            modifierKeys.push('META');
        }
        // TODO: Get rid of magic numbers :(
        if (event.which == 18) {
            modifierKeys.push('ALTGR');
        }
        return modifierKeys.length > 0 ? modifierKeys : null;
    }

    static shortcutKeyLabelsToCode(shortcutKeyLabels, keyMap) {
        if (shortcutKeyLabels?.length > 0) {
            const key = shortcutKeyLabels[0];
            if (keyMap.has(key)) {
                return keyMap.get(key);
            }
        }
    }

    hasMatch(destSelectionCriterion, destStringifyAttr) {
        if (Object.entries(this.#selectionCriterion).length === 0 &&
            Object.entries(destSelectionCriterion).length === 0) {
            return false;
        }

        if (!this.#selectionCriterion ||
            (Object.entries(destSelectionCriterion).length !== Object.entries(this.#selectionCriterion).length)) {
            return false;
        }

        if (this.#stringifyAttr === destStringifyAttr) {
            return true;
        }

        return false;
    }

    hasHotkeyMatch(stringifyModifierKeys, keyCode) {
        if (stringifyModifierKeys === this.#stringifyModifierKeys && keyCode === this.#keyCode) {
            return true;
        }
        return false;
    }
}
