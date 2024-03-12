//var baseUrl = 'http://localhost:65220/';
var baseUrl = 'https://www.citemaker.com/';
var openListBtn=false;
var doNotCite=false;
var folderBtnFlag=false;
var wcEmail=false;
var buttonClicked='';
var checkBoxTicked=false;
var tab_title = '';
chrome.tabs.query({active: true}, function(tabs) {
  var tab = tabs[0];
  tab_title = tab.title;
  
  /*chrome.tabs.executeScript(tab.id, {
    code: 'document.querySelector("h1").textContent'
  }, display_h1);*/
});


//"{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"https://www.realestate.com.au/news/","name":"News"}},{"@type":"ListItem","position":2,"item":{"@id":"https://www.realestate.com.au/news/qld/","name":"Queensland"}},{"@type":"ListItem","position":3,"item":{"@id":"https://www.realestate.com.au/news/qld/gold-coast/","name":"Gold Coast"}}]}``{"@context":"http://schema.org","@type":"NewsArticle","mainEntityOfPage":{"@type":"WebPage","@id":"https://www.realestate.com.au/news/one-of-the-last-original-burleigh-beach-houses-up-for-sale/"},"headline":"One of the last original Burleigh beach houses up for sale","image":["https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060052/capi_156ccfe437af043e54b69bc7c1adb654_3e2e5c8c12bf972f5e251794eb0b2b2d.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060014/capi_156ccfe437af043e54b69bc7c1adb654_a4b212c26d480f6ca3bef0ea5bf2b4cc.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060018/capi_156ccfe437af043e54b69bc7c1adb654_6dc25a8c936ee27e046e106edd93951e.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060022/capi_156ccfe437af043e54b69bc7c1adb654_c6bff846648b7ace0f55169765d6ad7d.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060029/capi_156ccfe437af043e54b69bc7c1adb654_a3e916d0cb309bf3b0beb2b6c467c2eb.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060034/capi_156ccfe437af043e54b69bc7c1adb654_c910a6514fd7af29e353173e55d89941.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060038/capi_156ccfe437af043e54b69bc7c1adb654_95c42eb663343bd9ef06340a796d57c7.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060042/capi_156ccfe437af043e54b69bc7c1adb654_9999d5133448dabc74959451b810fdb8.jpeg","https://www.realestate.com.au/blog/images/1280x720-fit,progressive/2021/03/31060048/capi_156ccfe437af043e54b69bc7c1adb654_cb9afdf80258403dfc349d9d01e2ed8a.jpeg"],"datePublished":"31 Mar 2021","author":{"@type":"Person","name":"Lisa Hughes"},"publisher":{"@type":"Organization","name":"Realestate.com.au","logo":{"@type":"ImageObject","url":"https://s1.rui.au.reastatic.net/rui-static/img/rea-logo-v4.png"}},"ArticleSection":["Queensland"],"description":"Built in 1933 this original beach house that has fought off development and is just moments from James Street and the beachfront is up for auction"}``"

var allAuthors=new Array();

var st_date='',st_year='';

function formatDt(dateStr)
{
    var arrMonth=new Array("month","january","february","march","april","may","june","july","august","september","october","november","december")

var arrMonth1=new Array("month","jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec");

    var date=day=month=year='';
if(dateStr.indexOf("-")>=0)
{
    var arrDate=  dateStr.split("-");
    if(arrDate.length>2)
    {
        
            if(arrDate[0].length==4)
            {
                year=arrDate[0];
            }
            if(arrDate[1].length==2)
            {
                var mnth=parseInt(arrDate[1]);
                month=arrMonth[mnth];
            }
            var tmpD=arrDate[2];
            if(tmpD.length>2)
            {
                tmpD=tmpD.substring(0, 2);
            }
            
                day=tmpD;
            
        
    }
}
else if(dateStr.indexOf('/')>=0)
{
    var arrDate= dateStr.split("/");
    if(arrDate.length>2)
    {
        
            if(arrDate[0].length==4)
            {
                year=arrDate[0];
            }
            if(arrDate[1].length==2)
            {
                var mnth=parseInt(arrDate[1]);
                month=arrMonth[mnth];
            }
            var tmpD=arrDate[2];
            if(strlen(tmpD)>2)
            {
                tmpD=  tmpD.substring(0, 2);
            }
            
                day=tmpD;
            
        
    }
}
else if(dateStr.indexOf(' ')>=0)
{
    var dateStr=  dateStr.trim();
    if(dateStr.indexOf(' ')>=0)
    {
        var arrDate=  dateStr.split(' ');
        if(arrDate.length>0)
        {
            if(arrDate.length==2)
            {
                var part1=arrDate[0].toLowerCase();
                var part2=  arrDate[1].toLowerCase();
                var part2Int=parseInt(part2);
                var part1Int=parseInt(part1);
                if(parseInt(part1)>0 && part1.length==4)
                {
                    year=part1;
                    if(in_array(part2, arrMonth))
                    {
                        month=  ucfirst(part2);
                    }
                    else if(typeof arrMonth[part2Int] != 'undefined')
                    {
                        month=arrMonth[part2Int];
                    }
                    else if(in_array(part2, arrMonth1))
                    {
                        month=  ucfirst(part2);
                    }
                    else if(typeof arrMonth1[part2Int] != 'undefined')
                    {
                        month=arrMonth1[part2Int];
                    }
                }
                else if(part2Int>0 && part2.length==4)
                {
                    year=part2;
                    if(in_array(part1, arrMonth))
                    {
                        month=  ucfirst(part1);
                    }
                    else if(typeof arrMonth[part1Int] != 'undefined')
                    {
                        month=arrMonth[part1Int];
                    }
                    else if(in_array(part1, arrMonth1))
                    {
                        month=  ucfirst(part1);
                    }
                    else if(typeof arrMonth1[part1Int] != 'undefined')
                    {
                        month=arrMonth1[part1Int];
                    }
                }
            }
            else if(arrDate.length==3)
            {
                var part1=  arrDate[0].toLowerCase();
                var part2=  arrDate[1].toLowerCase();
                var part3=  arrDate[2].toLowerCase();
                
                var part1Int=parseInt(part1);
                var part2Int=parseInt(part2);
                var part3Int=parseInt(part3);
                
                if(part1Int>0 && part1.length==4)
                {
                    year=part1;
                    if(in_array(part2, arrMonth))
                    {
                        month=  ucfirst(part2);
                    }
                    else if(typeof arrMonth1[part2Int] != 'undefined')
                    {
                        month=arrMonth1[part2Int];
                    }
                    else if(in_array(part2, arrMonth1))
                    {
                        month=  ucfirst(part2);
                    }
                    else if(typeof arrMonth1[part2Int] != 'undefined')
                    {
                        month=arrMonth1[part2Int];
                    }
                    day=part3;
                }
                else if(part3Int>0 && part3.length==4)
                {
                    year=part3;
                    if(in_array(part2, arrMonth))
                    {
                        month=  ucfirst(part2);
                    }
                    else if(typeof arrMonth[part2Int] != 'undefined')
                    {
                        month=arrMonth[part2Int];
                    }
                    else if(in_array(part2, arrMonth1))
                    {
                        month=  ucfirst(part2);
                    }
                    else if(typeof arrMonth1[part2Int] != 'undefined')
                    {
                        month=arrMonth1[part2Int];
                    }
                    day=part1;
                }
                
            }
        }        
        
        
    }
    //in_a
}

    if(month!='' && year!='')
    {
        date=year+', '+  ucfirst(month);
        if(day!='')
        {
            date+=' '+day;
        }
    }
    st_date= date;
    st_year=year;
}

