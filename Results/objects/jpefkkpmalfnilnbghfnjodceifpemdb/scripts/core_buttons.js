var script_correct_buttons = "(" +
	(function() {
		setTimeout(function() {
			var d_users = $("#div_users1");
			d_users.css("height", +d_users.css("height").replace("px", "") - 12);
		}, 100);
		var old_onWndResize = core.onWndResize;
		core.onWndResize = function() {
			old_onWndResize.apply(core, arguments);
			var div_users = $("#div_users1");
			div_users.css("height", +div_users.css("height").replace("px", "") - 12);
			return;
		}
		var old_onMouseMove = core.onMouseMove;
		core.onMouseMove = function() {
			old_onMouseMove.apply(core, arguments);
			var div_users = $("#div_users1");
			div_users.css("height", +div_users.css("height").replace("px", "") - 12);
			return;
		}
		var old_onWndResizeButtons = core.onWndResizeButtons;
		core.onWndResizeButtons = function() {
			old_onWndResizeButtons.apply(core, arguments);
			var div_users = $("#div_users1");
			div_users.css("height", +div_users.css("height").replace("px", "") - 12);
			return;
		}
		var old_init_size = core.init_size;
		core.init_size = function() {
			old_init_size.apply(core, arguments);
			var div_users = $("#div_users1");
			div_users.css("height", +div_users.css("height").replace("px", "") - 12);
			return;

		}
	}).toString() + ")();";