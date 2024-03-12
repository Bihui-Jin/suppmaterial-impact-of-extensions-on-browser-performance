
function load() {
    chrome.storage.sync.get(function (data) {
        if(typeof data.blockedMedia != "undefined") {
            for(var i = 0; i< data.blockedMedia.length; i++) {
                var val = data.blockedMedia[i];
                var ele = document.querySelector("input.blocked-link[value='" + val + "']");
                //console.log(ele);
                if(ele != null) ele.setAttribute("checked", "checked");
            }
        }
        
        if(typeof data.blockedComment != "undefined") {
            for(var i = 0; i< data.blockedComment.length; i++) {
                var val = data.blockedComment[i];
                var ele = document.querySelector("input.blocked-comment[value='" + val + "']");
                //console.log(ele);
                if(ele != null) ele.setAttribute("checked", "checked");
            }
        }
        
        document.querySelector('input#auto-load[type=checkbox]').checked = data.autoLoad;
        document.querySelector('input#block-extra[type=checkbox]').checked = data.blockExtra;
        document.querySelector('input#keep-label[type=checkbox]').checked = data.keepMediaLabel;
        document.querySelector('input#only-overline[type=checkbox]').checked = data.onlyOverline;
        document.querySelector('input#hide-comments[type=checkbox]').checked = data.hideComments;
        document.querySelector('input#hide-related-news[type=checkbox]').checked = data.hideRelatedNews;
        document.querySelector('input#hide-todays-photo[type=checkbox]').checked = data.hideTodaysPhoto;
        document.querySelector('textarea#black-keyword').value = data.blackKeyword || "";
    });
}

function save() {
    var blockedMedia = [];
    var inputs = document.querySelectorAll('input.blocked-link[type=checkbox]'); 
    for(var i = 0 ; i < inputs.length; i++){
        if(inputs[i].checked) {
            blockedMedia.push(inputs[i].value);
        }
    }
    //console.log(blockedMedia);
    
    var blockedComment = [];
    inputs = document.querySelectorAll('input.blocked-comment[type=checkbox]'); 
    for(var i = 0 ; i < inputs.length; i++){
        if(inputs[i].checked) {
            blockedComment.push(inputs[i].value);
        }
    }
    //console.log(blockedComment);
    
    chrome.storage.sync.set({
        "allMedia" : allMedia,
        "autoLoad" : document.querySelector('input#auto-load[type=checkbox]').checked,
        "blockExtra" : document.querySelector('input#block-extra[type=checkbox]').checked,
        "blockedMedia" : blockedMedia,
        "blockedComment" : blockedComment,
        "keepMediaLabel" : document.querySelector('input#keep-label[type=checkbox]').checked,
        "onlyOverline" : document.querySelector('input#only-overline[type=checkbox]').checked,
        "hideComments" : document.querySelector('input#hide-comments[type=checkbox]').checked,
        "hideRelatedNews" : document.querySelector('input#hide-related-news[type=checkbox]').checked,
        "hideTodaysPhoto" : document.querySelector('input#hide-todays-photo[type=checkbox]').checked,
        "blackKeyword" : document.querySelector('textarea#black-keyword').value,
        "linkMap" : {}
    });
    
    
    
    //alert("설정내용이 정상적으로 저장되었습니다.");      // 0.2.2
}

