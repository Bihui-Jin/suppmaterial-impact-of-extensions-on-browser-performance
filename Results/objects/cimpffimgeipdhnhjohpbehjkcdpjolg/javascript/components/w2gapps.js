var W2gApps = function (eleClass) {

    "use strict";

    var availApps = [],
        lastUrlSubmit = "",
        appsObj = {
        activeApp : 0,
        activeDescription : "Search OR paste a link to any site",
        activeLogo : "",
        activeName : "",
        installedApps : [],
        showApps : false,
        showAppsNote : true,
        auth : true,
        showMobileSearch : false,
        searchTerm : "",
        searchPage : 1,
        searchResults : [],
        searchResults_1 : [],
        searchResults_2 : [],
        showResults : false,
        itemsFound : false,
        canSearch : true,
        canImport : false,
        importRunning : false,
        importDone : false,
        searching : false,
        blockAddAll : false,
        canLoadMore : false,
        searchRendered : function(){},
        searchInitiated : function(){},
        click : function(val, app) {
            this.searchTerm = "";
            this.canLoadMore = false;
            this.activateMenu(app.provider_name);
            if(app.provider_type === "browse"){
                this.searchSubmitTopbar(w2g.isMobileView);
            }
        },
        dblclick : function(val, app) {
            this.searchTerm = "";
            this.canLoadMore = false;
            this.activateMenu(app.provider_name);
            this.showApps = false;
            this.searchSubmitTopbar();
        },
        toggleMobileSearch : function(){
            this.showMobileSearch = !this.showMobileSearch;
        },
        imgLoadError : function(ele, app, evt){
            if(evt.target.naturalWidth === 120 && evt.target.naturalHeight === 90 && app.id.indexOf("//www.youtube.com") === 0){
                //app.provider = null;
                //$w2g.getJSON((window._w2ghost || "") + "/w2g_search/lookup?url=" + app.id + "&force=1").catch(function(){});
            }
        },
        activateMenu : function(name){
            this.installedApps.forEach(function(ele, index){
                if(ele.provider_name === name){
                    ele.active = true;
                    this.activeApp = index;
                    this.showAppsNote = false;
                    this.activeDescription = ele.description || "Search OR paste a link to any site";
                    this.activeLogo = ele.icon_path || "";
                    this.activeName = ele.provider_name || "";
                    if(window.Cookies) {
                        Cookies.set("activeApp", this.activeApp, { expires: 1, path: window.location.pathname, secure: true, sameSite: 'strict' });
                    }
                    setTimeout(function (){
                        this.showAppsNote = true;
                    }.bind(this),0);
                } else {
                    ele.active = false;
                }
            }.bind(this));
        },
        searchSubmitTopbar : function(close){
            this.searchSubmit(close);
        },
        searchSubmit : function(close){
            this.canImport = false;
            this.importDone = false;
            this.importRunning = false;
            this.searchResults = [];
            this.searchResults_1 = [];
            this.searchResults_2 = [];
            this.searchPage = 1;
            this.itemsFound = true;
            this.showApps = typeof close === "undefined" ? false : !close;
            this.showResults = true;
            this.canLoadMore = false;
            if (this.searchTerm.trim().indexOf('http') === 0) {
                this.submitLookup();
            } else {
                this.search();
            }
            this.searchInitiated();
        },
        search : function(){
            this.searching = true;
            lastUrlSubmit = "";
            var term = this.searchTerm.indexOf("publisher:") === 0 ? this.searchTerm : encodeURIComponent(this.searchTerm);
            availApps[this.activeApp].search(term, 10, this.searchPage, function(data){
                this.setResults(data);
                if (w2g.isMobile === true) {
                    $w2g.querySelector("#search-bar-input").blur();
                }
                this.searchRendered();
                //W2gMtrx.sendEvent("w2g_search", availApps[this.activeApp].provider_name);
            }.bind(this) );
        },
        setResults: function(data){
            _loadResults(data);
            this.itemsFound = data.length > 0;
            this.canLoadMore = data.length >= 10 && availApps[this.activeApp].provider_name !== "youtube";
        },
        submitLookup : function(){
            this.searching = true;
            this.canImport = false;
            this.importDone = false;
            this.importRunning = false;
            this.lookup(this.searchTerm.trim(), function(vid, provider){
                this.itemsFound = vid.length > 0;
                _loadResults(vid);
                if(vid.length > 0) {
                    this.activateMenu(provider);
                    if(vid.length > 1){
                        this.canImport = true;
                    }
                    this.searchRendered();
                }
                //W2gMtrx.sendEvent("w2g_lookup", provider);
            }.bind(this));
        },
        inputPaste : function() {
            setTimeout(function(){
                if(this.searchTerm.indexOf("http") === 0) {
                    this.searchSubmitTopbar();
                }
            }.bind(this), 1);
        },
        lookup : function(url, cb){
            var result, i, success = false;
            for(i = 0; i < availApps.length; i++){
                try {
                    result = availApps[i].videoLookUp(url, function (vid, provider) {
                        cb(vid, provider);
                    }.bind(this), availApps[i].provider_name === this.activeName);
                    if (result) {
                        success = true;
                        break;
                    }
                } catch(e){
                    console.log(e);
                }
            }
            if(success === false) {
                cb([], "Error");
            }
        },
        clearSearch : function(){
            this.searchTerm = "";
        },
        play : function(val, ele){
            //this.showResults = false;
        },
        share : function(val, ele){
            this.showResults = false;
        },
        addToPl : function(val, ele){
        },
        addAllToPl : function(val, ele){
        },
        suggest : function(val, ele){
        },
        loadMore : function(){
            if(this.canLoadMore) {
                this.searchPage++;
                this.search();
            }
        },
        loadMoreFromPub : function(val, ele){
            if(ele.publisherID) {
                this.searchTerm = "publisher:" + ele.publisherID;
                this.searchPage = 1;
                this.search();
            }
        },
        toggleApps : function(){
            this.showApps = !this.showApps;
        },
        topSearchFocus : function(){
            this.showApps = true;
        }
    };

    for (var i = 0; i < W2gProviders.length; i++) {
        var prov = new W2gProviders[i]();
        availApps[i] = prov;
        appsObj.installedApps[i] = {provider_name: prov.provider_name, provider_type: prov.provider_type, icon_path: prov.icon_path, active: false, description: prov.description};
    }

    if(window.Cookies){
        appsObj.activeApp = isNaN(Cookies.get("activeApp")) ? 0 : Cookies.get("activeApp");
    }
    appsObj.activeApp = appsObj.installedApps[appsObj.activeApp] ? appsObj.activeApp : 0;

    appsObj.installedApps[appsObj.activeApp].active = true;
    appsObj.activeLogo = appsObj.installedApps[appsObj.activeApp].icon_path;
    appsObj.activeName = appsObj.installedApps[appsObj.activeApp].provider_name;
    appsObj.activeDescription = appsObj.installedApps[appsObj.activeApp].description || "Search OR paste a link to any site";

    var w2gApps = new W2gDataObject(appsObj);

    w2gApps._addHandler("showApps", function(prop, val){
       if(!val){
            $w2g.querySelector("#search-bar-input").blur();
       }
    });

    function _loadResults(data){
        w2gApps.searching = false;
        w2gApps.searchResults = data;
        if(w2gApps.searchPage === 1) {
            if (window.innerWidth <= 965) {
                w2gApps.searchResults_1 = data.slice(0, 2);
                w2gApps.searchResults_2 = data.slice(2);
            } else {
                w2gApps.searchResults_1 = data.slice(0, 2);
                w2gApps.searchResults_2 = data.slice(2);
            }
        } else {
            var items = [w2gApps.searchResults_2.length, 0].concat(data);
            Array.prototype.splice.apply(w2gApps.searchResults_2, items);
        }
    }

    new W2gBind(w2gApps, eleClass);

    return w2gApps;

};