function ucfirst(str)
{
    var j = str.charAt(0).toUpperCase();
    str = j + str.substr(1);
    return str;
}

function in_array(niddle,haystack)
{
    var i=0;
    var flag=false;
    for(i=0;i<haystack.length;++i)
        {
            if(niddle==haystack[i])
                {
                    flag=true;
                }
        }
        return flag;
}



var code = 'var json = document.querySelectorAll(\'script[type="application/ld+json"]\');' + 
           'if (json[0]){ \n\
    var i=0,str=""; \n\
   ' +
           '' +
           'for(i=0;i<json.length;++i){ str+=json[i].innerText+"``"; } ({authors: str || "" });' +
           ' }';

   
chrome.tabs.executeScript({
    code: code
}, function(results) {
    if (!results) {
        // An error occurred at executing the script. You've probably not got
        // the permission to execute a content script for the current tab
        return;
    }
    //var result = jsn=JSON.parse(results[0]);
    //console.log(results[0]);
    
    
    var result = results[0].authors;
    
    if(result!='')
        {
            var arrRes=result.split("``");
            var i=0;
            var jsn;
            var strAuthor='';
            for(i=0;i<arrRes.length;++i)
                {
                    if(arrRes[i].trim()!=''){
                        jsn=JSON.parse(arrRes[i]);
                        if(typeof jsn.author != "undefined")
                            {
                                if(typeof jsn.author.name != "undefined" ||
                                        (typeof jsn.author[0]!="undefined" && typeof jsn.author[0].name!="undefined"))
                                    {
                                        var arrAuthors;
                                        if(typeof jsn.author[0]!="undefined" && typeof jsn.author[0].name!="undefined")
                                        {
                                            var tmpStr='';
                                            var l=0;
                                            for(l=0;l<jsn.author.length;++l)
                                            {
                                               tmpStr+= jsn.author[l].name+'`';
                                            }
                                            arrAuthors=tmpStr.split("`");
                                        }
                                        else
                                        {
                                            arrAuthors=jsn.author.name.split(",");
                                        }
                                        var j=0;
                                        for(j=0;j<arrAuthors.length;++j)
                                            {
                                                var author=ucFirstAllWords(arrAuthors[j].trim());
                                                var arrAthr=author.trim().split(" ");
                                                var athr=arrAthr[arrAthr.length-1];
                                                var k=0;
                                                if(arrAthr.length>1)
                                                    {
                                                        for(k=0;k<arrAthr.length-1;++k)
                                                        {
                                                            var authPart=arrAthr[k];
                                                            athr+=' '+authPart[0];
                                                        }
                                                    }
                                                    if(strAuthor!='')
                                                        {
                                                            strAuthor+='``';
                                                        }
                                                    strAuthor+=athr;
                                                    console.log("strAuthor::"+strAuthor);
                                            }
                                    }
                            }
                            
                            if(typeof jsn.datePublished != "undefined")
                            {
                                formatDt(jsn.datePublished);
                            }
                    }
                }
                if(strAuthor!='')
                {
                    strAuthor=strAuthor.replace(/``$/,"");
                    allAuthors=strAuthor.split("``");
                }
                console.log(strAuthor);
        }
    //console.log(result);
    // Now, do something with result.title and result.description
});


