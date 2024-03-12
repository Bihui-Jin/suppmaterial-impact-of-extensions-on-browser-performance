var W2gLogin = function(eleClass) {

	"use strict";

	var loginObj;

	var loginForm = {
		auth : true,
		email : "",
		password : "",
		errors : [],
		processing : false,
		showError : false,
		showDialog : true,
		popoutWindow: function(){
			var href = window.location.href;
			browser.windows.create({
				url: href + "?popout=true",
				type: 'popup',
				width: 400,
				height: 600
			});
			window.close();
		},
		submit : function() {
			this.showError = false;
			$w2g.postJSON(window._w2ghost + "/auth/sign_in.json", {
                user : {
                    email : this.email,
                    password : this.password,
                    remember_me : 1
                }
			}).then( function(d) {
				window.w2g.user = d;
				this.password = "";
				this.email = "";
				this.errors = [];
				this.auth = true;
				this.showDialog = false;
			}.bind(this)).catch( function(data) {
				this.errors = [data];
				this.showError = true;
			}.bind(this)).finally( function() {
				this.processing = false;
			}.bind(this));
		},
		logout : function() {
			$w2g.getJSON(window._w2ghost + "/auth/sign_out.json").then(function() {
                this.auth = false;
            }.bind(this));
		},
		check : function() {
			var data = {};
			$w2g.postJSON(window._w2ghost + "/auth/sign_in.json").then(function(d) {
				if(d.error) {
					this.auth = false;
				} else {
					window.w2g.user = d;
					this.auth = true;
				}
            }.bind(this)).catch(function() {
                this.auth = false;
            }.bind(this));
		}
	};
	

	loginObj = new W2gDataObject(loginForm);
	new W2gBind(loginObj, eleClass);

	return loginObj;

};
