// ==UserScript==
// @name     ErExt_monloc
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==

	var mergedSystemOptions = mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);
	var myoptions = mergeOptions(kango.storage.getItem('options'), defaultConfig.myoptions);

var monsterLocationClass = function( popup, css) {
	this.popup = popup;
	this.css = css;
	this.main;
	this.view_ovl;
	this.view_opp;
	this.view;
	this.hideTimer;	
	this.closeButtonId = "er-ext-close-button";
	
	var self = this;
	this.init = function() {
		this.prepareView();
	};

 	this.prepareView = function() {
 		
	var htmlcss= ""+
	"<style type=\"text/css\">"+
   	".mur-monsters-table {"+
  	"	border-spacing: 0;"+
  	"	background-image: linear-gradient(top, #fff, #eaeaea, #fff);"+
	"}"+
	".mur-monsters-table img:hover:not([id]) {"+
    " 	box-shadow:inset 11px 9px 75px #000000;"+
	"}"+
	".mur-monsters-table img:not([id]) {"+
   	"	opacity: 0.6;"+
   	"	cursor: pointer;"+
	"}"+
	".mur_active_img {"+
    "	box-shadow:inset 11px 9px 75px green; !important;"+
    "	opacity: 1 !important;"+
	"}"+
 	"</style>"; 
 	var htmlovl= htmlcss+
	"<table class=\"mur-monsters-table\" >"+
    "<tbody>"+
     "   <tr>"+
     "       <td><img title =\"Гоблин\" src=\""+kango.io.getResourceUrl("res/monsters/monster_01.png")+"\"></td>"+
     "       <td><img title =\"Земляной Червяк\" src=\""+kango.io.getResourceUrl("res/monsters/monster_02.png")+"\"></td>"+
     "       <td><img title =\"Скелет\" src=\""+kango.io.getResourceUrl("res/monsters/monster_03.png")+"\"></td>"+
     "       <td><img title =\"Зомби\" src=\""+kango.io.getResourceUrl("res/monsters/monster_04.png")+"\"></td>"+
     "       <td><img title =\"Сумеречный Тэнгу\" src=\""+kango.io.getResourceUrl("res/monsters/monster_05.png")+"\"></td>"+
     "       <td><img title =\"Хобгоблин\" src=\""+kango.io.getResourceUrl("res/monsters/monster_06.png")+"\"></td>"+
     "		 <td><img title =\"Закрыть\" width=40 height=40 id=\"" + this.closeButtonId + "\" src=\"" + self.css.iconClose + "\"></td>"+ 
     "   </tr>"+
     "   <tr>"+
     "       <td><img title =\"Беглый Каторжник\" src=\""+kango.io.getResourceUrl("res/monsters/monster_07.png")+"\"></td>"+  
     "       <td><img title =\"Орк\" src=\""+kango.io.getResourceUrl("res/monsters/monster_08.png")+"\"></td>"+
     "       <td><img title =\"Гоблин-Мажор\" src=\""+kango.io.getResourceUrl("res/monsters/monster_09.png")+"\"></td>"+
     "       <td><img title =\"Скелет Онсдага\" src=\""+kango.io.getResourceUrl("res/monsters/monster_10.png")+"\"></td>"+
     "       <td><img title =\"Хоббит\" src=\""+kango.io.getResourceUrl("res/monsters/monster_11.png")+"\"></td>"+
     "       <td><img title =\"Туманный Волк\" src=\""+kango.io.getResourceUrl("res/monsters/monster_12.png")+"\"></td>"+
     "       <td><img title =\"Огр\" src=\""+kango.io.getResourceUrl("res/monsters/monster_13.png")+"\"></td>"+
     "   </tr>"+
     "   <tr>"+
     "       <td><img title =\"Саламандра\" src=\""+kango.io.getResourceUrl("res/monsters/monster_14.png")+"\"></td>"+
     "       <td><img title =\"Мумия\" src=\""+kango.io.getResourceUrl("res/monsters/monster_15.png")+"\"></td>"+
     "       <td><img title =\"Виверна\" src=\""+kango.io.getResourceUrl("res/monsters/monster_16.png")+"\"></td>"+
     "       <td><img title =\"Гнолл-Девиант\" src=\""+kango.io.getResourceUrl("res/monsters/monster_17.png")+"\"></td>"+
     "       <td><img title =\"Падший Чашник\" src=\""+kango.io.getResourceUrl("res/monsters/monster_18.png")+"\"></td>"+
     "       <td><img title =\"Гобиван\" src=\""+kango.io.getResourceUrl("res/monsters/monster_19.png")+"\"></td>"+
     "       <td><img title =\"Бурый Медведь\" src=\""+kango.io.getResourceUrl("res/monsters/monster_20.png")+"\"></td>"+
     "   </tr>"+
     "    <tr>"+
     "       <td><img title =\"Вэйми\" src=\""+kango.io.getResourceUrl("res/monsters/monster_21.png")+"\"></td>"+
     "       <td><img title =\"Гарпия\" src=\""+kango.io.getResourceUrl("res/monsters/monster_22.png")+"\"></td>"+
     "       <td><img title =\"Тролль\" src=\""+kango.io.getResourceUrl("res/monsters/monster_23.png")+"\"></td>"+
     "       <td><img title =\"Болотный Спектр\" src=\""+kango.io.getResourceUrl("res/monsters/monster_24.png")+"\"></td>"+
     "       <td><img title =\"Воин Демонов\" src=\""+kango.io.getResourceUrl("res/monsters/monster_25.png")+"\"></td>"+
     "       <td><img title =\"Саблезубый Тигр\" src=\""+kango.io.getResourceUrl("res/monsters/monster_26.png")+"\"></td>"+
     "       <td><img title =\"Черная Вдова\" src=\""+kango.io.getResourceUrl("res/monsters/monster_27.png")+"\"></td>"+
     "   </tr>"+
     "   <tr>"+
     "       <td><img title =\"Великан\" src=\""+kango.io.getResourceUrl("res/monsters/monster_28.png")+"\"></td>"+
     "       <td><img title =\"Гигантский Ящер\" src=\""+kango.io.getResourceUrl("res/monsters/monster_29.png")+"\"></td>"+
     "       <td><img title =\"Ноющая Тень\" src=\""+kango.io.getResourceUrl("res/monsters/monster_30.png")+"\"></td>"+
     "       <td><img title =\"Белый Медведь\" src=\""+kango.io.getResourceUrl("res/monsters/monster_31.png")+"\"></td>"+
     "       <td><img title =\"Кислотный Элементаль\" src=\""+kango.io.getResourceUrl("res/monsters/monster_32.png")+"\"></td>"+
     "       <td><img title =\"Джаггернаут\" src=\""+kango.io.getResourceUrl("res/monsters/monster_33.png")+"\"></td>"+
     "       <td><img title =\"Мясник Гераша\" src=\""+kango.io.getResourceUrl("res/monsters/monster_34.png")+"\"></td>"+
     "		 <td></td>"+
     "   </tr>"+          
    "</tbody>"+
"</table>";    

	var htmlopp= htmlcss+
	"<table class=\"mur-monsters-table\">"+
    "<tbody>"+
    "    <tr> "+
    "        <td><img title =\"Свободный Гоблин\" src=\""+kango.io.getResourceUrl("res/monsters/monster_49.png")+"\"></td>"+
    "        <td><img title =\"ФГ-07\" src=\""+kango.io.getResourceUrl("res/monsters/monster_51.png")+"\"></td>"+
    "        <td><img title =\"МВР-5М\" src=\""+kango.io.getResourceUrl("res/monsters/monster_52.png")+"\"></td>"+
    "        <td><img title =\"Техас-73\" src=\""+kango.io.getResourceUrl("res/monsters/monster_53.png")+"\"></td>"+
    "        <td><img title =\"Закрыть\" width=40 height=40 id=\"" + this.closeButtonId + "\" src=\"" + self.css.iconClose + "\"></td>"+
    "    </tr>"+
    "    <tr>"+
    "        <td><img title =\"Погонщик Скарабеев\" src=\""+kango.io.getResourceUrl("res/monsters/monster_50.png")+"\"></td> "+
    "        <td><img title =\"Белый Маг\" src=\""+kango.io.getResourceUrl("res/monsters/monster_39.png")+"\"></td>"+
    "        <td><img title =\"Боевой Маг\" src=\""+kango.io.getResourceUrl("res/monsters/monster_40.png")+"\"></td>"+
    "        <td><img title =\"Владычица\" src=\""+kango.io.getResourceUrl("res/monsters/monster_41.png")+"\"></td>"+
    "        <td><img title =\"Саммонер\" src=\""+kango.io.getResourceUrl("res/monsters/monster_42.png")+"\"></td>"+       
    "    </tr>"+
    "    <tr>"+
    "        <td><img title =\"Ассасин\" src=\""+kango.io.getResourceUrl("res/monsters/monster_35.png")+"\"></td>"+
    "        <td><img title =\"Тень\" src=\""+kango.io.getResourceUrl("res/monsters/monster_36.png")+"\"></td>"+
    "        <td><img title =\"Танцующая с Клинками\" src=\""+kango.io.getResourceUrl("res/monsters/monster_37.png")+"\"></td>"+
    "        <td><img title =\"Кошмар\" src=\""+kango.io.getResourceUrl("res/monsters/monster_38.png")+"\"></td>"+
    "        <td><img title =\"Валькирия\" src=\""+kango.io.getResourceUrl("res/monsters/monster_46.png")+"\"></td>"+    
    "    </tr>"+
    "    <tr>"+
    "        <td><img title =\"Скорбящий\" src=\""+kango.io.getResourceUrl("res/monsters/monster_47.png")+"\"></td>"+
    "        <td><img title =\"Экзекутор\" src=\""+kango.io.getResourceUrl("res/monsters/monster_43.png")+"\"></td>"+
    "        <td><img title =\"Звездный Странник\" src=\""+kango.io.getResourceUrl("res/monsters/monster_44.png")+"\"></td>"+
    "        <td><img title =\"Носферату\" src=\""+kango.io.getResourceUrl("res/monsters/monster_48.png")+"\"></td>"+  
    "        <td><img title =\"Берсеркер\" src=\""+kango.io.getResourceUrl("res/monsters/monster_45.png")+"\"></td>"+                   
    "    </tr>"+
    "</tbody>"+
"</table>"; 

	var htmlins= htmlcss+
	"<table class=\"mur-monsters-table\">"+
    "<tbody>"+
    "    <tr> "+
    "        <td><img title =\"Тирекс\" src=\""+kango.io.getResourceUrl("res/monsters/monster_54.png")+"\"></td>"+
    "        <td><img title =\"Закрыть\" width=40 height=40 id=\"" + this.closeButtonId + "\" src=\"" + self.css.iconClose + "\"></td>"+
	"    </tr> "+
    "</tbody>"+
"</table>";   

	var htmlsee= htmlcss+
	"<table class=\"mur-monsters-table\">"+
    "<tbody>"+
    "    <tr> "+
    "        <td><img title =\"Пираты\" src=\""+kango.io.getResourceUrl("res/monsters/monster_55.png")+"\"></td>"+
	"        <td><img title =\"Пираты\" src=\""+kango.io.getResourceUrl("res/monsters/monster_56.png")+"\"></td>"+
    "        <td><img title =\"Закрыть\" width=40 height=40 id=\"" + this.closeButtonId + "\" src=\"" + self.css.iconClose + "\"></td>"+
	"    </tr> "+
    "</tbody>"+
"</table>";  

		this.view_ovl = $(htmlovl);
		this.view_opp = $(htmlopp);
		this.view_ins = $(htmlins);
		this.view_see = $(htmlsee);
	};

	this.show = function(positionX, positionY) {
		this.popup.hide();/*
		imgmapovl = mergedSystemOptions.imgmapovl;
		if (myoptions.autoimgmapovl)
		{
			var date = new Date();
			if ((date.getMonth()<=1)||(date.getMonth()>=11))
			{
				imgmapovl = "mapwinter";
			}
			else
			{
				imgmapovl = "mapnew";
			}
		}

		if (navigator.userAgent.indexOf("Firefox")==-1) {
			var lengtOVL= $("img[src*=ru\\/mapwinter\\/00\\/]",main.document).length + $("img[src*=ru\\/mapwinter\\/10\\/]",main.document).length + $("img[src*=ru\\/mapwinter\\/20\\/]",main.document).length;
			var lengtOPP= $("img[src*=ru\\/mapwinter\\/01\\/]",main.document).length + $("img[src*=ru\\/mapwinter\\/11\\/]",main.document).length + $("img[src*=ru\\/mapwinter\\/21\\/]",main.document).length;
			if (lengtOVL>lengtOPP) this.view = this.view_ovl 
			else if (lengtOVL<lengtOPP) this.view = this.view_opp
			else return;
		}
		else
		{*/
			span_location = $("#span_location").text();
			index = span_location.indexOf(':');
			sectorX = span_location.substr(8,index-8);
			sectorY = span_location.substr(index+1);
			sectorY = sectorY.substr(0,sectorY.length-1);
			if (((sectorX <= 30)&&(sectorY <= 100))||(span_location.indexOf('Лист')!=-1)||(span_location.indexOf('Врата')!=-1)||(span_location.indexOf('Пристанище')!=-1)||(span_location.indexOf('Порт')!=-1)||(span_location.indexOf('поместье')!=-1))
			{
				this.view = this.view_ovl;
			}
			else if (((sectorX <= 25)&&((sectorY >= 138)&&(sectorY <= 210)))||(span_location.indexOf('Песка')!=-1)||(span_location.indexOf('Центр')!=-1))
			{
				this.view = this.view_opp;
			}
			else if (((sectorX >= 83)&&(sectorX <= 92))&&((sectorY >= 411)&&(sectorY <= 450)))
			{
				this.view = this.view_ins;
			}
			else if (((sectorX >= 90)&&(sectorX <= 115))&&((sectorY >= 398)&&(sectorY <= 464)))
			{
				this.view = this.view_see;
			}
			else return;
		//}		
		this.bindListeners();
		this.popup.show(this.view).move(this.calculatePositionX(positionX), this.calculatePositionY(positionY), 0, 0);
		return this;
	};
	
	this.calculatePositionX = function(x) {
		return x -= this.view.width();
	};
	
	this.calculatePositionY = function(y) {
		return y -= this.view.height();
	};
	
	this.hide = function() {
		this.popup.mhide();
		this.clearHideTimer();
		
		return this;
	};
	
	this.bindListeners = function() {
		this.view.find("#" + this.closeButtonId).on("click", function() {
			$(this).attr("src", self.css.iconClose);
			self.hide();
		}).hover(function() {
			$(this).attr("src", self.css.iconCloseHover);
		}, function() {
			$(this).attr("src", self.css.iconClose);
		});
		$("img[src*=monst]",$(this.view)).on("click", function() {
			if ($(this).attr("class") == "mur_active_img")
				$(this).attr("class", "");
			else
				$(this).attr("class", "mur_active_img");
		});
	};
	
		
	this.hideAfter = function(hideTime) {
		this.initHideTimer(hideTime);

		this.view.hover(function() {
			self.clearHideTimer();
		}, function() {
			self.initHideTimer(hideTime);
		});

		return this;
	};
	
	this.initHideTimer = function(hideTime) {
		this.hideTimer = setTimeout(function(){
			self.hide();
		}, hideTime);
	};
	
	this.clearHideTimer = function() {
		clearTimeout(this.hideTimer);
	};
}