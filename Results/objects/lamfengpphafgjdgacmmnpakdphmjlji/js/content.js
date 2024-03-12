var TAG_TYPE={IMG:0,LINK:1};String.prototype.isEndWith=function(a){if(a==null||a==""||this==null||this.length==0||a.length>this.length)
return false
if(this.substring(this.length-a.length).toLowerCase()==a.toLowerCase())
return true
else
return false};var PageQuery=function(){};PageQuery.prototype={images:[],getList:function(outputTabId){this.images=[];var imgs=document.getElementsByTagName('img');for(var i=0;i<imgs.length;i++){var img=imgs[i];if(img.src.length==0||img.src.indexOf('data:')==0)
continue;var tmpImg=new Image();tmpImg.src=img.src;var w=parseInt(img.naturalWidth);var h=parseInt(img.naturalHeight);var tw=parseInt(tmpImg.width);var th=parseInt(tmpImg.height);w=Math.max(w,tw);h=Math.max(h,th);tmpImg=null;this.add(TAG_TYPE.IMG,img.src,w,h);}
var tags=document.getElementsByTagName("a");for(var i=0;i<tags.length;i++){var url=tags[i].href;if(url.isEndWith('.jpg')||url.isEndWith('.jpeg')||url.isEndWith('.gif')||url.isEndWith('.png')||url.isEndWith('.bmp')||url.isEndWith('.ico')){this.add(TAG_TYPE.LINK,url,0,0);}}
if(this.images.length>0){chrome.extension.sendMessage({action:"IMAGELIST_LOAD",images:this.images,outputTabId:outputTabId});};},add:function(tagType,src,width,height){this.images.push({tagType:tagType,src:src,width:width,height:height})}};var pageQuery=new PageQuery();