$(function () {
		
	// load any previously saved setting
	chrome.storage.sync.get(function(value){
		/*if (value.style !== undefined) {
			$('.cite-styles li input[type="checkbox"]').removeClass('selected');
                        $('.cite-styles li input[type="checkbox"]').prop('checked', false);
			$('input[type="checkbox"][data-style="'+value.style+'"]').addClass('selected');
                        $('input[type="checkbox"][data-style="'+value.style+'"]').prop('checked', true);
		}*/




		citeCurrentPage();
	});	
	
	chrome.runtime.onMessage.addListener(function(message) {
		if (message.type === "tbsHighlightedText"){
			$('.quote-wrapper textarea').val(message.content);
		}
	});
	
	$(document).on('click', '.close-btn', function() {
            
		chrome.runtime.sendMessage({
			type: 'bgToggleFrame',
			content: 'toggleFrame'
		});
                window.close();
	});
		
	$(document).on('click', '.cite-styles li input[type="checkbox"]', function () {
            checkLikeRadio(this);
		$('.cite-styles li input[type="checkbox"]').removeClass('selected');
		var $selectedStyle = $(this);		
		$selectedStyle.addClass('selected');
		checkBoxTicked=false;
		var selectedStyle = $selectedStyle.data('style');
		
		// save it for the future
		//chrome.storage.sync.set({'style': selectedStyle});
                if(selectedStyle=='APA7')
                    citeCurrentPage();
	});	
	
	$(document).on('click', '.selectable', function() {
        $(this).selectText();
    });
	
	$('#bib-form').on('submit', function(e) {	
		e.preventDefault();
		
		var addToBibliographyJsString = 'javascript:var form = document.createElement("form");form.setAttribute("method", "post");form.setAttribute("action", "'+baseUrl+'cite/website/citeweb");var urlField = document.createElement("input");urlField.setAttribute("type", "hidden");urlField.setAttribute("name", "autociteUrl");urlField.setAttribute("value", "'+$('#Url').val()+'");form.appendChild(urlField);var quoteField = document.createElement("input");quoteField.setAttribute("type", "hidden");quoteField.setAttribute("name", "quote");quoteField.setAttribute("value", "'+$('#Quote').val()+'");form.appendChild(quoteField);document.body.appendChild(form);form.submit();';
		chrome.runtime.sendMessage({type:'bgOpenUrl', content: addToBibliographyJsString});
	});
});

function getWebsiteNameFromUrl(url) {
	url = url.replace('http://', '').replace('https://', '').replace('www.', '').replace(/\/.*/g, '');
	
	return url.charAt(0).toUpperCase() + url.slice(1);
}

function toggleError () {
	$('#spinner').hide(0, function () {
		$('#failed-wrapper').show(0);
	});
}

