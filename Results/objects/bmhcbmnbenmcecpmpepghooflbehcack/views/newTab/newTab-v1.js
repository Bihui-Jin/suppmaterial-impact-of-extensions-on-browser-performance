$(document).ready(() => {
  const newTabPopoverToggle = document.querySelector('.NewTabPopover__toggle');
  const newTabPopoverToggleCircle = newTabPopoverToggle.querySelector(
    '.NewTabPopover__toggleCircle',
  );

  const isNewTabOn = JSON.parse(localStorage.getItem('is_new_tab_on') ?? 'false');
  if (isNewTabOn) {
    newTabPopoverToggle.classList.add('LinerToggleOn');
    newTabPopoverToggleCircle.classList.add('LinerToggleOn');
  }

  const newTabPopoverTitle = document.querySelector('.NewTabPopover__title');
  newTabPopoverTitle.textContent = localize('LINER New Tab');

  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'view_new_tab_toggle_extension_popup',
    properties: {},
  });

  newTabPopoverToggle.addEventListener('click', () => {
    newTabPopoverToggle.classList.toggle('LinerToggleOn');
    newTabPopoverToggleCircle.classList.toggle('LinerToggleOn');

    const isToggledOn = newTabPopoverToggle.classList.contains('LinerToggleOn');
    const statusChange = isToggledOn ? 'off_to_on' : 'on_to_off';

    messageToNative('TOGGLE_NEW_TAB', {
      isTurningNewTabOn: isToggledOn,
    });

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_new_tab_toggle_extension_popup',
      properties: {
        status_change: statusChange,
      },
    });

    if (isToggledOn) {
      messageToNative('NEW_TAB', {
        isOpenLinerNewTab: true,
      });
    }
  });
});
