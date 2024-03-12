// ==UserScript==
// @name        ERContrast
// @namespace    
// @include   *ereality.ru*
// @include www.ereality.ru/move/*
// @require     tools.js
// @all-frames  true
// ==/UserScript==
	
//================================================================Begin
kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);
	var systemOptions = mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);

			if (!myoptions.unpaused) {
				return;
			}
			
			//===================================================================== 
			
	if (myoptions.ktLumen) {
			$('#main').ready(function () {
				loadimg();
			});

			function loadimg () {
				$("#map_div img[src^='https://img.ereality.ru/map/ct/cw2.png']").attr('src',kango.io.getResourceUrl('res/kt_flag.png'));
				$("#map_div img[src^='https://img.ereality.ru/map/ct/cw5.png']").attr('src',kango.io.getResourceUrl('res/kt_vrag.png'));      
				$("#map_div img[src^='https://img.ereality.ru/map/ct/17020.png']").attr('src',kango.io.getResourceUrl('res/kt_svecha.png'));
				
			}
	}

	
	if (myoptions.chengeheroAvatar)
	{	
		if (systemOptions.myheroAvatar=='')
		{
			var img = new Image();     
			img.src = kango.io.getResourceUrl('res/'+systemOptions.heroAvatar);
			width = Math.round(img.width*systemOptions.sizeheroAvatar/100);
			height = Math.round(img.height*systemOptions.sizeheroAvatar/100);
			if ((systemOptions.heroAvatar == "m2.png") || (systemOptions.heroAvatar == "f2.png"))
			{
				$("img[src='https://img.ereality.ru/map/m2.png']").attr({'src':kango.io.getResourceUrl('res/'+systemOptions.heroAvatar)});
				$("img[src='https://img.ereality.ru/map/f2.png']").attr({'src':kango.io.getResourceUrl('res/'+systemOptions.heroAvatar)});			
			}
			else
			{
				if ($("img[src='https://img.ereality.ru/map/m2.png']").css('left') != undefined)
				{
					left = $("img[src='https://img.ereality.ru/map/m2.png']").css('left');
					left = Number(left.slice(0,-2))+(36-width)/2;
					topi = $("img[src='https://img.ereality.ru/map/m2.png']").css('top');
					topi = Number(topi.slice(0,-2))+(45-height)/2;
					$("img[src='https://img.ereality.ru/map/m2.png']").attr({'src':kango.io.getResourceUrl('res/'+systemOptions.heroAvatar),'width':width,'height':height}).css({"left":left+"px", "top":topi+"px"});
				}
				if ($("img[src='https://img.ereality.ru/map/f2.png']").css('left') != undefined)
				{
					left = $("img[src='https://img.ereality.ru/map/f2.png']").css('left');
					left = Number(left.slice(0,-2))+(36-width)/2;
					topi = $("img[src='https://img.ereality.ru/map/f2.png']").css('top');
					topi = Number(topi.slice(0,-2))+(45-height)/2;
					$("img[src='https://img.ereality.ru/map/f2.png']").attr({'src':kango.io.getResourceUrl('res/'+systemOptions.heroAvatar),'width':width,'height':height}).css({"left":left+"px", "top":topi+"px"});
				}
			}
		}
		else
		{
			var img = new Image();         
			img.src = systemOptions.myheroAvatar;
			width = Math.round(img.width*systemOptions.sizeheroAvatar/100);
			height = Math.round(img.height*systemOptions.sizeheroAvatar/100);
			if ($("img[src='https://img.ereality.ru/map/m2.png']").css('left') != undefined)
				{
					left = $("img[src='https://img.ereality.ru/map/m2.png']").css('left');
					left = Number(left.slice(0,-2))+(36-width)/2;
					topi = $("img[src='https://img.ereality.ru/map/m2.png']").css('top');
					topi = Number(topi.slice(0,-2))+(45-height)/2;
					$("img[src='https://img.ereality.ru/map/m2.png']").attr({'src':systemOptions.myheroAvatar,'width':width,'height':height}).css({"left":left+"px", "top":topi+"px"});
				}
				if ($("img[src='https://img.ereality.ru/map/f2.png']").css('left') != undefined)
				{
					left = $("img[src='https://img.ereality.ru/map/f2.png']").css('left');
					left = Number(left.slice(0,-2))+(36-width)/2;
					topi = $("img[src='https://img.ereality.ru/map/f2.png']").css('top');
					topi = Number(topi.slice(0,-2))+(45-height)/2;
					$("img[src='https://img.ereality.ru/map/f2.png']").attr({'src':systemOptions.myheroAvatar,'width':width,'height':height}).css({"left":left+"px", "top":topi+"px"});
				}
		}			

	}


	
	if (myoptions.Other_Cell_Icons)
	{
		imgmapovl = (systemOptions.imgmapovl).replace("mapnew","map");
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
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22016.png']").attr({'src':kango.io.getResourceUrl('res/numbers/1.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22017.png']").attr({'src':kango.io.getResourceUrl('res/numbers/2.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22018.png']").attr({'src':kango.io.getResourceUrl('res/numbers/3.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22019.png']").attr({'src':kango.io.getResourceUrl('res/numbers/4.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22020.png']").attr({'src':kango.io.getResourceUrl('res/numbers/5.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22021.png']").attr({'src':kango.io.getResourceUrl('res/numbers/6.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22022.png']").attr({'src':kango.io.getResourceUrl('res/numbers/7.png')});
		$("img[src^='https://img.ereality.ru/"+imgmapovl+"/obj/22023.png']").attr({'src':kango.io.getResourceUrl('res/numbers/8.png')});	
	}

	//=========================end.
});
