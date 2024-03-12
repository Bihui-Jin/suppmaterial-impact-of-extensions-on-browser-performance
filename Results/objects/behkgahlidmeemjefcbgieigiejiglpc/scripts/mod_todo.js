/* ------------------ TASKS ------------------ */
// has scroll bar
(function ($) {
	$.fn.hasScrollBar = function () {
		return this[0] ? this[0].scrollHeight > this.innerHeight() : false;
	}
})(jQuery);

function checkScrollTasks() {
	// check scroll bar
	if ($('#sidebar_root #tasks').hasScrollBar())
		$('#sidebar_root #todo').addClass('with_scroll');
	else
		$('#sidebar_root #todo').removeClass('with_scroll');
}
setTimeout(function () {
	checkScrollTasks();
}, 1500);



// convert text in links
function linkable(element) {
	var linkable_content = $(element).html();
	if (!linkable_content.includes('<a href=')) {
		var regex = /(http?:\/\/[^ ;|\\*'"!,()<>]+\/?)/g;
		if (linkable_content.includes('https'))
			regex = /(https?:\/\/[^ ;|\\*'"!,()<>]+\/?)/g;

		linkable_content = linkable_content.replace(regex, '<a href="$1" target="_blank">$1</a>');
		$(element).html(linkable_content);
	}
}



// read tasks function
function readTasks() {
	chrome.storage.sync.get(function (obj) {
		if (typeof obj.todoList !== 'undefined') {
			$('#tasks').html(obj.todoList);

			if ($('#tasks').children('li').length > 0) {
				// convert links
				$('#tasks li').each(function () {
					linkable(this);
				});

				$('#tasks').removeClass('empty');
				$('#todo .info').hide();
				$('#tasks').sortable({
					handle: 'b',
					onDrop: function ($item, container, _super, event) {
						$item.removeClass(container.group.options.draggedClass).removeAttr('style');
						$('body').removeClass(container.group.options.bodyClass);
						saveTasks();
					}
				});

				addDeleteFn('tasks');
				markTaskAsDone();

				checkScrollTasks();
			}
			else {
				$('#tasks').addClass('empty');
				$('#todo .info').show();
			}
		}
		else {
			$('#tasks').addClass('empty');
			$('#todo .info').show();
		}
	});
}
readTasks();


// read tasks on storage change
chrome.storage.onChanged.addListener(readTasks);


// save tasks
function saveTasks() {
	setTimeout(function () {
		var items = $('#tasks').html();
		chrome.storage.sync.set({
			'todoList': items
		});
		readTasks();
	}, 100);
}


// mark task as done
function markTaskAsDone() {
	$('#tasks li').each(function () {
		$(this).click(function () {
			$(this).toggleClass('done');
			setTimeout(function () {
				saveTasks();
			}, 700);
		}).children().click(function () {
			var el = $(this).html();
			if (el.includes('http'))
				chrome.tabs.update({ url: el });
			return false;
		});
	});
}


// add task
function addTask() {
	readTasks();
	var query = $('#todo .custom_input').val();
	var regex = /(<([^>]+)>)/ig;
	query = query.replace(regex, "");

	if (query != "") {
		var item = '<li>' + query + ' <b class="icon-move" title="' + txt_move + '"></b> <i class="icon-delete" title="' + txt_delete + '"></i></li>';

		// save to-do list
		chrome.storage.sync.get(function (obj) {
			// no tasks
			if (typeof obj.todoList === 'undefined') {
				$('#tasks').prepend(item);

				chrome.storage.sync.set({
					'todoList': item
				});
			} else {
				$('#tasks').prepend(item);
				saveTasks();
			}

			addDeleteFn('tasks');
			markTaskAsDone();
		});


		// clear input
		$('#todo .custom_input').val('');
	}

	// sortable
	setTimeout(function () {
		readTasks();
	}, 300);
}

$('#todo .custom_input').bind("enterKey", function (e) {
	addTask();
});

$('#todo .addTask a').click(function () {
	addTask();
});

$('#todo .custom_input').keyup(function (e) {
	if (e.keyCode == 13) {
		$(this).trigger("enterKey");
	}
});



/* ------------------ SIDEBAR ------------------ */
chrome.storage.sync.get(function (obj) {
	if (typeof obj.sidebarOpen !== 'undefined')
		isSideBarOpen = obj.sidebarOpen;
});

function setSidebar() {
	console.log("setSidebar > " + isSideBarOpen)
	chrome.storage.sync.set({
		'sidebarOpen': isSideBarOpen
	});
}

function sidebarStatus() {
	try {
		if (isSideBarOpen)
			$("#check_sidebar").prop('checked', true);

		$('#check_sidebar').change(function () {
			if ($('#check_sidebar').is(':checked'))
				isSideBarOpen = true;
			else
				isSideBarOpen = false;
			setSidebar();
		});
	}
	catch (e) { }
}
setTimeout(function () {
	sidebarStatus();
}, 150);


// sidebar theme
if ($('#sidebar_root, #root.popup').length) {
	function sidebarTheme() {
		var darkmode = 'auto';
		chrome.storage.sync.get(function (obj) {
			if (typeof obj.userDarkMode !== 'undefined')
				darkmode = obj.userDarkMode;
			document.documentElement.setAttribute('data-theme', darkmode);
		});
	}
	sidebarTheme();

	// change theme on storage change
	chrome.storage.onChanged.addListener(sidebarTheme);
}