function citeCurrentPage(form,noAutoCite,wcEdit) {
    $("#username").val("");
    $("#password").val("");
	$('#result-wrapper').hide(0); // hide existing citation
	$('#failed-wrapper').hide(0); // hide any error messages too
        $("#saveFileDiv").hide();
        $("#login_panel").hide();
        $("#expired_panel").hide();
        $("#fileSaveContainer").show();
        $("#openedCitation").hide();
        $("#openSavedCiteBtn").show();
        $("#backBtn").hide();
        $("#copyBtnBtm").hide();
        $("#emailBtn").hide();
        $("#deleteBtn").hide();
        $('#registerPanel').hide();
        $("#subscribeDiv").hide();
        $("#libForm").hide();
        $("#fileListDiv").hide();
        $("#citePart").show();
        $("#worldcat-searchdiv").hide();
        folderBtnFlag=false;
        
        var subUrl1='&fd=none';
        if(typeof form == "undefined")
            form='website';
        else
            subUrl1='&fd=block';
        
	var style = 'APA7';
	var date = new Date();
	accessedOnDay = date.getDate();
	accessedOnMonth = date.getMonth() + 1; // +1 because .getMonth() is zero based
	accessedOnYear = date.getFullYear();	

	chrome.runtime.sendMessage({type: 'bgGetUrl'}, function(response) {
            console.log('response: '+response);
		var urlToCite = response;
                doNotCite=false;
		// check to make sure we're not on a Chrome options page
		var chromePage = urlToCite.indexOf('chrome://');
		if (chromePage !== -1)
		{
                    doNotCite=true;
			//toggleError();
			//return;
		}
		
		// or the chrome extensions gallery (this can't be injected into)
		var extensionsPage = urlToCite.indexOf('chrome.google.com/webstore');
		if (extensionsPage !== -1)
		{
                    doNotCite=true;
			//toggleError();
			//return;
		}

		$('#spinner').show(0, function () {
                    //console.log(baseUrl+'api/autocite/website?url='+encodeURIComponent(urlToCite)+'&style='+style);
                    var style = 'APA7';
                    
                    removeAllStyleJs();
                    var jsflname=style.toLowerCase()+'_functions.js';
                    
                    var js = document.createElement("script");
                         js.type = "text/javascript";
                                 js.setAttribute('id',style.toLowerCase()+'_functions');
                         js.src = 'js/'+jsflname;

                         document.body.appendChild(js);
                    //document.getElementById('abcd').innerHTML='<script src=""></script>';
                    $.ajax({
                                type: 'GET',
				url: baseUrl+'ajax.php?ms='+new Date().getTime(),
                                data:"type=islogin",
				success: function(data) {
                                    if(data.trim()=='')
                                        {                                            
                                            showBottomLogin();
                                        }
                                        else
                                            {
                                                showBottomLogout();
                                            }
					$('#userLoginDiv').html(data);
                                        logoutEventByAjax();
                                }
                    });
                    var subUrl='';
                    if(typeof noAutoCite != "undefined" && noAutoCite==true)
                        {
                            doNotCite=noAutoCite;
                        }
                    if(doNotCite==true)
                        {
                            subUrl="&no_citing=1";
                        }
                        if(typeof wcEdit != "undefined" && wcEdit==true)
                            {
                                subUrl+="&wc_edit=1";
                            }
                            if(checkBoxTicked==true)
                                {
                                    subUrl+="&clicked=1";
                                }
			$.ajax({
				url: baseUrl+'api/citeweb/?url='+encodeURIComponent(urlToCite)+'&ms='+new Date().getTime()+subUrl+'&form='+form+'&style='+style+subUrl1,						
				success: function(data) {
                                    //console.log(data);
					//if (data.status === 'ok') {
					// populate the visible area
                                        console.log(data);
					$('#result-wrapper').html(data);
					// Then show it
					$('#spinner').hide(0, function () {
						$('#result-wrapper').fadeIn('slow');
					});
					/*}
					else {
						toggleError();
					}*/
                                        $('.styles li input[type="checkbox"]').click(function () {
                                           checkLikeRadio1(this); 
                                           checkBoxTicked=true;
                                           if($(this).data('wcedit')=="yes")
                                               {
                                                   citeCurrentPage($('.styles li input:checked').val(),true,true);
                                               }
                                               else
                                                   {
                                                        citeCurrentPage($('.styles li input:checked').val());
                                                   }
                                        });
                                        if(style=="APA7")
                                            {
                                                var wcAutoFilFlg=false;
                                                if(typeof wcEdit!='undefined' && wcEdit==true)
                                                    {
                                                        
                                                        wcAutoFilFlg=true;
                                                    }
                                                    autofilWCSearch(allAuthors);
                                                reformatAPA7(wcAutoFilFlg);
                                            }
                                            else if(style=="Harvard")
                                                {
                                                    reformatHarvard();
                                                }
                                                $("#saveBtn").click(function(){
                                                    openListBtn=false;
                                                    buttonClicked='saveBtn';
                                                    showHideBtns();
                                                    $("#formFields").hide();
                                                formPanelSave=true;
                                                saveMyCiteBottom=true;
                                                saveCitationstoDB2(); 
                                             });
                                             $("#copyBtn").click(function(){
                                                 buttonClicked='copyBtn';
                                                 $("#formFields").hide();
                                                executeCopy2(document.getElementById('bookPanel').innerHTML); 
                                             });
                                             $("#copyBtnIntxt").click(function(){
                                                 copyIntext();
                                                 $("#formFields").hide();
                                             });
                                             $("#closeBtnWc").click(function(){
                                                 $("#result-wrapper").hide();
                                                 $("#worldcat-searchdiv").show();
                                             });
                                             $('#emaiIcon').click(function() {
                                                 buttonClicked='emailIcon';
                                                 wcEmail=false;
                                                 $("#formFields").hide();
                                                 openEmailPopup();
                                             });
                                            
                                             if(document.getElementById('style-worldcat').checked==true && (typeof wcEdit == "undefined" || wcEdit!=true))
                                                {
                                                    showWorldcatSearchResults();
                                                }
                                            
                                             $(".editBtn").click(function(){
                                                 
                                                 $("#citationPrevHeading").show();
                                                 $("#noAuthorMsgDiv").hide();
                                                $("#formFields").show();
                                                buttonClicked='editBtn';
                                                
                                             });
                                             $("#closeFormBtn").click(function(){
                                                 $("#formFields").hide();
                                             })
                                             $("#folderBtn").click(function(){
                                                 buttonClicked='folderBtn';
                                                openListBtn=true;
                                                folderBtnFlag=true;
                                                $("#formFields").hide();
                                                showHideBtns();
                                                formPanelSave=true;
                                                saveMyCiteBottom=true;
                                                showAllDatabase(); 
                                             });
				},
				error: function(e) {
					toggleError();
				}
			});
		});	
		
	});
}


