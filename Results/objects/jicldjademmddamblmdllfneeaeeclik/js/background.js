(function(){
	
var CODE = {};
const ext={"name":"OkTools","browser":"chrome","version":"5.4","ext_url":"https://chrome.google.com/webstore/detail/jicldjademmddamblmdllfneeaeeclik?hl=ru"};

var SCRDATA=[];

class LOAD {
	constructor() {
		this.script=[];	
		this.scriptMeta=new Map();
		this.navListen=new Map();
		this.url={"url":"","timer":null,"s":[]};
		this.lastHistoryUrl="";
		this.stopLoad=false;
		this.load=false;
		this.loadData=0;
		this.userScriptTime=0;
		this.uid=0;
		this.init();	
	}
	init(){
		this.stopLoad=false;
		chrome.storage.local.get(["UserScriptArr","UserScriptOn","UserScriptTime","#UserScript","valueG"], this._bind(this._init, this));		
	}
	_init(d)
	{
		if (this.checkIsReload(d))
		{
			if (this.loadData<5){
				load_data(true);  //(refreshOn) true = save user module on, false = load module on default
				this.loadData++;
			}
		}
		else{
			this.loadData=1;
			this._setScript(d["UserScriptArr"],d["UserScriptOn"]);
		}
	}
	_setScript(s, on){
		this.script=s;
		for(let i = 0; i < s.length; i++) 
		{
			let inc=[];
			let exc=[];
			let listen={"start":null,"end":null,"change":null,"filter":null};
			let scriptOn=false;
			for(let o = 0; o < on.length; o++) 
			{
				if(on[o].id==s[i].id && (on[o].on==true || on[o].on=='true') )
				{
					scriptOn=true;
				}
			}
			if(s[i].meta && s[i].meta.match){
				let match=s[i].meta.match;
				let filter=[];
				for(let m = 0; m < match.length; m++) 
				{
					let repl=this.replaceReg(match[m]);
					inc.push(repl);
					filter.push({"urlMatches":repl});
					listen.filter=filter;
				}
				if (scriptOn)
				{
					if(!this.scriptMeta.has(s[i].id)){
						listen=this.navAddListener(s[i].id, s[i].meta.run, filter);
					}						
				}
			}
			if(s[i].meta && s[i].meta.exclude){
				let exclude=s[i].meta.exclude;
				
				for(let m = 0; m < exclude.length; m++) 
				{
					exc.push(this.replaceReg(exclude[m]));
				}
			}
			
			let meta={"on":scriptOn,"include":inc,"exclude":exc,"run":s[i].meta.run,"listener":listen};
			this.scriptMeta.set(s[i].id, meta);
			//console.log("SCRIPT SET DATA "+s[i].id+"", meta);
		}
		this.load=true;
	}
	setScriptTime(time){
		this.userScriptTime=time;
	}
	checkScriptTime(){
		 
		let time=this.userScriptTime;
		var time_now=new Date().getTime();
		if (time<time_now)
		{					 
			return true;	
		}
		return false;
	}
	checkIsReload(d){	
		let ScriptReload=false;
		let userUid=0;

		if (d && d["UserScriptArr"] && d["UserScriptOn"] && d["UserScriptTime"])
		{		
			var UserScriptTime=d["UserScriptTime"];
			if (UserScriptTime === undefined)
			{
				chrome.storage.local.set({"UserScriptTime":0}, function() {	});
				ScriptReload=true;
			}
			else
			{		
				if (UserScriptTime=="" || UserScriptTime==0)
				{
					ScriptReload=true;	
				}
				else
				{
					this.userScriptTime=parseInt(UserScriptTime);
					if (this.checkScriptTime()){	 
						ScriptReload=true;	
					}
				}
			}
			
			let UserScriptArr=d["UserScriptArr"];
			if (UserScriptArr=="" || UserScriptArr===undefined)
			{
				UserScriptArr="";
				ScriptReload=true;
			}
			let UserScriptOn=d["UserScriptOn"];
			if (UserScriptOn=="" || UserScriptOn===undefined)
			{
				UserScriptOn=new Array();
				ScriptReload=true;
			}
		}
		else
		{
			ScriptReload=true;
		}
		if (d["valueG"]!==undefined)
		{
			let val=d["valueG"].userData;
			if (val!==undefined && typeof val==='object' && val.uid!==undefined)
			{
				this.uid=val.uid;
			}
		}
		return ScriptReload;
	}
	install(){  
		send_reload_page('',true);
	}
	update(){  
		this.reload();
	}
	clear(){
		chrome.storage.local.clear(function(result){
			load_data(false);
		});
	}
	reload(){  //true перезагрузка и удаление всех данных, false если уже была загрузка то не выполянть перезагрузку
		this.loadData=1;
		chrome.storage.local.get(null, this._bind(this._reload, this));
	}
	_reload(d){
		let removeVal=["UserScriptArr", "UserScriptOn", "UserScriptTime"];
		for (var key in d) {
			var regExp = new RegExp('^@code#([0-9]+)$', 'i');
			var s_id=key.match(regExp);
			if (s_id && s_id.length > 1)
			{							
				removeVal.push(key);
			}
			if (key=="valueG")
			{
				let val=d["valueG"].userData;
				if (val!==undefined && typeof val==='object' && val.uid!==undefined)
				{
					this.uid=val.uid;
				}
				removeVal.push(key);
			}
			
		}
		//console.log("REMOVE VAL", removeVal);
		chrome.storage.local.remove(removeVal,function(){
			if(chrome.runtime.lastError) { 
			}	
			load_data(false);
		});
	}
	getScript(){
		return this.script;
	}

	/*Проверка и загрузка скрипта при наступлении события навигации*/
	loadScript(sId, e){
		let tabId=e.tabId
		let frameId=e.frameId;
		let url=e.url;
		var time_now=new Date().getTime();
		if (this.checkScriptTime())
		{
			if (!this.stopLoad)
			{
				load_data(true);
			}
			this.stopLoad=true;
		}
		
		function checkCode(i,u,cu){
			let ie=false;
			let c=window["USEMScript"+i];
			if (c) 
			{
				ie=true;
			}
			else
			{
				window["USEMScript"+i]=true;
			}
			if(cu){
				let data={"u":u,"i":i};
				window.dispatchEvent(new CustomEvent("changeUrl", {detail:u}));
			}
			return ie;
		}
		//console.log('LOAD URL',sId, url, e, time_now);
		if(this.checkOn(sId, url) && !this.stopLoad){
			
			//console.log('LOAD URL ON',sId, url, e, time_now);
			let cUrl=false;
			if(this.lastHistoryUrl!=url){
				this.lastHistoryUrl=url;
				cUrl=true;
			}
			
			chrome.scripting.executeScript({
				target: {tabId: tabId, frameIds: [frameId]},
				func:checkCode,
				args: [sId, url, cUrl],
			},(res) => {
				if(chrome.runtime.lastError) { console.log("ERROR SEND TABS: ", chrome.runtime.lastError);}	
				if (res!==undefined)
				{					
					for (var fr of res)
					{
						if(fr.result==false)
						{
							getCode(tabId, frameId, [sId]);
						}
					}
				}
			});
		}
	}
	
	/*Проверка включен ли скрипт для страницы url*/	
	checkOn(sId, url){
		if(this.scriptMeta.has(sId)){
			let meta=this.scriptMeta.get(sId);
			if (meta.on==true  && !this.checkArr(url,meta.exclude)){
				return true;
			}
		}
		return false;
	}
	
	/*Вызывается при включении и отключении модуля */
	changeOn(v){  
		if (v!==undefined && v.length!=0)
		{
			//console.log("CHANGE ON", v);
			for(let i = 0; i < v.length; i++) 
			{
				let sId=v[i].id;
				if(this.scriptMeta.has(sId)){
					let meta=this.scriptMeta.get(sId);
					//console.log("CHANGE ON "+sId+"", meta);
					if(v[i].on==true || v[i].on=='true')
					{
						if(meta.on==false)
						{
							this.navAddListener(sId, meta.run, meta.listener.filter);
						}
						meta.on=true;					
					}
					else
					{
						meta.on=false;
					}
					this.scriptMeta.set(sId, meta);
				}
			}
		}
	}
	
	/*Создает прослушивание изменения url при навигации для каждого скрипта*/
	navAddListener(sId, run, match){
		//console.log("ADD NAVIGATION LISTENER", sId, run, match);
		let filter={url:match};
		let listen={"start":false,"end":false,"change":false,"filter":filter};
		if(run=="document-start")
		{
			try{
				chrome.webNavigation.onCommitted.addListener(function(e){SCRIPT.loadScript(sId,e);},filter);
				listen.start=true;
			}
			catch(e){}
		}
		if(run=="document-end")
		{	
			try{
				chrome.webNavigation.onDOMContentLoaded.addListener(function(e){SCRIPT.loadScript(sId,e);},filter);  //*function(e){SCRIPT.loadScript(sId,e);}
				listen.end=true;
			}
			catch(e){}
		}
		try{
			chrome.webNavigation.onHistoryStateUpdated.addListener(function(e){SCRIPT.loadScript(sId,e);},filter);
			listen.change=true;
		}
		catch(e){}
		return listen;
	}
	
	replaceReg(str) {
		str=str.replace(/\./g, "\\.");
		str=str.replace(/\*/g, "(.*)");	
		return str;
	}
	checkArr(u,data) {
		if (data!==undefined && data.length!=0)
		{
			for(let i = 0; i < data.length; i++) 
			{
				let regExp = new RegExp(data[i], 'gi');
				if (u.search(regExp) != -1) {
					return true;
				}
			}	
		}
		return false;	
	}
	_bind(f, obj){	
		return function() {
			return f.apply(obj, arguments);
		};
	}
}	

var SCRIPT=new LOAD();

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
		SCRIPT.install();
    }
	else if(details.reason == "update"){
		SCRIPT.update();
    }
});