var allMedia = [];
document.addEventListener("DOMContentLoaded", function() {
    /*
    var tree = document.getElementById("media-tree");
    var lists = [ tree ];
    
    for (var i = 0; i < tree.getElementsByTagName("ul").length; i++)
        lists[lists.length] = tree.getElementsByTagName("ul")[i];
    
    for (var i = 0; i < lists.length; i++) {
        var item = lists[i].lastChild;
        
        while (!item.tagName || item.tagName.toLowerCase() != "li")
            item = item.previousSibling;
        
        item.className += " last";
    }
    */
    //debugger;
    /*
    chrome.runtime.onMessage.addListener(function(message, sender) {
        if (message.sendBack) {
            var url = message.data;
            console.log(url);
            var ifrm = document.querySelector("iframe#iframe-daum-media-filter");
            ifrm.setAttribute("src", url);
            chrome.tabs.sendMessage(sender.tab.id, message.data);
        }
    });
    */
    var elements = document.querySelectorAll("ul.tree > li > ul > li");
    for(var i = 0; i<elements.length; i++) {
        var element = elements[i];
        
        allMedia.push(element.innerHTML);
        
        element.style.overflow = "hidden";

        
        var linkspan = document.createElement("span");
        linkspan.style.float = "right";
        linkspan.style.display = "inline";
        
        var linkcheckbox = document.createElement("input");
        linkcheckbox.className = "blocked-link";
        linkcheckbox["id"] = "link_" + i;
        linkcheckbox["type"] = "checkbox";
        linkcheckbox["class"] = "block-checkbox";
        linkcheckbox["value"] = element.innerHTML;
//        linkcheckbox.addEventListener("change", function(){
            //console.log("change......");
//            save();
//        });
        
        var linklabel = document.createElement("label");
        linklabel.setAttribute("for", "link_" + i);
        linklabel.innerHTML = "연결차단";
        
        linkspan.appendChild(linkcheckbox);
        linkspan.appendChild(linklabel);
        
        
        
        var commentspan = document.createElement("span");
        commentspan.style.float = "right";
        commentspan.style.display = "inline";
        
        var commentcheckbox = document.createElement("input");
        commentcheckbox.className = "blocked-comment";
        commentcheckbox["id"] = "comment_" + i;
        commentcheckbox["type"] = "checkbox";
        commentcheckbox["value"] = element.innerHTML;
//        commentcheckbox.addEventListener("change", function(){
//            save();
//        });
        
        var commentlabel = document.createElement("label");
        commentlabel.setAttribute("for", "comment_" + i);
        commentlabel.innerHTML = "댓글차단";
        commentspan.appendChild(commentcheckbox);
        commentspan.appendChild(commentlabel);
        
        
        //element.appendChild(commentspan);
        element.appendChild(linkspan);
        
        linkcheckbox.addEventListener("click", function(){
            save();
        });
        commentcheckbox.addEventListener("click", function(){
            save();
        });
    }
    
    var checkall = document.querySelector("input#checkall");
    checkall.addEventListener("click", function() {
        var arrcheckbox = document.querySelectorAll("ul.tree > li > ul input[type='checkbox'");
        for(var i = 0; i<arrcheckbox.length; i++) {
            var checkbox = arrcheckbox[i];
            checkbox.checked = checkall.checked;
        }
        save();
    });

//    document.querySelector("img#save").addEventListener("click", function(){
//        save();
//    });
    document.querySelector("input#block-extra[type=checkbox]").addEventListener("click", function(){
        save();
    });
    document.querySelector("input#keep-label[type=checkbox]").addEventListener("click", function(){
        save();
    });
    document.querySelector("input#auto-load[type=checkbox]").addEventListener("click", function(){
        var checked = document.querySelector('input#auto-load[type=checkbox]').checked;
        if(checked) {
            if(confirm("자동으로 읽어오는 경우 다음 사이트에 부하를 줄 수 있습니다. 정말로 사용하시겠습니까?")) {
                save();
                
            } else {
                document.querySelector('input#auto-load[type=checkbox]').checked = false;
            }
        } else {
            save();
        }
    });
    document.querySelector("input#only-overline[type=checkbox]").addEventListener("click", function(){
        save();
    });
    document.querySelector("input#hide-comments[type=checkbox]").addEventListener("click", function(){
        save();
    });
    document.querySelector("input#hide-related-news[type=checkbox]").addEventListener("click", function(){
        save();
    });
    document.querySelector("input#hide-todays-photo[type=checkbox]").addEventListener("click", function(){
        save();
    });
    document.querySelector("textarea#black-keyword").addEventListener("change", function(){
        save();
    });
    
    // document.querySelector("a#donate-button").addEventListener("click", function(){
    //      document.querySelector("form#donate").submit();
    // });
    document.querySelector("a#config-button").addEventListener("click", function(){
         document.querySelector("div.configuration").style.display="block";
    });
    document.querySelector("ul.tree").addEventListener("click", function(e) {
        //alert(e.target);
        document.querySelector("div.configuration").style.display="none";
    });
    
    load();
});