function reformatAPA7(wcAutoFilFlg)
{
    var placeHolder='author';
    if($("#author").data('plc')!='undefined' && $("#author").data('plc')!='')
        {
            placeHolder=$("#author").data('plc');
        }
     if(document.getElementById('authorSec'))
     {
            $("#addAuthorDiv").click(function(){
               addNewAuthor('authorSec','bookPanel',2,placeHolder) 
            });
     }
    if(document.getElementById('editorSec'))
    {
        $("#addEditorDiv").click(function(){
           addNewEditor('editorSec','bookPanel',13) 
        });
        
        $("#add_editor_p").click(function(){
           addNewEditor('editorSec','bookPanel',13) 
        });
    }
    
    if(document.getElementById('chkproducer'))
        {
            $("#chkproducer").click(function(){
                clearCreativeProGroupAuth(document.getElementById('chkproducer'),'editor');
            });
        }
        
        if(document.getElementById('chkdirector'))
        {
            $("#chkdirector").click(function(){
                clearCreativeProGroupAuth(document.getElementById('chkdirector'),'editor');
            });
        }
    
    var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[editor]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var disp=el.style.display;
               var val=el.value.trim();
               var disp=el.style.display;
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='')
                        {
                            var disp1=$("#"+cmBtnId).parent().parent().css('display');
                                        
                                    
                                    if(disp!='none' && disp1!='none')
                                    {
                                
                                        var patt11 = new RegExp(/^[author]+[2-9]$/);
                                        if(patt11.test(cmBtnId)==true || cmBtnId=="author")
                                            {

                                            }
                                            else
                                                {
                                                    if(cmBtnId=="volume" || cmBtnId=="issue")
                                                        {
                                                            ReloadTextDiv2(cmBtnId,$("#"+cmBtnId).data('div'),'journal');
                                                        }
                                                        else
                                                            {
                                                                if(cmBtnId=="chapter")
                                                                    {
                                                                        if($("#chapter").data('keyup').indexOf("italic")>0)
                                                                                {
                                                                                    ReloadTextDiv2('chapter','CiteChapter','italic');
                                                                                }
                                                                                else
                                                                                    {   
                                                                                        ReloadTextDiv2('chapter','CiteChapter');                                                                                
                                                                                    }


                                                                    }
                                                                    else if(cmBtnId=="title")
                                                                    {
                                                                        if($("#title").data('keyup').indexOf("capitalizeTitle")>0)
                                                                                {
                                                                                    ReloadTextDiv2('title','CiteTitle','journal','capitalizeTitle');
                                                                                }
                                                                                else
                                                                                    {   
                                                                                        ReloadTextDiv2('title','CiteTitle');
                                                                                    }


                                                                    }
                                                                    else
                                                                        {
                                                                            ReloadTextDiv2(cmBtnId,$("#"+cmBtnId).data('div'));
                                                                        }
                                                            }
                                                }

                            }
                        }
                        else if((cmBtnId=='year' || cmBtnId=='date') && val=="")
                        {
                            if(cmBtnId=='year')
                                yearFlg=true;
                            else if(cmBtnId=='date')
                                dateFlg=true;
                            chkYearDate();
                        }
                    }
                    if(wcAutoFilFlg==true)
                        {
                            if(document.getElementById('place'))
                                {
                                    var plc=$("#place").val();
                                    var pub='';
                                    if(document.getElementById('publisher'))
                                        {
                                            pub=$("#publisher").val();
                                        }
                                        if(plc=='' && pub=='')
                                            {
                                                showDiv('CitePlace');
                                                $("#CitePlace").html(' n.p.');
                                            }
                                            else if(plc=='' && pub!='')
                                                {
                                                    showDiv('CitePlace');
                                                    $("#CitePlace").html(' n.p.:');
                                                }
                                }
                        }
    $("#author").keyup(function() {
        ReloadTextDiv2('author','CiteAuthor');
    });
    $("#editor").keyup(function(){
       ReloadTextDiv2('editor','CiteEditor'); 
    });
    $("#descriptor").keyup(function(){
       ReloadTextDiv2('descriptor','CiteDescriptor'); 
    });
    $( "#year" ).keyup(function() {
        ReloadTextDiv2('year','CiteYear');
    });
    $("#year").blur(function(){
        chkYearDate();
    });
    $( "#date" ).keyup(function() {
        ReloadTextDiv2('date','CiteDate');
    });
    $("#date").blur(function(){
        chkYearDate();
    });
    
    
    if(document.getElementById('title'))
        {
            $( "#title" ).keyup(function() {
                if($("#title").data('keyup').indexOf("capitalizeTitle")>0)
                    {
                        ReloadTextDiv2('title','CiteTitle','journal','capitalizeTitle');
                    }
                    else
                        {   
                            ReloadTextDiv2('title','CiteTitle');                                                                            
                        }
            });
        }
    if(document.getElementById('chapter'))
        {
    $( "#chapter" ).keyup(function() {
        if($("#chapter").data('keyup').indexOf("italic")>0)
            {
                ReloadTextDiv2('chapter','CiteChapter','italic');
            }
            else
                {   
                    ReloadTextDiv2('chapter','CiteChapter');                                                                                
                }
    });
        }
    
    $( "#format" ).keyup(function() {
        ReloadTextDiv2('format','CiteFormat');
    });
    
    
    $("#pageBook").keyup(function(){
        ReloadTextDiv2('pageBook','CitePage','books');
    });
    $("#pageJournal").keyup(function(){
        ReloadTextDiv2('pageJournal','CitePage');
    });
    $( "#volume" ).keyup(function() {
        ReloadTextDiv2('volume','CiteVolume','journal');
    });
    $( "#issue" ).keyup(function() {
        ReloadTextDiv2('issue','CiteIssue','journal');
    });
    $( "#http" ).keyup(function() {
        ReloadTextDiv2('http','CiteHttp');
    });
    $( "#accessed" ).keyup(function() {
        ReloadTextDiv2('accessed','CiteAccessed','internet');
    });
    
    $( "#place" ).keyup(function() {
        ReloadTextDiv2('place','CitePlace');
    });
    $( "#publisher" ).keyup(function() {
        ReloadTextDiv2('publisher','CitePublisher');
    });
    
    $("#original_year").keyup(function(){
        ReloadTextDiv2('original_year','CiteOriginalYear', 'books');
    })
    
    $("#abstractChk").click(function(){
        checkchkabstract(document.getElementById('abstractChk'));
    });
    
    $("#specialChk").click(function(){
        checkchkspecialissue(document.getElementById('specialChk'));
    });
    

    $("#year").change(function(){
        chkYear();
    });
    if(document.getElementById('date'))
        {
            var chng=$("#date").data('onchange');
            if(typeof chng != "undefined" && chng!= null && chng!='' && chng.indexOf('YMd')>=0)
                {
                    $("#date").change(function(){
                            ValidateDate('date','CiteDate','YMd');
                        });
                    
                }
                else
                    {
                        $("#date").change(function(){
                            ValidateDate('date','CiteDate');
                        });
                    }
        }
    $("#pageBook").change(function(){
       chkPage(); 
    });
    $("#pageJournal").change(function(){
       chkPage(); 
    });
    
    $("#http").change(function(){
        //isValidURL('http');
    });
    
    
    $("#rerievedChk").click(function(){
       retrievedChk(document.getElementById('rerievedChk')); 
    });
    
    $("#chkUsername").click(function(){
        showHideUsername(document.getElementById('chkUsername'));
    });
    $("#chk_blog").click(function(){
        chkUnchkBlogPage(document.getElementById('chk_blog'));
    });
    $("#chk_highlight").click(function(){
        chkUnchkBlogPage(document.getElementById('chk_highlight'));
    });
    $("#chk_page").click(function(){
        chkUnchkBlogPage(document.getElementById('chk_page'));
    });
    $("#chk_profile").click(function(){
        chkUnchkBlogPage(document.getElementById('chk_profile'));
    });
    $("#transSpecial").click(function(){
        checkchkTransSpecial(document.getElementById('transSpecial'));
    });
    $("#chkRecord").click(function(){
        checkchkspecialissue(document.getElementById('chkRecord'));
    });
    $("#chkFormat").click(function(){
        checkchkabstract(document.getElementById('chkFormat'));
    });
    $("#chkeLocator").click(function(){
        eLocatorChk(document.getElementById('chkeLocator'));
    });
    $("#advance_online_app").click(function(){
        showHideAdvanceOnlinePub(document.getElementById('advance_online_app'));
    });
    $("#chkTedConferences").click(function(){
        showHideTedConferencesLect(document.getElementById('chkTedConferences'));
    });
    $("#chkPdf").click(function(){
        showHideFrmt('descriptor','CiteDescriptor',document.getElementById('chkPdf'));
    });
    $("#chkauthor").click(function(){
        clearGroupAll(document.getElementById('chkauthor'),'editor','CiteAuth');
    });
    
    $("#chk_newspaper").click(function(){
        magNewsChk(document.getElementById('chk_newspaper'));
    });
    
    $("#chk_magazine").click(function(){
        magNewsChk(document.getElementById('chk_magazine'));
    });
    
    ReplaceInternetS();
    if(document.getElementById('chkPdf') && document.getElementById('chkPdf').checked)
        {
            showHideFrmt('descriptor','CiteDescriptor',document.getElementById('chkPdf'));
        }
    
}