class valueListenerCl {	
	constructor() {
		this.list=[];
	}
	list(){
		return this.list;
	}
	add(i,n,t){
		if (!this.isExist(i,n))
		{
			this.list.push({"i":""+i+"","n":""+n+"","t":""+t+""});
		}
	}
	delete(i,n){
		let l=this.list;
		if(l.length!=0)
		{
			for (let a = 0; a < l.length; a++) 
			{
				if(l[a].i==i && l[a].n==n)
				{
					l.splice(a, 1);
				}
			}
		}
	}
	isExist(i,n){
		let l=this.list;
		if(l.length!=0)
		{
			for (let a = 0; a < l.length; a++) 
			{
				if(l[a].i==i && l[a].n==n)
				{
					return true;
				}
			}
		}
		return false;
	}
}
var valueListener=new valueListenerCl();
	
chrome.storage.onChanged.addListener(function(changes, namespace) {
	let list=valueListener.list;
	//console.log("change value", changes, namespace);
	if(list.length!=0)
	{
		for (var key in changes) {
			for (let a = 0; a < list.length; a++) 
			{
				if (list[a]!=undefined && typeof list[a]==='object' && key=="#value#"+list[a].i+"")
				{
					////console.log("CHANGE SET VALUE VARIABLE", key, changes[key].newValue)
					let o=changes[key].oldValue;
					let n=changes[key].newValue;
					let oldV='';
					let newV='';
					if(o[list[a].n]!==undefined)
					{
						oldV=o[list[a].n];
					}
					if(n[list[a].n]!==undefined)
					{
						newV=n[list[a].n];
					}
					if (oldV!=newV)
					{
						(function(list,oldV,newV){
						chrome.tabs.query({url: ["*://ok.ru/*", "*://*.ok.ru/*"]}, function(tabs){
							for (let t = 0; t < tabs.length; t++) 
							{	
								chrome.tabs.sendMessage(tabs[t].id, {action:"OkTools_changeValue", scriptId:list.i, name:list.n, oldV:oldV, newV:newV}, function(response) {
									if(chrome.runtime.lastError) { console.log("ERROR SEND TABS VAL: ", chrome.runtime.lastError);}	
									
								});								
						
							} 
						});
						})(list[a],oldV,newV);
					}
				}
			}
		}
	}
	for (var key in changes) {
		var regVal = new RegExp('^#value#([0-9]+)$', 'i');
		var s_id=key.match(regVal);
		if (s_id && s_id.length > 1)
		{							
			var script_id=s_id[1];
			if (SCRDATA[script_id])
			{
				SCRDATA[script_id]["#value#"+script_id+""]=changes[key].newValue;
			}
		}
		if (key=="valueG")
		{
			for (var ScrId in SCRDATA) {
				if (SCRDATA[ScrId])
				{
					SCRDATA[ScrId]["valueG"]=changes[key].newValue;
				}
			}
		}
		if (key=="UserScriptOn")
		{
			SCRIPT.changeOn(changes[key].newValue);
		}
		if (key=="UserScriptTime")
		{
			if(changes[key].newValue===undefined)
			{
				SCRIPT.setScriptTime(0);
			}
			else
			{
				SCRIPT.setScriptTime(changes[key].newValue);
			}
		}
	}
});
class notificationListenerCl {	
	constructor() {
		this.list=[];
	}
	add(i,t,f){
		let el=this.isExist(i);
		if (!el)
		{
			this.list.push({"i":""+i+"","t":t,"f":f});
		}		
	}
	remove(i){
		let l=this.list;
		if(l.length!=0)
		{
			for (let a = 0; a < l.length; a++) 
			{
				if(l[a].i==i)
				{
					l.splice(a, 1);
				}
			}
		}
	}
	close(i,b){
		let el=this.isExist(i);
		if (el)
		{
			chrome.tabs.sendMessage(el.t, {action:"notificationClose",id:el.i,b:b},{frameId: el.f}, function(response){
				if(chrome.runtime.lastError) { console.log("ERROR: ", chrome.runtime.lastError);}	
			});	
			this.remove(i);
		}
	}
	click(i,b){
		let el=this.isExist(i);
		if (el)
		{
			chrome.tabs.sendMessage(el.t, {action:"notificationClick",id:el.i, b:b},{frameId: el.f}, function(response){
				if(chrome.runtime.lastError) { console.log("ERROR: ", chrome.runtime.lastError);}	
			});		
		}
	}
	isExist(i){
		let l=this.list;
		if(l.length!=0)
		{
			for (let a = 0; a < l.length; a++) 
			{
				if(l[a].i==i)
				{
					return l[a];
				}
			}
		}
		return false;
	}
}

