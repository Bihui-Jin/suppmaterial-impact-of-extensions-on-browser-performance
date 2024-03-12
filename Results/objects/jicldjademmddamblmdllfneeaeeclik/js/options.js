(function(){
var doc = window.document;
window.addEventListener("hashchange", function (e) {
	get_hash();
}, false);

function get_hash()
{
	var page="main";
	var id=0;
	var hash=window.location.hash.substr(1);
	if (hash!="")
	{
		page=hash;
		var search_id=hash.match(/edit-(us[0-9]+)/i);
		if (search_id && search_id.length > 1)
		{			
			page="script_edit";
			var tit=doc.querySelector('#header_title') || null; 
			if (tit)
			{
				tit.textContent="Редактирование скрипта";
			}
			id=search_id[1];
			get_variable("@code#"+id+"", function(text){				
				var textarea=doc.querySelector('#OkTools_Script_Text') || null; 			
				textarea.dataset.id=id;
				textarea.value=text;
			});
		}
		if (hash=="new_script")
		{
			page="script_edit";
			var tit=doc.querySelector('#header_title') || null; 
			if (tit)
			{
				tit.textContent="Создать новый скрипт";
			}
			new_id(function (id) {
				var UserScriptName="Новый скрипт #"+id+"";				
				var UserScriptMeta="// ==UserScript==\n// @name         "+UserScriptName+"\n// @namespace    https://oktools.ru/\n// @version      0.1\n// @description  Мой новый скрипт\n// @author       You\n// @match        *://ok.ru*\n// @exclude      *cache.html$\n// ==/UserScript==\n\n";
				var UserScriptCode="(function() {\n    'use strict';\n\n    console.log('Мой скрипт #"+id+"');\n    // Вставьте Ваш код здесь...\n})();";
				var textarea=doc.querySelector('#OkTools_Script_Text') || null; 
				if (textarea)
				{
					textarea.dataset.id=id;
					textarea.value=""+UserScriptMeta+""+UserScriptCode+"";
				}
			});
		}
	}
	show_page(page);
}

function show_page(page)
{
	var active = doc.querySelectorAll(".screen.active");
	{
		for (var a = 0; a < active.length; a++) 
		{
			active[a].classList.remove('active');
		}
	}
	var page_active=doc.getElementById(''+page+'');
	if (page_active)
	{		
		
		page_active.classList.add('active');
		
	}
	else
	{
		var page_active=doc.getElementById('main');
		if (page_active)
		{		
			page_active.classList.add('active');
		}
	}
}
function extractMetablock(ScriptArrText) {
  try {
    var blocksReg = /\B(\/\/ ==UserScript==\r?\n([\S\s]*?)\r?\n\/\/ ==\/UserScript==)([\S\s]*)/
    var blocks = ScriptArrText.match(blocksReg)

    if (!blocks) {
      return null
    }

    var metablock = blocks[1]
    var metas = blocks[2]
    var code = blocks[3]

    var meta = {}
    var metaArray = metas.split('\n')
    metaArray.forEach(function (m) {
      var parts = m.match(/@([\w-]+)(:([\w]+))?\s+(.+)/)
      if (parts) {
        meta[parts[1]] = meta[parts[1]] || []
		if (parts[2])
		{			
			let obj='{"'+parts[3]+'":"'+parts[4]+'"}';
			meta[parts[1]].push(JSON.parse(obj))
		}
		else
		{
			meta[parts[1]].push(parts[4])
		}
      }
    })

    return {
      meta: meta,
      metablock: metablock,
      content: code
    }
  } catch(e) {
    if (console) console.error(e)
    return null
  }
}

class saveScript{
	constructor(id, text) {
		
		this.id=id;
		this.text=text;
		this.result=doc.querySelector('#OkTools_Script_SaveRes') || null; 
		let meta_new=extractMetablock(text);
		if (meta_new!==null && meta_new!==undefined && meta_new!='')
		{
			this.content=meta_new["content"];
			this.meta_new=meta_new["meta"];
			this.metablock=meta_new["metablock"];
			let meta={};
			meta["name"]=this.getMeta("name", "Новый скрипт #"+id+"");
			meta["namespace"]=this.getMeta("namespace", "http://ScriptArr.org");
			meta["version"]=this.getMeta("version", "1.0");
			meta["author"]=this.getMeta("author", "you");
			meta["description"]=this.getMeta("description", "");
			meta["homepage"]=this.getMeta("homepage", "");
			meta["homepageURL"]=this.getMeta("homepageURL", "");
			meta["website"]=this.getMeta("website", "");
			meta["source"]=this.getMeta("source", "");
			meta["icon"]=this.getMeta("icon", "");
			meta["iconURL"]=this.getMeta("iconURL", "");
			meta["defaulticon"]=this.getMeta("defaulticon", "");
			meta["icon64"]=this.getMeta("icon64", "");
			meta["icon64URL"]=this.getMeta("icon64URL", "");
			meta["updateURL"]=this.getMeta("updateURL", "");
			meta["downloadURL"]=this.getMeta("downloadURL", "");
			meta["supportURL"]=this.getMeta("supportURL", "");
			meta["include"]=this.getMeta("include", []);
			meta["match"]=this.getMeta("match", []);
			meta["exclude"]=this.getMeta("exclude", []);
			meta["require"]=this.getMeta("require", []);
			meta["resource"]=this.getMeta("resource", []);
			meta["connect"]=this.getMeta("connect", "");
			meta["run"]=this.getMeta("run-at", "document-end");
			meta["grant"]=this.getMeta("grant", []);
			meta["noframes"]=this.getMeta("noframes", []);
			meta["unwrap"]=this.getMeta("unwrap", "true");
			meta["nocompat"]=this.getMeta("nocompat", "");
			this.meta=meta;
			this.saveUser(function(r) {});
		}
	}
	getMeta(name, d){
		let n=d;
		if(this.meta_new[name])
		{
			n=this.meta_new[name];
		}
		return n;
	}
	saveUser(c){
		let id=this.id;
		let meta=this.meta;
		let sc=this;
		chrome.storage.local.get("#UserScript", function(data) {
			let UserScript=[];
			if (data["#UserScript"]!==undefined)
			{
				UserScript=data["#UserScript"];
			}			
			let scriptNew=false;	
			let add=false;
			if (UserScript)
			{
				for (let i = 0; i < UserScript.length; i++) 
				{
					if (UserScript[i].id==id)
					{
						add=true;
						UserScript[i].meta=meta;
					}
				}
			}
			if(!add)
			{
				UserScript.push({"id":""+id+"","user":"true","on":"true","meta":meta});
				scriptNew=true;
			}
			
			sc.saveCode(scriptNew);
			//console.log(" OPTION SAVE CODE", UserScript);
			chrome.storage.local.set({["#UserScript"]:UserScript}, function() {
				c({"id":""+id+""});
			});
		});			
	}
	saveCode(scriptNew){
		let id=this.id;
		let content=this.text;
		let result=this.result;
		chrome.storage.local.set({["@code#"+id+""]:content}, function() {
			if(scriptNew){
				window.location.hash = "#edit-"+id+"";
			}
			var date = new Date();
			var time=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			result.textContent="Сохранено "+time+"";
		});
	//	this.getRequire();
	}
	getRequire(){
		let id=this.id;
		let data=[];
		if(this.meta!==undefined && this.meta.require!==undefined)
		{
			data=this.meta.require;
		}
		if (this.meta!==undefined && this.meta.resource!==undefined){
			let t=this.meta.resource;
			if(t.length!=0){
				for(let l=0;l<t.length;l++){
					let res=t[l].match(/(\w+)\s+(.*)/i);
					if (res && res.length > 1)
					{				
						let ch=false;
						for (let i = 0; i < data.length; i++) 
						{
							if(res[2]==data[i])
							{
								ch=true;
							}
						}
						if(!ch)
						{
							data.push(res[2]);
						}			
					}
				}
			}
		}

		chrome.extension.sendRequest({action: "OkTools_load_require", id:id, require:data}, function(res){});
	}
}


function Delete_User_Script(id)
{
	get_variable("#UserScript", function(result){
		for (let i = 0; i < result.length; i++) 
		{
			if (result[i].id==id)
			{
				result.splice(i, 1);
				break;				
			}
		}
		chrome.storage.local.remove(["@code#"+id+""], function() {});	
		chrome.storage.local.set({["#UserScript"]:result}, function() {
			window.close();
		});
	});
}
function new_id(callback)
{
	get_variable("#UserScript", function(result){
		let max_id=0;
		if (result)
		{			
			for (let i = 0; i < result.length; i++) 
			{
				var search_id=result[i].id.match(/us([0-9]+)/i);
				if (search_id && search_id.length > 1)
				{	
					if(search_id[1]>max_id)
					{
						max_id=search_id[1];
					}
				}
			}
		}
		let new_id=parseInt(max_id)+1;
		callback("us"+new_id);
	});
}
function get_variable(VarName, callback)
{  
	chrome.storage.local.get([VarName], function(result) {
		if (result[VarName] !== undefined)
		{
			if (result[VarName]!="")
			{
				callback(result[VarName]);
			}
			else
			{
				callback(false);
			}
		}
		else
		{
			callback(false);
		}
	});
}
window.addEventListener("DOMContentLoaded",function() {
	get_hash();	
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
	var butt_back=doc.querySelectorAll('.button_back') || null; 
	if (butt_back)
	{
		for (var b = 0; b < butt_back.length; b++) 
		{
			butt_back[b].addEventListener('click', function(e) {
				show_page("script_edit");
			});
		}		
	}
	var func_info=doc.querySelector('#func_info_open') || null; 
	if (func_info)
	{
		func_info.addEventListener('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			show_page("func_info");
		});	
	}
	var save_button=doc.querySelector('#OkTools_Script_Save') || null; 
	if (save_button)
	{
		save_button.addEventListener('click', function(e) {
			var textarea=doc.querySelector('#OkTools_Script_Text') || null; 
			if (textarea)
			{				
				new saveScript(textarea.dataset.id, textarea.value);				
			}
		});
	}
	var delete_button=doc.querySelector('#OkTools_Script_Delete') || null; 
	if (delete_button)
	{
		delete_button.addEventListener('click', function(e) {
			var textarea=doc.querySelector('#OkTools_Script_Text') || null; 
			if (textarea)
			{				
				var id=textarea.dataset.id;
				var text=textarea.value;
				Delete_User_Script(id);				
			}
		});
	}
}, false);
})();