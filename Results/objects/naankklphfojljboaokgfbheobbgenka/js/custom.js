function checkLikeRadio(elem) {
        var group = document.styles.styleGrp;
		for (var i=0; i<group.length; i++) {
            if (group[i] != elem) {
                group[i].checked = false;
            }
        }
        elem.checked=true;
}
//



function checkLikeRadio1(elem) {
        var group = document.formMenu.forms;
		for (var i=0; i<group.length; i++) {
            if (group[i] != elem) {
                group[i].checked = false;
            }
        }
        elem.checked=true;
}

function checkFileLikeRadio(elem) {
        $("input[name='chk']").prop('checked', false);
		
        
        elem.checked=true;
}

function validatelogin(form)
{
  if (document.siteloklogin.username.value=="")
  {
   jAlertMod1("Please enter your username","Alert","&amp;nbsp;OK&amp;nbsp;",null);    document.siteloklogin.username.focus()
    return(false)
  }
  if (document.siteloklogin.password.value=="")
  {
   jAlertMod1("Please enter your password","Alert","&amp;nbsp;OK&amp;nbsp;",null);    document.siteloklogin.password.focus()
    return(false)
  }
  var LoginType="NORMAL";
  if (LoginType=="NORMAL")
    return(true);
  document.siteloklogin.sitelokhash.value=MD5(document.siteloklogin.password.value+document.siteloklogin.loginkey.value)
  document.siteloklogin.password.value="********"
  return(true)
}


$("#login").click(function(){
    doLogin(); 
});


function executeCopy(text) {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
}

// Copy HTML as text (without HTML tags)
function executeCopy2() {
    $("#myCopySpan").html($('#bookPanel').html());
    var s=window.getSelection();
    s.removeAllRanges();
    var element=document.getElementById('myCopySpan');
    var r = document.createRange();
    r.selectNode(element);
    s.addRange(r);
    document.execCommand('copy');
    s.removeAllRanges();
    $("#myCopySpan").html('');
}

function executeCopy3(id) {
    var s = window.getSelection();
        s.removeAllRanges();
    var element=document.getElementById(id);
    var r = document.createRange();
    r.selectNode(element);
    s.addRange(r);
    document.execCommand('copy');
    s.removeAllRanges();
}

$("#cancelLogin").click(function(){
    $('#login_register_panel').show(); // hide existing citation
        $("#login_panel").hide();
});

$(".fileSaveCancel").click(function(){
    $("#saveFileDiv").hide();
    $("#fileListDiv").hide();
    citeCurrentPage();
});

$("#openSavedCiteBtn").click(function(){
    $("#saveCitationFileBtn").hide();
    $("#backBtn").show();
    showSavedCitations();
    
})

$("#backBtn").click(function(){
    $("#fileSaveContainer").show();
        $("#openedCitation").hide();
        if(folderBtnFlag==false)
            {
                $("#saveCitationFileBtn").show();
            }
        $("#openSavedCiteBtn").show();
        $("#backBtn").hide();
        $("#copyBtnBtm").hide();
        $("#emailBtn").hide();
        $("#deleteBtn").hide();
});

$("#copyBtnBtm").click(function(){
    var n = $('.deletecitationbody:checked').length;
    if(n>0) {
            var content="";
            var s = window.getSelection();
s.removeAllRanges();
            $('.deletecitationbody:checked').parent().each(function(index){
                    //$('#c8Content .citation').each(function(index)
                    //{
                    //content=content+$.trim($(this).text())+"\r\n \r\n";
                    content+="<div>"+$(this).children("span").html()+"</div>";
                    
                    

//document.execCommand('copy');
                    //});
            });
            $("#myCopySpan").html(content);
            var element=document.getElementById("myCopySpan");
            var r = document.createRange();
r.selectNode(element);

s.addRange(r);
            document.execCommand('copy');
            s.removeAllRanges();
            $("#myCopySpan").html("");
            //executeCopy(content);
    }else{
                    if($('.deletecitationbody:checked').length <= 0){
                                    jAlertMod("<center>Click the checkbox alongside citations before using Copy.</center>","Alert","&nbsp;OK&nbsp;",null);
                    }
            
            return false;
    }
});


	
        
        $('#emailBtn').click(function() {
    
                    if(document.getElementById('emailAddr4') && document.getElementById('sleml'))
                    document.getElementById('emailAddr4').value=document.getElementById('sleml').value;

	var n = $('.deletecitationbody:checked').length;

	if(n>0) {

	

		var popID = 'emailSec4'; //Get Popup Name

	

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

                        $("#emailSec4").hide();
                        return false;

                });

		return false;

	}

	else{

		jAlertMod("<center>Click the checkbox alongside citations before using Email.</center>","Alert","&nbsp;OK&nbsp;",null);

		return false;

	}}

	);
        
       $("#deleteBtn").click(function()
       {
          DeleteSelectedfromDB(); 
       });
       

                                                            
