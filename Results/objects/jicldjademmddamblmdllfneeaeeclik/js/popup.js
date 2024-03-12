var doc = window.document;
var lang = chrome.i18n.getMessage("@@ui_locale");

class LOAD {
	constructor() {
		this.UserScriptArr=[];
		this.UserScriptOn=[];
		this.UserScript=[];
		this.scriptLoad=false;
		this.domLoad=false;		
		this.init();	
	}
	init(){
		////console.log("POPUP INIT");
		chrome.storage.local.get(["UserScriptArr","UserScriptOn", "#UserScript"], this._bind(this._init, this));		
	}
	_init(d)
	{
		var reload=false;
		if (d["UserScriptArr"]===undefined)
		{
			reload=true;
			chrome.storage.local.set({"UserScriptArr":[]}, function() {	});
		}
		else
		{
			this.UserScriptArr=d["UserScriptArr"];
		}
		if (d["UserScriptOn"]===undefined)
		{
			reload=true;
			chrome.storage.local.set({"UserScriptOn":[]}, function() {	});
		}
		else
		{
			this.UserScriptOn=d["UserScriptOn"];
		}
		if (d["#UserScript"]!==undefined)
		{
			this.UserScript=d["#UserScript"];
		}
		if(reload)
		{
			chrome.runtime.sendMessage({action: "OkTools_Script_Reload"}, function(result) {});
			//console.log("POPUP RELAOD");
		}
		//console.log("POPUP _INIT ", reload);
		if(this.domLoad)
		{
			this.setScriptMenu();	
		}

		this.scriptLoad=true;
	}
	_bind(f, obj){	
		return function() {
			return f.apply(obj, arguments);
		};
	}
	load(){
		//console.log("POPUP DOM LOAD");
		this.domLoad=true;	
		if(this.scriptLoad)
		{
			this.setScriptMenu();	
		}	
		
		var close_pop=doc.querySelectorAll('.close_btn') || null; 
		if (close_pop)
		{
			for (var a = 0; a < close_pop.length; a++) 
			{
				close_pop[a].addEventListener('click', function(e) {
					window.close();
				});
			}		
		}
		var open_ok=doc.querySelector('#open_ok') || null; 
		if (open_ok)
		{
			open_ok.addEventListener('click', function(e) {
				chrome.tabs.create({url: "https://ok.ru/", active: true}, function(){});
			});
		}	
		var clearData=doc.querySelector('#clearData') || null; 
		if (clearData)
		{
			clearData.addEventListener('click', function(e) {
				chrome.runtime.sendMessage({action: "OkTools_Script_Clear"}, function(result) {});
			});
		}	
		var script_new=doc.querySelector('#OkTools_newScript') || null; 
		if (script_new)
		{
			script_new.addEventListener('click', function() {	
				//console.log("POPUP OPEN TAB");
				POPUP.openTab("options.html", "#new_script");
			}, true);	
		}
		var script_reload=doc.querySelector('#OkTools_reload') || null; 
		if (script_reload)
		{
			script_reload.addEventListener('click', function() {
				//console.log("POPUP SCRIPT RELOAD");				
				chrome.runtime.sendMessage({action: "OkTools_Script_Reload"}, function(result){});
			}, true);	
		}
	}
	setScriptMenu(){
		//console.log("POPUP SET SCRIPT MENU");
		let UserScript=this.UserScript;
		let UserScriptArr=this.UserScriptArr;
		let UserScriptOn=this.UserScriptOn;
		
		var script_user=doc.querySelector('#script_user') || null; 
		if (script_user)
		{		
			clear_html(script_user);
			for (let i = 0; i < UserScript.length; i++) 
			{
				var li=create_dom('li', script_user, '', {"class":"settings_item"}, '');
					var div=create_dom('div', li, '', {"class":"setting_title"}, '');
						var edit=create_dom('div', div, '', {"class":"info_container","data-id":""+UserScript[i].id+""}, '');
							create_dom('span', edit, '', {"class":"icon edit"}, '');
						var titl=create_dom('div', div, '', {"class":"title_container"}, '');
							create_dom('span', titl, '', {}, UserScript[i].meta.name);
							var switch_contain=create_dom('div', div, '', {"class":"switch_container","data-load":"user", "data-id":""+UserScript[i].id+""}, '');		
								var switch_hoder=create_dom('div', switch_contain, '', {"class":"switch_hoder"}, '');
									var switcher=create_dom('label', switch_hoder, '', {"class":"switcher"}, '');
				if (UserScript[i].on==true || UserScript[i].on=="true")
				{
					switcher.classList.add('active');	
				}
				edit.addEventListener('click', function(e) {
					e.stopPropagation();					
					e.preventDefault();
					var data_id=this.dataset.id;
					POPUP.openTab("options.html","#edit-"+data_id+"")
				});
				switch_contain.addEventListener('click', function(e) {					
					POPUP.setCheckbox(this, e);
				});
			}
		}
		var script_setting=doc.querySelector('#script_main') || null; 
		if (script_setting)
		{
			clear_html(script_setting);
			if (UserScriptArr.length!=0)
			{
				for(var i = 0; i < UserScriptArr.length; i++) 
				{
					for(var o = 0; o < UserScriptOn.length; o++) 
					{
						if (UserScriptArr[i].id==UserScriptOn[o].id)
						{
							var li=create_dom('li', script_setting, '', {"class":"settings_item"}, '');
								var div=create_dom('div', li, '', {"class":"setting_title"}, '');
									var info=create_dom('div', div, '', {"class":"info_container","data-id":""+UserScriptArr[i].id+""}, '');
										create_dom('span', info, '', {"class":"icon info"}, '');
									var titl=create_dom('div', div, '', {"class":"title_container"}, '');
										create_dom('span', titl, '', {}, UserScriptArr[i].title);
									var switch_contain=create_dom('div', div, '', {"class":"switch_container","data-load":"main", "data-id":""+UserScriptArr[i].id+""}, '');										
										var switch_hoder=create_dom('div', switch_contain, '', {"class":"switch_hoder"}, '');
											var switcher=create_dom('label', switch_hoder, '', {"class":"switcher"}, '');
								var div2=create_dom('div', li, '', {"class":"settings_info"}, '');
									create_dom('div', div2, '', {"class":"settings_info_desc"}, UserScriptArr[i].desc);
									create_dom('span', div2, '', {"class":"settings_info_stat"}, UserScriptArr[i].stat);
										
									var stat=parseInt(UserScriptArr[i].stat);
									var stat_yest=parseInt(UserScriptArr[i].stat_yest);
									if (stat>=stat_yest)
									{
										var izm=stat-stat_yest;
										var znak="+";
										var cl="plus";
									}
									else
									{
										var izm=stat_yest-stat;
										var znak="-";
										var cl="minus";
									}
									
									create_dom('span', div2, '', {"class":"settings_info_stat_izm "+cl+""}, ""+znak+""+izm+"");
									var rep=create_dom('span', div2, '', {"class":"settings_info_report","data-id":""+UserScriptArr[i].id+""}, "Сообщить об ошибке");
							if (UserScriptOn[o].on==true || UserScriptOn[o].on=="true")
							{
								switcher.classList.add('active');	
							}
							rep.addEventListener('click', function(e) {
								e.stopPropagation();					
								e.preventDefault();
								var id=this.dataset.id;
								POPUP.getUid(function (user){
									open_tab("https://api.oktools.ru/report.php?id="+id+"&uid="+user.uid+"");
								});
							});
							if(UserScriptArr[i].id=="0")
							{
								li.classList.add("settings_radio");
							}							
							info.addEventListener('click', function(e) {
								e.stopPropagation();					
								e.preventDefault();
								var par=this.parentNode.parentNode;
								var desc=par.querySelector(".settings_info") || null;
								if(desc)
								{
									desc.classList.toggle("active");
								}								
							});
							
							switch_contain.addEventListener('click', function(e) {					
								POPUP.setCheckbox(this, e);
							});
						}
					}
				}
			}									
		}
		
	}
	saveConfig(id, result)
	{
		//console.log("SAVE CONFIG");
		let UserScriptArr=this.UserScriptArr;
		let UserScriptOn=this.UserScriptOn;
		for(let o = 0; o < UserScriptOn.length; o++) 
		{
			if (UserScriptOn[o].id==id)
			{
				UserScriptOn[o].on=result;
				//this.saveConfigMod(id, result);
				if (result==true)
				{
					for(let i = 0; i < UserScriptArr.length; i++) 
					{
						if(UserScriptArr[i].id==id)
						{
							var mod=UserScriptArr[i].mod;
							for(var key in mod)
							{
								var mod_id=parseInt(mod[key]);
								for(let k = 0; k < UserScriptOn.length; k++) 
								{
									if (UserScriptOn[k].id==mod_id)
									{
										UserScriptOn[k].on=true;
									}
								}
								var item=doc.querySelector('#script_main .switch_container[data-id="'+mod_id+'"') || null; 
								if (item)
								{
									var switcher=item.querySelector('.switcher') || null; 
									if (switcher)
									{
										if (!switcher.classList.contains('active'))
										{
											switcher.classList.add('active');
										}
									}
								}
							}				
						}
					}
				}
				if(result==false)
				{
					for(let i = 0; i < UserScriptArr.length; i++) 
					{
						var mod=UserScriptArr[i].mod;
						for(var key in mod)
						{
							var mod_id=parseInt(mod[key]);
							if (mod_id==id)
							{
								for(let k = 0; k < UserScriptOn.length; k++) 
								{
									if (UserScriptOn[k].id==UserScriptArr[i].id)
									{
										UserScriptOn[k].on=false;
										var item=doc.querySelector('#script_main .switch_container[data-id="'+UserScriptArr[i].id+'"') || null; 
										if (item)
										{
											var switcher=item.querySelector('.switcher') || null; 
											if (switcher)
											{
												if (switcher.classList.contains('active'))
												{
													switcher.classList.remove('active');
												}
											}
										}
									}
								}
							}
							
						}
					}
				}
			}
		}
		chrome.storage.local.set({"UserScriptOn":UserScriptOn}, function(){ 
			if (result==true)
			{
				chrome.runtime.sendMessage({action: "OkTools_Script_Apply", scriptId:id, "user":false}, function(res){});
			}
			else
			{
				chrome.runtime.sendMessage({action: "OkTools_Script_Delete", scriptId:id, "user":false}, function(res){});
			}
		});	
		this.UserScriptOn=UserScriptOn;
	}
	saveConfigUser(id, result)
	{
		chrome.storage.local.get(["#UserScript"], function(data){
			if(data["#UserScript"]!==undefined && data["#UserScript"].length!=0){
				let us=data["#UserScript"];
				for (let i = 0; i < us.length; i++) 
				{
					if (us[i].id==id)
					{
						us[i].on=result;
					}
				}
				chrome.storage.local.set({"#UserScript":us}, function() {
					if (result==true)
					{					
						chrome.runtime.sendMessage({action: "OkTools_Script_Apply", scriptId:id, "user":true});
					}
				});
			}		
		});
	}
	setCheckbox(el, e)
	{
		////console.log("POPUP SET CHECKBOX");
		e.stopPropagation();					
		e.preventDefault();
		var data_id=el.dataset.id;
		var switcher=el.querySelector('.switcher') || null; 
		if (switcher)
		{
			if (switcher.classList.contains('active'))
			{
				switcher.classList.remove('active');
				if (el.dataset.load=="user")
				{
					this.saveConfigUser(data_id, false);
				}
				else
				{
					this.saveConfig(data_id, false);
				}
			}
			else
			{
				switcher.classList.add('active');
				if (el.dataset.load=="user")
				{
					this.saveConfigUser(data_id, true);
				}
				else
				{
					this.saveConfig(data_id, true);
				}
			}
		}
	}
	openTab(url,hash)
	{
		let data={"url":""+url+"","hash":""+hash+"","active":true};
		chrome.runtime.sendMessage({action: "OkTools_Open_Tab", data:data}, function(result) {});
	}
	getUid(callback)
	{
		chrome.storage.local.get(["valueG"], function(data){
			let userUid=0;
			if (data["valueG"]!==undefined)
			{
				let val=data["valueG"].userData;
				if (val!==undefined && typeof val==='object' && val.uid!==undefined)
				{
					userUid=val.uid;
				}
			}
			callback(userUid);
		});
	}
}
var POPUP=new LOAD();

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
	switch(request.action) {
		case 'OkTools_popupRefresh': 
			POPUP.init();
		break;	
	}
	callback(true);
});

window.addEventListener("DOMContentLoaded", function(){	
	POPUP.load();
}, false);

function create_dom(el, parent, before_el, attr, text)
{
	var new_dom = doc.createElement(''+el+'');
	for(var key in attr) 
	{
		new_dom.setAttribute(''+key+'', ''+attr[key]+'');
	}	
	if (text!='')
	{
		new_dom.textContent=text;
	}
	if (before_el!='')
	{
		parent.insertBefore(new_dom, before_el);
	}
	else
	{
		parent.appendChild(new_dom);
	}
	return new_dom;
}
function clear_html(node) 
{
    var children = node.childNodes;
	while(children.length) 
	{	
		node.removeChild(children[0]);
    }	
}
