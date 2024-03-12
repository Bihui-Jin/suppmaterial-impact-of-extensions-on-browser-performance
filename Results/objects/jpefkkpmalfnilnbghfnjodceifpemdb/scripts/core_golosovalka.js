var script_golosovalka = "(" +
	(function() {
		core.mur_setmirka = function(id) {
			var imgsrc = "golosovalka_pic";
			$("img",$("#mur_mirka"+localStorage['golosovalka_id'])).remove();
			$("img",$("#m_mur_golosovalka")).remove();
			$("#mur_mirka"+id).append($("<img/>", {src:"golosovalka_pic"}));
			$("#mur_mirka"+id,$("#m_mur_golosovalka")).append($("<img>", {src:"golosovalka_pic"}));
			localStorage['golosovalka_id'] = id;
		}

	$(document.body.lastChild).after($("<div>", {'id':"m_mur_golosovalka", 'class':"contextMenu", 'style':"visibility: hidden;position:absolute;"}).append($('<ul>', {'class':"textM"}).append(
				$('<li>', {'id':"mur_mirka11"}).append($("<a>", {'href':"javascript: core.mur_setmirka(11);", text:'Лесоруб'}))),
				$('<li>', {'id':"mur_mirka8"}).append($("<a>", {'href':"javascript: core.mur_setmirka(8);", text:'Шахтер'})),
				$('<li>', {'id':"mur_mirka6"}).append($("<a>", {'href':"javascript: core.mur_setmirka(6);", text:'Землекоп'})),
				$('<li>', {'id':"mur_mirka3"}).append($("<a>", {'href':"javascript: core.mur_setmirka(3);", text:'Ремесленник'})),
				$('<li>', {'id':"mur_mirka4"}).append($("<a>", {'href':"javascript: core.mur_setmirka(4);", text:'Рыбак'})),
				$('<li>', {'id':"mur_mirka9"}).append($("<a>", {'href':"javascript: core.mur_setmirka(9);", text:'Траппер'})),
				$('<li>', {'id':"mur_mirka12"}).append($("<a>", {'href':"javascript: core.mur_setmirka(12);", text:'Плотник'})),
				$('<li>', {'id':"mur_mirka14"}).append($("<a>", {'href':"javascript: core.mur_setmirka(14);", text:'Оружейник'})),
				$('<li>', {'id':"mur_mirka7"}).append($("<a>", {'href':"javascript: core.mur_setmirka(7);", text:'Строитель'})),
				$('<li>', {'id':"mur_mirka5"}).append($("<a>", {'href':"javascript: core.mur_setmirka(5);", text:'Повар'}))));
	$("#m_golosovalka").contextMenu("m_mur_golosovalka",{});
	$("#m_golosovalka").on("click",function() {
		$.get("https://www.ereality.ru/holiday.php?click="+localStorage['golosovalka_id'], function(response) {
					var textResp = $("b", response).eq(0).text();
					if (textResp == "Спасибо за голосование!") 
						top.core.alertMsg(textResp);
					else
						top.core.alertError(textResp);
		});
		var now_dt =  new Date( new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000); // GMT +3
		core.mur_golosovalka_date = now_dt.getDate();
		localStorage['golosovalka_date']=core.mur_golosovalka_date;
		$("#m_golosovalka").hide();

	});
	if (localStorage['golosovalka_id']==undefined) {
		rnd= Math.floor(Math.random() * (9 - 1)) + 1;
		nmb = ((rnd==1)?(11):(((rnd==2)?(8):(((rnd==3)?(6):(((rnd==4)?(3):(((rnd==5)?(4):(((rnd==6)?(9):(((rnd==7)?(12):(((rnd==8)?(14):(7))))))))))))))));
		core.mur_setmirka(nmb); 
		$("img:first",$("#m_mur_golosovalka")).remove();
	} else $("#mur_mirka"+localStorage['golosovalka_id'],$("#m_mur_golosovalka")).append($("<img>", {'src':"golosovalka_pic"}));
	core.mur_golosovalka_date = localStorage['golosovalka_date'];
	var now_dt =  new Date( new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000); // GMT +3
	if (now_dt.getDate()!=core.mur_golosovalka_date) $("#m_golosovalka").show();


	}).toString() + ")();"