$(".closeWCBtn").click(function(){
    $("#style-worldcat").prop('checked', false);
    $("#style-apa7").prop('checked', true);
    $("#worldcat-searchdiv").hide();
                citeCurrentPage();
});

$("#closeExpBtn").click(function(){
    $("#expired_panel").hide();
    $("#result-wrapper").show();
})
                                                            
$("#closeSubscribeBtn").click(function(){
    $("#subscribeDiv").hide();
    $("#registerPanel").show();
})

$("#cancelRegister").click(function(){
                                                         $('#login_register_panel').show();
                                                         $('#registerPanel').hide();
                                                     });
$("#cancelLoginRegister").click(function(){
    $("#login_register_panel").hide();
    $("#style-worldcat").prop('checked', false);
                citeCurrentPage();
})

 $(".loginBtn").click(function(){
        $('#login_panel').show();
        $('#login_register_panel').hide();
    }); 
    
    $(".addFldr").click(function(){
        addFolderPopup();
    });
    
    $(".backToFlLst").click(function(){
        backToFlList();
    });
    
    $("#saveFolderBtn").click(function(){
       saveSubFolder(); 
    });
    $("#deleteBtnFo").click(function(){
        DeleteSelectedfromDBFolder();
    });
    
    $("#openBtnFo").click(function(){
       openSubjectPanel(); 
    });
    
    $("#saveAsFo").click(function(){
        var n = $('#fileListDiv .opencitationbody:checked').length;


	  if(n>0){
              $("#fileListDiv").hide();
                $("#saveAsFolderDiv").show();
	}	

	else

	{jAlertMod("Click the checkbox alongside citations before using Save As functionality.","Alert","&nbsp;OK&nbsp;",null);}
      
    });
    
    $("#duplicateFolderBtn").click(function(){
        saveAsSubFolder();
    });
    
    $("#deleteBtnFl").click(function(){
        DeleteSelectedfromDBFile();
    });
    
    
    
    $("#saveAsFl").click(function(){
        
        duplicateCitation2();
    });
    
    $("#duplicatFileBtn").click(function(){
       saveDuplicateCitation2(); 
    });
    
    $("#saveCitationFileBtn").click(function(){
       saveSubFile(); 
    });
    
    $("#saveAsCtBtn").click(function(){
        duplicateCitation();
    });
    
    $("#duplicatCitaBtn").click(function(){
        
        saveDuplicateCitation();
    });
    
    function backToFlList()
    {
        $("#fileListDiv").show();
        $("#createFolderDiv").hide();
        $("#saveAsFolderDiv").hide();
        $("#openedCitation").hide();
        $("#saveAsFileDiv").hide();
        $("#saveAsCitDiv").hide();
    }
    
    $("#duplicatCitaCancel").click(function(){
        $("#openedCitation").show();
        $("#saveAsCitDiv").hide();
    });
    
   $("#saveBtnFoot").click(function(){
    openListBtn=false;
    buttonClicked='saveBtn';
    showHideBtns()
formPanelSave=true;
saveMyCiteBottom=true;
saveCitationstoDB2(); 
});

$("#libEnquiries").click(function(){
    $("#citePart").hide();
    $("#libForm").show();
});

$(".closeLibBtn").click(function(){
    $("#citePart").show();
    $("#libForm").hide();
});

$("#libFormSubmit").click(function(){
    submitLibForm();
});

$("#cmTablet").click(function(){
    $("#cmTablet").prop('checked', false);
    openTabletSite(base_url+'tablet/apa7/');
});

$("#forgotPwd").click(function(){
   forgotpw(); 
});

function showHideSubDiv(div1,span1)
{
    var plusMinus=$("#"+span1).html();
    $(".subCitation").hide();
    $(".spanPlus").html("+");
    if(plusMinus=="-")
        {
            $("#"+span1).html("+");
        }
        else
            {
                $("#"+span1).html("-");
                $("#"+div1).show();
            }
}

function setFileFolderBtnEvnts()
{
    $(".opnct").click(function(){
               ShowButtonsSubFolder(); 
            });
            $(".opnct1").click(function()
            {
                ShowButtons();
            });
            $(".plusminus").click(function(){
                var subId=$(this).attr('subid');
                if(typeof subId == "undefined")
                    subId='';
                showHideSubDiv('subDiv'+subId,'subplus'+subId);
            });
            
            $(".flPlus").click(function(){
                var fileid=$(this).attr('fileid');
                OpenCitations1("",fileid); 
            });
		var $unique = $('input.opencitationbody');
		$unique.click(function() {
		$unique.filter(':checked').not(this).removeAttr('checked');
	});
}