$(document).ready(function () {
	$().UItoTop({
		easingType: 'easeOutQuart'
	});
	//промотка вверх при переклшючении табин
	$('.menutab').click(function () {
		$('html, body').animate({
			scrollTop: 0
		}, 0);
	});

	//выбор образа героя
	$('td[id^=selavatrid]').click(function () {
		$('td[id^=selavatrid]').removeClass('bg-info');
		var obj = $(this);
		obj.addClass('bg-info');
		var valueForSelect = obj.find('img').attr('src').split('/')[1];
		$('#heroAvatar').val(valueForSelect).change();
	});

	//включение/выключение кнопки
	$('.checkForButton').click(function () {
		var obj = $(this);
		if (obj.prop('checked')) {
			obj.parents().eq(1).removeClass('panel-danger').addClass('panel-info');
		} else {
			obj.parents().eq(1).removeClass('panel-info').addClass('panel-danger');
		}
		refreshButtonsInput();
	});

	//обновление позиций кнопок
	$('#button_position').change(function () {
		refreshButtonsPosition();
	});

	//выбор следа
	$('img[id^=selsled]').click(function () {
		var obj = $(this);
		var valueForSelect = obj.attr('src').split('res/')[1];
		$('#trace_img_src').val('res/' + valueForSelect).change();
	});

	//выбор ареала
	$('img[id^=sel_monster_fon]').click(function () {
		var obj = $(this);
		var valueForSelect = obj.attr('src').split('res/')[1];
		$('#monster_fon').val('res/' + valueForSelect).change();
	});

	//костыль для позиционирование кнопок
	$('a[href^="#menu10"]').click(function () {
		refreshButtonsPosition();
	});


	//включение/выключение таймера
	$('.checkForTimer').click(function () {
		var obj = $(this);
		if (obj.prop('checked')) {
			obj.parents().eq(3).removeClass('panel-danger').addClass('panel-info');
		} else {
			obj.parents().eq(3).removeClass('panel-info').addClass('panel-danger');

		}
		refreshTimersInput();
	});

	//обновление позиций таймеров
	$('#timers_position').change(function () {
		refreshTimersPosition();
	});

	//костыль для позиционирование кнопок
	$('a[href^="#menu9"]').click(function () {
		refreshTimersPosition();
	});

	//выбор для форума
	$('td[id^=selignorid]').click(function () {
		var obj = $(this);
		var valueForSelect = obj.find('img').attr('src').split('res/')[1];
		valueForSelect = valueForSelect.split('.')[0];
		$('#forum_ignore_user_replace').val(valueForSelect).change();
	});

	//выбор картинки для сетки
	$('img[id^=sturquoise_grid_map_]').click(function () {
		var obj = $(this);
		var valueForSelect = obj.attr('src');
		$('#turquoise_grid_map').val(valueForSelect).change();
	});
	$('#background_scripts_host_erhelp').click(function () {
		$('#background_scripts_host').val($(this).text());
	});
	$('#background_scripts_host_juki').click(function () {
		$('#background_scripts_host').val($(this).text());
	});

});
//перетаскивание панелей кнопок
jQuery(function ($) {
	var panelList = $('#draggablePanelList');

	panelList.sortable({
		handle: '.panel-heading',
		update: function () {
			$('.panel', panelList).each(function (index, elem) {
				var $listItem = $(elem),
					newIndex = $listItem.index();
			});
			refreshButtonsInput();
		}
	});
});
//обновление input в зивисимости от обновления кнопок
var refreshButtonsInput = function () {
		var objarr = $('.checkForButton:checked').parent().parent();
		var arrForInput = [];
		objarr.each(function (index) {
			arrForInput.push($(this).attr('id').split('_')[1]);
		});
		$('#button_position').val(arrForInput.join('|')).change();
	}
	//обновление позиций кнопок в зависимости от input
var refreshButtonsPosition = function () {
		var strPosition = $('#button_position').val();
		var arrPosition = strPosition.split('|').reverse();
		var arrBtnpos = $("[id^=btnpos_]");
		arrBtnpos.find('.checkForButton').prop('checked', false);
		arrBtnpos.removeClass('panel-info').addClass('panel-danger');
		var elementContainer = $('#draggablePanelList');
		$.each(arrPosition, function (key, val) {
			var obj = $("#btnpos_" + val);
			obj.find('.checkForButton').prop('checked', true);
			obj.removeClass('panel-danger').addClass('panel-info');
			elementContainer.prepend(obj);
		});
	}
	//перетаскивание панелей кнопок
jQuery(function ($) {
	var timerList = $('#draggablePanelListTimers');

	timerList.sortable({
		handle: '.panel-heading',
		update: function () {
			$('.panel', timerList).each(function (index, elem) {
				var $listItem = $(elem),
					newIndex = $listItem.index();
			});
			refreshTimersInput();
		}
	});
});
//обновление input в зивисимости от обновления кнопок
var refreshTimersInput = function () {
		var objarr = $('.checkForTimer:checked').parents('.panel-dd-timer');
		var arrForInput = [];
		objarr.each(function (index) {
			arrForInput.push($(this).attr('id').split('_')[1]);
		});
		$('#timers_position').val(arrForInput.reverse().join('|')).change();
	}
	//обновление позиций таймеров в зависимости от input
var refreshTimersPosition = function () {
	var strPosition = $('#timers_position').val();
	var arrPosition = strPosition.split('|').reverse();
	var arrBtnpos = $("[id^=timrs_]");
	arrBtnpos.find('.checkForTimer').prop('checked', false);
	arrBtnpos.removeClass('panel-info').addClass('panel-danger');
	var elementContainer = $('#draggablePanelListTimers');
	$.each(arrPosition, function (key, val) {
		var obj = $("#timrs_" + val);
		obj.find('.checkForTimer').prop('checked', true);
		obj.removeClass('panel-danger').addClass('panel-info');
		elementContainer.prepend(obj);
	});
}