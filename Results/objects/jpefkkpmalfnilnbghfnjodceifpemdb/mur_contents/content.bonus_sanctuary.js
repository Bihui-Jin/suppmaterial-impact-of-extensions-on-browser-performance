// ==UserScript==
// @name     ErExt_bonst
// @include *clan.php?mode=sanctuary
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
		myoptions = mergeOptions(value, defaultConfig.myoptions);

		
	if (!myoptions.unpaused) {
		return;
	}
		//===================================================================== 
	//механизм статуи
	if (myoptions.quickBuySanctuary)
	{
		setTimeout(function (){
			$("#sanctuaryTopBar").css({width:'250px'});
			$("#sanctuaryInfo").before("<a id='sanctuaryAllShop' style='margin-top:5px'><img src='https://img.ereality.ru/sanctuary/buildings/statue.png' width='13px' height='27px'></a>");
			$("#sanctuaryAllShop").on('click',function(){
				$("#sanctuaryMain").append("<div id='sanctuaryScrollDialogPlg' class='sanctuaryBackground' style='margin-top: 54.5px;z-index: 13;position: absolute;left:25%;'>"+
				"<table>"+
					"<tr>"+
						"<td>Наименование</td>"+
						"<td><select id='statueSelectColor_all'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_all'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td id='messageSanctuary_all'>Параметр</td>"+
						"<td><input type='button' value='Х' id='buyBonusSanctuary_Close'></td>"+
						"<td></td>"+
					"</tr>"+
					"<tr>"+
						"<td>Поножи</td>"+
						"<td><select id='statueSelectColor_0'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_0'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Ловкость</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_0'></td>"+
						"<td id='messageSanctuary_0'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Кольчуга</td>"+
						"<td><select id='statueSelectColor_1'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_1'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Жизни</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_1'></td>"+
						"<td id='messageSanctuary_1'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Доспех</td>"+
						"<td><select id='statueSelectColor_2'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_2'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Сила</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_2'></td>"+
						"<td id='messageSanctuary_2'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Плащ</td>"+
						"<td><select id='statueSelectColor_3'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_3'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Защита</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_3'></td>"+
						"<td id='messageSanctuary_3'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Сапоги</td>"+
						"<td><select id='statueSelectColor_4'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_4'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Уворот</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_4'></td>"+
						"<td id='messageSanctuary_4'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Кольцо</td>"+
						"<td><select id='statueSelectColor_5'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_5'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Доп.урон</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_5'></td>"+
						"<td id='messageSanctuary_5'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Шлем</td>"+
						"<td><select id='statueSelectColor_6'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_6'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Мудрость</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_6'></td>"+
						"<td id='messageSanctuary_6'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Перчатки</td>"+
						"<td><select id='statueSelectColor_7'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_7'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Точность</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_7'></td>"+
						"<td id='messageSanctuary_7'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Кулон</td>"+
						"<td><select id='statueSelectColor_8'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_8'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Сопротивление</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_8'></td>"+
						"<td id='messageSanctuary_8'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Пояс</td>"+
						"<td><select id='statueSelectColor_9'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_9'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Интуиция</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_9'></td>"+
						"<td id='messageSanctuary_9'></td>"+
					"</tr><tr>"+
					"<tr>"+
						"<td>Наручи</td>"+
						"<td><select id='statueSelectColor_10'><option value='0'>Серый</option><option value='1'>Зеленый</option><option value='2'>Синий</option><option value='3'>Красный</option><option value='4'>Золотой</option></select></td>"+
						"<td><select id='statueSelectTerm_10'><option value='1'>7 дней</option><option value='2'>14 дней</option><option value='3'>21 день</option><option value='4'>28 дней</option></select></td>"+
						"<td>Сокрушение</td>"+
						"<td><input type='button' value='Купить' id='buyBonusSanctuary_10'></td>"+
						"<td id='messageSanctuary_10'></td>"+
					"</tr>"+
				"</div>");
				$("#buyBonusSanctuary_0").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>19</type><color>'+$("#statueSelectColor_0").val()+'</color><term>'+$("#statueSelectTerm_0").val()+'</term></request>', function (response) {
						$("#messageSanctuary_0").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_1").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>20</type><color>'+$("#statueSelectColor_1").val()+'</color><term>'+$("#statueSelectTerm_1").val()+'</term></request>', function (response) {
						$("#messageSanctuary_1").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_2").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>21</type><color>'+$("#statueSelectColor_2").val()+'</color><term>'+$("#statueSelectTerm_2").val()+'</term></request>', function (response) {
						$("#messageSanctuary_2").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_3").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>22</type><color>'+$("#statueSelectColor_3").val()+'</color><term>'+$("#statueSelectTerm_3").val()+'</term></request>', function (response) {
						$("#messageSanctuary_3").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_4").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>23</type><color>'+$("#statueSelectColor_4").val()+'</color><term>'+$("#statueSelectTerm_4").val()+'</term></request>', function (response) {
						$("#messageSanctuary_4").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_5").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>24</type><color>'+$("#statueSelectColor_5").val()+'</color><term>'+$("#statueSelectTerm_5").val()+'</term></request>', function (response) {
						$("#messageSanctuary_5").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_6").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>25</type><color>'+$("#statueSelectColor_6").val()+'</color><term>'+$("#statueSelectTerm_6").val()+'</term></request>', function (response) {
						$("#messageSanctuary_6").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_7").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>26</type><color>'+$("#statueSelectColor_7").val()+'</color><term>'+$("#statueSelectTerm_7").val()+'</term></request>', function (response) {
						$("#messageSanctuary_7").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_8").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>27</type><color>'+$("#statueSelectColor_8").val()+'</color><term>'+$("#statueSelectTerm_8").val()+'</term></request>', function (response) {
						$("#messageSanctuary_8").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_9").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>28</type><color>'+$("#statueSelectColor_9").val()+'</color><term>'+$("#statueSelectTerm_9").val()+'</term></request>', function (response) {
						$("#messageSanctuary_9").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_10").on("click",function() {			
					$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="buy_statueart"><type>29</type><color>'+$("#statueSelectColor_10").val()+'</color><term>'+$("#statueSelectTerm_10").val()+'</term></request>', function (response) {
						$("#messageSanctuary_10").html("Куплено");
					});
				});
				$("#buyBonusSanctuary_Close").on("click",function() {
					$("#sanctuaryScrollDialogPlg").detach();
				});
				$("#statueSelectColor_all").on("change",function() {
					for (i=0;i<=10;i++)
					{
						$("#statueSelectColor_"+i).val($("#statueSelectColor_all").val());
					}
				});
				$("#statueSelectTerm_all").on("change",function() {
					for (i=0;i<=10;i++)
					{
						$("#statueSelectTerm_"+i).val($("#statueSelectTerm_all").val());
					}
				});
								
			
				$.post("https://www.ereality.ru/ajax/sanctuary/", '<request action="get_statue_art_dialog"></request>', function (response) {
					$("#messageSanctuary_all").html($("karma", response).text());
					for (i=0;i<$("item", response).length;i++)
					{
						if ($("item", response).eq(i).attr("cur")==1)
						{
							$("#messageSanctuary_"+($("item", response).eq(i).attr("cat")-19)).html("Куплено");
						}
					}
				});

			})
		},400);
	}
	

	//=========================end.
});