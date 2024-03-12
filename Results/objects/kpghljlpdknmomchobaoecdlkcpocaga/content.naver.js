var domain = new URL(location.href);
if(domain.hostname.indexOf("naver.com") > 0) {
//    console.log("HostName : " + domain.hostname);

    // 아래코드를 주석처리하지 않으면 네이버 로그인 페이지가 계속 반복로딩됨
    // document.domain = "naver.com";



    
    var _g_media_map = {
        // 방송/통신사
        "001" : "연합뉴스",
        "003" : "뉴시스",
        "421" : "뉴스1",
        "374" : "SBS Biz",
        "056" : "KBS",
        "449" : "채널A",
        "437" : "JTBC",
        "215" : "한국경제TV",
        "422" : "연합뉴스TV",
        "052" : "YTN",
        "055" : "SBS",
        "448" : "TV조선",
        "214" : "MBC",
        "057" : "MBN",
        
        // 종합지
        "021" : "문화일보",
        "023" : "조선일보",
        "032" : "경향신문",
        "025" : "중앙일보",
        "020" : "동아일보",
        "005" : "국민일보",
        "469" : "한국일보",
        "022" : "세계일보",
        "081" : "서울신문",
        "028" : "한겨레",
        
        // 경제지
        "009" : "매일경제",
        "011" : "서울경제",
        "008" : "머니투데이",
        "018" : "이데일리",
        "648" : "비즈니스워치",
        "015" : "한국경제",
        "014" : "파이낸셜뉴스",
        "366" : "조선비즈",
        "016" : "헤럴드경제",
        "277" : "아시아경제",
        "123" : "조세일보",
        
        // 매거진
        "308" : "시사IN",
        "262" : "신동아",
        "053" : "주간조선",
        "050" : "한경비즈니스",
        "586" : "시사저널",
        "037" : "주간동아",
        "024" : "매경이코노미",
        "033" : "주간경향",
        "094" : "월간산",
        "950" : "월간중앙",
        "036" : "한겨레21",
        "243" : "이코노미스트",
        "353" : "중앙SUNDAY",
        
        // 전문지
        "346" : "헬스조선",
        "296" : "코메디닷컴",
        "640" : "코리아중앙데일리",
        "607" : "뉴스타파",
        "310" : "여성신문",
        "584" : "동아사이언스",
        "127" : "기자협회보",
        "007" : "일다",
        "044" : "코리아헤럴드",
        
        // 인터넷/IT지
        "293" : "블로터",
        "119" : "데일리안",
        "047" : "오마이뉴스",
        "031" : "아이뉴스24",
        "030" : "전자신문",
        "138" : "디지털데일리",
        "029" : "디지털타임스",
        "629" : "더팩트",
        "002" : "프레시안",
        "006" : "미디어오늘",
        "079" : "노컷뉴스",
        "092" : "지디넷코리아",
        "417" : "머니S",
        
        // 지역지
        "082" : "부산일보",
        "088" : "매일신문",
        "087" : "강원일보",

        // 포토
        "348" : "신화사 연합뉴스",
        "077" : "AP연합뉴스",
        "091" : "EPA연합뉴스",
    }



    var _g_ignore_domains = ["javascript:", "about:"];

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

    // // iframe간 이벤트 초기화
    // (function(){
    //     function insertAfter(newnode, refnode) {
    //         if (!!refnode.nextSibling) {
    //             refnode.parentNode.insertBefore(newnode, refnode.nextSibling);
    //         } else {
    //             refnode.parentNode.appendChild(newnode);
    //         }  
    //     }
        

    //     //var frameDepth = getFrameDepth(window.self);
    //     if(window.self == window.top) {
        
    //         var ifrm = document.getElementById("mf-media-iframe");
    //         if(!ifrm) {
    //             ifrm = document.createElement("iframe");
    //             ifrm.setAttribute("id", "mf-media-iframe");
    //             ifrm.setAttribute("src", chrome.extension.getURL('/iframe.html'));
    // //            ifrm.setAttribute("style", "border:1px solid #ff0000;height: 100px; width:100%;");
    //             ifrm.style.display="none";

    //             //document.body.insertBefore(ifrm, document.body.firstChild);
    //             insertAfter(ifrm, document.body.lastChild);
    //         }

    //         chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //             try {
    //                 var data = request;
    //                 //console.log(data.url + ", " + data.origin + ", " + data.label);

    //                 var element = _g_event_elements[data.origin];
    //                 //console.log(element);

    //                 if(!!element) {
    //                     var event = new CustomEvent('media-loaded', { detail : {label : data.label }});

    //                     // 이벤트 디스패치.
    //                     element.dispatchEvent(event);
    //                 }

    // //            console.log(sender.tab ?
    // //                "from a content script:" + sender.tab.url :
    // //                "from the extension");
    //                 sendResponse({reveived: "true"});
    //             } catch(e) {
    //             }
    //         });
    //     } else {
    //         var elements = document.querySelectorAll("em.info_cp");
    //         if(elements.length > 0) {
    //             //console.log(elements);
    //             var element = elements[0];
    //             var contents = element.innerHTML;

    //             var imgstd = contents.indexOf("<img");
    //             var imgend = contents.indexOf(">", imgstd);
    //             if(imgstd > 0 && imgend > 0 && imgstd < imgend) {
    //                 var str = contents.substr(imgstd, imgend - imgstd + 1);
    //                 var altstd = str.indexOf("alt=")
    //                 var altend = 0;
    //                 //console.log(str);

    //                 if(altstd > 0) {
    //                     altstd = str.indexOf("\"", altstd);
    //                     altend = str.indexOf("\"", altstd + 1);
    //                 }

    //                 var href = location.href;
    //                 if(altstd > 0 && altend > 0 && altstd < altend){
    //                     var label = str.substr(altstd + 1, altend - altstd - 1);
    //                     //span.innerHTML = label;
    //                     //console.log("언론사 : " + label);
    // //                    _g_media_map_cache[href] = label;

    //                     try {
    //                         chrome.runtime.sendMessage({sendBack:true, data: {
    //                             type: "loaded"
    //                             , url : href
    //                             , label : label
    //                         }});
    //                     } catch(e) {
    //                         //console.log("POS 005 : " + e);
    //                     }
    //                 } else {
    //                 }
    //             }
    //         }
    //     }
    // })();

    function findoid(link) {
        var oid = null;
        if(!link) return null;
        // console.log(link);
        
        if(link.indexOf("read.nhn") >= 0 || link.indexOf("read.naver") >= 0) {
            var q = link;
            var sidx = q.indexOf("&oid=") + 5;
            // console.log(q + " ===> " + sidx);

            if(sidx >= 5) {
                var eidx = q.indexOf("&", sidx);
                if(eidx > 0) {
                    oid = q.substring(sidx, eidx);
                } else {
                    oid = q.substring(sidx);
                }
            }

            if(!!oid) return oid;

            var sidx = q.indexOf("?oid=") + 5;
            // console.log(q + " ===> " + sidx);

            if(sidx >= 5) {
                var eidx = q.indexOf("&", sidx);
                if(eidx > 0) {
                    oid = q.substring(sidx, eidx);
                } else {
                    oid = q.substring(sidx);
                }
            }
            if(!!oid) return oid;
            
        } else if(link.indexOf("/office.nhn") >= 0) {
            var q = link;
            var sidx = q.indexOf("officeId=") + 9;
            // console.log(q + " ===> " + sidx);
            if(sidx >= 9) {
                var eidx = q.indexOf("&", sidx);
                if(eidx > 0) {
                    oid = q.substring(sidx, eidx);
                } else {
                    oid = q.substring(sidx);
                }
            }
            // console.log(q + " ===> " + oid);
        } else if(link.indexOf("/article/comment/") >= 0) {
            var q = link;
            var sidx = q.indexOf("/article/comment/") + 17;
            // console.log(q + " ===> " + sidx);

            if(sidx >= 17) {
                var eidx = q.indexOf("/", sidx);
                if(eidx > 0) {
                    oid = q.substring(sidx, eidx);
                } else {
                    oid = q.substring(sidx);
                }
            }
        } else if(link.indexOf("/article/") >= 0) {
            var q = link;
            var sidx = q.indexOf("/article/") + 9;
            // console.log(q + " ===> " + sidx);

            if(sidx >= 9) {
                var eidx = q.indexOf("/", sidx);
                if(eidx > 0) {
                    oid = q.substring(sidx, eidx);
                } else {
                    oid = q.substring(sidx);
                }
            }
        } else if(link.indexOf("/press/") >= 0) {
            var q = link;
            var sidx = q.indexOf("/press/") + 7;
            // console.log(q + " ===> " + sidx);

            if(sidx >= 7) {
                var eidx1 = q.indexOf("/", sidx);
                var eidx2 = q.indexOf("?", sidx);
                if(eidx1 > 0) {
                    oid = q.substring(sidx, eidx1);
                } else if(eidx2 > 0) {
                oid = q.substring(sidx, eidx2);
                } else {
                    oid = q.substring(sidx);
                }
            }
        }

        return oid;
    }

    function loadmedia(link, callback) {
        var url = link.href;
        // console.log(url);

        var oid = findoid(url);
        // console.log(link + " ===> " + oid + " : " + _g_media_map[oid]);
        if(!!oid && !!_g_media_map[oid]) {
            // console.log(link + " ===> " + oid + " : " + _g_media_map[oid]);
            callback( _g_media_map[oid]);
            return;
        }
        if(!!oid && _g_block_unknown_media) {
            callback("미등록언론사");
            return;
        }

        return;
        // 캐시에 언론사가 있으면 바로 반환
        if(_g_media_map_cache[url] != null) {
            callback(_g_media_map_cache[url]);
            return;
        }


        return;
    }


    var _g_link_queue = [];


    function hideBlocks() {
        // ** 언론사 주요뉴스 숨기기, ** 관련뉴스
        if(_g_hide_related_news) {
            var blocks = document.querySelectorAll("div.link_news");
            if(blocks.length > 0) {
                for(var i = 0; i< blocks.length; i++) {
                    blocks[i].parentNode.removeChild(blocks[i]);
                }
            }
        }

        // // 오늘의 포토 숨기기
        // if(_g_hide_todays_photo) {
        //     var blocks = document.querySelectorAll("div.wrap_topic");
        //     if(blocks.length > 0) {
        //         for(var i = 0; i< blocks.length; i++) {
        //             blocks[i].parentNode.removeChild(blocks[i]);
        //         }
        //     }
        // }

        // 댓글 숨기기..
        // if(_g_hide_comments && (document.location.hostname != "post.naver.com" && document.location.hostname != "m.post.naver.com")) {
        if(_g_hide_comments && document.location.hostname.endsWith("news.naver.com")) {
                var blocks = [];
            var elements = [];

            // 이모티콘
            var elements = document.querySelectorAll("div._reactionModule.u_likeit");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            // 댓글
            elements = document.querySelectorAll("div#cbox_module");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("a#articleTitleCommentCount");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("a#comment_count");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }

            elements = document.querySelectorAll("a.count_cmt");
            if(elements.length > 0) {
                for(var i = 0; i< elements.length; i++) {
                    blocks.push(elements[i]);
                }
            }


            elements = document.querySelectorAll("a.cluster_cmt");
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
                    return;
                    //element.removeChild(element.firstChild);
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
                
                var parentli = findParent(element, "li");
                if(!!parentli) {
                    parentli.style.textDecoration = "line-through";
                    parentli.style.color = "#cccccc";
                    // parentli.style.color = "rgb(187, 187, 187, 0.5)";
                }
                //element.style.pointerEvents="none";
            } else {
                var clazz = element.getAttribute("class");
                if(_g_keep_media_label) {
                    if(!clazz) clazz = "";
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
            
            if(node.tagName && node.tagName.toLowerCase() == tag) {
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
            
            // if(!!link.getAttribute("class") && link.getAttribute("class").indexOf("link_thumb") >= 0) return;


    //            console.log(link);
    //            console.log("Label : " + link.innerText.trim());
            var parent = link.parentElement;
            if(!!parent) {
                var info = parent.querySelector("span.writing");
                if(!!info) {
                    var media = findmedia1(info.innerHTML);
                    if(!!media) {
                        doCacheMedia(link, media);
                        insertMediaLabel(link, media);
                        return true;
                    }
                }

            }


            // var parent = link.parentElement.parentElement;
            // if(!!parent) {
            //     var info = parent.querySelector("span.info_mainnews");
            //     if(!!info) {
            //         var media = findmedia2(info.innerHTML);
            //         if(!!media) {
            //             doCacheMedia(link, media);
            //             insertMediaLabel(link, media);
            //             return true;
            //         }
            //     }


            //     var info = parent.querySelector("span.info_thumb");
            //     if(!!info) {
            //         var media = findmedia2(info.innerHTML);
            //         if(!!media) {
            //             doCacheMedia(link, media);
            //             insertMediaLabel(link, media);
            //             return true;
            //         }
            //     }
            // }

    //      console.log("---------------------");

            return false;
        }
        

        
        
        //console.log("aaaaaaaaaaaaaaaaa : " + _g_is_initialized);

        if(_g_is_initialized == false) return;

        // 환경설정에 따른 블럭들 숨기기
        hideBlocks();


        function is_ignore_item(anchor) {
            if(!anchor) return false;
            if(typeof anchor.href === "undefined" || !anchor.href) return true;
            if(!_g_ignore_domains || _g_ignore_domains.length == 0) return false;

            
            var href = anchor.getAttribute("href") || "";
            var clazz = anchor.getAttribute("class") || "";
            
            // var href = anchor.href || "";
            // console.log("href : " + href);
            if(href == "" || href == "#" || href.startsWith("javascript:")) return true;
            if(href.indexOf("/read.naver") < 0 && href.indexOf("/article/") < 0 && href.indexOf("/press/") < 0 && href.indexOf("/read.nhn") < 0 && href.indexOf("/office.nhn") < 0 && href.indexOf("/list.nhn") < 0) return true;

            // 언론사의 상단 카테고리 메뉴는 예외로 처리
            if(clazz.indexOf("Nitem_link") >= 0 || clazz.indexOf("ofhd_float_title_text") >= 0) return true;

            for(var i = 0; i< _g_ignore_domains.length; i++) {
                var domain = _g_ignore_domains[i];
                if(href.indexOf(domain) >= 0) return true;
            }
            return false;
        }
        
        var links = [];
        // for(var i = 0; i< domains.length; i++) {
            //if(frameDepth == 0) {
            if(window.self == window.top) {
                var res = document.querySelectorAll("a[href]");
                // if(res.length == 0) continue;
                
                for(var j = 0; j < res.length ; j++) {
                    var link = res[j];
                    if(!link || !link.href) continue;


                    if(is_ignore_item(link)) {
                        // console.log("href : " + link.href);
                        continue;
                    }
                    links.push(link);
                }
            }
        // }
        
        //console.log(links);
        
        for(var i = 0; i < links.length; i++){
            var anchor = links[i];
            // console.log(anchor);

            // 키워드로 차단하기 0.3.14
            if(anchor.text) {
                var label = anchor.text;
                var blockedByKeyword = false;
                for(var j = 0; j < _g_black_keyword.length; j++) {
                    if(label.indexOf(_g_black_keyword[j]) >= 0) {
                        insertMediaLabel(anchor, "``" + _g_black_keyword[j] + "``");
                        blockedByKeyword = true;
                        break;
                    }
                }
                if(blockedByKeyword) continue;
            }
            
            
            // 링크 근처에 언론사 이름이 있는지 확인
            var hasNeerBy = neerby(anchor);
            if(hasNeerBy) continue;

            // var media = _g_media_map_cache[anchor.href];
            // if(!!media) {
            //     insertMediaLabel(anchor, media);
            //     continue;
            // }

            if(hasNeerBy === false) {
                anchor.addEventListener("mouseover", function(event){
                    var target = findParent(event.target, "a");

                    if(target == null || target.tagName.toLowerCase() !== "a" || !target.href) return;
                    if(target.getAttribute("data-blocked") == "true") return;

                    //console.log('link mouseover : ' + target.href);
                    loadmedia(target, function(media) {
                        if(!media) {
                            console.log("No Media : " + target.href);
                        }
                        doCacheMedia(target, media);
                        insertMediaLabel(target, media);
                    });

                    event.stopPropagation();
                    event.preventDefault();
                });
                
                if(_g_auto_load) {
                    // _g_link_queue.push(anchor);

                    loadmedia(anchor, function(media) {
                        if(!media) {
                            console.log("No Media : " + anchor.href);
                        }
                        doCacheMedia(anchor, media);
                        insertMediaLabel(anchor, media);
                    });
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
                    if(!media) {
                        console.log("No Media : " + anchor.href);
                    }
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

                    // console.log("..................chrome.storage.sync.get....................");
                    modify();
                });
            });
            
            
            
            
            // var lastdiv = "";
            // var newsdiv = document.querySelector("div#news");
            // if(typeof newsdiv != "undefined" && newsdiv != null){
            //     newsdiv.addEventListener("DOMSubtreeModified",function(event){
            //         if(newsdiv.firstChild != null) {
            //             var fc = newsdiv.firstChild.className;
            //             if(fc != lastdiv) {
            //             // console.log('news div changed');
            //                 lastdiv = fc;
            //                 modify();
            //             }
            //         }
            //         event.stopPropagation();
            //         event.preventDefault();
            //     });
            // }


            setInterval(function() {
                // var groupdiv = document.querySelector("div#mediaTab");
                // if(typeof groupdiv != "undefined" && groupdiv != null){
                //     var fc = groupdiv.className;
                //     if(fc != lastgroup) {
                //         // console.log('group div changed');
                //         lastgroup = fc;
                //         modify();
                //     }
                // }

                // var divs = document.querySelectorAll("div.aside_g.aside_popular ul.tab_aside.tab_media > li")
                // if(typeof divs != "undefined" && divs != null && divs.length > 0){
                //     for(var i = 0; i<divs.length; i++) {
                //         var div = divs[i];
                //         if(div.className == "on") {
                //             var dom = div.innerHTML;
                //             if(onindex != i || dom != activedom) {
                //                 // console.log(div.className + " : " + i);
                //                 onindex = i;
                //                 modify();
                //                 activedom = div.innerHTML;
                //             }
                //         }
                //     }
                // }


                // var uls = document.querySelectorAll("ul.list_timenews")
                // if(typeof uls != "undefined" && uls != null && uls.length > 0){
                //     for(var i = 0; i<uls.length; i++) {
                //         var ul = uls[i];
                //         var li = ul.firstChild;
                //         if(li != null && li.className != "media-filter-li") {
                //             var newli = document.createElement("li");
                //             newli.className = "media-filter-li";
                //             newli.style.display = "none";
                //             ul.insertBefore(newli, ul.firstChild);
                //             modify();
                //         }
                //     }
                // }

                // if(location.host == "search.daum.net") {
                //     if(document.querySelector("ul#clusterResultUL") && document.querySelector("ul#clusterResultUL").childElementCount != lastCount) {
                //         lastCount = document.querySelector("ul#clusterResultUL").childElementCount;
                //         modify();
                //     }
                // }

                
                modify();

                // 환경설정에 따른 블럭들 숨기기
                hideBlocks();

            }, 1000);        // 0.3.16 1초이하는 사용자에게 별다른 의미가 없어 웹 브라우저 부하를 줄이기 위해 수정
            

            // var interval = 1000;
            // function _delayLoad() {
            //     console.log(".................._delayLoad....................");
            //     modify();
            //     interval += 1000;
            //     setTimeout(function() {
            //         _delayLoad();
            //     }, interval);
            // }

            // _delayLoad();
        }       // if(window.self == window.top) {

    })();
}