function reformatAuthorAPA7()
{
    if(document.getElementById('author').value=='')
    {
        document.getElementById('CiteAuthor').style.fontStyle="italic";
        document.getElementById('CiteAuthor').innerHTML=document.getElementById('CiteTitle').innerHTML.replace('&nbsp;','').trim();
        document.getElementById('CiteTitle').innerHTML='';
    }
}

function removeAllStyleJs()
{
    if(document.getElementById('apa_functions'))
        document.body.removeChild(document.getElementById('apa_functions'));
    
    if(document.getElementById('apa7_functions'))
        document.body.removeChild(document.getElementById('apa7_functions'));
    
    if(document.getElementById('agps_functions'))
        document.body.removeChild(document.getElementById('agps_functions'));
    
    if(document.getElementById('harvard_functions'))
        document.body.removeChild(document.getElementById('harvard_functions'));
    
    if(document.getElementById('mla_functions'))
        document.body.removeChild(document.getElementById('mla_functions'));
}

function logoutEventByAjax(id)
{
    if(typeof id == "undefined")
        {
            id='logout';
        }
    $("#"+id).click(function(){
        $.ajax({
		type: "GET",
		url: baseUrl+"logout.php",
		data: "type=menu",
		success: function(data){
                    console.log('data: '+data);
                    $('#userLoginDiv').html('');
                    citeCurrentPage();
		}
	});
        
    });
}

function showHideBtns()
{
    if(openListBtn==true)
        {
            $("#saveCitationFileBtn").hide();
            $("#fileSavePromptDiv").hide();
        }
        else
            {
                $("#saveCitationFileBtn").show();
                $("#fileSavePromptDiv").show();
            }
}


$("#registerLink, .registerBtn").click(function(){
   justRegister();
                                
});

function justRegister(glogin,username,email,id)
{
     var gLoginFlag='';
    var gUserName='';
    var gEmail='';
    var gId='';
    if(typeof glogin != "undefined")
        {
            gUserName=username.replace(/\s+/g,"&nbsp;");
            gEmail=email;
            gId=id;
        }
    /*if($('#registerPanel-inner').html()!="")
        {
            $('#login_panel').hide();
            $('#login_register_panel').hide();
                                                     $('#registerPanel').show();
        }*/
        //else{
        console.log(baseUrl+'register_ext.php?chrome_ext=yes&g_id='+gId+'&g_email='+gEmail+'&g_user='+gUserName+'&ms='+new Date().getTime());
        
                $.ajax({
                                             url: baseUrl+'register_ext.php?chrome_ext=yes&g_id='+gId+'&g_email='+gEmail+'&g_user='+gUserName+'&ms='+new Date().getTime(),						
                                             success: function(data) {
                                                 
                                                 //console.log(data);
                                                     //if (data.status === 'ok') {
                                                     // populate the visible area
                                                     $('#login_panel').hide();
                                                     $('#login_register_panel').hide();
                                                     $('#registerPanel').show();
                                                     $('#registerPanel-inner').html(data);
                                                     $('#gregister').click(function(){
                                                         interactiveSignIn();
                                                     })
                                                     $("#registerBtn").click(function(){
                                                        registerByAjax('register_ext.php?ms='+new Date().getTime(),'sitelokfbregisteruser','','pProfileRegister','afterRegister',''); 
                                                     });
                                                        $("#loginLink").click(function(){
                                                        $('#login_panel').show();
                                                        $('#registerPanel').hide();
                                                    });                                                     
                                                     $("#subscription-fee-link").click(function(){
                                                         openSubscriptionPage();
                                                     })
                                             }
                });
        //}
}



$("#style-worldcat").click(function(){
    $("#expired_panel").hide();
    $("#subscribeDiv").hide();
    $("#libForm").hide();
        $("#citePart").show();
    if(document.getElementById('style-worldcat').checked==true)
        {
            showWorldcatSearchResults();
        }
    else
            {
                $("#worldcat-searchdiv").hide();
                citeCurrentPage();
            }
})

