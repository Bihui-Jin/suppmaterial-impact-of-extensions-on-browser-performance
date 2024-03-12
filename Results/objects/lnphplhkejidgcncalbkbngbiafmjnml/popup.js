    google.load("feeds", "1");

    function initialize() {
      
	  // En la siguiente línea, sustituye la URL del Feed RSS por el de tu Blog
	  var feed = new google.feeds.Feed("https://www.adondeviajar.es/feed/");
      
	  // En la siguiente línea, hemos indicado que extraiga los 5 últimos artículos
	  feed.setNumEntries(5);
      
	  feed.load(function(result) {
        if (!result.error) {
          var container = document.getElementById("feed");
          var html = "";
          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            html = "<h5><a href='" + entry.link + "'>" + entry.title + "</a></h5>";
            var div = document.createElement("div");
            div.innerHTML = html;
            container.appendChild(div);            
          }
          document.write(html);
        }
      });
    }
    google.setOnLoadCallback(initialize);