/*var notificationListener=new notificationListenerCl();

chrome.notifications.onClicked.addListener(function(nId){
	notificationListener.click(nId,"body");
	chrome.notifications.clear(nId);
});
chrome.notifications.onClosed.addListener(function(nId){
	notificationListener.close(nId);
});
chrome.notifications.onButtonClicked.addListener(function(nId,butt){
	notificationListener.click(nId, ""+butt+"");
	chrome.notifications.clear(nId);
});
*/
var webReqData=[];
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
///	console.log("GET MESSAGE", request, sender);
	
	switch(request.action) {	
		case 'OkTools_XMLHttpRequest': 
			ajax_request_new(request.data,request.r, function(result) {
				callback(result); 
			});
		break;
		case 'OkTools_WebRequest':
			if (request.data!==undefined && typeof request.data==='object'){
				let REQ=request.data;
				if (webReqData)
				{
					if (!webReqData[REQ.id])
					{	
						webReqData[REQ.id]=true;
						try{
							let ids=[];
							for(let key in REQ.rule){								
								ids.push(REQ.rule[key].id);
							}
							chrome.declarativeNetRequest.updateDynamicRules({addRules:REQ.rule,removeRuleIds: ids});
							callback(true);
						}
						catch(e){}
					}
				}				
			}
			callback(false);
		break;
		case 'OkTools_Open_Tab': 
			if (request.data!==undefined && typeof request.data==='object'){
				let data=request.data;
				//console.log("background open TAB", data);
				if (data.url=="options.html" || data.url=="popup.html")
				{
					let u=data.url;
					if (data.hash)
					{
						u=data.url+""+data.hash;
						delete data["hash"];
					}
					data.url=chrome.runtime.getURL(u);
				}		
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					let ind=0;
					let tid=0;	
					for (let t = 0; t < tabs.length; t++) 
					{
						ind=tabs[t].index+1;
						tid=tabs[t].id;
					}
					data.index=ind;		
					chrome.tabs.create(data, function(){				
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
							let ctid=0;
							for (let t = 0; t < tabs.length; t++) 
							{
								ctid=tabs[t].id;
							}							
							chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){ if (tabId==ctid){chrome.tabs.update(tid, {active: true});}});
						});
					});			
				});	
				callback(true);
			}
			else
			{
				callback(false);
			}
		break;
		case 'OkTools_Notification': 
			
			let data=request.data;
			//console.log("SET NOTIFICATION back 0 "+JSON.stringify(data)+"");
			let nId=request.nId;
			//console.log('NOT', nId, data);
			if (data!==undefined && typeof data==='object'){
				var check_el={"type":"string","title":"string","message":"string","iconUrl":"string","contextMessage":"string","priority":"number","eventTime":"number","buttons":"object","items":"object","progress":"number","requireInteraction":"boolean","silent":"boolean"};
				
				//let newId=1;

				//if(localStorage['NotificationLastId']!==undefined)
				//{
					//newId=parseInt(localStorage['NotificationLastId'])+1;	
			//	}
				//localStorage['NotificationLastId']=newId;
				
				let timeout=0;
				//console.log("SET NOTIFICATION back 1 "+data.title+"|"+data.message+"");
				if (data.timeout!==undefined && typeof data.timeout==='number')
				{
					timeout=data.timeout;
					delete data.timeout;
				}			
				for(let key in data){
					//console.log("NOTIFIC CHECK DATA "+key+"", check_el[key]);
					if (check_el[key]!==undefined)
					{
						//console.log("NOTIFIC CHECK DATA "+key+" O11111K", data[key], check_el[key]);
						if (typeof data[key]!==check_el[key]) //data.key!==check_el[key]
						{
							//console.log("NOTIFIC CHECK DATA "+key+" not type" );
							delete data[key];
						}
					}
					else
					{
						//console.log("NOTIFIC CHECK DATA "+key+" not found" );
						delete data[key];
					}
				}
				//console.log("SET NOTIFICATION back 2 "+JSON.stringify(data)+"");
				if (data.title===undefined){
					data.title="USEM";
				}
				if (data.message===undefined){
					data.message="1234";
				}
				if (data.contextMessage===undefined){
					data.contextMessage="USEM";
				}
				if (data.type===undefined){
					data.type="basic";
				}
				if (data.iconUrl===undefined){
					data.iconUrl="/img/icon_48.png";
				}
				if (data.requireInteraction===undefined)
				{
					data.requireInteraction=true;
				}
				chrome.notifications.create(''+nId+'', data,  function(nId) {				
					let tabId=sender.tab.id;
					let frameId=sender.frameId;
					notificationListener.add(nId,tabId,frameId);
					if (timeout!=0)
					{
						setTimeout(function(){chrome.notifications.clear(nId);}, timeout);
					}
					callback(nId);
				});
			}
		break;
		case 'OkTools_addValueChangeListener': 
			if (request.n!==undefined && request.i!==undefined && typeof request.n==='string'  && typeof request.i==='string'){
				let tabId=sender.tab.id;
				let frameId=sender.frameId;
				valueListener.add(request.i,request.n, tabId);
			}
		break;
		case 'OkTools_removeValueChangeListener': 
			if (request.i!==undefined && request.n!==undefined && typeof request.i==='string' && typeof request.n==='string'){
				valueListener.delete(request.i,request.n);
			}
		break;
		case 'OkTools_Download_File': 
			let tabId=sender.tab.id;
			let frameId=sender.frameId;
			//console.log("DOWNLOAD START", request);
			var d=request.d;
			
			
			if (d!==undefined && typeof d==='object')
			{
				//console.log('DOWNL',JSON.stringify(d));
				if (d.name!==undefined && typeof d.name==='string')
				{
					d.filename=d.name;
				}
				var check_el={"url":"string","filename":"string","saveAs":"boolean","method":"string","headers":"object","body":"string","conflictAction":"string"};//"saveAs":"boolean",
				let fileId=request.d.id;
				for(let key in d){
					//console.log(key, d[key]);
					if (check_el[key]!==undefined)
					{
						if (typeof d[key]!==check_el[key])
						{
							delete d[key];
						}
					}
					else
					{
						delete d[key];
					}
				}
				
				chrome.downloads.download(d, function(dId) {
					//console.log("RESULT Download", dId);
					if(chrome.runtime.lastError) 
					{				
						callback({"result":"onerror","r":request.r,"fileId":fileId,"dId":"0","message":""+chrome.runtime.lastError.message+""});
					}
					else
					{
						callback({"result":"onloadstart","r":request.r,"fileId":fileId,"dId":dId});			
						downloading_process(tabId, frameId, request.r, fileId, parseInt(dId));							
					}			
				});
			}
		break;
		case 'OkTools_Get_Download_List': 
			//console.log("Download list", request);
			if (request.d!==undefined && typeof request.d==='object'){
				download_list_load(request.d, function(result){
					//console.log("Download list result", result);
					callback({"result":"onload","r":request.r,"data":result});		
					//callback(result);
				});
			}
			else{
				callback(false);
			}
		break;
		case 'OkTools_Download_Show_File': 
			//console.log("SHOW FILE", request.d);
			if (request.d!==undefined && (typeof request.d==='string' || 'number')){
				var did=parseInt(request.d);
				chrome.downloads.search({"id":d},function(items) {
					if (items.length!=0)
					{
						chrome.downloads.show(d);	
					}
				});
			}
			callback(true);
		break;
		case 'OkTools_Script_Apply': 
			//console.log("SEND RELOAD PAGE SCRIPT APPLY");
			send_reload_page(chrome.i18n.getMessage("rel_text"),false);
			callback(true);
		break;
		case 'OkTools_Script_Delete': 
			//console.log("SEND RELOAD PAGE SCRIPT DELETE");
			send_reload_page(chrome.i18n.getMessage("rel_text"),false);
			callback(true);
		break;
		case 'OkTools_Script_Reload': 
			SCRIPT.reload();
			callback(true);
		break;
		case 'OkTools_Script_Clear': 
			SCRIPT.clear();
			callback(true);
		break;
		
	}
	return true;
});
function send_reload_page(text, reload)
{
	//console.log("SEND RELOAD PAGE FUNCTION", text);
	function relF(t, tb, r){
		if (r)
		{
			window.document.location.reload();
		}
		else
		{			
			(function(){
				var b=window.document.querySelector('body') || null;
				if(b){
					var search=b.querySelector('.okt_news_reload_page') || null;
					if(!search){
						var d = window.document.createElement('div');
						d.setAttribute('class', 'okt_news_reload_page');
						var s = window.document.createElement('span');
						s.textContent='OkTools';
						d.appendChild(s);
						var s1 = window.document.createElement('span');
						s1.textContent=t;
						d.appendChild(s1);
						var a = window.document.createElement('span');
						a.textContent=tb;
						a.setAttribute('class', 'okt_news_reload_link');
						d.appendChild(a);
						a.addEventListener('click', function(e) {
							window.document.location.reload();
						});
						b.appendChild(d);
					}
				}
			})();
		}
	}
	chrome.tabs.query({url: ["*://ok.ru/*", "*://*.ok.ru/*"]}, function(tabs) {
		var tb=chrome.i18n.getMessage("reload");		
		for (let t = 0; t < tabs.length; t++) 
		{	
			chrome.scripting.executeScript({
				target: {tabId: tabs[t].id},
				func:relF,
				args: [text, tb, reload],
			});
		}
	});
}
function downloading_process(tabId, frameId, reqId, fileId, did)
{
	//console.log("downloading process");
	let previos_percent=0;
	let i=0;
	let TimerLoading=setInterval(function () {
		//console.log("downloading process 1", did);
		i++;
		if(i>100){
			clearInterval(TimerLoading);
			percent=100;
		}
		chrome.downloads.search({id:did},function(items) {
			//console.log(items);
			let item=items[0];
			let percent=0;
			if (item.state == 'in_progress') 
			{
				percent=Math.round(item.bytesReceived*100/item.totalBytes);
			}
			else if ((item.state == 'complete') && item.endTime && !item.error) 
			{
				clearInterval(TimerLoading);
				percent=100;
			}
			else if (item.state == 'interrupted' && item.error) 
			{
				clearInterval(TimerLoading);
				percent=100;
			}
			if (percent!=previos_percent)
			{		
				previos_percent=percent;
				//console.log("SEND Download process", did, percent);
				chrome.tabs.sendMessage(tabId, {action:"OkTools_Download_Process", reqId:reqId, fileId:fileId, did:did, percent:percent}, function(){
					if(chrome.runtime.lastError) { console.log("ERROR send TABS: ", chrome.runtime.lastError);}		
				});	
			}
		});
	}, 500);
}
function download_list_load(query, callback)
{
	var download_f = new Array();
	var search_query={limit:100};
	try {				
		var search_query=JSON.parse(''+query+'');	
	} 
	catch (e) 
	{
	}	
	chrome.downloads.search(search_query, function(items) {
		if (items.length!=0)
		{
			for (let i=0;i<items.length;i++)
			{
				if (items[i].byExtensionName=="OkTools")
				{		
					var id=0;
					var aid=items[i].url.match(/#(\d+)/i);
					if (aid && aid.length > 1)
					{							
						id=aid[1];	
					}
					if (id!=0 && id!=null)
					{
						download_f.push({"did":""+items[i].id+"","id":""+id+""});
					}
				}
			}
		}
		callback(download_f);
	});
}

async function getCode(tabId, frameId, script)
{
	////console.log('GET Code START !!!!!!!!!!!!!!!!!!!!', script);
	let SCR=SCRIPT.getScript();
	for(let i = 0; i < script.length; i++) 
	{
		let id=script[i];
		let us=undefined;
		for(let k = 0; k < SCR.length; k++) 
		{
			if (SCR[k] && SCR[k].id && SCR[k].id==id){
				us=SCR[k];
			}
		}
		
		////console.log('GET Code START', id);
		if(!SCRDATA[id]){
			let promise = new Promise((resolve, reject) => {
				chrome.storage.local.get(["@code#"+id+"","@meta#"+id+"","#value#"+id+"","#require#"+id+"","valueG"], function(data){
					SCRDATA[id]=data;
					resolve("готово!");
				});
				//setTimeout(() => resolve("готово!"), 1000)
			});

			let code1 = await promise;
		}
		
		let data=SCRDATA[id];
		
		//console.log("LOAD CODE RESULT", data);
		let valueG={};
		if (data["valueG"]!==undefined && data["valueG"]!="")
		{
			valueG=data["valueG"];
		}
		let meta="";
		if(data["@meta#"+id+""]!==undefined && data["@meta#"+id+""]!="")
		{
			meta=data["@meta#"+id+""];		
		}
		let resource={};
		let value={};
		if (data["#value#"+id+""]!==undefined && typeof data["#value#"+id+""]==='object')
		{		
			value=data["#value#"+id+""];
		}
		let require="";
		if (data["@code#"+id+""]!==undefined && data["@code#"+id+""]!="")
		{
			var code=data["@code#"+id+""];			
			setCode(tabId, frameId, us, meta, ''+require+'\n'+code+'', value, valueG, resource);				
		}
		else
		{
			/*if(!isUser)
			{
				chrome.extension.sendRequest({action: 'OkTools_updateCode', id:id}, function(code) {
					setCode(us, meta, ''+require+'\n'+code+'', value, valueG, resource);
				});	
			}*/
		}
	}
}
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


class FUNCI {
	constructor(sId,act,resource,info,value,valueG) {
		this._sId=sId;
		this._act={};		
		if (act!==undefined){
			this._act=act;
		}
		this.resource=resource;
		this.info=info;
		this.value=value;
		this.valueG=valueG;
		
		this._init=false;
		this._VL={};
		this._DOWN={};
		this.reqList={};
		this.respListen();
		this.init();
	}
	init(){
		let d={id:this._sId,act:this._act};
		/*console.log("SCRIPT SEND INIT", this._sId, window.location.href);*/
		window.dispatchEvent(new CustomEvent('bz5oyxm26', {detail:d}));
	}
	SR(q){		
		let reqId=this._RND();
		let today=new Date;
		let time=today.getTime();
		this.reqList[reqId]={a:q.a,response:false,start:time};
		
		if (this._ch(q.d, 'object'))
		{
			if (this._ch(q.d.onload, 'function'))
			{
				this.reqList[reqId].onload=q.d.onload;
				delete q.d.onload;
			}
			if (this._ch(q.d.onerror, 'function'))
			{
				this.reqList[reqId].onerror=q.d.onerror;
				delete q.d.onerror;
			}
			if (this._ch(q.d.onclick, 'function'))
			{
				this.reqList[reqId].onclick=q.d.onclick;
				delete q.d.onclick;
			}
			if (this._ch(q.d.ondone, 'function'))
			{
				this.reqList[reqId].ondone=q.d.ondone;
				delete q.d.ondone;
			}
			if (this._ch(q.d.onabort, 'function'))
			{
				this.reqList[reqId].onabort=q.d.onabort;
				delete q.d.onabort;
			}
			if (this._ch(q.d.onchange, 'function'))
			{
				this.reqList[reqId].onchange=q.d.onchange;
				delete q.d.onchange;				
				this._VL[q.d.n]={n:q.d.n,a:q.a,reqId:reqId};
			}
			if (this._ch(q.d.onprogress, 'function'))
			{
				this.reqList[reqId].onprogress=q.d.onprogress;
				delete q.d.onprogress;
			}
			if (this._ch(q.d.onprocess, 'function'))
			{
				this.reqList[reqId].onprocess=q.d.onprocess;
				delete q.d.onprocess;
			}
			if (this._ch(q.d.ontimeout, 'function'))
			{
				this.reqList[reqId].ontimeout=q.d.ontimeout;
				delete q.d.ontimeout;
			}
			if (this._ch(q.d.onloadstart, 'function'))
			{
				this.reqList[reqId].onloadstart=q.d.onloadstart;
				delete q.d.onloadstart;
			}
			if (this._ch(q.d.timeout, 'number'))
			{
				this.reqList[reqId].timeout=q.d.timeout;
			}
		}
		q.reqId=reqId;
		for(var key in q.d) {
			if(q.d.hasOwnProperty(key)){
				if (typeof key==='function')
				{
					delete q.d[key];
				}
			}
		}
		let SI=this._act.SI;
		window.dispatchEvent(new CustomEvent(''+SI+'', {detail:q}));
	}
	respListen(){
		let RI=this._act.RI;
		window.addEventListener(''+RI+'', this._bind(this.R, this));
	}
	R(r){
		let req=r.detail;
		if (this._ch(req, 'object'))
		{
			if (req.reqId!==undefined)
			{
				let resp=this.reqList[req.reqId];
				if (resp!==undefined)
				{
					let act=resp.a;
					resp.response=true;
					let response=req.res;
					if (this._ch(response.result, 'string'))
					{				
						if (response.result=="onload")
						{
							if (this._ch(resp.onload, 'function'))
							{
								if(act==this._act["XR"])
								{
									if (response.data.responseText=="")
									{
										response.data.responseText=response.data.response;
									}
									resp.onload(response.data);											
								}
								else
								{
									resp.onload(response.data.d);	
								}									
							}
						}
						if (response.result=="onerror")
						{
							if (this._ch(resp.onerror, 'function'))
							{
								resp.onerror(response.data.d);
							}
						}
						if (response.result=="onclick")
						{
							if (this._ch(resp.onclick, 'function'))
							{
								resp.onclick(response.data);
								resp.ondone(true);
							}
						}
						if (response.result=="ondone")
						{
							if (this._ch(resp.ondone, 'function'))
							{
								resp.ondone(false);
							}
						}
						if (response.result=="onchange")
						{
							if (this._ch(resp.onchange, 'function'))
							{
								let d=response.data;
								if (this._ch(d, 'object'))
								{									
									resp.onchange(d.n, d.ov, d.nv, d.win);
								}
							}
						}
						if (response.result=="onprogress")
						{
							if (this._ch(resp.onprogress, 'function'))
							{
								resp.onprogress(response.data);
							}
						}
						if (response.result=="onprocess")
						{
							if (this._ch(resp.onprocess, 'function'))
							{
								resp.onprocess(response.data);
							}
						}
						if (response.result=="ontimeout")
						{
							if (this._ch(resp.ontimeout, 'function'))
							{
								resp.ontimeout(response.data);
							}
						}
						if (response.result=="onloadstart")
						{
							if (this._ch(resp.onloadstart, 'function'))
							{
								resp.onloadstart(response.data);
							}
						}
						
					}						
				}
			}
		}
	}
	AS(c){
		if (this._ch(c, 'string'))
		{
			let style = document.createElement("style");
			style.setAttribute("id", this._act["SV"]);
			style.setAttribute("type", "text/css");
			style.appendChild(document.createTextNode(c));
			(document.head||document.documentElement).appendChild(style);
			return style;
		}
	}
	
	SV(n,d,g){
		if (this._ch(n, 'string') && this._ch(d) && typeof d==='string' || 'number' || 'boolean' || 'object')
		{
			if (this._ch(g, 'boolean', true))
			{
				this.valueG[n]=d;
				this.SR({a:this._act["SV"],g:true,d:this.valueG});
			}
			else
			{
				if (this.value[n]!=d)
				{
					let oldV=this.value[n];
					this.value[n]=d;
					this.SR({a:this._act["SV"],g:false,d:this.value,n:n,v:d});
					if (this._VL[n]!==undefined)
					{
						let reqI=this._VL[n].reqId;
						let resp=this.reqList[reqI];
						if (this._ch(resp.onchange, 'function'))
						{
							resp.onchange(n,oldV,d,false);
						}
					}
				}
			}
		}
		return undefined;
	} 
	GV(n,d,g){
		const value=this.value;
		const valueG=this.valueG;		
		if (this._ch(n, 'string'))
		{
			if (this._ch(g, 'boolean', true))
			{
				if (valueG[n]!==undefined)
				{
					return JSON.parse(JSON.stringify(valueG[n]));
				}
				else
				{
					if (d!==undefined)
					{
						return d;
					}
					else
					{
						
						return undefined;
					}
				}
			}
			else
			{
				
				if (value[n]!==undefined)
				{
					return JSON.parse(JSON.stringify(value[n]));
					
				}
				else
				{
					if (d!==undefined)
					{
						return d;
					}
					else
					{
						
						return undefined;
					}
				}
			}
		}
	}
	LV(g){ 
		if (this._ch(g, 'boolean', true))
		{
			let l=[];
			for(let i in this.valueG){
				l.push(i);
			}
			return l;
		}
		else
		{
			let l=[];
			for(let i in this.value){
				l.push(i);
			}
			return l;
		}
	}
	DV(n,g){
		if (this._ch(n, 'string'))
		{
			if (this._ch(g, 'boolean', true))
			{
				if (this.valueG[n]!==undefined)
				{
					delete this.valueG[n];
					this.SR({a:this._act["SV"],g:true,d:this.valueG});
				}
			}
			else
			{
				if (this.value[n]!==undefined)
				{
					let oldV=this.value[n];
					delete this.value[n];
					this.SR({a:this._act["SV"],g:false,d:this.value});
					if (this._VL[n]!==undefined)
					{
						let reqI=this._VL[n].reqId;
						let resp=this.reqList[reqI];
						if (this._ch(resp.onchange, 'function'))
						{
							resp.onchange(n,oldV,undefined,false);
						}
					}
				}
			}
		}
		return undefined;
	}
	XR(d){
		if (this._ch(d, 'object'))
		{
			this.SR({a:this._act["XR"],d:d});	
		}
	}
	WR(d){
		if (this._ch(d, 'object'))
		{
			this.SR({a:this._act["WR"],d:d});
		}
	}
	OT(u,d){		
		if (this._ch(u, 'string'))
		{
			this.SR({a:this._act["OT"],u:u,d:d});	
		}		
	}
	N(m,t,i,o)
	{
		if (this._ch(m))
		{
			let d={};
			if(typeof m==='string'){
				d.message=m;
				if (this._ch(o,'function')){
					d.onclick=o;
				}
				if (this._ch(t,'string')){
					d.title=t;
				}
				if (i!==undefined && typeof i==='string'){
					d.iconUrl=i;
				}
			}
			if(typeof m==='object'){
				d=m;
				d.message=m.text;
				if (this._ch(m.image,'string')){
					d.iconUrl=m.image;
				}
				if (this._ch(t,'function')){
					d.ondone=t;
				}				
			}
			let nId=this._RND();
			this.SR({a:this._act["N"],nId:nId,d:d});			
		}		
	}
	GRT(n){
		return "text";
	}
	GR(n,d){
		let data='';
		let res=this.resource;
		if (this._ch(n, 'string'))
		{
			if (res[n]!==undefined)
			{
				if (res[n].data!==undefined)
				{
					if (d!==undefined && d===true)
					{
						if (res[n].type!==undefined && res[n].type!=="")
						{
							data="data:"+res[n].type+";base64,"+res[n].data;
						}
						else
						{
							data=res[n].data;
						}
					}
					else
					{
						data=decodeURIComponent(escape(window.atob(res[n].data)));
					}
				}
			}
		}
		return data;
	}
	AVL(n,c){
		if (this._ch(n, 'string') && this._ch(c, 'function')){
			this.SR({a:this._act["VL"],g:"add",d:{n:n,onchange:c}});
			return n;
		}
		return false;
	}
	DVL(n){
		if (this._ch(n, 'string'))
		{
			this.SR({a:this._act["VL"],g:"delete",d:{n:n}});
			if (this._VL[n]!==undefined)
			{
				delete this._VL[n];
			}
		}
	}	
	DW(u,n){
		if (this._ch(u, 'string'))
		{
			this.SR({a:this._act["DW"],d:{url:u,filename:n}});	
		}
		if (this._ch(u, 'object'))
		{
			if (u.id===undefined) 
			{
				u.id=this._RND();
			}
			if (u.name!==undefined) 
			{
				u.filename=u.name;
			}
			this.SR({a:this._act["DW"],d:u});			
		}
	}
	DWL(q,c){
		if (q!==undefined && typeof q==='object')
		{
			this.SR({a:this._act["DWL"],d:{"onload":c,d:q}});
		}
	}
	DWS(d){
		if (q!==undefined && typeof q==='object')
		{
			this.SR({a:this._act["DWS"],d:d});
		}
	}
	ST(v){
		if (this._ch(v))
		{
			if (typeof v==='string' ||'object'){
				this.SR({a:this._act["ST"],d:{v:v}});
			}
			else
			{
				this.SR({a:this._act["ST"],d:{v:{}}});
			}				
		}
	}
	GT(c,d){
		if (this._ch(c, 'function'))
		{
			this.SR({a:this._act["GT"],d:{"onload":c,d:d}});	
		}
	}
	I(){
		return this.info;
	}
	_gm(n,s){
		let m=this.meta;
		if (m[n]!==undefined)
		{
			if(typeof m[n]==='object'){
				if (s=='string')
				{
					for(let i in m[n]){
						return m[n][i];
					}
				}
				if(s=='array')
				{
					return m[n];
				}
			}
		}
		else{
			return null;
		}	
	}
	_bind(f, obj){	
		return function() {
			return f.apply(obj, arguments);
		};
	}
	_ch(V,t,v){
		let c=false;
		if (V!==undefined)
		{
			if (t!==undefined)
			{
				if(typeof V===t)
				{
					if (v!==undefined)
					{
						if (V==v)
						{
							return true;
						}
						return false;
					}
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}
	_RND(){
		let ID=Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
		return ID;
	}
	SC(d){
		if (this._ch(d, 'string'))
		{
			if (navigator.clipboard != undefined) {
				navigator.clipboard.writeText(d);
			}
			else if(window.clipboardData) {
				window.clipboardData.setData("Text", d);
			}
		}
	}
	ER(e){
		if(e!==undefined && typeof e==='object')
		{
			if (e.type!==undefined && e.lineno!==undefined && e.colno!==undefined)
			{
				let err={type:e.type,message:e.message,lineno:e.lineno,colno:e.colno,stack:e.error.stack,mess:e.error.message};	
				this.SR({a:this._act["ER"],d:err});				
			}
			else if (e.name!==undefined && e.message!==undefined && e.stack!==undefined)
			{
				let err={type:e.name,message:e.message,lineno:0,colno:0,stack:e.stack,mess:""};
				let rd=e.stack.match(/#([\d]+):([\d]+):([\d]+)/i);
				if (rd && rd.length > 1)
				{	
					err.lineno=rd[2];
					err.colno=rd[3];
				}
				this.SR({a:this._act["ER"],d:err});		
			}			
		}
	}
	ERR(e){
		console.log("%cERROR: Script NAME failed!","padding: 2px; background: crimson; font: 1.2em/1 Arial; color: white;",e);
		console.log(e.message);
		/*this.SR({a:this._act["ER"],d:{v:{}}});*/
	}
}

function infon(meta,meta_or){
	let m=meta;
	let i={"script":{"options":{"override":{}}},"ext":ext};
	let s=i.script;
	let o=i.script.options;
	let ov=i.script.options.override;
	if (m!==undefined)
	{
		s.author=getMeta('author','string');
		s.copyright=getMeta('copyright','string');
		s.description=getMeta('description','string');
		s.excludes=getMeta('exclude','array');
		s.homepage=getMeta('homepage','string');
		s.icon=getMeta('icon','string');
		s.icon64=getMeta('icon64','string');
		s.includes=getMeta('include','array');
		s.lastUpdated=getMeta('lastUpdated','string');
		s.matches=getMeta('match','array');
		s.downloadMode=getMeta('downloadMode','string');
		s.name=getMeta('name','string');
		s.namespace=getMeta('namespace','string');
		s.position=getMeta('position','string');
		//s.resources=this.infoResource();
		s["run-at"]=getMeta('run','string');
		s.system=getMeta('system','string');
		s.unwrap=getMeta('unwrap','string');
		s.version=getMeta('version','string');
		s.position=getMeta('position','string');
		
		o.awareOfChrome=true;
		o.compat_arrayleft=false;
		o.compat_foreach=false;
		o.compat_forvarin=false;
		o.compat_metadata=false;
		o.compat_prototypes=false;
		o.compat_uW_gmonkey=false;
		o.noframes=getMeta('noframes','string');
		
		ov.excludes=false;
		ov.includes=false;
		ov.orig_excludes=getMeta('exclude','array');
		ov.orig_includes=getMeta('include','array');
		ov.use_excludes=[];
		ov.use_includes=[];
		
		i.scriptMetaStr=undefined;
		i.scriptSource=meta_or;
		i.scriptUpdateURL=getMeta('updateURL','string');
		i.scriptWillUpdate=false;
		i.scriptHandler=ext.name;
		i.isIncognito=false;
		i.version=ext.version;
		////console.log(i);
		return i;
	}
	else
	{
		return undefined;
	}
	function getMeta(n,s){
		if (m[n]!==undefined)
		{
			if(typeof m[n]==='object'){
				if (s=='string')
				{
					for(let i in m[n]){
						return m[n][i];
					}
				}
				if(s=='array')
				{
					return m[n];
				}
			}
		}
		else{
			return null;
		}	
	}
}

function RND(){
	let ID='b'+Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
	return ID;
}
function setCode(tabId, frameId, us, meta, code, value, valueG, resource) {

	let sId=us.id;
	let ac={
		FN:RND(),
		FC:RND(),
		SI:RND(),
		IN:RND(),
		RI:RND(),			
		AS:RND(),
		SV:RND(),
		OT:RND(),
		XR:RND(),
		N:RND(),
		VL:RND(),
		DW:RND(),
		DWL:RND(),
		DWS:RND(),
		ST:RND(),
		GT:RND(),
		ER:RND(),
		WR:RND()
	};
	let FN=ac.FN;
	let FC=ac.FC;
	var str=FUNCI.toString().replace(/\r?\n/g, "");
	let FU='function err(e){'+FN+'.ERR(e);}'+str.replace("FUNCI", ""+FC+"");
	let act=JSON.stringify(ac);
	
	let loadValue=false;
	let loadResource=false;
	let loadInfo=false;
	
	let F='';
	let FUN='';
	let DAT=[];	
	let GM='';
	if(us.meta.grant!==undefined && us.meta.grant.length!=0)
	{	
		for (let i = 0; i < us.meta.grant.length; i++) 
		{
			switch(us.meta.grant[i]) {				
				case 'GM_addStyle': 
					let GM_addStyle='function GM_addStyle(c){return '+FN+'.AS(c);}';
					F+=GM_addStyle;
					FUN+='GM_addStyle,';
					DAT.push(GM_addStyle);
				break;
				case 'GM_listValues':
					let GM_listValues='function GM_listValues(g=false){return '+FN+'.LV(g);}';
					F+=GM_listValues;
					FUN+='GM_listValues,';
					DAT.push(GM_listValues);
					loadValue=true;
				break;
				case 'GM_getValue':
					let GM_getValue='function GM_getValue(n,d,g){return '+FN+'.GV(n,d,g);}';
					F+=GM_getValue;
					FUN+='GM_getValue,';
					DAT.push(GM_getValue);
					loadValue=true;
				break;
				case 'GM_setValue': 
					let GM_setValue='function GM_setValue(n,d,g){return '+FN+'.SV(n,d,g);}';
					F+=GM_setValue;
					FUN+='GM_setValue,';
					DAT.push(GM_setValue);
					loadValue=true;
				break;
				case 'GM_deleteValue':
					let GM_deleteValue='function GM_deleteValue(n,g){return '+FN+'.DV(n,g);}';
					F+=GM_deleteValue;
					FUN+='GM_deleteValue,';
					DAT.push(GM_deleteValue);
					loadValue=true;
				break;
				case 'GM_addValueChangeListener': 
					let GM_addValueChangeListener='function GM_addValueChangeListener(n,c){return '+FN+'.AVL(n,c);}';
					F+=GM_addValueChangeListener;
					FUN+='GM_addValueChangeListener,';
					DAT.push(GM_addValueChangeListener);
				break;
				case 'GM_removeValueChangeListener': 
					let GM_removeValueChangeListener='function GM_removeValueChangeListener(n){return '+FN+'.DVL(n);}';
					F+=GM_removeValueChangeListener;
					FUN+='GM_removeValueChangeListener,';
					DAT.push(GM_removeValueChangeListener);
				break;
				case 'GM_log': 
					let GM_log='function GM_log(t){ //console.log(t);}';
					F+=GM_log;
					FUN+='GM_log,';
					DAT.push(GM_log);
				break;
				case 'GM_getResourceText':
					loadResource=true;
					let GM_getResourceText='function GM_getResourceText(n){return '+FN+'.GR(n);}';
					F+=GM_getResourceText;
					FUN+='GM_getResourceText,';
					DAT.push(GM_getResourceText);
				break;
				case 'GM_getResourceURL': 
					loadResource=true;
					let GM_getResourceURL='function GM_getResourceURL(n){return '+FN+'.GR(n,true);}';
					F+=GM_getResourceURL;
					FUN+='GM_getResourceURL,';
					DAT.push(GM_getResourceURL);
				break;
				case 'GM_registerMenuCommand': 
					let GM_registerMenuCommand='function GM_registerMenuCommand(name, fn, accessKey){return false;}';
					F+=GM_registerMenuCommand;
					FUN+='GM_registerMenuCommand,';
					DAT.push(GM_registerMenuCommand);
				break;
				case 'GM_unregisterMenuCommand': 
					let GM_unregisterMenuCommand='function GM_unregisterMenuCommand(menuCmdId) {return false;}';	
					F+=GM_unregisterMenuCommand;	
					FUN+='GM_unregisterMenuCommand,';	
					DAT.push(GM_unregisterMenuCommand);
				break;
				case 'GM_openInTab': 
					let GM_openInTab='function GM_openInTab(u,d){'+FN+'.OT(u,d);}';
					F+=GM_openInTab;
					FUN+='GM_openInTab,';
					DAT.push(GM_openInTab);
				break;
				case 'GM_download': 
					let GM_download='function GM_download(u,n){return '+FN+'.DW(u,n);}';
					F+=GM_download;
					FUN+='GM_download,';
					DAT.push(GM_download);
				break;			
				case 'GM_downloadList':
					let GM_downloadList='function GM_downloadList(u,c){return '+FN+'.DWL(u,c);}';
					F+=GM_downloadList;
					FUN+='GM_downloadList,';
					DAT.push(GM_downloadList);
				break;
				case 'GM_downloadShow':
					let GM_downloadShow='function GM_downloadShow(d){return '+FN+'.DWS(d);}';
					F+=GM_downloadShow;
					FUN+='GM_downloadShow,';
					DAT.push(GM_downloadShow);
				break;
				case 'GM_xmlhttpRequest': 
					let GM_xmlhttpRequest='function GM_xmlhttpRequest(d){return '+FN+'.XR(d);}';
					F+=GM_xmlhttpRequest;
					FUN+='GM_xmlhttpRequest,';
					DAT.push(GM_xmlhttpRequest);
				break;
				case 'GM_notification': 
					let GM_notification='function GM_notification(m,t,i,o){'+FN+'.N(m,t,i,o); }';
					F+=GM_notification;
					FUN+='GM_notification,';
					DAT.push(GM_notification);
				break;
				case 'GM_setClipboard': 
					let GM_setClipboard='function GM_setClipboard(d,i){return '+FN+'.SC(d);}';
					F+=GM_setClipboard;
					FUN+='GM_setClipboard,';
					DAT.push(GM_setClipboard);
				break;
				case 'GM_saveTab': 
					let GM_saveTab='function GM_saveTab(v){return '+FN+'.ST(v);}';
					F+=GM_saveTab;
					FUN+='GM_saveTab,';
					DAT.push(GM_saveTab);
				break;
				case 'GM_getTab': 
					let GM_getTab='function GM_getTab(c){return '+FN+'.GT(c,false);}';
					F+=GM_getTab;
					FUN+='GM_getTab,';
					DAT.push(GM_getTab);
				break;
				case 'GM_getTabs': 
					let GM_getTabs='function GM_getTabs(c){return '+FN+'.GT(c,true);}';
					F+=GM_getTabs;
					FUN+='GM_getTabs,';
					DAT.push(GM_getTabs);
				break;				
				case 'GM_info':
					loadInfo=true;
					let GM_info='var GM_info1='+FN+'.I();function GM_info(){return GM_info1;}';			
					F+=GM_info;					
					FUN+='GM_info,';
					DAT.push('GM_info');
				break;
				case 'GM_webRequest': 
					let GM_webRequest='function GM_webRequest(d){return '+FN+'.WR(d);}';
					F+=GM_webRequest;
					FUN+='GM_webRequest,';
					DAT.push(GM_webRequest);
				break;
				
				
				case 'GM.info':
					GM+='info: '+FN+'.I(),';
					loadInfo=true;					
				break;
				case 'GM.deleteValue':
					GM+='deleteValue(n){return GM.prom('+FN+'.DV(n));},';				
				break;
				case 'GM.getValue':
					GM+='getValue(n,d){return GM.prom('+FN+'.GV(n,d));},';			
				break;
				case 'GM.listValues': 
					GM+='listValues(){return GM.prom('+FN+'.LV());},';
				break;
				case 'GM.setValue': 
					GM+='setValue(n,d){return GM.prom('+FN+'.SV(n,d));},';
				break;
				case 'GM.getResourceUrl': 
					GM+='getResourceUrl(n){return GM.prom('+FN+'.GR(n,true));},';
				break;
				case 'GM.notification': 
					GM+='notification(m,t,i,o){return GM.prom('+FN+'.N(m,t,i,o));},';
				break;
				case 'GM.openInTab': 
					GM+='openInTab(u,d){return GM.prom('+FN+'.OP(u,d));},';
				break;
				case 'GM.setClipboard': 
					GM+='setClipboard(d,i){return '+FN+'.SC(d);},';
				break;
				case 'GM.xmlHttpRequest': 
					GM+='xmlHttpRequest(d){return GM.prom('+FN+'.XR(d));},';					
				break;
				case 'none': 					
				break;
				default:
					//console.log("SCRIPT ID:"+us.id+" - GRANT NOT FOUND ["+us.meta.grant[i]+"]"); 
			}
		}
		if (GM.length!=0)
		{
			F+='var GM={'+GM+'prom(f){let prom = new Promise(function(resolve, reject){resolve(f);});return prom;}};';
			FUN+='GM,';
			DAT.push('GM');
		}
		let GM_error='function GM_error(e){return '+FN+'.ER(e);}';
		F+=GM_error;
		FUN+='GM_error,';
		DAT.push(GM_error);
		
		let cloneInto='function cloneInto(v,t,o){return v;}';
		F+=cloneInto;
		FUN+='cloneInto,';
		DAT.push(cloneInto);
		
		
		
		let exportFunction='function exportFunction(v,t,o){if (o!==undefined && o.defineAs!==undefined){t[o.defineAs] = v;} return v;}';
		F+=exportFunction;
		FUN+='exportFunction,';
		DAT.push(exportFunction);
		
		let createObjectIn='function createObjectIn(v,o){var r = {};if (o!==undefined && o.defineAs!==undefined){v[o.defineAs] = r;}return r;}';
		F+=createObjectIn;
		FUN+='createObjectIn,';
		DAT.push(createObjectIn);
		
		let uneval="function uneval(o){var retVal = '';if (typeof o === 'object'){if (Array.isArray(o)){retVal = '[' + o.map((el) => uneval(el)).join(',') + ']';}else if (o instanceof RegExp){retVal = o.toString();}else if (o instanceof Date) {retVal = `new Date(${o})`;} else if (o === null) {retVal = 'null';} else if (Number.isNaN(o)) {retVal = 'NaN';}else {retVal = '{' + Object.keys(o).map((k) => `\"${k}\":${uneval(o[k])}`).join(',') + '}';}}else if (typeof o === 'function'){let isNative=false; isNative= o.toString().match(/^function \(\) \{ \[native code\] \}$/);if (isNative && noNativeFns) {throw new Error('No native functions is allowed');}retVal = `${isNative ? o.name : o.toString()}`;} else {retVal = JSON.stringify(o);}return retVal;}";
		F+=uneval;
		FUN+='uneval,';
		DAT.push(uneval);
		
		
		F+='var unsafeWindow=window;';
		FUN+='unsafeWindow';
		DAT.push('unsafeWindow');
	}
	
	let res={};
	if (loadResource)
	{
		let r=us.meta["resource"];
		////console.log('LOAD RESOURCE',loadResource,r,resource);
		if (r!==undefined && r.length!=0 && resource!==undefined && resource.length!=0)
		{
			for(let i in r){
				let rd=r[i].match(/(\w+)\s+(.*)/i);
				if (rd && rd.length > 1)
				{				
					if (rd[1] && rd[2])
					{
						for(let n in resource){
							if (resource[n].url!==undefined && resource[n].url==rd[2])
							{
								res[rd[1]]={url:rd[2],type:resource[n].type,data:resource[n].data};
							}
						}
						
					}			
				}
			}
		}
	}
	res=JSON.stringify(res);
	let info='{"script":{"options":{"override":{}}},"ext":{}}';
	if (loadInfo)
	{
		info=JSON.stringify(infon(us.meta,meta));
	}
	let val='{}';
	let valG='{}';
	if (loadValue)
	{
		val=JSON.stringify(value);
		valG=JSON.stringify(valueG);
	}

	let IN='let '+FN+'=new '+FC+'(\''+us.id+'\', '+act+', '+res+', '+info+', '+val+', '+valG+');let usId="'+us.id+'";';
	let code2="(function(){ document.currentScript.remove();"+FU+" "+IN+" "+F+"var FUN='"+FUN+"';var DAT=["+DAT+"];\ntry{"+code+"}catch(e){GM_error(e);}})();";


	chrome.scripting.executeScript({
		target: {tabId: tabId, frameIds: [frameId]},
		func: code => {
			const el = document.createElement('s'+'cr'+'ip'+'t');
			el.textContent = code;
			document.documentElement.appendChild(el);
			el.remove();
		},
		args: [code2],
		world: 'MAIN',
	});
}

function load_data(saveOn)
{
	var scr_on="";
	var SM=SCRIPT.scriptMeta;
	if (SM!==undefined)
	{
		SM.forEach(function(value, key, map) { 
			if (value!==undefined && value.on!==undefined && value.on==true)
			{
				scr_on=''+scr_on+''+key+',';
			}
		})
	}

	let userUid=SCRIPT.uid;
	postData("https://api.oktools.ru/index.php", "json", {
		method: "POST",
		headers: {
			"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
			"X-Requested-With":"XMLHttpRequest"
		},
		body:"mod=func&podmod=load&function_on="+scr_on+"&uid="+userUid+"&browser="+ext.browser+"&version="+ext.version+"&nc="+Math.random()+""
	})
	.then((res) => {
		if(res){
			//console.log(res);
			let data=res.data;
			let UserScriptOn=[];
			for(let i = 0; i < data.length; i++) 
			{
				let on=true;
				if (data[i].on=="false")
				{
					on=false;
				}
				
				if (saveOn && SM!==undefined)
				{
					if(SM.has(data[i].id)){
						let meta=SM.get(data[i].id);
						if (meta!==undefined && meta.on!==undefined)
						{
							on=meta.on;
						}
					}
				}
				UserScriptOn.push({"id":""+data[i].id+"", "on":on, "mod":data[i].mod});
			}
			var time_end=new Date().getTime() + parseInt(res.reload);	
			var localSave={};
			localSave["UserScriptArr"]=data;
			localSave["UserScriptOn"]=UserScriptOn;
			localSave["UserScriptTime"]=time_end;

			if (res.c !== undefined && res.c.length>0){
				let cod=res.c;
				for (var i in cod) 
				{
					let id=cod[i].id;
					let code=cod[i].code;
					localSave["@code#"+id+""]=code;
					if(SCRDATA[id] && SCRDATA[id]["@code#"+id+""]){
						SCRDATA[id]["@code#"+id+""]=code;
					}
				}		
			}
			chrome.storage.local.set(localSave, function() {				
				SCRIPT.init();
				send_reload_page('',true);
				try{
					chrome.runtime.sendMessage({action: 'OkTools_popupRefresh'}, function(re) {
						if(chrome.runtime.lastError) { console.log("ERROR SEND POPUP: ", chrome.runtime.lastError);}	
					});	
				}
				catch(e){}
			});
		}	
	});
}

async function postData(url, type, data) {
	try {
		const response = await fetch(url, data);
		const contentType = response.headers.get('content-type');
		if (type=="json"){
			if (!contentType || !contentType.includes('application/json')) {
				throw new TypeError("Ой, мы не получили JSON!");
			}
			var result = await response.json();
		}
		else if (type=="blob"){
			var result = await response.blob();
		}
		else{
			var result = await response.text();
		}
		return result;
	} catch (error) {console.log(error);}
	return false;
}

function ajax_request_new(dat, r, callback){
	let params={};
	const data=dat;
	let url="";
	let type="json";
	let method="POST";
	if(data.url!==undefined)
	{
		url=data.url;
	}
	if(data.method!==undefined)
	{
		params["method"]=data.method;
	}
	if (data.headers!==undefined && typeof data.headers === 'object')
	{
		let headers	= new Headers();
		for(var key in data.headers) 
		{			
			try {
				headers.append(key, data.headers[key]);
			} catch (e) {}
			
		}
		params["headers"]=headers;
		
	}
	if(data.data!==undefined && typeof data.data === 'string')
	{
		params["body"]=data.data;
	}
	
	if (data.responseType!==undefined && typeof data.responseType === 'string')
	{
		type=data.responseType;
	}

	postData(url, type, params)
	.then((response) => {
		let result ={'result':'onload', 'r':r, 'status':'', 'statusText':'', 'readyState':'', 'response':response, 'responseText':'','responseType':'','finalUrl':'','responseXML':'','responseHeaders':''};
		callback(result);
	});
}
})();