function showWorldcatSearchResults()
{
    
            $("#result-wrapper").hide();
            hideAllDiv();
                $('#spinner').show(0, function () {
                    
                    $.ajax({
                                                url: baseUrl+'api/citeweb/wordcatform.php?ms='+new Date().getTime()+'&form=website&style=apa7',						
                                                success: function(data) {
                                                    $('#spinner').hide(0, function () {
                                                                $('#worldcat-searchdiv').fadeIn('slow');
                                                        });
                                                    $("#worldcat-searchdiv-inner").html(data);
                                                    $("#drpSearch1").click(function(){
                                                       showHideWCAuAlrt(); 
                                                    });
                                                     $('#worldcatsearchBtn').click(function(){
                                                                getCitation(0); 
                                                             });
                                                             $("#worldcatsaveBtn").click(function(){
                                                                 SaveSearch();
                                                             });
                                                     $("#wcClearBtn").click(function(){
                                                        clearWcPanel(); 
                                                     });        
                                                             
                                                     $(".libSearchChk").click(function(){
                                                        setLibSearchChk($(this).attr('id')); 
                                                     });        
                                                }
                    });
                    });
        
        

}

function hideAllDiv()
{
    $('#result-wrapper').hide(0); // hide existing citation
	$('#failed-wrapper').hide(0); // hide any error messages too
        $("#saveFileDiv").hide();
        $("#login_panel").hide();
        $("#openedCitation").hide();
        $('#registerPanel').hide();
}


function openEmailPopup(){
    
                    if(document.getElementById('emailAddr1ext') && document.getElementById('sleml'))
                    document.getElementById('emailAddr1ext').value=document.getElementById('sleml').value;

	

	

	

		var popID = 'emailSec1ext'; //Get Popup Name

	

		//Pull Query & Variables from href URL


		var popWidth = 370; //Gets the first query string value

	

		//Fade in the Popup and add close button

		$('#' + popID).fadeIn().css({ 'width': Number( popWidth ) }).prepend('<a href="#" class="close" style="opacity:1"><img src="images/close_pop.gif" class="btn_close" title="Close Window" alt="Close" /></a>');

	

		//Define margin for center alignment (vertical   horizontal) - we add 80px to the height/width to accomodate for the padding  and border width defined in the css

		var popMargTop = ($('#' + popID).height() + 80) / 2;

		var popMargLeft = ($('#' + popID).width() + 80) / 2;

	

		//Apply Margin to Popup

		$('#' + popID).css({

			'margin-top' : -popMargTop,

			'margin-left' : -popMargLeft

		});

	

		//Fade in Background

		$('body').append('<div id="fade"></div>'); //Add the fade layer to bottom of the body tag.

		$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn(); //Fade in the fade layer - .css({'filter' : 'alpha(opacity=80)'}) is used to fix the IE Bug on fading transparencies 

               
               $('a.close, #fade').click(function() { //When clicking on the close or fade layer...

                        $("#emailSec1ext").hide();

                        return false;

                });
		return false;

	

	}
        
               $("#sendEmailBtnext").click(function(){
                   
                   if(wcEmail==true)
                       {
                           var val=$('input[name=1234chkResultsWCS]:checked').val();
                           email1ext('TD'+val);
                       }
                       else
                           {
                               email1ext('bookPanel');
                           }
                                                            });
                                                            
