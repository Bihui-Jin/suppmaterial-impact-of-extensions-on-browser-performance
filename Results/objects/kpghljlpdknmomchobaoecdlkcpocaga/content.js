var domain = new URL(location.href);
if(domain.hostname.indexOf("daum.net") > 0) {
    // console.log("HostName : " + domain.hostname);
    document.domain = "daum.net";

    var domains = ["v.daum.net", "v.media.daum.net", "news.v.daum.net", "sports.v.daum.net"];
    var _g_ignore_domains = ["logins.daum.net", "gallery.v.daum.net"];

    var _g_keep_media_label = true;
    var _g_is_initialized = false;
    var _g_media_map_cache = {};
    var _g_avariable_media_map = {};

    var _g_media_list = [];
    var _g_auto_load = false;
    var _g_block_unknown_media = false;
    var _g_only_overline = false;
    var _g_hide_comments = false;
    var _g_hide_related_news = false;
    var _g_hide_todays_photo = false;
    var _g_black_keyword = [];
    var _g_blocked_media_list = [];
    var _g_blocked_comment_media_list = [];

    var _g_lastest_call_link = null;
    var _g_event_elements = {};

    /*
    function insertAfter(newnode, refnode) {
        if (!!refnode.nextSibling) {
            refnode.parentNode.insertBefore(newnode, refnode.nextSibling);
        } else {
            refnode.parentNode.appendChild(newnode);
        }  
    }

    function includeJs(jsFilePath) {
        var js = document.getElementById("mf-media-loader-js");
        if(!js) {
            js = document.createElement("script");
            js.type = "text/javascript";
            js.src = jsFilePath;
            js.id = "mf-media-loader-js"
            insertAfter(js, document.head.lastChild);
    //        document.body.appehcChild(js);
        }
    }

    includeJs(chrome.extension.getURL('/media.loader.js'));
    */

    // iframe간 이벤트 초기화
    (function(){
        function insertAfter(newnode, refnode) {
            if (!!refnode.nextSibling) {
                refnode.parentNode.insertBefore(newnode, refnode.nextSibling);
            } else {
                refnode.parentNode.appendChild(newnode);
            }  
        }
        

        //var frameDepth = getFrameDepth(window.self);
        if(window.self == window.top) {
        
            var ifrm = document.getElementById("mf-media-iframe");
            if(!ifrm) {
                ifrm = document.createElement("iframe");
                ifrm.setAttribute("id", "mf-media-iframe");
                ifrm.setAttribute("src", chrome.extension.getURL('/iframe.html'));
    //            ifrm.setAttribute("style", "border:1px solid #ff0000;height: 100px; width:100%;");
                ifrm.style.display="none";

                //document.body.insertBefore(ifrm, document.body.firstChild);
                insertAfter(ifrm, document.body.lastChild);
            }

            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                try {
                    var data = request;
                    //console.log(data.url + ", " + data.origin + ", " + data.label);

                    var element = _g_event_elements[data.origin];
                    //console.log(element);

                    if(!!element) {
                        var event = new CustomEvent('media-loaded', { detail : {label : data.label }});

                        // 이벤트 디스패치.
                        element.dispatchEvent(event);
                    }

    //            console.log(sender.tab ?
    //                "from a content script:" + sender.tab.url :
    //                "from the extension");
                    sendResponse({reveived: "true"});
                } catch(e) {
                }
            });
        } else {
            var elements = document.querySelectorAll("em.info_cp");
            if(elements.length > 0) {
                //console.log(elements);
                var element = elements[0];
                var contents = element.innerHTML;

                var imgstd = contents.indexOf("<img");
                var imgend = contents.indexOf(">", imgstd);
                if(imgstd > 0 && imgend > 0 && imgstd < imgend) {
                    var str = contents.substr(imgstd, imgend - imgstd + 1);
                    var altstd = str.indexOf("alt=")
                    var altend = 0;
                    //console.log(str);

                    if(altstd > 0) {
                        altstd = str.indexOf("\"", altstd);
                        altend = str.indexOf("\"", altstd + 1);
                    }

                    var href = location.href;
                    if(altstd > 0 && altend > 0 && altstd < altend){
                        var label = str.substr(altstd + 1, altend - altstd - 1);
                        //span.innerHTML = label;
                        //console.log("언론사 : " + label);
    //                    _g_media_map_cache[href] = label;

                        try {
                            chrome.runtime.sendMessage({sendBack:true, data: {
                                type: "loaded"
                                , url : href
                                , label : label
                            }});
                        } catch(e) {
                            //console.log("POS 005 : " + e);
                        }
                    } else {
                    }
                }
            }
        }
    })();



    function loadmedia(link, callback) {

        // 마지막에 호출한 링크주소가 같으면 언론사 검색 중지
        var url = link.href;
        if(url == _g_lastest_call_link) return;
        _g_lastest_call_link = url;

        if(_g_media_map_cache[url] != null) {
            callback(_g_media_map_cache[url]);
            return;
        }
        
        
        
        // iframe을 이용하여 언론사 이름 읽어오기
        _g_event_elements[url] = link;
        
        // 이벤트 리슨.
        link.addEventListener('media-loaded', function (e) {
            var label = (!!e.detail) ? e.detail.label : null;
    //        console.log("Event................");
    //        console.log(e);
            if(!!label) {
    //            console.log(label);
                _g_media_map_cache[url] = label;
                callback(_g_media_map_cache[url]);
            }
        }, false);


        
        var originUrl = url;
        //console.log("POS 001 : " + url);
        if(!url.startsWith(location.protocol)) {
            var proc = url.substring(0, url.indexOf(":") + 1);
            url = url.replace(proc, location.protocol);
            //console.log(url);
        }

        if(url.startsWith(location.protocol + "//v.daum.net")) {
            url = url.replace(location.protocol + "//v.daum.net", location.protocol + "//news.v.daum.net")
        }
        if(url.startsWith(location.protocol + "//v.media.daum.net")) {
            url = url.replace(location.protocol + "//v.media.daum.net", location.protocol + "//news.v.daum.net")
        }
        if(url.startsWith(location.protocol + "//v.movie.daum.net")) {
            url = url.replace(location.protocol + "//v.movie.daum.net", location.protocol + "//movie.v.daum.net")
        }

        try {
            chrome.runtime.sendMessage({
                sendBack : true,
                data: {
                    type: "iframe",
                    url : url,
                    origin : originUrl
                }
            });
        } catch(e) {
    //            console.log("POS 005 : " + e);
        }
    }


    var _g_link_queue = [];


    function hideBlocks() {
        // ** 언론사 주요뉴스 숨기기
        if(_g_hide_related_news) {
            var blocks = document.querySelectorAll("div.foot_view div.cp_view");
            if(blocks.length > 0) {
                for(var i = 0; i< blocks.length; i++) {
                    blocks[i].parentNode.removeChild(blocks[i]);
                }
            }
        }

        // 오늘의 포토 숨기기
        if(_g_hide_todays_photo) {
            var blocks = document.querySelectorAll("div.wrap_topic");
            if(blocks.length > 0) {
                for(var i = 0; i< blocks.length; i++) {
                    blocks[i].parentNode.removeChild(blocks[i]);
                }
            }
        }

        // 댓글 숨기기..
        if(_g_hide_comments) {
            // 이모티콘
            var cmtBlocks = document.querySelectorAll("div.emotion_wrap");
            if(cmtBlocks.length > 0) {
                for(var i = 0; i< cmtBlocks.length; i++) {
                    cmtBlocks[i].parentNode.removeChild(cmtBlocks[i]);
                }
            }

            // 댓글
            var cmtBlocks = document.querySelectorAll("div.cmt_news");
            if(cmtBlocks.length > 0) {
                for(var i = 0; i< cmtBlocks.length; i++) {
                    cmtBlocks[i].parentNode.removeChild(cmtBlocks[i]);
                }
            }

            var blocks = [];
            var elements = [];

            elements = document.querySelectorAll("button.link_cmt");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }


            elements = document.querySelectorAll("button.link_cmt");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("div.box_bestreply span.info_ranking");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("div.cont_thumb span.ico_cmt");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }
            elements = document.querySelectorAll("div.cont_thumb span.txt_middot");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("span.info_mainnews span.ico_cmt");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }
            elements = document.querySelectorAll("span.info_mainnews span.txt_middot");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("div.rank_num span.info_rank");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            if(blocks.length > 0) {
                for(var i = 0; i< blocks.length; i++) {
                    blocks[i].parentNode.removeChild(blocks[i]);
                }
            }
        }
    }


    function modify() {
    //    _g_link_queue = [];
        
        function insertMediaLabel(element, media) {
            try {
                if(element.firstChild != null && element.firstChild.getAttribute("class") === "media-filter") {
                    element.removeChild(element.firstChild);
                }
            } catch(e) {}
            
            var div = document.createElement("div");
            div.className="media-filter";
            
            var span = document.createElement("span");
            span.innerHTML = media;
            div.appendChild(span);
            
            element.insertBefore(div, element.firstChild);
            
            
            var isBlocked = (_g_blocked_media_list.indexOf(media) >= 0 || (media && _g_block_unknown_media && _g_media_list.indexOf(media) == -1 ));
            
            if(isBlocked) {
                //console.log("media : " + media);

                // 0.3.16 mf-blocked 가 누적되는 현상 수정
                var clazz = element.getAttribute("class");
                if(!clazz || clazz.indexOf("mf-blocked") < 0) {
                    element.setAttribute("class", clazz ? clazz + " mf-blocked" : "mf-blocked");
                }
                element.setAttribute("data-blocked", "true");

                if(_g_keep_media_label) {
                    var clazz = element.getAttribute("class");
                    if(!clazz || clazz.indexOf("mf-active") < 0) {
                        element.setAttribute("class", clazz ? clazz + " mf-active" : "mf-active");
                    }
                }

                element.style.textDecoration = "line-through";
                element.style.color = "#bbbbbb";
                
                if(!_g_only_overline) {
                    // 0.4.1 주석해제하면 차단된 기사의 언론사가 일괄적으로 특정 언론사로 매핑됨
                    // element.setAttribute("href", "javascript:void(0)");
                    
                    element.setAttribute("disabled", "disabled");
                    element.style.cursor="default";

                    //element.href = "#";
                    element.addEventListener("click",function(e){
                        e.preventDefault();
                        //e.stopImmediatePropagation();
                        //e.stopPropagation();
                        return false;
                    });
                }
                
                //element.style.pointerEvents="none";
            } else {
                var clazz = element.getAttribute("class");
                if(_g_keep_media_label) {
                    if(clazz.indexOf("mf-active") >= 0) return;
                    element.setAttribute("class", clazz ? clazz + " mf-active" : "mf-active");
                }
            }
        }
        
        
        function cacheMediaToStorage(href, media) {
            if(!(href in _g_avariable_media_map)) {
                var newdata = {
                    link : href,
                    media : media,
                    registed : new Date().getTime()
                };
                _g_avariable_media_map[href] = newdata;
                //console.log(newdata);

                try {
                    chrome.storage.local.set({
                        "linkMap" : _g_avariable_media_map
                    });
                } catch(e) {
                    console.log(e);
                }
            }
        }
        
        function findParent(node, tag) {
            if(!node) return node;
            
            if(node.tagName.toLowerCase() == tag) {
                return node;
            }
            return findParent(node.parentNode, tag);
        }
        
        
        function findmedia1(contents) {
            var label = null;
            if(!!contents) {
                label = contents.trim();
            }
            return label;
        }
        function findmedia2(contents) {
            var label = null;
            if(!!contents) {
                contents = (contents.indexOf("<span") > 0) ? contents.substring(0, contents.indexOf("<span")) : contents;
                //console.log(contents);
                label = contents.trim();
            }
            return label;
        }
        function findmedia3(contents) {
            var label = null;
            //console.log(contents);
            if(!!contents) {
                var splitIdx = contents.indexOf("|");
                var labelstd = contents.indexOf(">", splitIdx);
                var labelend = contents.indexOf("<", labelstd);
                if(labelstd > 0) {
                    if(labelend > 0 && labelstd < labelend) {
                        label = contents.substr(labelstd + 1, labelend - labelstd - 1);
                    } else {
                        label = contents.substr(labelstd + 1, contents.length);
                    }
                }
                if(!!label) {
                    label = label.trim();
                }
            }
            return label;
        }
        function findmedia4(contents) {
            
            // var spans = ele.querySelectorAll("span");
            // if(spans != null && spans.length > 0) {
            //     for(var i = 0; i< spans.length; i++) {
            //         spans[i].parentNode.removeChild(spans[i]);
            //     }
            // }

            var label = null;
            if(!!contents) {
                if(contents.indexOf("<span") > 0) {
                    label = contents.substr(0, contents.indexOf("<span")).trim();
                } else {
                    label = contents.trim();
                }
            }
            return label;
        }

        
        function doCacheMedia(link, media) {
            var href = link.href;
            _g_media_map_cache[href] = media;
            cacheMediaToStorage(href, media);
        }
        
        // 연결주소 근처에 언론사 이름이 있는지 확인..
        function neerby(link) {
            if(!link || !link.href) return false;
            
            // var href = link.href;
            // if(!!_g_media_map_cache[href]) return false;

            if(!!link.getAttribute("class") && link.getAttribute("class").indexOf("link_thumb") >= 0) return;

            if(location.host == "search.daum.net") {
                //debugger;
                var parent = (link.className.indexOf("f_link_b") >= 0) ? link.parentElement.parentElement : link.parentElement;
                if(!!parent) {
                    var info = parent.querySelector("span.f_nb");
                    if(!!info) {
                        var media = findmedia3(info.innerHTML);
                        if(!!media) {
                            doCacheMedia(link, media);
                            insertMediaLabel(link, media);
                            return true;
                        }
                    }
                }
            }

    //            console.log(link);
    //            console.log("Label : " + link.innerText.trim());
            var parent = link.parentElement;
            if(!!parent) {
                var info = parent.querySelector("span.info_news");
                if(!!info) {
                    var media = findmedia4(info.innerHTML);
                    if(!!media) {
                        doCacheMedia(link, media);
                        insertMediaLabel(link, media);
                        return true;
                    }
                }

                var info = parent.querySelector("span.txt_view");
                if(!!info) {
                    var media = findmedia1(info.innerHTML);
                    if(!!media) {
                        doCacheMedia(link, media);
                        insertMediaLabel(link, media);
                        return true;
                    }
                }

                // 0.3.16 연재 - 언론사별 사설
                // var grandparent = link.parentElement.parentElement.parentElement;
                // if(!!grandparent && !!grandparent.getAttribute("class") && grandparent.getAttribute("class").indexOf("editorial") >= 0) {
                //     var info = parent.querySelector("em.emph_g a.link_text");
                //     if(!!info) {
                //         var media = findmedia1(info.innerHTML);
                //         if(!!media) {
                //             doCacheMedia(link, media);
                //             insertMediaLabel(link, media);
                //             return true;
                //         }
                //     }
                // }
            }


            var parent = link.parentElement.parentElement;
            if(!!parent) {
                var info = parent.querySelector("span.info_mainnews");
                if(!!info) {
                    var media = findmedia2(info.innerHTML);
                    if(!!media) {
                        doCacheMedia(link, media);
                        insertMediaLabel(link, media);
                        return true;
                    }
                }


                var info = parent.querySelector("span.info_thumb");
                if(!!info) {
                    var media = findmedia2(info.innerHTML);
                    if(!!media) {
                        doCacheMedia(link, media);
                        insertMediaLabel(link, media);
                        return true;
                    }
                }
            }

    //      console.log("---------------------");

            return false;
        }
        


        
        
        if(_g_is_initialized == false) return;

        // 환경설정에 따른 블럭들 숨기기
        hideBlocks();


        function is_ignore_item(anchor) {
            if(!anchor) return false;
            if(typeof anchor.href === "undefined" || !anchor.href) return true;
            if(!_g_ignore_domains || _g_ignore_domains.length == 0) return false;
            for(var i = 0; i< _g_ignore_domains.length; i++) {
                var domain = _g_ignore_domains[i];
                var href = anchor.href || "";
                if(href.indexOf(domain) > 0) return true;
            }
            return false;
        }
        
        var links = [];
        for(var i = 0; i< domains.length; i++) {
            //if(frameDepth == 0) {
            if(window.self == window.top) {
                var res = document.querySelectorAll("a[href*=\"" + domains[i] + "\"");
                if(res.length == 0) continue;
                
                for(var j = 0; j < res.length ; j++) {
                    var link = res[j];
                    if(!link || !link.href || is_ignore_item(link)) continue;
                    links.push(link);
                }
            }
        }
        
        //console.log(links);
        
        for(var i = 0; i < links.length; i++){
            var anchor = links[i];

            // 키워드로 차단하기 0.3.14
            if(anchor.text) {
                var label = anchor.text;
                var blockedByKeyword = false;
                for(var j = 0; j < _g_black_keyword.length; j++) {
                    if(label.indexOf(_g_black_keyword[j]) >= 0) {
                        //console.log(label);
                        // doCacheMedia(anchor, "``" + _g_black_keyword[j] + "``");
                        insertMediaLabel(anchor, "``" + _g_black_keyword[j] + "``");
                        blockedByKeyword = true;
                        break;
                    }
                }
                if(blockedByKeyword) continue;
            }
            
            
            // 0.3.16 비동기로 읽어오는 경우 일부 꼬이는 부분이 있어 근처에 언론사가 있는 경우를 먼저 체크하고 캐쉬를 업데이트
            //debugger;
            // var media = _g_media_map_cache[anchor.href];
            // if(media) {
            //     insertMediaLabel(anchor, media);
            //     continue;
            // }
            
            // 링크 근처에 언론사 이름이 있는지 확인
            var hasNeerBy = neerby(anchor);
            if(hasNeerBy) continue;

            var media = _g_media_map_cache[anchor.href];
            if(media) {
                insertMediaLabel(anchor, media);
                continue;
            }

            if(hasNeerBy === false) {
                anchor.addEventListener("mouseover", function(event){
                    var target = findParent(event.target, "a");

                    if(target == null || target.tagName.toLowerCase() !== "a" || !target.href) return;
                    if(target.getAttribute("data-blocked") == "true") return;

                    //console.log('link mouseover : ' + target.href);
                    loadmedia(target, function(media) {
                        doCacheMedia(target, media);
                        insertMediaLabel(target, media);
                    });

                    event.stopPropagation();
                    event.preventDefault();
                });
                
                if(_g_auto_load) {
                    _g_link_queue.push(anchor);
                }
            }
        }
        

        // 자동 읽기
        if(_g_auto_load) {
            function _next() {
                var ret = _g_link_queue.shift();
                while(_g_link_queue.length > 0 && !ret) {
                    ret = _g_link_queue.shift();
                }
                return ret;
            }

            function _load(anchor) {
                if(anchor == null) return;

    //            console.log('link auto : ' + anchor.href);
                var timerid = setTimeout(function() {
                    _load(_next());
                }, 2000);           // 0.3.16 1초동안 못읽어오는 경우가 있어 2초로 변경
                
                loadmedia(anchor, function(media) {
                    clearTimeout(timerid);

                    doCacheMedia(anchor, media);
                    insertMediaLabel(anchor, media);
                    
                    _load(_next());
                });
            }
            
            _load(_next());
        }
    }


    function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
    }


    (function() {
        //debugger;
        if(window.self == window.top) {
            // 기존에 연결된 링크주소 읽어오기..
            chrome.storage.local.get(function (data) {
                var linkMap = data.linkMap ? data.linkMap : {};

                for(var n in linkMap) {
                    var item = linkMap[n];

                    // 오래된 항목을 제외하고 연결되었던 링크 복원
                    if(item.registed + 24*60*60*1000 > new Date().getTime()) {      // 1일 전..
                        _g_media_map_cache[item.link] = item.media;
                        _g_avariable_media_map[item.link] = item;
                    }
                }


                chrome.storage.sync.get(function (data) {
                    //console.log("storage : " + data);
                    _g_media_list = data.allMedia;
                    _g_auto_load = data.autoLoad;
                    _g_block_unknown_media = data.blockExtra;
                    _g_only_overline = data.onlyOverline;
                    _g_hide_comments = data.hideComments;
                    _g_hide_todays_photo = data.hideTodaysPhoto;
                    _g_hide_related_news = data.hideRelatedNews;
                    if(data.blackKeyword) {
                        var arr = data.blackKeyword.split(",");
                        for(var i = 0; i< arr.length; i++) {
                            var keyword = myTrim(arr[i]);
                            if(keyword) {
                                _g_black_keyword.push(keyword);
                            }
                        }
                    }

                    _g_blocked_media_list = data != null ? ( data.blockedMedia != null ? data.blockedMedia : [] ) : [];
                    _g_blocked_comment_media_list = data.blockedComment;
                    _g_keep_media_label = data.keepMediaLabel;

                    _g_is_initialized = true;

                    modify();
                });
            });
            
            
            
            
            var lastdiv = "";
            var newsdiv = document.querySelector("div#news");
            if(typeof newsdiv != "undefined" && newsdiv != null){
                newsdiv.addEventListener("DOMSubtreeModified",function(event){
                    if(newsdiv.firstChild != null) {
                        var fc = newsdiv.firstChild.className;
                        if(fc != lastdiv) {
                        // console.log('news div changed');
                            lastdiv = fc;
                            modify();
                        }
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });
            }


            var lastgroup = "";
            var onindex = -1;
            var activedom = "";
            var lastCount = 0;
            setInterval(function() {
                var groupdiv = document.querySelector("div#mediaTab");
                if(typeof groupdiv != "undefined" && groupdiv != null){
                    var fc = groupdiv.className;
                    if(fc != lastgroup) {
                        // console.log('group div changed');
                        lastgroup = fc;
                        modify();
                    }
                }

                var divs = document.querySelectorAll("div.aside_g.aside_popular ul.tab_aside.tab_media > li")
                if(typeof divs != "undefined" && divs != null && divs.length > 0){
                    for(var i = 0; i<divs.length; i++) {
                        var div = divs[i];
                        if(div.className == "on") {
                            var dom = div.innerHTML;
                            if(onindex != i || dom != activedom) {
                                // console.log(div.className + " : " + i);
                                onindex = i;
                                modify();
                                activedom = div.innerHTML;
                            }
                        }
                    }
                }


            var uls = document.querySelectorAll("ul.list_timenews")
            if(typeof uls != "undefined" && uls != null && uls.length > 0){
                for(var i = 0; i<uls.length; i++) {
                    var ul = uls[i];
                    var li = ul.firstChild;
                    if(li != null && li.className != "media-filter-li") {
                        var newli = document.createElement("li");
                        newli.className = "media-filter-li";
                        newli.style.display = "none";
                        ul.insertBefore(newli, ul.firstChild);
                        modify();
                    }
                }
            }

            if(location.host == "search.daum.net") {
                if(document.querySelector("ul#clusterResultUL") && document.querySelector("ul#clusterResultUL").childElementCount != lastCount) {
                    lastCount = document.querySelector("ul#clusterResultUL").childElementCount;
                    modify();
                }
            }

            
                // 환경설정에 따른 블럭들 숨기기
                hideBlocks();



        }, 1000);        // 0.3.16 1초이하는 사용자에게 별다른 의미가 없어 웹 브라우저 부하를 줄이기 위해 수정
        }       // if(window.self == window.top) {

    })();

}