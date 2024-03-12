(function(){

    function getTime(){
        var seconds = 0;
        var timeSrc = document.querySelector(".webPlayer .time");
        if(timeSrc){
            timeArr = timeSrc.innerHTML.split("<")[0].split(":");
            var multiplier = 1;
            for(var i = timeArr.length - 1; i >= 0; i--){
                seconds += parseInt(timeArr[i] * multiplier);
                multiplier *= 60;
            }
        } else {
            seconds = W2gSync.player.currentTime;
        }
        return seconds;
    }

    Object.defineProperty(W2gSync, "currentTime", {
       set: function(time){
           W2gSync.player.pause();
           var offset = W2gSync.player.currentTime - getTime();
           W2gSync.player.currentTime = time + offset;
       },
       get: function(){
            return getTime();
       }
    });

    return true;

}());

