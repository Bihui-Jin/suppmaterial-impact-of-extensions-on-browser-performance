var W2gSync = (function () {
    "use strict";

    var player = null, my, playerport;

    my = {
        play : function(){
            return player.play();
        },
        pause : function() {
            return player.pause();
        },
        seek : function(time){
            my.currentTime = time;
        }
    };

    Object.defineProperty(my, "player", {
        get: function () {
            return player;
        }
    });

    Object.defineProperty(my, "port", {
        get: function () {
            return playerport;
        }
    });

    Object.defineProperty(my, "currentTime", {
        get: function () {
            return player.currentTime;
        },
        set: function(time) {
            player.currentTime = time;
        },
        configurable: true
    });

    function topBar(port){
        var w2gMessage = document.createElement("div"),
            my = {},
            duration = 0,
            time = 0,
            updateSlider = true,
            updateTimeout = null,
            syncUrl = "#";

        w2gMessage.setAttribute("id", "w2g_sync_panel");
        document.body.appendChild(w2gMessage);
        var content = ` <div class="w2g-searching">
                            Searching video... you might need to press play.
                        </div>   
                        <div class="w2g-top-menu">
                                    <div class="w2g-play-button w2g-button">Pause</div>
                                    <div class="w2g-time-display">
                                        <span class="w2g-time">00:00:00</span>&nbsp;/&nbsp;<span class="w2g-duration">00:00:00</span>                                        
                                    </div>
                                    <div class="w2g-time-slider">
                                        <input type="range" min="0" max="1000" value="0" class="w2g-slider">
                                    </div>
                        </div>
                        <div class="w2g-unsync">
                            <div>This site is out of sync:</div>
                            <div class="w2g-resync-button w2g-button">Re-Sync</div>
                            <div class="w2g-setnew-button w2g-button">Set as New</div>
                        </div>`;
        w2gMessage.insertAdjacentHTML('afterbegin', content);
        w2gMessage.classList.add("searching");

        var playButton = document.querySelector("#w2g_sync_panel .w2g-play-button");
        playButton.addEventListener("click", function(){
            port.postMessage({"ui_toggle": true});
        });

        var time_display = document.querySelector("#w2g_sync_panel .w2g-time");
        var duration_display = document.querySelector("#w2g_sync_panel .w2g-duration");

        var slider = document.querySelector("#w2g_sync_panel .w2g-slider");
        slider.addEventListener("change", function(){
            port.postMessage({"ui_seek": slider.value / 1000 * duration});
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function(){
                updateSlider = true;
            }, 2000);
        });
        slider.addEventListener("input", function(){
            clearTimeout(updateTimeout);
            updateSlider = false;
            if(duration){
                time_display.innerText = _toTimeCode(slider.value / 1000 * duration);
            }
        });

        var resyncButton = document.querySelector("#w2g_sync_panel .w2g-resync-button");
        resyncButton.addEventListener("click", function(){
            window.location.href = syncUrl;
        });

        var setAsNewButton = document.querySelector("#w2g_sync_panel .w2g-setnew-button");
        setAsNewButton.addEventListener("click", function(){
            port.postMessage({"newurl": {url: window.location.href, title: document.title}});
        });

        my.handleUpdate = function(msg){
            var m = msg.ui_update || msg;
            if (m.play){
                playButton.innerHTML = "Pause";
            } else if (m.pause){
                playButton.innerHTML = "Play";
            } else if (m.durationchange){
                duration = m.durationchange;
                duration_display.innerHTML = _toTimeCode(duration);
            } else if (m.timeupdate){
                if(duration && updateSlider){
                    time = m.timeupdate
                    time_display.innerHTML = _toTimeCode(time);
                    slider.value = Math.round(time / duration * 1000);
                }
            } else if(m.videofound){
                w2gMessage.classList.remove("searching", "error");
                w2gMessage.classList.add("found")
            } else if(m.resync){
                syncUrl = m.resync;
                w2gMessage.classList.remove("searching", "found");
                w2gMessage.classList.add("error");
            }
        }

        function _toTimeCode(seconds) {
            seconds = isNaN(seconds) ? 0 : seconds;
            var hours,
                minutes,
                retval;
            seconds = Math.round(seconds);
            hours = ("00" + Math.floor(seconds / 3600)).slice(-2);
            seconds = seconds % 3600;
            minutes = ("00" + Math.floor(seconds / 60)).slice(-2);
            seconds = ("00" + seconds % 60).slice(-2);
            retval = hours + ":" + minutes + ":" + seconds;
            return (retval);
        }

        return my;
    }

    browser.runtime.onConnect.addListener(function (port) {

        playerport = port;

        var syncUrl = null, w2gMessage, canSync = true, vidScore = 0, checkIntervall, videoIntervall = null;

        port.onMessage.addListener(function (msg) {
            if(w2gMessage && msg.ui_update){
                w2gMessage.handleUpdate(msg);
            } else {
                if (player && canSync && msg.play && player.paused === true) {
                    my.play();
                } else if (player && canSync && msg.pause && player.paused === false) {
                    my.pause();
                } else if (player && canSync && msg.seek) {
                    my.seek(msg.seek);
                } else if (msg.syncUrl) {
                    syncUrl = msg.syncUrl;
                } else if (msg.urlok) {
                    if(msg.urlok.result){
                        canSync = true;
                    } else {
                        canSync = false;
                        if(w2gMessage){
                            w2gMessage.handleUpdate({resync: syncUrl});
                        }
                    }
                } else if (canSync && typeof msg.videofound !== "undefined") {
                    if(w2gMessage){
                        w2gMessage.handleUpdate(msg);
                    }
                }
            }
        });

        function init() {
            //Insert Toolbar only at top frame
            if (self === top) {
                w2gMessage = new topBar(port);
            }

            videoIntervall = setInterval(attachToVideo, 1000);
            setInterval(function(){
                if(self === top) {
                    port.postMessage({"checkurl": window.location.href});
                }
            }, 1000);
        }

        checkIntervall = setInterval(function (){
            if(document.body){
                clearInterval(checkIntervall);
                init();
            }
        }, 200);

        function handlePlay(evt) {
            port.postMessage({"durationchange": player.duration});
            port.postMessage({"play": true});
        }

        function handlePause() {
            port.postMessage({"pause": true});
        }

        function handleTimeUpdate() {
            port.postMessage({"timeupdate": my.currentTime});
        }

        function handleDurationChange() {
            port.postMessage({"durationchange": player.duration});
        }

        function handleEnded() {
            port.postMessage({"ended": true});
        }

        function attachToVideo() {
            var videos = document.getElementsByTagName("video"), i, selectedVideo;
            if (videos.length > 0) {
                for (i = 0; i < videos.length; i++) {
                    if(videos[i].readyState > 0 && videos[i].offsetParent !== null){
                        var score = videos[i].videoHeight * videos[i].videoWidth * (videos[i].duration + 1);
                        if(score >= vidScore){
                            vidScore = score;
                            selectedVideo = videos[i];
                        }
                    }
                }

                if (selectedVideo && selectedVideo !== player) {
                    removeListeners(player);
                    player = selectedVideo;
                    addListeners(player);
                    port.postMessage({"videofound": vidScore});
                    port.postMessage({"durationchange": player.duration});
                    if(player.paused){
                        port.postMessage({"pause": true});
                    } else {
                        port.postMessage({"play": true});
                    }
                }
            }
        }

        function addListeners(video){
            if(video){
                player.addEventListener("play", handlePlay);
                player.addEventListener("pause", handlePause);
                player.addEventListener("timeupdate", handleTimeUpdate);
                player.addEventListener("durationchange", handleDurationChange);
                player.addEventListener("ended", handleEnded);
            }
        }

        function removeListeners(video){
            if(video){
                player.removeEventListener("play", handlePlay);
                player.removeEventListener("pause", handlePause);
                player.removeEventListener("timeupdate", handleTimeUpdate);
                player.removeEventListener("durationchange", handleDurationChange);
                player.removeEventListener("ended", handleEnded);
            }
        }
    });

    return my;

}());