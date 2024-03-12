var script_presents2017 = "(" +
	(function() {
			mAj = function(_params, fn) {

				$.ajax({
					type: "POST",
					url: "/ajax/json.php",
					data: _params,
					dataType: "json",
					processData: false,
					success: fn
				});

			}

			PV = function() {
				if ($('#myCloseButt').css("display")=="block") {
					ClearPV();
					return;
				}	
							var obj_tables = $("#good_patt table");
			var present_types = ["Все"];
				$('#mur_present_container').show();
				$('#myCloseButt').show();
				var _params = '{"controller":"inventory","action":"controlPresents","params":{"sort":"3","direction":0},"client":1}',
					fn = function(data) {
						var getIt = 0;
						if ('response' in data) {
							if ('presents' in data.response) {
								getIt = 1;
								var ob = data.response.presents;
							}
						}

						if (getIt > 0) {
							var i = ob.length,
								tblTpl = '';
							for (p in ob) {
								i--;
								$('#good_patt').append(getTblTpl(ob[p], i, ob.length));;
								if($.inArray( ob[p]['desc'], present_types) === -1)
								{
								  present_types.push(ob[p]['desc']);
								}
							}
						} else {
							$('#best_patt').html('Ничего нет или ошибка........');
						}
						var s = $("<select id=\"present_type\" style=\"float: left;\" onchange=\"changeType()\" />");
						for(var val in present_types) {
						    $("<option />", {value: val, text: present_types[val]}).appendTo(s);
						}
						s.appendTo("#best_patt");
					};

				mAj(_params, fn);
			}
			changeType = function(){
				var texttype =$('#present_type :selected').text() ;
				if(texttype == 'Все'){
					$('#good_patt table').show();
				}
				else{
					$('#good_patt table').hide();
					$('#good_patt table[data-gift="'+texttype+'"]').show();
				}
			}

			arr = "ng_presents2".split("|");
			
			getTblTpl = function(p, i, cnt) {

				p.buttons = '';
				//"Звёздочка|Страница|ФейвИШамунь|Мирка|Умелка|ЗЗГ|Клубок|1|Ослик|13240|13216|13192|Удочка|13239|13215|13191|Клетка|13252|13228|13204|Нож|1506|1505|1504|Кирка ГН|"
				//"Звёздочка|0|-|-|-|Страница|1|-|-|-|ФейвИШамунь|2|-|-|-|Ослик|3|1|1|1|Ворон|4|-|-|-|Удочка|5|13240|13216|13192|Клетка|5|13239|13215|13191|Нож|5|13252|13228|13204|Мирка|6|-|-|-|Умелка|7|-|-|-|ЗЗГ|8|-|-|-|Клубок|9|-|-|-|
				//Мирка|Умелка|ЗЗГ|Клубок|13240|13216|13192|Удочка|13239|13215|13191|Клетка|13252|13228|13204|Нож|1506|1505|1504|Кирка ГН|"
				if (p.desc == 'Огромный Подарок') {
					buttons=(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[0]+'', 'onClick':'Javascript:getPresent('+arr[1]+', ' + p.id + ', this'+(arr[2]=="-"?"":","+arr[2])+')'}).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[5]+'', 'onClick':'Javascript:getPresent('+arr[6]+', ' + p.id + ', this'+(arr[7]=="-"?"":","+arr[7])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[10]+'', 'onClick':'Javascript:getPresent('+arr[11]+', ' + p.id + ', this'+(arr[12]=="-"?"":","+arr[12])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[15]+'12д', 'onClick':'Javascript:getPresent('+arr[16]+', ' + p.id + ', this'+(arr[17]=="-"?"":","+arr[17])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[20]+'8д', 'onClick':'Javascript:getPresent('+arr[21]+', ' + p.id + ', this'+(arr[22]=="-"?"":","+arr[22])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[25]+'III.', 'onClick':'Javascript:getPresent('+arr[26]+', ' + p.id + ', this'+(arr[27]=="-"?"":","+arr[27])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[30]+'III.', 'onClick':'Javascript:getPresent('+arr[31]+', ' + p.id + ', this'+(arr[32]=="-"?"":","+arr[32])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[35]+'III.', 'onClick':'Javascript:getPresent('+arr[36]+', ' + p.id + ', this'+(arr[37]=="-"?"":","+arr[37])+')'})).add(	
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[40]+'', 'onClick':'Javascript:getPresent('+arr[41]+', ' + p.id + ', this'+(arr[42]=="-"?"":","+arr[42])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[45]+'', 'onClick':'Javascript:getPresent('+arr[46]+', ' + p.id + ', this'+(arr[47]=="-"?"":","+arr[47])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[50]+'', 'onClick':'Javascript:getPresent('+arr[51]+', ' + p.id + ', this'+(arr[52]=="-"?"":","+arr[52])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[55]+'', 'onClick':'Javascript:getPresent('+arr[56]+', ' + p.id + ', this'+(arr[57]=="-"?"":","+arr[57])+')'}))				
					);
				} else if (p.desc == 'Большой Подарок') {
					buttons=(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[0]+'', 'onClick':'Javascript:getPresent('+arr[1]+', ' + p.id + ', this'+(arr[2]=="-"?"":","+arr[2])+')'}).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[5]+'', 'onClick':'Javascript:getPresent('+arr[6]+', ' + p.id + ', this'+(arr[7]=="-"?"":","+arr[7])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[10]+'', 'onClick':'Javascript:getPresent('+arr[11]+', ' + p.id + ', this'+(arr[12]=="-"?"":","+arr[12])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[15]+'6д', 'onClick':'Javascript:getPresent('+arr[16]+', ' + p.id + ', this'+(arr[17]=="-"?"":","+arr[17])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[20]+'4д', 'onClick':'Javascript:getPresent('+arr[21]+', ' + p.id + ', this'+(arr[22]=="-"?"":","+arr[22])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[25]+'II.', 'onClick':'Javascript:getPresent('+arr[26]+', ' + p.id + ', this'+(arr[28]=="-"?"":","+arr[28])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[30]+'II.', 'onClick':'Javascript:getPresent('+arr[31]+', ' + p.id + ', this'+(arr[33]=="-"?"":","+arr[33])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[35]+'II.', 'onClick':'Javascript:getPresent('+arr[36]+', ' + p.id + ', this'+(arr[38]=="-"?"":","+arr[38])+')'})).add(	
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[40]+'', 'onClick':'Javascript:getPresent('+arr[41]+', ' + p.id + ', this'+(arr[42]=="-"?"":","+arr[42])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[45]+'', 'onClick':'Javascript:getPresent('+arr[46]+', ' + p.id + ', this'+(arr[47]=="-"?"":","+arr[47])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[50]+'', 'onClick':'Javascript:getPresent('+arr[51]+', ' + p.id + ', this'+(arr[52]=="-"?"":","+arr[52])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':'-----', 'onClick':'Javascript:getPresent(-1, -1, this)'}))						
					);
				} else if (p.desc == 'Средний Подарок') {
					buttons=(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[0]+'', 'onClick':'Javascript:getPresent('+arr[1]+', ' + p.id + ', this'+(arr[2]=="-"?"":","+arr[2])+')'}).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[5]+'', 'onClick':'Javascript:getPresent('+arr[6]+', ' + p.id + ', this'+(arr[7]=="-"?"":","+arr[7])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[10]+'', 'onClick':'Javascript:getPresent('+arr[11]+', ' + p.id + ', this'+(arr[12]=="-"?"":","+arr[12])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[15]+'3д', 'onClick':'Javascript:getPresent('+arr[16]+', ' + p.id + ', this'+(arr[17]=="-"?"":","+arr[17])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[20]+'2д', 'onClick':'Javascript:getPresent('+arr[21]+', ' + p.id + ', this'+(arr[22]=="-"?"":","+arr[22])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[25]+'I.', 'onClick':'Javascript:getPresent('+arr[26]+', ' + p.id + ', this'+(arr[29]=="-"?"":","+arr[29])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[30]+'I.', 'onClick':'Javascript:getPresent('+arr[31]+', ' + p.id + ', this'+(arr[34]=="-"?"":","+arr[34])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[35]+'I.', 'onClick':'Javascript:getPresent('+arr[36]+', ' + p.id + ', this'+(arr[39]=="-"?"":","+arr[39])+')'})).add(	
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[40]+'', 'onClick':'Javascript:getPresent('+arr[41]+', ' + p.id + ', this'+(arr[42]=="-"?"":","+arr[42])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[45]+'', 'onClick':'Javascript:getPresent('+arr[46]+', ' + p.id + ', this'+(arr[47]=="-"?"":","+arr[47])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[50]+'', 'onClick':'Javascript:getPresent('+arr[51]+', ' + p.id + ', this'+(arr[52]=="-"?"":","+arr[52])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':'-----', 'onClick':'Javascript:getPresent(-1, -1, this)'}))							
					);
				} else if (p.desc == 'Малый Подарок') {
					buttons=(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[0]+'', 'onClick':'Javascript:getPresent('+arr[1]+', ' + p.id + ', this'+(arr[2]=="-"?"":","+arr[2])+')'}).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[5]+'', 'onClick':'Javascript:getPresent('+arr[6]+', ' + p.id + ', this'+(arr[7]=="-"?"":","+arr[7])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[10]+'', 'onClick':'Javascript:getPresent('+arr[11]+', ' + p.id + ', this'+(arr[12]=="-"?"":","+arr[12])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[15]+'1д', 'onClick':'Javascript:getPresent('+arr[16]+', ' + p.id + ', this'+(arr[17]=="-"?"":","+arr[17])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[40]+'', 'onClick':'Javascript:getPresent(4, ' + p.id + ', this'+(arr[42]=="-"?"":","+arr[42])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[45]+'', 'onClick':'Javascript:getPresent(5, ' + p.id + ', this'+(arr[47]=="-"?"":","+arr[47])+')'}))							
					);
				}  else if (p.desc == 'Скромный Подарок') {
					buttons=(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[0]+'', 'onClick':'Javascript:getPresent('+arr[1]+', ' + p.id + ', this'+(arr[2]=="-"?"":","+arr[2])+')'}).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[5]+'', 'onClick':'Javascript:getPresent('+arr[6]+', ' + p.id + ', this'+(arr[7]=="-"?"":","+arr[7])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[10]+'', 'onClick':'Javascript:getPresent('+arr[11]+', ' + p.id + ', this'+(arr[12]=="-"?"":","+arr[12])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[40]+'', 'onClick':'Javascript:getPresent(3, ' + p.id + ', this'+(arr[42]=="-"?"":","+arr[42])+')'})).add(
					$('<input/>', {'type':'button', 'class':'invbutt', 'value':''+arr[45]+'', 'onClick':'Javascript:getPresent(4, ' + p.id + ', this'+(arr[47]=="-"?"":","+arr[47])+')'}))
					);
				}else {
					buttons = 'я хз, что в этом подарке [' + p.desc + '], поэтому пусто';
				}

				i = parseInt(i);

				return $('<table/>', {'data-gift':p.desc, 'id':p.id, 'border':1, 'cellpadding':1, 'cellspacing':1, 'class':'textM', 'width':770}).append($('<tr/>').append($('<td/>', {'align':'center', 'bgcolor':'#d7d7d7', 'text':p.desc })).append($('<td/>', {'align':'center', 'bgcolor':'#d7d7d7', 'text':'Получен: ' + p.date + ' От '}).append($('<b>', {text:(p.name).replace('<i>','').replace('</i>','')})).append($('<a>', {'href':'https://www.ereality.ru/~'+p.name, 'target':'_blank'}).append($('<img>', {'src':'https://img.ereality.ru/inf.gif', 'border':0}))))).append($('<tr/>').append($('<td/>', {'align':'center', 'bgcolor':'#d7d7d7', 'width':'155', 'valign':'top', 'text':(i + 1) + ' из ' + cnt })).append($('<td/>', {'align':'left', 'bgcolor':'#d7d7d7', 'rowspan':'2', 'height':'100%', 'valign':'top'}).append(buttons))).append($('<tr/>').append($('<td/>', {'align':'center', 'bgcolor':'#d7d7d7', 'height':'10'})))


			}
			getPresent = function(packNum, PresentId, _this, itemNum) {
				itemNum = itemNum || "";
				if (packNum < 0) {
					chat.msgSystem("Оповещение плагина", "Подарок #" + PresentId + " скрыт. Остался в подарках. Тупо там нет такой опции, что вы жмякнули =) Новое открытие списка - вернет его в список.");
					$(_this).parents('table').remove();
				}
				var _params = '{"controller":"inventory","action":"openPresent","params":{"presentId":' + PresentId + ',"selectedItems":[' + itemNum+ '],"packNum":"' + packNum + '"},"client":1} ',
					fn = function(data) {
						var text = "";
						if ('response' in data) {
							if ('core' in data.response) {
								if ('messages' in data.response.core) {
									for (_m in data.response.core.messages) {
										text = data.response.core.messages[_m];
										chat.msgSystem("Оповещение плагина", text);
									}
								}
							}
						}
						if (text == '') {
							chat.msgSystem("Оповещение плагина", "Подарок #" + PresentId + " вытащен! Наверное...  :121: ");
						}
					};
				mAj(_params, fn);
				$(_this).parents('table').remove();
			}

			ClearPV = function() {
				$('#best_patt').html('');
				$('#good_patt').html('');
				$('#myCloseButt').hide();
				$('#mur_present_container').hide();
			}

			var my_style = '  style="position: absolute; top: 0px; right: 0px; z-index: 9999; background-color: rgba(221, 221, 221, 0.87); padding: 1px; border-radius: 9px; border: 1px dashed #adadad; text-align: right; max-height: 530px; overflow-y: scroll;display:none;" ',
			    my_block_style = ' style="font-size: 12px; font-family: arial;" ',
				close_style = '  style="position:fixed;top:5px;right:19px; width: 20px!important; height: 22px!important; display: none!important; background: url(closeButton_pic) 0 0 no-repeat!important;" ',
				my_close = '<a id="myCloseButt" href="JavaScript:ClearPV();" ' + close_style + '></a>';

			$("body").prepend('<div id=\"mur_present_container\"' + my_style + '>' + my_close + '<div id="best_patt"' + my_block_style + '></div><div id="good_patt"' + my_block_style + '></div></div>');
			$("#best_patt").css({
				"font-weight": "bold",
				"text-align": "center"
			});
		


	}).toString() + ")();"