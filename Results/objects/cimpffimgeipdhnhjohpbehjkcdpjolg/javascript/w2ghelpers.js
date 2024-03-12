var $w2g = (function () {

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    var exp = {},
        readyProm = new Promise(function(resolve, reject){
            if(document.readyState === 'loading'){
                document.addEventListener("DOMContentLoaded", resolve);
            } else {
                resolve();
            }
        });

    exp.querySelector = function(sel){
        return document.querySelector(sel) || document.createElement("DIV");
    };

    exp.domReady = function(){
        return readyProm;
    };

    exp.show = function(selector, mode){
        document.querySelectorAll(selector).forEach(function(ele){
            ele.style.display = mode || "block";
        });
    };

    exp.hide = function(selector){
        document.querySelectorAll(selector).forEach(function(ele){
            ele.style.display = "none";
        });
    };

    exp.postJSON = function(url, data, method){
        data = data || {};
        return new Promise(function(resolve, reject) {
            fetch(url, {
                method: method || 'POST',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(function(data){
                if(data.ok || data.redirected){
                    data.json().then(function(json){
                        resolve(json);
                    }).catch(function(){
                        resolve();
                    });
                } else {
                    data.json().then(function(json){
                        reject(json);
                    }).catch(function(){
                        reject(data.status);
                    });
                }
            }).catch(function(e){
                reject(500);
            });
        });
    };

    exp.getJSON = function(url, method, headers){
       return new Promise(function(resolve, reject){
           fetch(url, {method: method || 'GET', credentials: "same-origin", headers: headers || {}}).then(function(data){
               if(data.ok || data.redirected){
                   data.json().then(function(json){
                       resolve(json);
                   }).catch(function(){
                       reject();
                   });
               } else {
                   data.json().then(function(json){
                       reject(json);
                   }).catch(function(){
                       reject();
                   });
               }
           }).catch(reject);
       });
    };

    return exp;

})();