function email1ext(id)
{
	  var section=getSectionName();
	  
	
	  	var content="";
        
		var	content1 = getText(id);
                        var re = new RegExp(String.fromCharCode(160), "g");
                content1=content1.replace(re, " ");
                content1=content1.replace(/&amp;/g , "||");                
                content1=content1.replace(/#/g , "~`~");
		content1=content1.replace(/&/g , "````");
                content1=content1.replace(/%20/g , "``");
			content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'>"+content1+"</div><br />"; 
			content=content+content1;
	

		
	var txtToEmail="<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
	txtToEmail = removeNewLine(txtToEmail);
        console.log(txtToEmail);
	var emailAddr1 = document.getElementById('emailAddr1ext').value;
	
	if(echeck(emailAddr1))
	{
        var lngth = txtToEmail.length;
		
        document.getElementById('emailedData5ext').value = txtToEmail;
	$.ajax({
               type: 'GET',
		   url: base_url+ 'students/scripts/phpMailer.php',
               data: "html="+txtToEmail+"&emailAddr1="+emailAddr1+"&set=email1&chrome_ext=yes&format="+section+"&time="+new Date().toString().substring(4,28),
		   success: function(data){
   				if(data =='An error has occured.' )
					{
                                jAlertMod("An error has occured, please report this to the website administrator.","Failure","&nbsp;OK&nbsp;",null);
					}
					else
				if(data =='success' )

					{
					  jAlertMod("Your CiteMaker citations have been e-mailed.","Success","&nbsp;OK&nbsp;",null);					
					  $('#fade , .popup_block').fadeOut(function() {
							$('#fade, a.close').remove();  //fade them both out
						});
					}
			}					
		
	      });


	}
	return false;
	
}

function getCitation(p)
{
	secName = getSectionName();
        var mt=$("#mt").val();
        
	$('#main').html('');
	strData = "chrome_ext=yes&secName=apa7&p=" + p + "&txtSearch1="+jQuery("#txtSearch1").val() + "&drpSearch1="+jQuery("#drpSearch1").val()+"&mt="+mt;
	jQuery("#main").html("<center><img src='images/loading_bar.gif' align='center'></center>");
        
        var searchUrl="worldcat.php";
        if(document.getElementById('openLibraryChk') && document.getElementById('openLibraryChk').checked==true)
        {
           searchUrl="openlibrary.php"; 
        }
        else if(document.getElementById('googleBookChk') && document.getElementById('googleBookChk').checked==true)
        {
           searchUrl="googlebook.php"; 
        }
        
	jQuery.ajax({
		type: "GET",
		url: base_url+searchUrl,
		data: strData,
		success: function(msg){
			//alert(msg);
                        if(msg!="searchcriteria")
                            {
                                jQuery("#main").html(msg);
                            }
                            else
                                {
                                    jQuery("#main").html('');
                                    jAlertMod1('Please enter search criteria',"Alert","&nbsp;OK&nbsp;",null);
                                }
                        $(".wcpn").click(function(){
                           getCitation($(this).data('pn')); 
                        });
                        $("input[name='1234chkResultsWCS']").click(function(){
                            locateNear($(this).val());
                        });
                        $("#worldcatsaveBtn").show();
                        $("#saveIcnWc").click(function()
                        {
                            SaveSearch();
                        });
                        $("#editBtnWc").click(function(){
                            editWCSearch();
                        });
                        $("#copyBtnWc").click(function(){
                            var val=$('input[name=1234chkResultsWCS]:checked').val();
                            if(typeof val !="undefined" && val!="undefined" && val!="")
                                {
                                    executeCopy3('TD'+val);
                                }
                        else
                            {
                                jAlertMod1('Click Citation to proceed with your request',"Alert","&nbsp;OK&nbsp;",null);
                            }
                            
                        });
                        $("#emaiIconWC").click(function(){
                            var val=$('input[name=1234chkResultsWCS]:checked').val();
                            if(typeof val !="undefined" && val!="undefined" && val!="")
                                {
                                    wcEmail=true;
                                    openEmailPopup();
                                }
                        else
                            {
                                jAlertMod1('Click Citation to proceed with your request',"Alert","&nbsp;OK&nbsp;",null);
                            }
                            
                        });
                                                             
		}
	});
	return false;
}

function getText(srcPnlID)
{
	 	//MI_15_march_13
		/*if(document.getElementById('author').value== "")
		{
			document.getElementById('CiteYear').innerHTML="";
		}*/
		var content="";
            var found;
            if(wcEmail==false)
                    found= $("#"+srcPnlID).find("span");
                else
                    found = $("#"+srcPnlID).find("p");
				//alert(found.length);
				//alert($("#"+srcPnlID).html());
                    //alert(found);                
                if(found.length >0)
                {					
                    for( i=0; i < found.length; i++){	
                        /*if ($(found[i]).attr('id') == 'CiteTitle' && $.trim(removeNewLine($(found[i]).text()))!= "")*/
                        $(found[i]).html($(found[i]).html().replace(/\<i\>/g,"^i^").replace(/\<\/i\>/g,"^ii^"));
                        if ($(found[i]).css('font-style') == 'italic' && $.trim(removeNewLine($(found[i]).text()))!= "")
						{
                            content=content+"^i^"+ removeNewLine($(found[i]).text())+"^ii^";
							//content=content.replace(",","");
							
                        }
						else if ($(found[i]).attr('id')=='VirCiteAuthor' || $(found[i]).attr('id')=='VirCiteEditor') {
							//do nothing
						}
						else {
							content=content+removeNewLine($(found[i]).text());
						}
                                                $(found[i]).html($(found[i]).html().replace(/\^i\^/g,"<i>").replace(/\^ii\^/g,"</i>"));
						//alert($(found[2]).text());
				     }
					 
                }
            content=$.trim(removeNewLine(content));
			var count_i = content.split("^i^");
			for(var i=0; i<count_i.length;i++){
			content=content.replace("^i^", "<i>");
            content=content.replace("^ii^", "</i>");
			}
			return content;

 

}

function openSubscriptionPage()
{
    
    $.ajax({
               type: 'GET',
		   url: base_url+ 'subscribe.php',
               data: "chrome_ext=yes&ms="+new Date().toString().substring(4,28),
		   success: function(data){
                       $("#subscribeDiv").show();
                             $("#registerPanel").hide();
   				$("#subscribeDiv-inner").html(data);
                                $("#subscBtn1").click(function(){
                                    checkform('frm1');
                                });
                                $("#subscBtn2").click(function(){
                                    checkform('frm2');
                                });
                                $("#subscBtn3").click(function(){
                                    checkform('frm3');
                                });
                                $("#subscBtn4").click(function(){
                                    checkform('frm4');
                                });
			}					
		
	      });
}

function checkform(frmid){

	if($('#subscriber_email').val() == ''){

		jAlertMod('Please enter valid Email address',"Alert","&nbsp;OK&nbsp;",null);

		return false;

	}else if(!echeck($('#subscriber_email').val())){

		return false;

	}else{

		  $.ajax({

		  type: 'GET',

		  url: base_url+'ajax.php',

		  data: "type=CheckUser&user="+$('#subscriber_email').val(),

		  success: function(data){

			  //alert(data);

			  if(data=='This Email Already in System. Please try different Email.'){

				  jAlertMod(data,"Alert","&nbsp;OK&nbsp;",null);

				  return false;

			  }else{

				  myForm = document.forms[frmid];

				  joinvar =  $('#subscriber_email').val()+$('#customvars').val();

				  myForm.custom.value=joinvar;

				  myForm.submit();

					return true;

			  }

		  }

		});

	return false;  

	}

}

function showBottomLogin()
{
    $("#btmLoginCnt").html('<a id="bottomLogin" href="#">Login</a>');
    $("#bottomLogin").click(function(){
        $("#login_register_panel").show();
        hideAllDiv();
    });
}

function showBottomLogout()
{
    $("#btmLoginCnt").html('<a id="bottomLogout" href="#">Logout</a>');
    logoutEventByAjax('bottomLogout');
}
