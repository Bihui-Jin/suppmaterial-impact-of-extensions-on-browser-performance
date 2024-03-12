(function(){
var INIT=undefined;
var SC=[];	

var SCRIPT={
	notif:{},
	CVL:{},
	DOWN:{},
	NR:function(i,a,b){
		if (i!==undefined)
		{
			let n=this.notif[i];
			if (n!==undefined && n.sId!==undefined){
				SC[n.sId].sendResponse({a:n.a,reqId:n.r,res:{result:a,data:b}});
				delete this.notif[i];
			}
		}
	}
}

class INITSC {
	constructor() {
		this._init=false;
		this._frame=0;
		this.init();
	}
	init(){
		var url=window.location.href;
		window.setInterval(function(){
			var u=window.location.href;
			if(url!=u){
				url = u;
				window.dispatchEvent(new CustomEvent("changeWinUrl", {detail:u}));
			}
		}, 100);
		this._frame=this.getFrame(window.self);
		this.onMessage();
	}
	getFrame(){
		let winToID=window.self;
		if (winToID === window.top) {
			return 0;
		}
		else if (winToID.parent === window.top) {
			return 1;
		}

		return 1;
	}
	onMessage(){
		chrome.runtime.onMessage.addListener(function (request, sender, callback) {
			if (request.action == "OkTools_Download_Process")
			{
				if (request!==undefined && typeof request==='object'){
					if (request.reqId!==undefined){
						let d=SCRIPT.DOWN[request.reqId];
						if (d!==undefined)
						{
							let result='onprogress';
							SC[d.sId].sendResponse({reqId:request.reqId,res:{result:result,data:request}});
							if (result=='onload' || result=='onerror')
							{
								delete SCRIPT.DOWN[request.reqId];
							}
						}
					}
				}
				callback(true);
			}
			if (request.action == "OkTools_changeValue")
			{
				if (request.scriptId!==undefined)
				{
					valueChange.set(request.scriptId, request.name, request.oldV, request.newV);
				}
				callback(true);
			}
			if (request.action == "notificationClose") 
			{
				SCRIPT.NR(request.id, "ondone", request.b);
				callback(true);
			}
			if (request.action == "notificationClick") 
			{
				SCRIPT.NR(request.id, "onclick", request.b);	
				callback(true);				
			}
		});
	}
}


class NEW_FUNC {
	constructor(sId,meta,act) {
		this._sId=sId;
		this._meta=meta;
		this._act=act;
		this._init=false;
		this._notif={};
		this._VL={};
		//FN function name in inject script
		//FC class name in inject script
		//SI:sendID 
		//RI:response ID
		//IN init in include
		//AS GM_addStyle
		//SV GM_setValue
		//OT GM_openInTab
		//XR GM_xmlHttpsRequest
		//N GM_notification
		//VL Value listener
		//DW download
		//DWL GET download LIST
		//DWS SHOW download Folder
		//ST GM_setTab
		//GT GM_getTabs
		//WR WebRequest
		this.reqListen();
	}
	act(){
		return this._act;
	}
	reqListen(){
		let SI=this._act.SI;
		window.addEventListener(''+SI+'', this._bind(this.getRequest, this));
	}
	getRequest(r){
		let req=r.detail;
		if (this._ch(req, 'object'))
		{
			if (req.a!==undefined && req.reqId!==undefined)
			{
				if (req.a==this._act["IN"])
				{
					this._init=true;
					this.sendResponse({a:req.a,reqId:req.reqId,res:{result:'INIT OK',data:undefined}});
				}
				if (req.a==this._act["SV"])
				{
					this._SV(req.d,req.n,req.v,req.g);
				}
				if (req.a==this._act["OT"])
				{
					this._OT(req.u,req.d);
				}
				if (req.a==this._act["XR"])
				{
					req.d.reqId=req.reqId;
					this._XR(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["WR"])
				{
					req.d.reqId=req.reqId;
					this._WR(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["N"])
				{
					req.d.reqId=req.reqId;
					this._N(req.a,req.reqId,req.d,req.nId);					
				}
				if (req.a==this._act["VL"])
				{
					req.d.reqId=req.reqId;
					this._CVL(req.a,req.reqId,req.d.n,req.g);					
				}
				if (req.a==this._act["DW"])
				{
					req.d.reqId=req.reqId;
					this._DW(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["DWL"])
				{
					req.d.reqId=req.reqId;
					this._DWL(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["DWS"])
				{
					req.d.reqId=req.reqId;
					this._DWS(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["ST"])
				{
					req.d.reqId=req.reqId;
					this._ST(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["GT"])
				{
					req.d.reqId=req.reqId;
					this._GT(req.a,req.reqId,req.d);					
				}
				if (req.a==this._act["ER"])
				{
					req.d.reqId=req.reqId;
					this._ER(req.a,req.reqId,req.d);					
				}
			}
		}
	}
	sendResponse(q){
		let RI=this._act.RI;
		window.dispatchEvent(new CustomEvent(''+RI+'', {detail:q}));
	}
	_bind(f, obj){	
		return function() {
			return f.apply(obj, arguments);
		};
	}
	_N(a,r,d,nId){
		let sId=this._sId;
		chrome.runtime.sendMessage({action: 'OkTools_Notification', nId:nId, data:d}, function(nId) {
		
			SCRIPT.notif[nId]={sId:sId,a:a,r:r,nId:nId};	
		});	
	}
	_XR(a,r,d){
		if (this._ch(d, 'object'))
		{
			chrome.runtime.sendMessage({action: 'OkTools_XMLHttpRequest', r:r, data:d}, this._bind(this._XRR, this));	
		}
	}
	_XRR(res){
		this.sendResponse({reqId:res.r,res:{result:res.result,data:res}});
	}
	_WR(a,r,d){
		if (this._ch(d, 'object'))
		{
			chrome.runtime.sendMessage({action: 'OkTools_WebRequest', r:r, data:d}, this._bind(this._WRR, this));	
		}
	}
	_WRR(res){
	}
	_DW(a,r,d){
		if (this._ch(d, 'object'))
		{
			chrome.runtime.sendMessage({action: 'OkTools_Download_File', a:a, r:r, d:d}, this._bind(this._DWR, this));
			
		}
	}
	_DWR(res){
		let sId=this._sId;
		if (res!==undefined && typeof res==='object')
		{
			if (res.result!==undefined)
			{
				if (res.result=="onloadstart")
				{
					SCRIPT.DOWN[res.r]={sId:sId,dId:res.dId};
				}
				let r1={reqId:res.r,res:{result:res.result,data:res}};
				this.sendResponse({reqId:res.r,res:{result:res.result,data:res}});
			}
		}
	}
	_DWL(a,r,d){
		if (this._ch(d, 'object'))
		{
			chrome.runtime.sendMessage({action: 'OkTools_Get_Download_List', a:a, r:r, d:d}, this._bind(this._DWLR, this));
		}
	}	
	_DWLR(res){ //Check OK
		let sId=this._sId;
		if (res!==undefined && typeof res==='object')
		{
			this.sendResponse({reqId:res.r,res:{result:res.result,data:{d:res.data}}});
		}
	}
	_DWS(d){
		if (this._ch(d, 'number'))
		{
			chrome.runtime.sendMessage({action: 'OkTools_Download_Show_File', d:d}, function(){});
		}
	}
	_SV(d,n,v,g){
		let sId=this._sId;
		if (this._ch(d))
		{
			if (this._ch(g, 'boolean', true))
			{
				chrome.storage.local.set({["valueG"]:d}, function(){});
			}
			else
			{
				chrome.storage.local.set({["#value#"+sId+""]:d}, function(){});
				let sv=SCRIPT["CVL"][sId]
				if(sv!==undefined && sv[n]!==undefined)
				{
					sv[n].val.push(v);
				}
			}
		}
	}
	_OT(u,d){		
		let data={};
		if (this._ch(u,'string'))
		{
			data.url=u;
			if (d!==undefined)
			{
				if (typeof d==='object')
				{
					if (d.active!==undefined)
					{
						data.active=d.active;
					}
					else
					{
						data.active=false;
					}
				}
				if (typeof d==='boolean')
				{
					if(d)
					{
						data.active=false;
					}					
				}
			}
			chrome.runtime.sendMessage({action: 'OkTools_Open_Tab', data:data}, function(result) {});	
		}		
	}
	_CVL(a,r,n,g){
		let sId=this._sId;
		let CV=SCRIPT["CVL"];
		if (this._ch(n, 'string'))
		{
			if (g=="add")
			{
				if (CV[sId]!==undefined)
				{
					if (this._isEmpty(CV[sId]))
					{
						CV[sId]={};
					}
				}
				else
				{
					CV[sId]={};
				}
				
				CV[sId][n]={val:[],a:a, r:r};
			}
			if (g=="delete"){
				if (CV[sId]!==undefined && CV[sId][n]!==undefined)
				{
					delete SCRIPT["CVL"][sId][n];
				}
				if (this._isEmpty(SCRIPT["CVL"][sId]))
				{
					delete SCRIPT["CVL"][sId];
				}
			}
		}
	}
	_ST(a,r,d){
		let sId=this._sId;
		if (this._ch(d))
		{
			chrome.runtime.sendMessage({action: 'ST', sId:sId, a:a, r:r, d:d}, function(){});
		}
	}
	_GT(a,r,d){
		let sId=this._sId;
		chrome.runtime.sendMessage({action: 'GT', sId:sId, a:a, r:r, d:d}, this._bind(this._GTR, this));
	}
	_GTR(res){
		if (res!==undefined && typeof res==='object')
		{
			this.sendResponse({reqId:res.r,res:{result:"onload",data:{d:res.d}}});
		}
	}
	_ER(a,r,d){
		let sId=this._sId;
		d.sId=sId;
		d.url={host:document.location.host,href:document.location.href,count:1};
		chrome.runtime.sendMessage({action: 'ER', sId:sId, a:a, r:r, d:d}, function(){});
	}
	_isEmpty(obj){
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
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
}
window.addEventListener('bz5oyxm26', function(r){
	let req=r.detail;
	if(INIT==undefined)
	{
		INIT=new INITSC();
	}
	SC[req.id]=new NEW_FUNC(req.id,"",req.act);
});
})();