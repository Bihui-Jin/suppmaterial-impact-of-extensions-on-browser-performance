var Config={getAll:function(){return{widthRange:this.getWidthRange(),heightRange:this.getHeightRange(),fileType:this.getFileType(),sortType:this.getSortType(),alertDownloadAsk:this.getAlertDownloadAsk()};},getWidthRange:function(){return this.safeGetRangeValue(localStorage.filterWidthRange,[0,1000]);},getHeightRange:function(){return this.safeGetRangeValue(localStorage.filterHeightRange,[0,1000]);},setWidthRange:function(range){localStorage.filterWidthRange=range;},setHeightRange:function(range){localStorage.filterHeightRange=range;},getFileType:function(){var fileType=localStorage.filterFileType;if(fileType==undefined){fileType='all';}
else if(fileType!='all'&&fileType!='jpg'&&fileType!='gif'&&fileType!='png'&&fileType!='other'){fileType='all';}
return fileType;},setFileType:function(value){localStorage.filterFileType=value;},getSortType:function(){var sortType=localStorage.filterSortType;if(sortType==undefined)
sortType='tab,asc';else if(sortType!='tab,asc'&&sortType!='area,desc'&&sortType!='area,asc')
sortType='tab,asc';return sortType;},setSortType:function(value){localStorage.filterSortType=value;},getAlertDownloadAsk:function(){var value=localStorage.alertDownloadAsk;if(value==undefined)
value=1;else if(value!=1&&value!=0)
value=1;return value;},setAlertDownloadAsk:function(value){localStorage.alertDownloadAsk=value;},safeGetRangeValue:function(value,defaultValue){if(value!=undefined){var ar=value.split(',');var min=-1;var max=-1;if(ar.length==2){min=parseInt(ar[0]);max=parseInt(ar[1]);}
if(min>=0&&max>=0&&min>=defaultValue[0]&&min<=defaultValue[1]&&max>=defaultValue[0]&&max<=defaultValue[1])
return[min,max];}
return defaultValue;}};

