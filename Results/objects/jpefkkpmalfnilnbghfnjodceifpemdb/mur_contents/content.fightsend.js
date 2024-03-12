// ==UserScript==
// @name        fightsend
// @include     https://www.ereality.ru/*
// @require     tools.js
// @require		tools/jquery.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);
	systemOptions = mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);
	
	if (!myoptions.unpaused) {
		return;
	}	
	
	if (myoptions.senallpipleonthebuttle) {

	setTimeout(function(){
		if ($("#div_players1").length)
		{

			el = $("#div_players1").find("span.row");
			for (j=0;j<=el.length;j++)
			{
				el.eq(j).html("<a>>>"+el.eq(j).html()+"</a>").on('click',function ()
				{
					textpl = "";
					el2 = $("#div_players1").find("span.bp1");
					for (k=0;k<=el2.length;k++)
					{
						if (el2.eq(k).html()!=undefined)
						{
							textpl= textpl + "["+el2.eq(k).attr('name')+"]";
							//console.log(textpl);
						}
					}
					el2 = $("#div_players1").find("span.bp2");
					for (k=0;k<=el2.length;k++)
					{
						if (el2.eq(k).html()!=undefined)
						{
							textpl= textpl + "["+el2.eq(k).attr('name')+"]";
							//console.log(textpl);
						}
					}
					el2 = $("#div_players1").find("span.bp0_list");
					for (k=0;k<=el2.length;k++)
					{
						if (el2.eq(k).html()!=undefined)
						{
							textpl= textpl + "["+el2.eq(k).attr('name')+"]";
							//console.log(textpl);
						}
					}
					$("#chat_msg").val(textpl+" "+$("#chat_msg").val());
				});
			}
			el = $("#div_players2").find("span.row");
			for (j=0;j<=el.length;j++)
			{
				el.eq(j).html("<a>>>"+el.eq(j).html()+"</a>").on('click',function ()
				{
					textpl = "";
					el2 = $("#div_players2").find("span.bp1");
					for (k=0;k<=el2.length;k++)
					{
						if (el2.eq(k).html()!=undefined)
						{
							textpl= textpl + "["+el2.eq(k).attr('name')+"]";
						}
					}
					el2 = $("#div_players2").find("span.bp2");
					for (k=0;k<=el2.length;k++)
					{
						if (el2.eq(k).html()!=undefined)
						{
							textpl= textpl + "["+el2.eq(k).attr('name')+"]";
						}
					}
					el2 = $("#div_players2").find("span.bp0_list");
					for (k=0;k<=el2.length;k++)
					{
						if (el2.eq(k).html()!=undefined)
						{
							textpl= textpl + "["+el2.eq(k).attr('name')+"]";
						}
					}
					$("#chat_msg").val(textpl+" "+$("#chat_msg").val());
				});
			}
		}	
	},100);
	}
	
});

//================================================================End