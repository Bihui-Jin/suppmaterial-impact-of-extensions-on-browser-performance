var numOfAuthors = 2;
var numOfEditors = 2;
var numOfProducers = 2;
var numOfRevAuthors = 2;
var numOfTrans = 2;

var clip11 = null;
var clip22 = null;
var capitalizeTitleFlg=false;
var copyToPg = false;
var pSvd = "";
var noAuthorFlg = false;
var placeFlg = false;
var yearFlg = false;
var dateFlg = false; //MIS_19_Apr_'13
var httpFlg = false;
var internetFlg = false;
var reviewFlg = false;
var webpgFlg = false;
var govFlg = false;
//var govNoPlcFlg = false;
var newsFlg = false;
var bookFlg = false;
var refFlg = false;
var mapFlg = false;
var posterFlg = false;
var lectureFlg = false;
var singleAuthor = true;
var noInOnFlg = false;
var outsidehttpFlg=false;
document.retain = false;



var classWrap="form-group";
var labelCol="col-xs-4";
var inputCol='col-xs-8';

    
    var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var currentAuthorNo;
var dotInsertFlg=false;

var srcSec = '<span id="CiteAuthor" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="VirCiteAuthor"></span><span id="CiteProducer" style="visibility: hidden;"></span><span id="VirCiteProducer"></span><span id="CiteProd"></span><span id="CiteYear" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteDate"></span><span id="CiteChapter" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteIOn" style="visibility:hidden; position:absolute; top:0; left:-100"></span>   <i><span id="CiteTitle" style="visibility:hidden; position:absolute; top:0; left:-100"></span></i><span id="CiteEdition" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteVolume" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteIssue" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CitePage" style="visibility:hidden; position:absolute; top:0; left:-100"></span><i><span id="CiteSubject" style="visibility:hidden; position:absolute; top:0; left:-100"></span></i><span id="CiteDescriptor" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteEditor" style="visibility: hidden;"></span><span id="VirCiteEditor"></span><span id="CiteEd"></span><span id="CiteSource" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteCity" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteRecord"></span><span id="CiteObserved"></span><span id="CitePlace"></span><span id="CitePublisher" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteAccessed" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CitePublication" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteHttp" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteRevOpen"></span><span id="CiteRevClose"></span><span id="CiteOriginalYear"></span>';

var bookPanelArr = new Array("CiteAuthor","VirCiteAuthor","CiteYear","CiteDate","CiteChapter","CiteIOn","CiteEditor","VirCiteEditor","CiteEd","CiteTitle","CiteDescriptor","CiteSubject","CiteTrans","VirCiteTrans","CiteTra","CiteEdition","CiteIssue","CiteVolume","CitePage","CitePlace","CitePublisher","CiteAccessed","CitePublication","CiteHttp","CiteProducer","VirCiteProducer","CiteProd","CiteRevAuthor","VirCiteRevAuthor","CiteRevAuth","CiteRecord","CiteSource","CiteCity","CiteRole","CiteRevOpen","CiteRevClose","CiteObserved","citeFormat","CiteCommaStart","CiteCommaEnd","CiteAuth","CiteOriginalYear");
var copyArr = bookPanelArr;

function Reset(srcSecVar)
{
    numOfAuthors = 2;
    numOfEditors = 2;
    numOfProducers = 2;
    numOfRevAuthors = 2;
    numOfTrans = 2;

    noAuthorFlg = false;
    if(document.getElementById('emailSec'))
        document.getElementById('emailSec').style.display = "none";
    ask4Save();
    placeFlg = false;
    yearFlg = false;
	dateFlg = false; //MIS_19_Apr_'13
    httpFlg = false;
    internetFlg = false;
    webpgFlg = false;
    reviewFlg = false;
    //journalPageFlg = false;
    newsFlg=false;
    //govNoPlcFlg = false;
    //elecPlcFlg = false;
    bookFlg = false;
    refFlg = false;
    mapFlg = false;
    //    document.getElementById('CiteAuthor').style.fontStyle = "normal";

    if(typeof srcSecVar != "undefined")
    {	
        setSrcSec(srcSecVar);
    }
//return true;
}



//set srcSec
function setSrcSec(srcSecVar)
{
	var tmpSrc = "";

    for(var i=0;i<srcSecVar.length;i++)
    {
        var index = srcSecVar[i];
		var tmp = '';
        if(bookPanelArr[index] == "VirCiteAuthor" || bookPanelArr[index] == "VirCiteEditor" ||
            bookPanelArr[index] == "VirCiteTrans" || bookPanelArr[index] == "VirCiteRevAuthor" ||
            bookPanelArr[index] == "VirCiteProducer" || bookPanelArr[index] == "CiteEd" || bookPanelArr[index] == "CiteAuth" ||
            bookPanelArr[index] == "CiteProd" || bookPanelArr[index] == "CiteTra" ||
            bookPanelArr[index] == "CiteRevAuth")
            tmp = '<span id="' + bookPanelArr[index] + '"></span>';

        else  if(bookPanelArr[index] == "CiteVolume")
            tmp = '<i><span id="' + bookPanelArr[index] + '"></span></i>';

        else
			tmp = '<span id="' + bookPanelArr[index] + '" style="visibility:hidden; position:absolute; top:0; left:-100"></span>';

        tmpSrc = tmpSrc + tmp;
    }
    document.getElementById("bookPanel").innerHTML = tmpSrc;
    //alert(tmpSrc);
    srcSec = "";
    srcSec = tmpSrc;
}
//Add New Review Author
function addNewRevAuthor(secRef , panelArr , tab , performer)
{
    if(document.getElementById('revauthor').value == "")
    {
	//do nothing
	return false;
    }
    var tmpValArr = new Array();
    var tmpVar = "";
    var titlName = "author";
    var myTitle = " writ."
    if (typeof performer != "undefined")
    {
        titlName = performer;
		if(performer == "artist")
            myTitle = "";
		else if(performer == "director")
            myTitle = " (Directors).";
    }
    
    var placeholder='';
    if(getFormName()=="creativeReview")
        {
            placeholder='b '+performer;
        }
    
    for (var j = 2; j < numOfRevAuthors; j++)
    {
        tmpVar = 'revauthor'+j;
        tmpValArr[j] = document.getElementById(tmpVar).value;
        if(tmpValArr[j]== "")
	{
		return false; //do nothing
       }
    }
    
    var tabVal = tab;
    var authors =  document.getElementById(secRef).innerHTML;
    var formatNum;
    var hint = "";


    if(numOfRevAuthors == 2 )
    {
        formatNum = numOfRevAuthors + 'nd';
    //hint = '<a href="#" class="hintanchor" onmouseover="showhint(\'Insert and before the last author.\', this, event, \'150px\')">[?]</a>';
    }
    else if(numOfRevAuthors == 3 )
        formatNum = numOfRevAuthors + 'rd';
    else
        formatNum = numOfRevAuthors + 'th';
    
    
		if(document.istablet5){
                    
			authors = authors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" placeholder="'+placeholder+'" value="" id="revauthor'+numOfRevAuthors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'revauthor'+numOfRevAuthors+'\',\'CiteRevAuthor'+numOfRevAuthors+'\');"/>'+hint+'</div></div>';

		}else{
			authors = authors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="revauthor'+numOfRevAuthors+'" placeholder="'+placeholder+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'revauthor'+numOfRevAuthors+'\',\'CiteRevAuthor'+numOfRevAuthors+'\');"/>'+hint+'<br/>';
		}
    document.getElementById(secRef).innerHTML = authors;

    if(getFormName()!="creativeReview")
    {
        setInnerText("CiteRevAuth", myTitle);
    }

    
    for (var k = 2; k < numOfRevAuthors; k++)
    {
        tmpVar = 'revauthor'+k;
        document.getElementById(tmpVar).value = tmpValArr[k];
    }
    

    var tmpArr;
    tmpArr = getArr(panelArr);
    tmpArr.push("CiteRevAuthor" + numOfRevAuthors);
    tmpArr.push("CiteAndRA" + numOfRevAuthors);
    tmpArr.push("CiteCommaRA" + numOfRevAuthors);

    //add new span to the piew panel
    var newSpan = document.getElementById("VirCiteRevAuthor").innerHTML;
    newSpan = newSpan + '<span id="CiteCommaRA'+numOfRevAuthors+'"></span><span id="CiteAndRA'+numOfRevAuthors+'"></span><span id="CiteRevAuthor'+numOfRevAuthors+'"></span>';
    document.getElementById("VirCiteRevAuthor").innerHTML = newSpan;

    tabVal += 1;
    numOfRevAuthors += 1;
}

//Add New Translator
function addNewTrans(secRef , panelArr , tab , performer)
{
    if(document.getElementById('trans').value == "")
    {
	//do nothing
	return false;
    }	
    var tmpValArr = new Array();
    var tmpVar = "";
    var titlName = "translator";
    var myTitle = ", Trans.).";
    if (typeof performer != "undefined")
    {
        titlName = performer;
    }
    
    for (var j = 2; j < numOfTrans; j++)
    {
        tmpVar = 'trans'+j;
        tmpValArr[j] = document.getElementById(tmpVar).value;
	  if(tmpValArr[j]== "")
        {
        return false; //do nothing
	  } 
    }
    /*
   @end
@*/
    var tabVal = tab;
    var authors =  document.getElementById(secRef).innerHTML;
    var formatNum;
    var hint = "";


    if(numOfTrans == 2 )
    {
        formatNum = numOfTrans + 'nd';
    //hint = '<a href="#" class="hintanchor" onmouseover="showhint(\'Insert and before the last author.\', this, event, \'150px\')">[?]</a>';
    }
    else if(numOfTrans == 3 )
        formatNum = numOfTrans + 'rd';
    else
        formatNum = numOfTrans + 'th';
		if(document.istablet5){
                    
                    
			authors = authors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="trans'+numOfTrans+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'trans'+numOfTrans+'\',\'CiteTrans'+numOfTrans+'\');" placeholder="b '+titlName+'"/>'+hint+'</div></div>';
		}else{
			authors = authors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="trans'+numOfTrans+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'trans'+numOfTrans+'\',\'CiteTrans'+numOfTrans+'\');" placeholder="b '+titlName+'"/>'+hint+'<br/>';
		}
    document.getElementById(secRef).innerHTML = authors;

    setInnerText("CiteTra", myTitle);

    
    for (var k = 2; k < numOfTrans; k++)
    {
        tmpVar = 'trans'+k;
        document.getElementById(tmpVar).value = tmpValArr[k];
    }
    

    var tmpArr;
    tmpArr = getArr(panelArr);
    tmpArr.push("CiteTrans" + numOfTrans);
    tmpArr.push("CiteAndTRA" + numOfTrans);
    tmpArr.push("CiteCommaTRA" + numOfTrans);

    //add new span to the piew panel
    var newSpan = document.getElementById("VirCiteTrans").innerHTML;
    newSpan = newSpan + '<span id="CiteCommaTRA'+numOfTrans+'"></span><span id="CiteAndTRA'+numOfTrans+'"></span><span id="CiteTrans'+numOfTrans+'"></span>';
    document.getElementById("VirCiteTrans").innerHTML = newSpan;


    tabVal += 1;
    numOfTrans += 1;
}

//Add New Author
function addNewAuthor(secRef , panelArr , tab , performer)
{
	
	if(document.getElementById('author').value == "")
	{
		//do nothing
	}
	else
	{
		singleAuthor = false;
		var tmpValArr = new Array();
		var tmpVar = "";
		var titlName = "author";
    if (typeof performer != "undefined")
    {
        titlName = performer;
    }
    var myTitle='';
    if(performer == "Cartographer")
            myTitle = " (Cartographers). ";
    /*if(getFormName()=="DigitalDVD")
        {
            titlName="producer";
        }*/
        if(performer=="interviewer")
            {
                titlName="interviewer";
            }
        //LC03052015
  	//jAlertMod1('APA formats personal '+titlName+'s as Last Name + First Name Initial(s)<br/><br/>Enter a space between characters for authors with multiple initials<br/><br/>Follow this format when entering personal author name details.','Alert','&nbsp;OK&nbsp;',null);
        
                var authorLimit=50;
            
    if(numOfAuthors<authorLimit)
    {
        for (var j = 2; j < numOfAuthors; j++)
        {
            tmpVar = 'author'+j;
		tmpValArr[j] = document.getElementById(tmpVar).value;
		if (tmpValArr[j] == "")
		{
		//do nothing
		return false;
		}
        }
		alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        var tabVal = tab;
        var authors =  document.getElementById(secRef).innerHTML;
        var formatNum;
        var hint = "";
        if($("#CiteAuth").html()=="")
        {
            setInnerText("CiteAuth", myTitle);
        }
        if(numOfAuthors == 2)
            formatNum = numOfAuthors + 'nd';
        else if(numOfAuthors == 3 )
            formatNum = numOfAuthors + 'rd';
        else
            formatNum = numOfAuthors + 'th';
        
        var authcnt=numOfAuthors;
		authors = authors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="author'+numOfAuthors+'" tabindex="'+tabVal+'" data-div="CiteAuthor'+numOfAuthors+'" placeholder="'+titlName+' '+alphabet[numOfAuthors-1]+'"/>'+hint+'</div></div>';			
		
        document.getElementById(secRef).innerHTML = authors;
        for (var k = 2; k < numOfAuthors; k++)
        {
            tmpVar = 'author'+k;
            document.getElementById(tmpVar).value = tmpValArr[k];
        }

        var tmpArr;
        tmpArr = getArr(panelArr);
        tmpArr.push("CiteAuthor" + numOfAuthors);
        tmpArr.push("CiteAndA" + numOfAuthors);
        tmpArr.push("CiteCommaA" + numOfAuthors);
		
		//alert("t "+ panelArr);
		//add new span to the piew panel
        var newSpan = document.getElementById("VirCiteAuthor").innerHTML;
        newSpan = newSpan + '<span id="CiteCommaA'+numOfAuthors+'"></span><span id="CiteAndA'+numOfAuthors+'"></span><span id="CiteAuthor'+numOfAuthors+'"></span><span id="CiteEnd'+numOfAuthors+'"></span>';
        document.getElementById("VirCiteAuthor").innerHTML = newSpan;
		
        tabVal += 1;
        numOfAuthors += 1;
    }
    else if(numOfAuthors == authorLimit)
    {
			
		 for (var j = 2; j < numOfAuthors; j++)
		 { 
			  tmpVar = 'author'+j;
			tmpValArr[j] = document.getElementById(tmpVar).value;
			if (tmpValArr[j] == "")
			{
				//do nothing
				return false;
			}
		 }

                 if(typeof document.wcAuthorExFlg != "undefined" && document.wcAuthorExFlg==true)
                 {
                    var tabVal = tab;
                    var authors =  document.getElementById(secRef).innerHTML;
                    var formatNum;
                    var hint = "";

                            formatNum = 'Last ';
                            authors=addField(authors,formatNum,titlName,numOfAuthors,tabVal,tmpValArr,secRef,hint,alphabet);
                            var tmpArr;
                    tmpArr = getArr(panelArr);
                    tmpArr.push("CiteAuthor" + numOfAuthors);
                    tmpArr.push("CiteAndA" + numOfAuthors);
                    tmpArr.push("CiteCommaA" + numOfAuthors);
                    tabVal += 1;
                    numOfAuthors += 1;
                    document.wcAuthorExFlg=false;
                 }
                 else
                 {
		jConfirmMod2("<center>For more than 7 authors only the first 6 and the last are recorded in the main citation.</center>","Alert","&nbsp;Cancel&nbsp;","&nbsp;Add&nbsp;",function(a1) {
				if(a1){
					
                                        setInText('','',true);
				}
				else
				{ 
					//document.getElementById("VirCiteAuthor").innerHTML=  "<span> et al.</span>"; 
					
                                        
                                        var tabVal = tab;
					var authors =  document.getElementById(secRef).innerHTML;
					var formatNum;
					var hint = "";
				   
						formatNum = 'Last ';
                                                authors=addField(authors,formatNum,titlName,numOfAuthors,tabVal,tmpValArr,secRef,hint,alphabet);
                                                var tmpArr;
					tmpArr = getArr(panelArr);
					tmpArr.push("CiteAuthor" + numOfAuthors);
					tmpArr.push("CiteAndA" + numOfAuthors);
					tmpArr.push("CiteCommaA" + numOfAuthors);
					tabVal += 1;
                                        numOfAuthors += 1;
				}
		});
                 }
        

    }
    else
    {
						
		jAlertMod("<center>For more than 7 authors only the first 6 and the last are recorded in the main citation.</center>","Alert","&nbsp;OK&nbsp;",null);

    }
	 clearGlobalGroup();
        $( '#author'+authcnt ).keyup(function() {
            ReloadTextDiv2('author'+authcnt,'CiteAuthor'+authcnt);
            clearGlobalGroup();
        });
}
}

//Add New Editor
function addNewEditor(secRef , panelArr , tab , director)
{
	
    if(document.getElementById('editor').value == "")
    {
	//do nothing
	return false;
    }
    var tmpValArr = new Array();
    var tmpVar = "";
    var titlName = "editor";
    var myTitle = " (Eds.).";
    var formName=getCleanedFormName();
    if (typeof director != "undefined")
    { 
        titlName = director;
        if(director == "Curator")
            myTitle = " (Curators). ";
        if(director == "director")
            myTitle = " (Directors). ";
        else if(director == "interviewer")
            myTitle = " (Interviewers).";
         else if(director == "interviewee")
            myTitle = " (interviewees).";
        else if(director == "translator")
            myTitle = ", Trans.).";
        else if(director == "narrator")
            {
            //myTitle = ", Narr.).";
            }
        else if(director == "writer")
            myTitle = " writ. ";
		else if(director == "producer"){
            myTitle = "";
		}
		if(director == "Recipient")
            myTitle = " Email to";	
        else if(director == "review")
        {
            titlName = "director";
            if(document.getElementById('author') && document.getElementById('author').value == "")
                myTitle = ", directed by";
            else
                myTitle = " Directed by";
        }
    }
    
    if(getFormName()=="digitalSound")
        {
            myTitle='';
        }
	
  //jAlertMod('Apa formats  '+titlName+'s as Last Name + First Name Initial(s)','Alert','&nbsp;OK&nbsp;',null);
  /*if(director=="director")
      {
          jAlertMod('APA formats personal director as Last Name + First Name Initial(s) <br/><br/>Enter a space between characters for authors with multiple initials<br/><br/>Follow this format when entering personal author name details.','Alert','&nbsp;OK&nbsp;',null)
      }
      else
          {  
              jAlertMod('APA formats editors as First Name Initial(s) + Last Name <br/><br/>Enter a space between characters for editors with multiple initials<br/><br/>Follow this format when entering personal editor name details.','Alert','&nbsp;OK&nbsp;',null);
          }*/ //LC03052015
	      
	if(numOfEditors<9)
	{
		for (var j = 2; j < numOfEditors; j++)
		{
			tmpVar = 'editor'+j;
			tmpValArr[j] = document.getElementById(tmpVar).value;
		  if(tmpValArr[j]=="")
			{
			return false; //do nothing
			}
		}
		
		var tabVal = tab;
		var editors =  document.getElementById(secRef).innerHTML;
		var formatNum;
		var hint = "";

		if(numOfEditors == 2 )
		{
			formatNum = numOfEditors + 'nd';
		//hint = '<a href="#" class="hintanchor" onmouseover="showhint(\'Insert and before the last author.\', this, event, \'150px\')">[?]</a>';
		}
		else if(numOfEditors == 3 )
			formatNum = numOfEditors + 'rd';
		else
			formatNum = numOfEditors + 'th';

		alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		var plchldr=alphabet[numOfEditors-1]+' '+titlName;
		if(getFormName()=="DigitalDVD")
		{
			plchldr=titlName+' '+alphabet[numOfEditors-1];
		}
			if(document.istablet5)
			{
				editors = editors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'</div></div>';
			}
			else
			{
				editors = editors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'<br/>';
			}

		document.getElementById(secRef).innerHTML = editors;
		if(getInTextFormat()!="DigitalInterview" && formName!="review")
                    {
                        if($("#CiteEd").html()=="")
                        {
                                setInnerText("CiteEd", myTitle);
                        }
                    }

		for (var k = 2; k < numOfEditors; k++)
		{
			tmpVar = 'editor'+k;
			// alert(tmpValArr[k]);
			if(document.getElementById(tmpVar)){
				document.getElementById(tmpVar).value = tmpValArr[k];
			}
		}
		/*
	   @end
	@*/

		var tmpArr;
		tmpArr = getArr(panelArr);
		tmpArr.push("CiteEditor" + numOfEditors);
		tmpArr.push("CiteAndE" + numOfEditors);
		tmpArr.push("CiteCommaE" + numOfEditors);

		//add new span to the piew panel
		var newSpan = document.getElementById("VirCiteEditor").innerHTML;
		newSpan = newSpan + '<span id="CiteCommaE'+numOfEditors+'"></span><span id="CiteAndE'+numOfEditors+'"></span><span id="CiteEditor'+numOfEditors+'"></span>';
		
		document.getElementById("VirCiteEditor").innerHTML = newSpan;
		

		tabVal += 1;
		numOfEditors += 1;
	}else if(numOfEditors==9){
		for (var j = 2; j < numOfEditors; j++)
		 { 
			tmpVar = 'editor'+j;
			tmpValArr[j] = document.getElementById(tmpVar).value;
			if (tmpValArr[j] == "")
			{
				//do nothing
				return false;
			}
		 }
		if(document.getElementById('author').value == ""){
			jConfirmMod2("<center>For more than eight (8) editors add the last editor's name. </center><br><center>Only the first 6 editors + last editor will appear in your citation.</center>","Alert","&nbsp;Proceed&nbsp;","&nbsp;Cancel&nbsp;",function(a1) {
				if(a1){
						var tabVal = tab;
						var editors =  document.getElementById(secRef).innerHTML;
						var formatNum;
						var hint = "";

						formatNum = 'Last ';
						alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
						var plchldr=alphabet[numOfEditors-1]+' '+titlName;
						if(getFormName()=="DigitalDVD")
						{
							plchldr=titlName+' '+alphabet[numOfEditors-1];
						}
							if(document.istablet5)
							{
								editors = editors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'</div></div>';
							}
							else
							{
								editors = editors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'<br/>';
							}

						document.getElementById(secRef).innerHTML = editors;
						if(getInTextFormat()!="DigitalInterview"  && formName!="review")
                                                    setInnerText("CiteEd", myTitle);

						for (var k = 2; k < numOfEditors; k++)
						{
							tmpVar = 'editor'+k;
							// alert(tmpValArr[k]);
							if(document.getElementById(tmpVar)){
								document.getElementById(tmpVar).value = tmpValArr[k];
							}
						}
						/*
					   @end
					@*/

						var tmpArr;
						tmpArr = getArr(panelArr);
						tmpArr.push("CiteEditor" + numOfEditors);
						tmpArr.push("CiteAndE" + numOfEditors);
						tmpArr.push("CiteCommaE" + numOfEditors);

						//add new span to the piew panel
						var newSpan = document.getElementById("VirCiteEditor").innerHTML;
						newSpan = newSpan + '<span id="CiteCommaE'+numOfEditors+'"></span><span id="CiteAndE'+numOfEditors+'"></span><span id="CiteEditor'+numOfEditors+'"></span>';
						
						document.getElementById("VirCiteEditor").innerHTML = newSpan;
						

						tabVal += 1;
						numOfEditors += 1;
					
				}
				else
				{ 
						var tabVal = tab;
						var editors =  document.getElementById(secRef).innerHTML;
						var formatNum;
						var hint = "";

						formatNum = '9th ';
						alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
						var plchldr=alphabet[numOfEditors-1]+' '+titlName;
						if(getFormName()=="DigitalDVD")
						{
							plchldr=titlName+' '+alphabet[numOfEditors-1];
						}
							if(document.istablet5)
							{
								editors = editors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'</div></div>';
							}
							else
							{
								editors = editors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'<br/>';
							}

						document.getElementById(secRef).innerHTML = editors;
						if(getInTextFormat()!="DigitalInterview")
						setInnerText("CiteEd", myTitle);

						for (var k = 2; k < numOfEditors; k++)
						{
							tmpVar = 'editor'+k;
							// alert(tmpValArr[k]);
							if(document.getElementById(tmpVar)){
								document.getElementById(tmpVar).value = tmpValArr[k];
							}
						}
						/*
					   @end
					@*/

						var tmpArr;
						tmpArr = getArr(panelArr);
						tmpArr.push("CiteEditor" + numOfEditors);
						tmpArr.push("CiteAndE" + numOfEditors);
						tmpArr.push("CiteCommaE" + numOfEditors);

						//add new span to the piew panel
						var newSpan = document.getElementById("VirCiteEditor").innerHTML;
						newSpan = newSpan + '<span id="CiteCommaE'+numOfEditors+'"></span><span id="CiteAndE'+numOfEditors+'"></span><span id="CiteEditor'+numOfEditors+'"></span>';
						
						document.getElementById("VirCiteEditor").innerHTML = newSpan;
						

						tabVal += 1;
						numOfEditors += 1;
						setInText('','',true);
				}
			});
		}else{
			var tabVal = tab;
			var editors =  document.getElementById(secRef).innerHTML;
			var formatNum;
			var hint = "";

			formatNum = '9th ';
			alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var plchldr=alphabet[numOfEditors-1]+' '+titlName;
			if(getFormName()=="DigitalDVD")
			{
				plchldr=titlName+' '+alphabet[numOfEditors-1];
			}
				if(document.istablet5)
				{
					editors = editors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'</div></div>';
				}
				else
				{
					editors = editors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'<br/>';
				}

			document.getElementById(secRef).innerHTML = editors;
			if(getInTextFormat()!="DigitalInterview")
			setInnerText("CiteEd", myTitle);

			for (var k = 2; k < numOfEditors; k++)
			{
				tmpVar = 'editor'+k;
				// alert(tmpValArr[k]);
				if(document.getElementById(tmpVar)){
					document.getElementById(tmpVar).value = tmpValArr[k];
				}
			}
			/*
		   @end
		@*/

			var tmpArr;
			tmpArr = getArr(panelArr);
			tmpArr.push("CiteEditor" + numOfEditors);
			tmpArr.push("CiteAndE" + numOfEditors);
			tmpArr.push("CiteCommaE" + numOfEditors);

			//add new span to the piew panel
			var newSpan = document.getElementById("VirCiteEditor").innerHTML;
			newSpan = newSpan + '<span id="CiteCommaE'+numOfEditors+'"></span><span id="CiteAndE'+numOfEditors+'"></span><span id="CiteEditor'+numOfEditors+'"></span>';
			
			document.getElementById("VirCiteEditor").innerHTML = newSpan;
			

			tabVal += 1;
			numOfEditors += 1;
		}
	}else{
		for (var j = 2; j < numOfEditors; j++)
		 { 
			tmpVar = 'editor'+j;
			tmpValArr[j] = document.getElementById(tmpVar).value;
			if (tmpValArr[j] == "")
			{
				//do nothing
				return false;
			}
		 }
		if(numOfEditors==10 && document.getElementById('author').value != ""){
			var tabVal = tab;
			var editors =  document.getElementById(secRef).innerHTML;
			var formatNum;
			var hint = "";

			formatNum = '10th ';
			alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var plchldr=alphabet[numOfEditors-1]+' '+titlName;
			if(getFormName()=="DigitalDVD")
			{
				plchldr=titlName+' '+alphabet[numOfEditors-1];
			}
				if(document.istablet5)
				{
					editors = editors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'</div></div>';
				}
				else
				{
					editors = editors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" placeholder="'+plchldr+'"/>'+hint+'<br/>';
				}

			document.getElementById(secRef).innerHTML = editors;
			if(getInTextFormat()!="DigitalInterview")
			setInnerText("CiteEd", myTitle);

			for (var k = 2; k < numOfEditors; k++)
			{
				tmpVar = 'editor'+k;
				// alert(tmpValArr[k]);
				if(document.getElementById(tmpVar)){
					document.getElementById(tmpVar).value = tmpValArr[k];
				}
			}
			/*
		   @end
		@*/

			var tmpArr;
			tmpArr = getArr(panelArr);
			tmpArr.push("CiteEditor" + numOfEditors);
			tmpArr.push("CiteAndE" + numOfEditors);
			tmpArr.push("CiteCommaE" + numOfEditors);

			//add new span to the piew panel
			var newSpan = document.getElementById("VirCiteEditor").innerHTML;
			newSpan = newSpan + '<span id="CiteCommaE'+numOfEditors+'"></span><span id="CiteAndE'+numOfEditors+'"></span><span id="CiteEditor'+numOfEditors+'"></span>';
			
			document.getElementById("VirCiteEditor").innerHTML = newSpan;
			

			tabVal += 1;
			numOfEditors += 1;
			setInText('','',true);
		}else{
			jAlertMod("Maximum number of editors reached.","Alert","&nbsp;OK&nbsp;",null);
		}

	}

}

//Add New Producer
function addNewProducer(secRef , panelArr , tab, role)
{
   if(document.getElementById('producer').value == "")
    {
	//do nothing
	return false;
    }
    var tmpValArr = new Array();
    var tmpVar = "";
    var titlName = "producer";
    var myTitle = " (Producers).";

    if (typeof role != "undefined")
    {
        titlName = role;
        if(role == "exe")
            myTitle = " (Executive Producers). ";
        else if(role == "Cartographer")
            myTitle = " (Cartographers). ";
		else if(role == "performer")	
			myTitle = "]";
    }
   
    for (var j = 2; j < numOfProducers; j++)
    {
        tmpVar = 'producer'+j;
        tmpValArr[j] = document.getElementById(tmpVar).value;
	   if(tmpValArr[j] == "")
		{
		return false; //do nothing	
		}
    }
   
    var tabVal = tab;
    var producers =  document.getElementById(secRef).innerHTML;
    var formatNum;
    var hint = "";

    if(numOfProducers == 2 )
    {
        formatNum = numOfProducers + 'nd';
    //hint = '<a href="#" class="hintanchor" onmouseover="showhint(\'Insert and before the last author.\', this, event, \'150px\')">[?]</a>';
    }
    else if(numOfProducers == 3 )
        formatNum = numOfProducers + 'rd';
    else
        formatNum = numOfProducers + 'th';
		if(document.istablet5){
			producers = producers + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="producer'+numOfProducers+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'producer'+numOfProducers+'\',\'CiteProducer'+numOfProducers+'\',\'performer\');" />'+hint+'</div></div>';

		}else{
			producers = producers + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="producer'+numOfProducers+'" tabindex="'+tabVal+'" onkeyup="ReloadTextDiv2(\'producer'+numOfProducers+'\',\'CiteProducer'+numOfProducers+'\',\'performer\');" />'+hint+'<br/>';
		}
    document.getElementById(secRef).innerHTML = producers;

    setInnerText("CiteProd", myTitle);
   
    for (var k = 2; k < numOfProducers; k++)
    {
        tmpVar = 'producer'+k;
        document.getElementById(tmpVar).value = tmpValArr[k];
    }
   
    var tmpArr;
    tmpArr = getArr(panelArr);
    tmpArr.push("CiteProducer" + numOfProducers);
    tmpArr.push("CiteAndP" + numOfProducers);
    tmpArr.push("CiteCommaP" + numOfProducers);

    //add new span to the piew panel
    var newSpan = document.getElementById("VirCiteProducer").innerHTML;
    newSpan = newSpan + '<span id="CiteCommaP'+numOfProducers+'"></span><span id="CiteAndP'+numOfProducers+'"></span><span id="CiteProducer'+numOfProducers+'"></span>';
    document.getElementById("VirCiteProducer").innerHTML = newSpan;

    tabVal += 1;
    numOfProducers += 1;
}

//Function to check place and date
function chkPlcAndDate()
{
   
    chkPlc();
	//MIS_19_April_'13
        chkYearDate();
}

function chkPlc()
{
    var doNothingFlg=false;
    var pageSec=getPageSectionGlobal();
                    if(getCurStyl()=="japa" && pageSec=="encyclopaedia (internet)")
                        doNothingFlg=true;
     if(placeFlg && doNothingFlg==false)
    {
        showDiv('CitePlace');

        // chris  changed innertext property to innerhtml 07 July 09
        var placeVal ="";
        if(document.getElementById('place') && placeFlg)
            {
                placeVal=document.getElementById('place').value.trim()
            }
		var httpVal = getInnerText("CiteHttp").trim();
                var formName;
                formName=getFormName();
                var myFlg=true;
                if(document.getElementById('publisher') && document.getElementById('publisher').value.trim()=="")
                    myFlg=false;
                
    }
}

function chkYearDate()
{
     var nd='&nbsp;(n.d.).';
     
                var pageSec=getPageSectionGlobal();
    	if(dateFlg){
		showDiv('CiteDate');
		var dateVal = getInnerText("CiteDate");
		var Len = getInnerText("CiteDate").trim().length;
                if(pageSec=="internet" || (getCurStyl()=="japa" && pageSec!="book (internet)" && (pageSec.indexOf("internet")>=0 || pageSec=="pdf" || pageSec=="podcast" || pageSec=="website")))
                    {
                        if(document.getElementById('date'))
                            {
                                var obj=document.getElementById('date');
                               // var nd1=obj.getAttribute("placeholder").trim();
                               var nd1='n.d.';
                                if(nd1!='')
                                    nd='&nbsp;('+nd1+').';
                            }
                    }
		if(dateVal == "" || dateVal == " " || Len == 0){
			if(!document.getElementById('year')){
				document.getElementById('CiteDate').innerHTML = nd;
			}
                        else if(getFormName()=='creativeReview' || getFormName()=='periodicalReview')
                            {
                                document.getElementById('CiteDate').innerHTML = "&nbsp;(n.d.).";
                            }
                        else{
				//do nothing
			}
		}
	}
        nd='&nbsp;(n.d.).';
    if(yearFlg)
    {	
        showDiv('CiteYear');
        //chris - changed innerhtml property to new method to retrieve text 07 July 09b
        var yearVal = getInnerText("CiteYear");

        // mark changed - July 2009
        var TheLen = getInnerText("CiteYear").trim().length;
        // mark changed - July 2009
        if(pageSec=="internet" || (getCurStyl()=="japa" && pageSec!="book (internet)" && (pageSec.indexOf("internet")>=0 || pageSec=="pdf" || pageSec=="podcast" || pageSec=="website")))
        {
            if(document.getElementById('year'))
                {
                    var obj=document.getElementById('year');
                    //var nd1=obj.getAttribute("placeholder").trim();
                    var nd1='n.d.';
                    if(nd1!='')
                        nd='&nbsp;('+nd1+').';
                }
        }
        if(yearVal == "" ||yearVal == " " || TheLen == 0)
        {
           	if(!document.getElementById('date') ||document.getElementById('date').value==""){
                            
                            if(getFormName()=='creativeReview' || getFormName()=='periodicalReview')
                            {
                                document.getElementById('CiteYear').innerHTML = "&nbsp;(n.d.)";
                            }
                            else
                            {
				document.getElementById('CiteYear').innerHTML = nd;
                            }
			}
			else if(dateVal != "" || dateVal != " " || Len != 0){
                            if(getFormName()=="creativeReview" || getFormName()=="periodicalReview")
                            {
                                document.getElementById('CiteYear').innerHTML = "";	
                            }
                            else
                            {		
                                document.getElementById('CiteYear').innerHTML = " ";	
                            }
			}
			else{
			}
			
		}
    }
}

function chkDatend()
{
     var nd='&nbsp;(n.d.).';
     
                var pageSec=getPageSectionGlobal();
    	if(dateFlg){
		showDiv('CiteDate');
		var dateVal = getInnerText("CiteDate");
		var Len = getInnerText("CiteDate").trim().length;
                if(pageSec=="internet" || (getCurStyl()=="japa" && pageSec!="book (internet)" && (pageSec.indexOf("internet")>=0 || pageSec=="pdf" || pageSec=="podcast" || pageSec=="website")))
                    {
                        if(document.getElementById('date'))
                            {
                                var obj=document.getElementById('date');
                                //var nd1=obj.getAttribute("placeholder").trim();
                                var nd1='n.d.';
                                if(nd1!='')
                                    nd='&nbsp;('+nd1+').';
                            }
                    }
		if(dateVal == "" || dateVal == " " || Len == 0){
			if(!document.getElementById('year')){
				document.getElementById('CiteDate').innerHTML = nd;
			}
                        else if(getFormName()=='creativeReview' || getFormName()=='periodicalReview')
                            {
                                document.getElementById('CiteDate').innerHTML = "&nbsp;(n.d.).";
                            }
                        else{
				//do nothing
			}
		}
	}
    
}

function chkYearnd()
{
    var formName=getCleanedFormName();
     var nd='&nbsp;(n.d.).';
     
                var pageSec=getPageSectionGlobal();
    
        nd='&nbsp;(n.d.).';
        if(dateFlg){
		var dateVal = getInnerText("CiteDate");
		var Len = getInnerText("CiteDate").trim().length;
            }
    if(yearFlg)
    {	
        showDiv('CiteYear');
        //chris - changed innerhtml property to new method to retrieve text 07 July 09b
        var yearVal = getInnerText("CiteYear");

        // mark changed - July 2009
        var TheLen = getInnerText("CiteYear").trim().length;
        // mark changed - July 2009
        if(pageSec=="internet" || (getCurStyl()=="japa" && pageSec!="book (internet)" && (pageSec.indexOf("internet")>=0 || pageSec=="pdf" || pageSec=="podcast" || pageSec=="website")))
        {
            if(document.getElementById('year'))
                {
                    var obj=document.getElementById('year');
                    //var nd1=obj.getAttribute("placeholder").trim();
                    var nd1='n.d.';
                    if(nd1!='')
                        nd='&nbsp;('+nd1+').';
                }
        }
        if(yearVal == "" ||yearVal == " " || TheLen == 0)
        {
           	if(!document.getElementById('date') ||document.getElementById('date').value==""){
                            
                            if(getFormName()=='creativeReview' || getFormName()=='periodicalReview')
                            {
                                document.getElementById('CiteYear').innerHTML = "&nbsp;(n.d.)";
                            }
                            else
                            {
                                if(formName=="law_reports")
                                    {
                                      if((document.getElementById('law_circuit') && document.getElementById('law_circuit').checked && $("#record").val()!='') || 
                                          (document.getElementById('law_district') && document.getElementById('law_district').checked && $("#city").val()!='') ||
                                       (document.getElementById('law_state') && document.getElementById('law_state').checked && $("#city").val()!=''))
                                        {
                                            document.getElementById('CiteYear').innerHTML = ",&nbsp;n.d.";
                                        }
                                        else
                                            {
                                                document.getElementById('CiteYear').innerHTML = nd;
                                            }  
                                    }
                                    else
                                        {
                                            document.getElementById('CiteYear').innerHTML = nd;
                                        }
                            }
			}
			else if(dateVal != "" || dateVal != " " || Len != 0){
                            if(getFormName()=="creativeReview" || getFormName()=="periodicalReview")
                            {
                                document.getElementById('CiteYear').innerHTML = "";	
                            }
                            else
                            {		
                                document.getElementById('CiteYear').innerHTML = " ";	
                            }
			}
			else{
			}
			
		}
    }
}

function expandcontent2(blockID)
{
    var datFlg = false;
    var obsFlg = false;

	if(document.getElementById("intexplink"))
		$("#intexplink").text("Internet Sourced [click -]");
	if(blockID != 'nosc3')
		Internetpubplace();

    document.getElementById(blockID).style.display=(document.getElementById(blockID).style.display!="block")? "block" : "none";
    if(document.getElementById(blockID).style.display!="block")
    {
        setInnerText('CiteHttp',"");
        setInnerText('CiteAccessed',"");
        

                
		if(document.getElementById("intexplink"))
			$("#intexplink").text("Internet Sourced [click +]");
    }
    else
    {
        $('#'+blockID+' input:text').first().focus();
        $('#'+blockID+' input[type=text]').each(function(index)
        {
            //eval(el.getAttribute('onkeyup'));
            var vl=$(this).val().trim();
            if(vl!='')
            {
                var el=document.getElementById($(this).attr('id'));
                eval(el.getAttribute('onkeyup'));
            }
        });

    
    }

    if(document.getElementById('observed'))
    {
        document.getElementById('observed').style.visibility = (document.getElementById(blockID).style.display=="block")? "hidden" : "visible";
        document.getElementById('observed').value = "";
        //document.getElementById('dateTxt').style.visibility = (document.getElementById(blockID).style.display=="block")? "hidden" : "visible";
        obsFlg = true;
    }
    
    //chkPlc();
    /*if(document.getElementById('place') && document.getElementById('publisher'))
        {
            if(document.getElementById('place').value.trim()=="" && document.getElementById('publisher').value.trim()=="")
                {
                    setInnerText('CitePlace',"");
                }
        }*/
   
    if(datFlg)
        setInnerText('CiteDate',"");

    if(obsFlg)
        setInnerText('CiteObserved',"");

}

function insertNthChar(str,chr,nth)
{
    var output = '';
    for (var i=0; i<str.length; i++)
    {
        if (i>0 && i%nth == 0)
            output += chr;
        output += str.charAt(i);
    }

    return output;
}

function chkTitle(tagName)

{	

    if(reviewFlg && getFormName()!="creativeReview" && getFormName()!="periodicalReview")
    {

        if(document.getElementById('revauthor') && document.getElementById('revauthor').value == "")
        {

            showDiv('CiteRevAuthor');

            if(tagName == 'descriptor')
            {

                document.getElementById('CiteRevAuthor').innerHTML = document.getElementById('CiteRevOpen').innerHTML

                + document.getElementById('CiteDescriptor').innerHTML

                + document.getElementById('CiteSubject').innerHTML

                + document.getElementById('CiteAuthor').innerHTML

                + document.getElementById('CiteYear').innerHTML

                + document.getElementById('CiteRevClose').innerHTML;

                document.getElementById('VirCiteAuthor').innerHTML = "";

                document.getElementById('CiteDescriptor').innerHTML ="";

                document.getElementById('CiteSubject').innerHTML ="";

                document.getElementById('CiteAuthor').innerHTML ="";

                document.getElementById('CiteYear').innerHTML ="";

                document.getElementById('CiteRevOpen').innerHTML = "";

                document.getElementById('CiteRevClose').innerHTML = "";

            }

        }

    }

    else if(govFlg)

    {

        var ch = document.getElementById('CiteChapter').innerHTML;

        ch = ch.replace("&nbsp;","");

        document.getElementById('CiteChapter').innerHTML = ch;

    }
    else if(document.getElementById('author') && document.getElementById('author').value == "")
    {

       	showDiv('CiteAuthor');

		showDiv('VirCiteAuthor');
                if(getFormName()=="creativeReview" || getFormName()=="periodicalReview")
                {
                    var chap;
                    chap=getInnerText("CiteChapter").trim();
                    if(chap=='')
                    {
                        var lastEditorNo=getLastEditorNo();
                        var lastRevAuthor=getLastRevAuthorNo();
                        if(lastRevAuthor!=1)
                        {
                            var edi = document.getElementById('CiteRevAuthor').innerHTML;
                            var virEdiCnt=0;
                            edi = edi.replace("(","");

                            edi = edi.replace("&nbsp;","");
                            var eds = document.getElementById('CiteRevAuth').innerHTML;

                                        eds = eds.trim();

                                        eds = eds.replace(" ,","");
                                        eds = eds.replace("(","");
                                        eds = eds.trim();
                                        if(eds.indexOf('),')!=-1)
                                                eds =eds.replace("),","");

                                            if(eds.indexOf(').,')!=-1)
                                            {
                                                eds =eds.replace(").,","");
                                                eds ="("+eds+").";
                                            }
                                            if(eds.indexOf(').')!=-1)
                                            {
                                                eds =eds.replace(").","");
                                                eds ="("+eds+").";
                                            }

                                        if(eds.indexOf("(")==-1 && eds!='')
                                            {
                                                eds ="("+eds+")";
                                            }

                                        eds =eds.replace(", ","");
                                        var  perNo = document.perNorevauthor; 	

                                        edi1 = edi.split(" ");

                                        if(typeof(edi1[2])!="undefined" && perNo==0)

                                                edi = edi1[2].replace(".","") +", "+ edi1[0]+" "+edi1[1] + " ";

                                        else if(typeof(edi1[1])!="undefined" && perNo==0)

                                                edi = edi1[1].replace(".","") +", "+ edi1[0] + " ";



                            //Chris added to account for translator

                                        var edi2 =  document.getElementById('VirCiteRevAuthor').getElementsByTagName('span');


                                        for (var i = 0; i < edi2.length; i++) {

                                                //omitting undefined null check for brevity

                                                if (edi2[i].id.lastIndexOf("CiteRevAuthor", 0) === 0) {

                                                        filedno = edi2[i].id.charAt(edi2[i].id.length - 1);

                                                        var  addperNo = eval("document.perNorevauthor"+filedno);

                                                        edit = document.getElementById(edi2[i].id).innerHTML;

                                                        edit1 = edit.split(" ");

                                                        if(typeof(edit1[2])!="undefined" && addperNo==0)
                                                        {
                                                                edit = edit1[2] +", "+ edit1[0]+" "+edit1[1];
                                                                virEdiCnt++;
                                                            }

                                                        else if(typeof(edit1[1])!="undefined" && addperNo==0)
                                                        {
                                                                edit = edit1[1] +", "+ edit1[0];
                                                                virEdiCnt++;
                                                            }



                                                        document.getElementById(edi2[i].id).innerHTML = edit;	

                                                }

                                        }
                                        if(virEdiCnt>0)
                                        {
                                            eds=' '+eds;
                                        }

                                        if(eds!='')
                                            {
                                            eds = "<span>"+eds+"</span>";
                                            }
                                            else
                                                {
                                                    edi=edi.trim();
                                                }
                                                if(virEdiCnt>0)
                                                {
                                                    edi=edi.trim();
                                                }


                                                eds='';


                            document.getElementById('CiteAuthor').innerHTML = edi.trim();

                            document.getElementById('VirCiteAuthor').innerHTML = document.getElementById('VirCiteRevAuthor').innerHTML+eds;

                                        //document.getElementById('FADAuthor').innerHTML = edi;

                           // document.getElementById('FAAD').innerHTML = document.getElementById('FAAD').innerHTML + eds;



                            document.getElementById('CiteRevAuth').innerHTML = "";

                            document.getElementById('CiteRevAuthor').innerHTML = "";

                            document.getElementById('VirCiteRevAuthor').innerHTML = "";

                                        document.getElementById('revauthor').value = "";
                        }
                        else if(lastEditorNo!=1)
                        {
                            var edi = document.getElementById('CiteEditor').innerHTML;
                            var virEdiCnt=0;
                            edi = edi.replace("(","");

                            edi = edi.replace("&nbsp;","");
                            var eds = document.getElementById('CiteEd').innerHTML;

                                        eds = eds.trim();

                                        eds = eds.replace(" ,","");
                                        eds = eds.replace("(","");
                                        eds = eds.trim();
                                        if(eds.indexOf('),')!=-1)
                                                eds =eds.replace("),","");

                                            if(eds.indexOf(').,')!=-1)
                                            {
                                                eds =eds.replace(").,","");
                                                eds ="("+eds+").";
                                            }
                                            if(eds.indexOf(').')!=-1)
                                            {
                                                eds =eds.replace(").","");
                                                eds ="("+eds+").";
                                            }

                                        if(eds.indexOf("(")==-1 && eds!='')
                                            {
                                                eds ="("+eds+")";
                                            }

                                        eds =eds.replace(", ","");
                                        var  perNo = document.perNoeditor; 	

                                        edi1 = edi.split(" ");

                                        if(typeof(edi1[2])!="undefined" && perNo==0)

                                                edi = edi1[2].replace(".","") +", "+ edi1[0]+" "+edi1[1] + " ";

                                        else if(typeof(edi1[1])!="undefined" && perNo==0)

                                                edi = edi1[1].replace(".","") +", "+ edi1[0] + " ";



                            //Chris added to account for translator

                                        var edi2 =  document.getElementById('VirCiteEditor').getElementsByTagName('span');


                                        for (var i = 0; i < edi2.length; i++) {

                                                //omitting undefined null check for brevity

                                                if (edi2[i].id.lastIndexOf("CiteEditor", 0) === 0) {

                                                        filedno = edi2[i].id.charAt(edi2[i].id.length - 1);

                                                        var  addperNo = eval("document.perNoeditor"+filedno);

                                                        edit = document.getElementById(edi2[i].id).innerHTML;

                                                        edit1 = edit.split(" ");

                                                        if(typeof(edit1[2])!="undefined" && addperNo==0)
                                                        {
                                                                edit = edit1[2] +", "+ edit1[0]+" "+edit1[1];
                                                                virEdiCnt++;
                                                            }

                                                        else if(typeof(edit1[1])!="undefined" && addperNo==0)
                                                        {
                                                                edit = edit1[1] +", "+ edit1[0];
                                                                virEdiCnt++;
                                                            }



                                                        document.getElementById(edi2[i].id).innerHTML = edit;	

                                                }

                                        }

                                        if(virEdiCnt>0)
                                        {
                                            eds=' '+eds;
                                        }

                                        if(eds!='')
                                            {
                                            eds = "<span>"+eds+"</span>";
                                            }
                                            else
                                                {
                                                    edi=edi.trim();
                                                }
                                                if(virEdiCnt>0)
                                                {
                                                    edi=edi.trim();
                                                }


                                                eds='';


                            document.getElementById('CiteAuthor').innerHTML = edi.trim();

                            document.getElementById('VirCiteAuthor').innerHTML = document.getElementById('VirCiteEditor').innerHTML+eds;

                                        //document.getElementById('FADAuthor').innerHTML = edi;

                           // document.getElementById('FAAD').innerHTML = document.getElementById('FAAD').innerHTML + eds;



                            document.getElementById('CiteEd').innerHTML = "";

                            document.getElementById('CiteEditor').innerHTML = "";

                            document.getElementById('VirCiteEditor').innerHTML = "";

                                        document.getElementById('editor').value = "";
                        }
                    }
                    
                }
                else
                {
                    if(tagName == 'editor')
                    {
                        if(getFormName()=="BooksTranslation")
                    {
                        document.getElementById('CiteChapter').innerHTML=document.getElementById('CiteChapter').innerHTML+'.';
                    }

                var soundRecordStart='';
                var soundRecordEnd='';
                if(getFormName()=="digitalSound")
                    {
                        soundRecordStart=getInnerText("CiteAuth")+' ';
                        soundRecordEnd=getInnerText("CiteProd");
                        setInnerText("CiteAuth","");
                        setInnerText("CiteProd","");
                    }
                var edi = document.getElementById('CiteEditor').innerHTML;
                var virEdiCnt=0;
                edi = edi.replace("(","");

                edi = edi.replace("&nbsp;","");
                var eds = document.getElementById('CiteEd').innerHTML;

                            eds = eds.trim();

                            eds = eds.replace(" ,","");
                            eds = eds.replace("(","");
                            eds = eds.trim();
                            if(eds.indexOf('),')!=-1)
                                    eds =eds.replace("),","");

                                if(eds.indexOf(').,')!=-1)
                                {
                                    eds =eds.replace(").,","");
                                    eds ="("+eds+").";
                                }
                                if(eds.indexOf(').')!=-1)
                                {
                                    eds =eds.replace(").","");
                                    eds ="("+eds+").";
                                }
                           
                            eds =eds.replace(", ","");
                            var  perNo = document.perNoeditor; 	

                            edi1 = edi.split(" ");

                            if(typeof(edi1[2])!="undefined" && perNo==0)

                                    edi = edi1[2].replace(".","") +", "+ edi1[0]+" "+edi1[1] + " ";

                            else if(typeof(edi1[1])!="undefined" && perNo==0)

                                    edi = edi1[1].replace(".","") +", "+ edi1[0] + " ";



                //Chris added to account for translator

                            var edi2 =  document.getElementById('VirCiteEditor').getElementsByTagName('span');


                            for (var i = 0; i < edi2.length; i++) {

                                    //omitting undefined null check for brevity

                                    if (edi2[i].id.lastIndexOf("CiteEditor", 0) === 0) {

                                            filedno = edi2[i].id.charAt(edi2[i].id.length - 1);

                                            var  addperNo = eval("document.perNoeditor"+filedno);

                                            edit = document.getElementById(edi2[i].id).innerHTML;

                                            edit1 = edit.split(" ");

                                            if(typeof(edit1[2])!="undefined" && addperNo==0)
                                            {
                                                    edit = edit1[2] +", "+ edit1[0]+" "+edit1[1];
                                                    virEdiCnt++;
                                                }

                                            else if(typeof(edit1[1])!="undefined" && addperNo==0)
                                            {
                                                    edit = edit1[1] +", "+ edit1[0];
                                                    virEdiCnt++;
                                                }



                                            document.getElementById(edi2[i].id).innerHTML = edit;	

                                    }

                            }

                            if(virEdiCnt>0)
                            {
                                eds=' '+eds;
                            }

                            if(eds!='')
                                {
                                eds = "<span>"+eds+"</span>";
                                }
                                else
                                    {
                                        edi=edi.trim();
                                    }
                                    if(virEdiCnt>0)
                                    {
                                        edi=edi.trim();
                                    }
                                    var st='';
                                    var en='';
                                    var firstEdi=getFirstEditorNo();
                                    var lastEdi=getLastEditorNo();



        if(getFormName()=="digitalSound" && getLastAuthorNo()!=1)
            {
                                    if(edi!='')
                                        {
                                            edi=soundRecordStart+edi;
                                            if(virEdiCnt<=0)
                                                {
                                                    edi+=soundRecordEnd;
                                                }

                                        }



                                        if(edi=='' && virEdiCnt>0)
                                            {
                                                st=soundRecordStart;
                                                if(firstEdi!='' && firstEdi>1)
                                                    {
                                                        document.getElementById('CiteEditor'+firstEdi).innerHTML=st+document.getElementById('CiteEditor'+firstEdi).innerHTML;
                                                    }
                                            }

                                            if(virEdiCnt>0)
                                                {
                                                    en=soundRecordEnd;
                                                    if(lastEdi!='' && lastEdi>1)
                                                    {
                                                        document.getElementById('CiteEditor'+lastEdi).innerHTML=document.getElementById('CiteEditor'+lastEdi).innerHTML+en;
                                                    }
                                                }
            }


                document.getElementById('CiteAuthor').innerHTML = edi;

                document.getElementById('VirCiteAuthor').innerHTML = document.getElementById('VirCiteEditor').innerHTML+eds;

                            
                document.getElementById('CiteEd').innerHTML = "";

                document.getElementById('CiteEditor').innerHTML = "";

                document.getElementById('VirCiteEditor').innerHTML = "";

                            document.getElementById('editor').value = "";
                    }

                    else if( tagName == 'chapter')
                    {

                        var ch = document.getElementById('CiteChapter').innerHTML;

                                    ch = ch.replace("&nbsp;","");

                                    document.getElementById('CiteAuthor').innerHTML = FLUprCase(ch);

                                    document.getElementById('CiteChapter').innerHTML = "";

                                    document.getElementById('chapter').value = "";

                                    if(document.getElementById('title') && document.getElementById('title').value!= "" && !document.getElementById('edition')){



                                            var tit=document.getElementById('title').value;

                                            tit = tit.replace("&nbsp;","");

                                            if(!Endwithpunctuation(tit)){

                                                    if(document.getElementById('volume') && document.getElementById('volume').value!= ""){

                                                            document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

                                                    }else if(document.getElementById('issue') && document.getElementById('issue').value!= ""){

                                                            document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

                                                    }else if(document.getElementById('pageJournal') && document.getElementById('pageJournal').value!= ""){

                                                            document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

                                                    }

                                                    else{

                                                            document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";

                                                    }

                                            }	

                                            //MI_06_april_2013

                                            //document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";

                                            document.getElementById('CiteTitle').style.fontStyle = "italic";



                                    }



                    }

                    else if( tagName == 'title')
                    {	//alert(tagname)

                                    var tit = document.getElementById('CiteTitle').innerHTML;

                                    tit = tit.replace("&nbsp;","");
                                    if(document.getElementById('CiteAuthor'))
                                        {
                                            document.getElementById('CiteAuthor').innerHTML = tit;

                                            document.getElementById('CiteAuthor').style.fontStyle="italic";
                                        }
                                        else if(getFormName()=="annualReport" && document.getElementById('CiteSubject'))
                                            {
                                                document.getElementById('CiteSubject').innerHTML = tit;
                                                document.getElementById('CiteSubject').style.fontStyle="italic";
                                            }

                                    if(!document.getElementById('edition') && !Endwithpunctuation(tit)){

                                            if(document.getElementById('volume') && document.getElementById('volume').value!= ""){

                                                    document.getElementById('CiteTitle').innerHTML = ",";

                                            }else if(document.getElementById('issue') && document.getElementById('issue').value!= ""){
                                                
                                                    document.getElementById('CiteTitle').innerHTML = ",";

                                            }else if(document.getElementById('pageJournal') && document.getElementById('pageJournal').value!= ""){

                                                    document.getElementById('CiteTitle').innerHTML = ",";

                                            }

                                            else{
                                                    if(document.getElementById('CiteAuthor') || (getFormName()=="annualReport" && document.getElementById('CiteSubject')))
                                                    document.getElementById('CiteTitle').innerHTML = "";

                                            }

                                    }else{
                                            if(document.getElementById('CiteAuthor') || (getFormName()=="annualReport" && document.getElementById('CiteSubject')))
                                            document.getElementById('CiteTitle').innerHTML = "";
                                        

                                    }

                                    document.getElementById('title').value = "";

                                    //document.getElementById('CiteYear').innerHTML = "";

                                    if(document.getElementById('CiteIOn'))	

                            document.getElementById('CiteIOn').innerHTML = "";

                                    // || document.getElementById('CitePage').innerHTML!= ""



                                    //MIS_18_april_13

                                    if(document.getElementById('year')){	

                                            if(document.getElementById('CitePage')){

                                                    document.getElementById('CitePage').innerHTML+=document.getElementById('CiteYear').innerHTML;

                                                    document.getElementById('CiteYear').innerHTML = "";

                                            }else if(document.getElementById('CiteVolume')){

                                                    document.getElementById('CiteVolume').innerHTML+=document.getElementById('CiteYear').innerHTML;

                                                    document.getElementById('CiteYear').innerHTML = "";

                                            }else{

                                                    //do nothing

                                            }

                                    }else{

                                            //do nothing

                                    }
                                    
                                    if(getFormGroup()=="academic")
                                        {
                                            if(document.getElementById('issue') && document.getElementById('issue').value!= ""){
                                                var isSub=document.getElementById('CiteIssue').innerHTML;
                                                isSub = isSub.replace(":", "");
                                                if(getFieldValue('format')=='' && getFieldValue('http')=="" && getFieldValue('pageBook')=='' && getFieldValue('publisher')=='' && getFieldValue('city')=='')
                                                    {
                                                        var isTtl=document.getElementById('CiteTitle').innerHTML;
                                                        isTtl = isTtl.replace(",", ".");
                                                        document.getElementById('CiteTitle').innerHTML=isTtl;
                                                    }
                                                    document.getElementById('CiteIssue').innerHTML=isSub;
                                            }
                                        }

                            }

                    else if( tagName == 'publisher')
                    {	

                            var pub = document.getElementById('CitePublisher').innerHTML;

                        pub = pub.replace("&nbsp;","");

                            document.getElementById('CiteAuthor').innerHTML = pub;

                        var place = document.getElementById('CitePlace').innerHTML;

                        place = place.replace(":", "");

                        document.getElementById('CitePlace').innerHTML = place;

                        document.getElementById('CitePublisher').innerHTML = "";

                                    document.getElementById('publisher').value = "";

                    }
                    else if( tagName == 'http')
                    {

            var path = document.getElementById('CiteHttp').innerHTML;

            path = path.replace("&nbsp;","");

            document.getElementById('CiteAuthor').innerHTML = path;

            document.getElementById('CiteHttp').innerHTML = "";

			document.getElementById('http').value = "";

        }
                }

    }

	else if(document.getElementById('author') && document.getElementById('author').value!= "")

	{

		showDiv('CiteAuthor');

		//alert(tagName);

		if( tagName == 'chapter')

        {

            var ch =document.getElementById('chapter').value; //document.getElementById('CiteChapter').innerHTML;

			//alert(Endwithpunctuation(ch));

            //ch = ch.replace("&nbsp;","");

            //document.getElementById('CiteAuthor').innerHTML = ;

            if(!Endwithpunctuation(ch))

				document.getElementById('CiteChapter').innerHTML = "&nbsp;"+FLUprCase(ch)+".";

			if(document.getElementById('title') && document.getElementById('title').value!= "" && !document.getElementById('edition')){

				var tit = document.getElementById('title').value;

				tit = tit.replace("&nbsp;","");

				if(!Endwithpunctuation(tit)){

					if(document.getElementById('volume') && document.getElementById('volume').value!= ""){

						document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

					}else if(document.getElementById('issue') && document.getElementById('issue').value!= ""){

						document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

					}else if(document.getElementById('pageJournal') && document.getElementById('pageJournal').value!= ""){

						document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

					}

					else{

						document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";

					}

				}	

				//document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";

			}

        }



        else if( tagName == 'title')

        {	

            var tit = document.getElementById('title').value;

            tit = tit.replace("&nbsp;","");

			if(!document.getElementById('edition') && !Endwithpunctuation(tit)){

				if(document.getElementById('volume') && document.getElementById('volume').value!= ""){

					document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

				}else if(document.getElementById('issue') && document.getElementById('issue').value!= ""){

						document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

				}else if(document.getElementById('pageJournal') && document.getElementById('pageJournal').value!= ""){

						document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";

				}

				else{

					document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";

				}

				//document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";

				document.getElementById('CiteTitle').style.fontStyle = "italic";

            }

         }

	}



}

//Define 'endsWith(sting)' function for String Type variables
String.prototype.endsWith = function(str)
{
    return (this.match(str+"$")==str)
}

String.IsNullOrEmpty = function(value) {
    var isNullOrEmpty = true;
    if (value) {
        if (typeof (value) == 'string') {
            if (value.length > 0)
                isNullOrEmpty = false;
        }
    }
    return isNullOrEmpty;
}
 
function FormatCitation(textName,divName,other,other1)
{      
    var otherFlg = false;
    
    var myTitle = " (Ed.).";
    var editorCnt=getFilledEditorCount();
    if(editorCnt>1)
        {
            myTitle=" (Eds.).";
        }
    	
        
        var formName=getCleanedFormName();
        
        if(formName=="blu_ray_dvd")
            {
                myTitle="";
            }
        
    var pageSec=getPageSectionGlobal();
    var teleFlg =false;
    var conferenceFlg=false;
    var swFlg = false;
    var academicFlg = false;
    var patentsFlg = false;
    var legislationFlg=false;
    var exhibitFlg = false;
    var performanceFlg = false;
    var journalFlg = false;
    var reportFlg=false;
    var refmanuFlg=false;
    var edissertionFlg=false;
    var bookEditedFlg=false;
    var doNotCapitalizeFlg=false;
    var capitalizeTtlFlg=false;
    var displayPFlg=false;
    var creativePgmFlg = false;
    //    var parFlg = false;
    var paperFlg = false;
    var posterFlg = false;
    var lectureFlg = false;
    var markBlankFlg=false;

	var replaceFlg = false;
	var republisherFlg =false;
	var performerFlg = false;
	var digitalFlg = false;
	var NovolFlg =false;
	var refFlg = false;
	var govFlg = false;
	var parliamentFlg =false;
	var bookFlg = false;
        var retainAlertFlg=false;
        var firstFieldId=$(".cssform input:text").first().attr('id');
        if(typeof isHomePage != "undefined" && isHomePage==true)
            {
                if(document.getElementById('author'))
                    {
                        firstFieldId='author';
                    }
            }
            var authorCnt=getFilledAuthorCount();
            var editorCount=getFilledEditorCount();
            
    if (typeof other != "undefined")
    {	//alert(other);
        otherFlg = true;
        if(other == "director")
            myTitle = " (Director).";
		if(other == "tvdirector")
            myTitle = " (Director).";
        if(other == "Curator")
            {
                myTitle = " (Curator). ";
                if(editorCnt>1)
                    {
                        myTitle = " (Curators). ";
                    }
            }
        if(other == "writer")
            myTitle = " writ. ";
        else if(other == "interviewer")
            myTitle = " (Interviewer).";
        else if(other == "interviewee")
            myTitle = " (Interviewee).";
        else if(other == "prod")
            myTitle = " (Producer).";
        else if(other == "digitalinterview" || other == "periodicalinterview")
            myTitle = " Interview by";
        /*else if(other == "periodicalinterview")
        {
            myTitle = " Interview of";
        }*/
        else if(other == "exe")
            myTitle = "";
		//Recipient	
		else if(other == "Recipient")
            myTitle = " Email to";
		else if(other =="replace")
			replaceFlg = true;
                    else if(other=="outsidehttp")
                        outsidehttpFlg=true;
		else if(other =="republisher")
			republisherFlg = true;			
        else if(other == "map")
        {
            mapFlg = true;
            if(authorCnt>0)
                {
                    myTitle = " (Cartographer).";
                }
                else
                    {
                        myTitle="";
                    }
            
        }
		else if(other == "review" && textName=="revauthor")
        {
            
                var prevDiv=getPreviousFilledDiv('CiteRevAuth');
                if(isAllRevAuthorsBlank==true || prevDiv=="CiteRecord")
                {
                    myTitle="";
                }
                else
                    {
                        var strComma='';
                        if(prevDiv=="CiteSubject")
                        {
                            strComma=',';
                        }
			myTitle = strComma+" by ";
                        if(pageSec=="books" && document.getElementById('chkedi') && document.getElementById('chkedi').checked)
                        {
                                myTitle=strComma+" edited by ";
                        }
                        else if(pageSec=="creative")
                        {
                            var val=getRevCheckVal();
                                if(val!='')
                                {
                                    $("#CiteRevAuth").html(strComma+" "+val+" by ");
                                }
                        }
                    }
        }
        else if(other == "noInOn")
            noInOnFlg = true;
        else if(other == "television")
            teleFlg = true;
		else if(other == "hidevol")
			NovolFlg = true;
        else if(other == "gov")
        {
            govFlg = true;
        }
		else if(other =="parliament")
			parliamentFlg = true;	
        else if(other == "review")
        {
            reviewFlg = true;
        }
        else if(other == "transcript")
        {
            transcriptFlg = true;
        }
        else if(other == "journal")
        {
            journalFlg = true;
        //journalPageFlg = true;
        }
        else if(other=="dispP")
        {
            displayPFlg=true;
        }
        else if(other == "report")
        {
            reportFlg = true;
        }
        else if(other == "refmanu")
        {
            refmanuFlg = true;
        }
        else if(other == "conference")
        {
            conferenceFlg = true;
        }
        else if(other == "booksedited")
        {
            bookEditedFlg = true;
            var myTitle = " (Ed.).";
            if(getFilledEditorCount()>1)
            {
                myTitle=" (Eds.).";
            }
        }
        else if(other == "books")
        {
            bookFlg = true;
        }
        else if(other == "reference")
        {
            refFlg = true;
        }
        else if(other == "doNotCapitalize")
            {
                doNotCapitalizeFlg=true;
            }
            else if(other == "capitalizeTitle")
            {
                capitalizeTtlFlg=true;
            }
           
        else if(other == "newspaper")
        {
            newsFlg = true;
            journalFlg = true;
        }
        else if(other == "newsletter")
        {
            newsFlg = true;
        }
        else if(other == "translator")
            myTitle = ", Trans.).";
        else if(other == "narrator")
            {
                myTitle = ", Narr.).";
                if(editorCount>1)
                    {
                        myTitle = ", Narrs.).";
                    }
            }
        else if(other == "performance")
            performanceFlg = true;
        else if(other == "software")
        {
            swFlg = true;
        }
        else if(other == "creativePgm")
            creativePgmFlg = true;
        else if(other == "exhibit")
            exhibitFlg = true;
        else if(other == "patents")
            patentsFlg = true;
        else if(other == "legislation")
            {
                legislationFlg=true;
            }
        else if(other == "academic")
        {
            academicFlg = true;
        }
		else if(other == "digital")
		{
			digitalFlg = true;
		}
        else if(other == "paper")
            paperFlg = true;
		else if(other == "poster")
            posterFlg = true;
		else if(other == "lecture")
            lectureFlg = true;
        else if(other == "internet")
            internetFlg = true;
        else if(other == "webpage")
            webpgFlg = true;
		else if(other == "performer")
        {
			myTitle = "]";
            performerFlg = true;
        }	
        else if(other == "noItalic")
        {
            if(document.getElementById('CiteTitle'))
                document.getElementById('CiteTitle').style.fontStyle = "normal";
        }
		
    }
    
    if (typeof other1 != "undefined")
    {
        if(other1 == "refmanu")
        {
            refmanuFlg=true;
        }
    }
    if (typeof other1 != "undefined")
    {
        if(other1 == "edissertion")
        {
            edissertionFlg=true;
        }
        if(other1=="retainAlert")
            {
                retainAlertFlg=true;
            }
            if(other1=="markBlank")
            {
                markBlankFlg=true;
            }
            else if(other1 == "capitalizeTitle")
            {
                capitalizeTtlFlg=true;
            }
    }

    if(document.getElementById('http'))
        httpFlg = true;
    if(document.getElementById('place'))
        placeFlg = true;
    if(document.getElementById('year'))
    {
        yearFlg = true;
    }
	//MIS_19_April_'13
	if(document.getElementById('date'))
    {
        dateFlg = true;
    }
    if(document.getElementById('title'))
	{	
	    titleFlg = true;
	}

	if(document.getElementById('source'))
	{	
	    frmtFlg = true;
	}
		if(document.getElementById('chapter'))
	{	
	    frmtFlg = true;
	}
		if(document.getElementById('record'))
	{	
	    frmtFlg = true;
	}
		if(document.getElementById('year'))
	{	
	    frmtFlg = true;
	}
		if(document.getElementById('author'))
	{	
	    frmtFlg = true;
	}
		if(document.getElementById('city'))
	{	
	    frmtFlg = true;
	}
		if(document.getElementById('subject'))
	{	
	    frmtFlg = true;
	}
			if(document.getElementById('descriptor'))
	{	
	    frmtFlg = true;
	}
        
        if(formName=="conference")
            {
                myTitle=getChairEditorTxt();
            }

    var NewText = document.getElementById(textName).value;
    NewText=processExtraDotComma(divName,NewText);
        
    var copyVal = NewText;
    showDiv(divName);

        
	
    var wordArr = NewText.split(" ");
	var tmpNewText = "";
    for(var i = 0; i < wordArr.length ; i++)
    {
        if(wordArr[i] != "" && wordArr[i].length > 50)
        {
            wordArr[i] = insertNthChar(wordArr[i] , "\r\n" , 50);
        }

        if( i == 0)
            tmpNewText = tmpNewText + wordArr[i];
        else
            tmpNewText = tmpNewText + " " + wordArr[i];
    }
    NewText = tmpNewText;
    
    if(NewText == "")
        NewText = "";
    else if(textName == 'issue' || textName == 'date' || textName == 'observed')
    {
        NewText = NewText.replace(/[()]/g,"");
        if(textName == 'issue')
        {
            if(teleFlg)
            {
                NewText = "(broadcast " + FLUprCase(NewText) + ")";
            }
            else if(formName=="constitutions_conventions")
                {
                    NewText = "para. " + FLUprCase(NewText)+".";
                }
            else if(govFlg)
                {
                    NewText = "(" + FLUprCase(NewText) + ")";                                    
                }
                else if(formName=="law_reports")
                {
                    NewText = FLUprCase(NewText) + ".";                                    
                }
                else if(formName=="legislation")//parliament
                    {
                        if(document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked)
                            {
                                NewText = " Pub. L. No. " + FLUprCase(NewText) + ".";
                            }
                            else
                                {
                                    NewText = " &sect; " + FLUprCase(NewText) + ".";
                                }                                    
                    }
                else if(formName=="parliament")
                {
                    if((document.getElementById('chkresolution') && document.getElementById('chkresolution').checked==true)
                                ||
                            (document.getElementById('chkbill') && document.getElementById('chkbill').checked==true))
                                {
                                    NewText = FLUprCase(NewText) + ".";
                                }
                                else
                                    {
                                        NewText = "(" + FLUprCase(NewText) + ")";
                                    }
                }
            else if(refFlg){
                NewText = "Microfilm " + FLUprCase(NewText) + "";
				showDiv("CiteCommaStart");
				showDiv("CiteCommaEnd");		
				setInnerText("CiteCommaStart", " (");
				setInnerText("CiteCommaEnd", ").");
			}
			else if(other == "archive"){
                NewText = "Series " + FLUprCase(NewText) + ".";
				showDiv("CiteCommaStart");
				showDiv("CiteCommaEnd");		
				setInnerText("CiteCommaStart", " (");
				setInnerText("CiteCommaEnd", ").");
			}
            else if(mapFlg)
                NewText = "(Series " + FLUprCase(NewText) + ").";
            else if(patentsFlg)
                NewText ="&nbsp;"+FLUprCase(NewText) + ".";
            else if(academicFlg)
            {
                document.getElementById('CiteIssue').style.fontStyle = "italic";
                NewText = FLUprCase(NewText) + ".";
            }
            else if(formName=="podcast")
                {
                     NewText = "(No. " + FLUprCase(NewText) + ").";
                }
            else
            {
                NewText = "(" + FLUprCase(NewText) + ").";
            }
        }
        else
        {
            
            if(NewText.replace(/\./,"").toLowerCase()=="in press")
                {
                    NewText = "(" + NewText.replace(/\./,"").toLowerCase() + ").";
                }
            else if(academicFlg)
            {
                var NewTextArr;
                if(NewText.indexOf(",")!=-1)
                    NewTextArr = NewText.trimStart().split(",");
                else
                    NewTextArr = NewText.trimStart().split(" ");
                
                var myNewText=NewText.replace(".", "").toLowerCase();
                
                var strlen=myNewText.length;
                var subStr=myNewText.substr(strlen-2,2).toLowerCase();
                
                var myNewTextArr=new Array();
                var txtlen=myNewText.length;
                if(myNewText.substr(0,5)=="circa")
                    {
                        myNewTextArr[0]="circa.";
                        myNewTextArr[1]=myNewText=myNewText.substr(5,txtlen-5);
                    }
                    else if(myNewText.substr(0,2)=="ca")
                        {
                            myNewTextArr[0]="ca.";
                            myNewTextArr[1]=myNewText=myNewText.substr(2,txtlen-2);
                        }
                        else if(myNewText.substr(0,1)=="c")
                            {
                                myNewTextArr[0]="c.";
                                myNewTextArr[1]=myNewText=myNewText.substr(1,txtlen-1);
                            }
                            else if(myNewText.substr(0,2)=="ad")
                                {
                                    myNewTextArr[0]="A.D.";
                                    myNewTextArr[1]=myNewText=myNewText.substr(2,txtlen-2);
                                }
                                else if(myNewText.substr(0,2)=="bc")
                                    {
                                        myNewTextArr[0]="B.C.";
                                        myNewTextArr[1]=myNewText=myNewText.substr(2,txtlen-2);
                                    }
                            
                                if(subStr=="ad" || subStr=="bc")
                                    {
                                        var tempStr=myNewText.substr(0,(myNewText.length-2));;
                                        if(typeof myNewTextArr[0] != "undefined" && myNewTextArr[0]!='')
                                            {   
                                                myNewTextArr[1]= tempStr;                                               
                                            }
                                            else
                                                {
                                                    myNewTextArr[0]= tempStr;                                               
                                                }
                                        subStr=subStr.toUpperCase();
                                        if(subStr=="AD")
                                            {
                                                subStr='A.D.';
                                            }
                                            else
                                                {
                                                    subStr='B.C.';
                                                }
                                        if(typeof myNewTextArr[1] != "undefined" && myNewTextArr[1]!='')
                                            {
                                                myNewTextArr[2]=subStr;
                                            }
                                            else
                                                {
                                                    myNewTextArr[1]=subStr;
                                                }
                                    }
                            
                if(typeof myNewTextArr[0] != "undefined" && myNewTextArr[0]!='')
                    {
                         NewText = "(";
                         NewText+=myNewTextArr[0].trim();
                         if(typeof myNewTextArr[1] != "undefined")
                             {
                                 NewText+=" " + FLUprCase(myNewTextArr[1].trim());
                             }
                             if(typeof myNewTextArr[2] != "undefined")
                                 {
                                     NewText+=" "+myNewTextArr[2];
                                 }
                         NewText+=")."
                    }
                else if(typeof NewTextArr[1] != "undefined")
                {
                    
                        NewTextArr[0]=NewTextArr[0].replace(",", "");
                        if(NewTextArr.length==3)
                            {
                                NewText = "(" + FLUprCase(NewTextArr[0]) + ", " + FLUprCase(NewTextArr[1].trim()) + " " + FLUprCase(NewTextArr[2].trim()) + ").";
                            }
                            else
                                {
                                    NewText = "(" + FLUprCase(NewTextArr[0]) + ", " + FLUprCase(NewTextArr[1].trim()) + ").";
                                }
                    
                }
                else
                {
                    NewText = "(" + FLUprCase(NewTextArr[0]) + ").";
                }

                
            }
            else if(digitalFlg)
            {
                var NewTextArr;
                if(NewText.indexOf(",")!=-1)
                    NewTextArr = NewText.trimStart().split(",");
                else
                    NewTextArr = NewText.trimStart().split(" ");
                
                if(typeof NewTextArr[1] != "undefined")
                {
                    NewTextArr[0]=NewTextArr[0].replace(",", "");
                    NewText = "(Recorded " + FLUprCase(NewTextArr[0]) + ", " + FLUprCase(NewTextArr[1].trim()) + ").";
                }
                else
                {
                    NewText = "(Recorded " + FLUprCase(NewTextArr[0]) + ").";
                }

			}
            else if(creativePgmFlg)
                {
                    NewText = "Viewed: " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ".";
                }
            else if(internetFlg)
                {   
                    NewText = "Retrieved " + CapitalizeAfter(NewText.toString().toLowerCase(), " ");                    
                }
			else if(bookFlg)
                NewText = "(Original work published " + NewText+")";
            else if(formName=="parliament")
                {
                     NewText = "(proposed " + CapitalizeAfter(NewText.toString().toLowerCase(), " ")+")";
                }
            else
            {
                if(isDateYYYYMonth(NewText) || isDateYYYYMonthDD(NewText))
                {
                    var NewTextArray;
					if(NewText.indexOf(",")!=-1)
                        NewTextArray = NewText.trimStart().split(",");
                    else
                        NewTextArray = NewText.trimStart().split(" ");

                    NewTextArray[0]=NewTextArray[0].replace(",", "");
					if(isDateYYYYMonth(NewText))
                    	NewText = "(" + FLUprCase(NewTextArray[0]) + ", " + FLUprCase(NewTextArray[1].trim()) + ").";
					else if(isDateYYYYMonthDD(NewText)){
						if(typeof(NewTextArray[2])!="undefined")
							NewText = "(" + FLUprCase(NewTextArray[0]) + ", " + FLUprCase(NewTextArray[1].trim()) +" "+NewTextArray[2] + ").";
						else
	                    	NewText = "(" + FLUprCase(NewTextArray[0]) + ", " + FLUprCase(NewTextArray[1].trim()) + ").";							
					}
                }
                else
                    NewText = "(" + CapitalizeAfter(NewText.toString().toLowerCase(), " ")+ ").";
            }
        }
    //chris - changed innertext property to innerhtml
    // document.getElementById(divName).innerHTML = NewText;

    }
    else if(textName == 'descriptor' && performanceFlg)
    {
        NewText = "Performance: " + FLUprCase(NewText) + ".";
    }
	else if(textName == 'format')
    {
        if(formName=="data" && document.getElementById('chkUnpublished') && document.getElementById('chkUnpublished').checked)
            {
                NewText="Unpublished raw data on "+NewText;
            }
            else if(document.getElementById('chkUnpublished') && document.getElementById('chkUnpublished').checked)
                {
                    NewText="Unpublished "+NewText;
                }
        NewText = FLUprCase(NewText) + "";
    }
    else if(textName == 'place')
    {
        if(exhibitFlg)
            NewText = "Exhibited at " + FLUprCase(NewText) + ".";
        else if(performanceFlg)
            NewText = "Performed at " + FLUprCase(NewText) + ".";
		else if(replaceFlg)
			NewText = "Reprint, " + FLUprCase(NewText)+ ":";	
        else
        {
            var NewTextarr;
		var check1=NewText.indexOf(",");
           	     	   NewTextarr = NewText.trimStart().split(" ");
		
		NewText=CapitalizeAfter(NewText," ") + ".";

	  }

  		NewText = ReplaceAnd(NewText);//.replace(/And /g,"and ");
		if(!document.getElementById(textName).value.match(/\b(A)\b/g)){
			NewText=NewText.replace(/\b(A)\b/g, "a");
		}

    }
    else if(textName == 'publisher' || textName=="parliament")
    { 
        if(paperFlg)
            {
                if(getFormName()=="corporatepresen")
                    {
                        NewText = FLUprCase(NewText) + ".";
                    }
                    else
                        {
                            NewText = "Paper presented at " + FLUprCase(NewText) + ".";
                        }
            }
		else if(posterFlg)
            NewText = "Poster presented at " + FLUprCase(NewText) + ".";
		else if(lectureFlg)
            NewText = "lecture presented at " + FLUprCase(NewText) + ".";
        else if(republisherFlg)
			NewText = FLUprCase(NewText) + ",";
		else if(academicFlg){
			desc = getInnerText("CiteDescriptor");
			if(desc!=''){
				NewText = FLUprCase(NewText) + ")";
				desc = desc.replace(").",",");
				setInnerText("CiteDescriptor", desc);
			}
			else
				NewText = FLUprCase(NewText) + ".";
		}
		else
		{
			NewText = CapitalizeAfter(NewText," ") + ".";
			//NewText = NewText.replace(/And /g,"and ");
		}
		NewText = ReplaceAnd(NewText);//.replace(/And /g,"and ");
		if(!document.getElementById(textName).value.match(/\b(A)\b/g)){
			NewText=NewText.replace(/\b(A)\b/g, "a");
		}

    }
    else if(textName == 'title' && titleFlg)
    {
                if(formName=="law_reports" || formName=="parliament")
                    {
                        NewText=NewText.replace(/\s+v\s+/i," v. ");
                        NewText = ucFirstAllWords(NewText);
                        NewText = ReplaceAnd(NewText) + ".";
                    }
		else if(NewText.indexOf(": ")!=-1)
		{
			
			var New =NewText.split(' ');
			New[1] = FLUprCase(New[1]);
			//NewText = New.join(" ");
			NewText = ReplaceAnd(NewText);
			NewText = CapitalizeAfter(CapitalizeAfter(NewText,". "),": ") + ".";
			
		}
		else if(!document.getElementById('author') || document.getElementById('author').value== ""){
			if(!document.getElementById('chapter') || document.getElementById('chapter').value== "" ){
				NewText=CapitalizeAfter(CapitalizeAfter(NewText,". "),": ")+ ".";
			}else{
				NewText=CapitalizeAfter(CapitalizeAfter(NewText,". "),": ")+ ".";
                                
                                if(formName=="parliament")
                                    {
                                        NewText=ReplaceAnd(ucFirstAllWords(NewText));
                                    }
			}
		}
		else{
			NewText = CapitalizeAfter(CapitalizeAfter(NewText,". "),": ") + ".";
		}

				
    }
    
	else if(textName == 'source' && frmtFlg)
    {
		NewText=CapitalizeAfter(NewText,". ");
    }
    else if(textName=="original_year")
        {
            NewText = "(Original work published " + NewText+")";
        }
	else if(textName == 'chapter' && frmtFlg)
    {
		if(!document.getElementById('author') || document.getElementById('author').value== ""){
			NewText=CapitalizeAfter(CapitalizeAfter(NewText,". "),": ");
		}else{
			
			NewText=CapitalizeAfter(CapitalizeAfter(NewText,". "),": ");
		}
    }
	else if(textName == 'record' && frmtFlg)
    {
        
        if(formName=="parliament" && document.getElementById('chkresolution') && document.getElementById('chkresolution').checked)
            {
                
                NewText="Res. "+CapitalizeAfter(NewText,". ");
            }
            else if(formName=="parliament" && document.getElementById('chkreport') && document.getElementById('chkreport').checked)
            {
                NewText="Rep. "+CapitalizeAfter(NewText,". ");
            }
            else if(formName=="legislation")//parliament
                {
                    console.log('par 1');
                    NewText=CapitalizeAfter(NewText,". ");
                    if(document.getElementById('chkhsc') && document.getElementById('chkhsc').checked)
                        {
                            NewText=NewText+" U.S.C.";
                        }
                        else if(document.getElementById('chkparl') && document.getElementById('chkparl').checked)
                            {
                                NewText=NewText+" Hansard.";
                            }
                            else
                                {
                                    NewText=NewText+'.';
                                }
                }
            else
                {
                    NewText=CapitalizeAfter(NewText,". ");                    
                }
    }
    else if(textName == 'year' && frmtFlg)
    {
		NewText=NewText;//CapitalizeAfter(NewText,". ");
    }
	else if(textName == 'author' && frmtFlg)
    {
		NewText=CapitalizeAfter(NewText,". ");
    }
	//MIS_18_april_'13
	else if(textName == 'city' && frmtFlg)
    {
		if(academicFlg){
			desc = getInnerText("CitePublisher");
			if(desc!=''){
				NewText = FLUprCase(NewText) + ")";
				desc = desc.replace(")",".");
				setInnerText("CitePublisher", desc);
			}
			else{
				NewText = FLUprCase(NewText) + ".";
			}
		}else{	
                    if(formName=="law_reports" && ((document.getElementById('law_district') && document.getElementById('law_district').checked) || 
                        (document.getElementById('law_state') && document.getElementById('law_state').checked)))
                        {
                            NewText=processDistrictName(NewText)+".";
                        }
                        else
                            {	
                                NewText=CapitalizeAfter(NewText,". ");                                
                            }
		}
    }
	else if(textName == 'descriptor' && frmtFlg)
    {
		
                /*if(getFormName()=="digitalPdf" || getFormName()=="internetPdf")
                {*/
                    NewText=makeKeywordsCapital(NewText).trim();                    
                /*}
                else
                {*/
                    //NewText=CapitalizeAfter(NewText,". ");
                //}
    }
	else if(textName == 'subject' && frmtFlg)
    {
		NewText=CapitalizeAfter(NewText,". ");
    }
	else if(textName == 'issue' && frmtFlg)
    {
		NewText=CapitalizeAfter(NewText,". ");
    }
	else if(textName == "volume")
    {
        
        if(patentsFlg)
        {	
            document.getElementById(divName).style.fontStyle = "italic";
            NewText = "Patent No. " + FLUprCase(NewText) + ".";
        }
        else if(journalFlg)
        {
           	document.getElementById(divName).style.fontStyle = "italic";
			//NewText = FLUprCase(NewText) + ",";	
			NewText = FLUprCase(NewText);//By MI 12-06-2012	
        }
        else if(formName=="tv_series")
            {
                document.getElementById(divName).style.fontStyle="normal";
                NewText = "Episode "+FLUprCase(NewText);
            }
		else if(refFlg)
        {
			document.getElementById(divName).style.fontStyle = "normal";	
			NewText = "Reel " + NewText + ".";
			showDiv("CiteCommaStart");
			showDiv("CiteCommaEnd");		
			setInnerText("CiteCommaStart", " (");
			setInnerText("CiteCommaEnd", ").");
        }
		else if(other == "archive")
        {
			NewText = "Box " + FLUprCase(NewText)+ '.';
			showDiv("CiteCommaStart");
			showDiv("CiteCommaEnd");		
			setInnerText("CiteCommaStart", " (");
			setInnerText("CiteCommaEnd", ").");
        }
        else if(legislationFlg || formName=="constitutions_conventions")
            {
                document.getElementById(divName).style.fontStyle = "normal";
                if(formName=="constitutions_conventions" || (document.getElementById('chkregulation') && document.getElementById('chkregulation').checked==true))
                {
                    NewText="&sect; "+NewText+".";
                }
            else if(document.getElementById('legi_cfr') && document.getElementById('legi_cfr').checked==true)
                {
                    NewText="F."+NewText + "d.";
                }
                else if((!document.getElementById('chkregulation') || document.getElementById('chkregulation').checked!=true) && 
                        document.getElementById('legis_congress') && document.getElementById('legis_congress').checked==true)
                    {
                        var stnd=getStNdRdTh(NewText);
                        NewText =NewText+stnd + " Cong.";
                    }
                    else
                        {
                            if((document.getElementById('chkresolution') && document.getElementById('chkresolution').checked==true)
                                ||
                            (document.getElementById('chkbill') && document.getElementById('chkbill').checked==true))
                                {
                                    var stnd=getStNdRdTh(NewText);
                                    NewText =NewText+stnd + " Parl.";
                                }
                                else
                                    {
                                        NewText = NewText + ".";
                                    }
                        }
            }
		else if(parliamentFlg)
		{
				document.getElementById(divName).style.fontStyle = "normal";	
				if($("#chkparl").val()=="Bill"){
					NewText = "s. " +NewText + ".";
				}else if($("#chkparl").val()=="Deb"){
					NewText = "Vol. " +NewText + ".";
				}
		}
        else if(swFlg)
        {
            document.getElementById(divName).style.fontStyle = "normal";
            NewText = "(Version " + FLUprCase(NewText) + ").";
        }
        else if(mapFlg)
        {
            document.getElementById(divName).style.fontStyle = "normal";
            NewText = "(Sheet No. " + FLUprCase(NewText) + ").";
        }
        else if(other=="publicationno")
            {
                document.getElementById(divName).style.fontStyle = "normal";
                NewText = "(Publication No. " + NewText + ").";
            }
		else if(NovolFlg)
                {
                    document.getElementById(divName).style.fontStyle = "normal";
			NewText = 	FLUprCase(NewText)+ '.';
                    }
       else if(formName=="law_reports")
        {
            document.getElementById(divName).style.fontStyle = "normal";
            if(document.getElementById('law_supreme') && document.getElementById('law_supreme').checked==true)
                {
                    NewText=NewText.replace(/^\u\.*\s*s\.*\s*/i,"");
                    NewText=NewText + ".";
                }
                else if(document.getElementById('law_circuit') && document.getElementById('law_circuit').checked==true)
                {
                    NewText="F."+NewText + "d.";
                }
                else if((document.getElementById('law_district') && document.getElementById('law_district').checked==true) || 
                    (document.getElementById('law_state') && document.getElementById('law_state').checked==true))
                {
                    var tmpp='';
                    if(document.getElementById('law_state') && document.getElementById('law_state').checked==true)
                        {
                            
                        }
                        else
                            {
                                tmpp="F. Supp. ";
                            }
                            NewText = tmpp+NewText + "d.";
                }
                else
                    {
                        NewText = NewText + ".";
                    }
        }
        else if(formName=="legislation")//parliament
            {
                
                document.getElementById(divName).style.fontStyle = "normal";
                if(document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked)
                    {
                        NewText = NewText+"  Stat.";
                    }
                    else
                        {
                            if(NewText.search("-")!=-1)
                            {
                                NewText = "Vols. " + NewText + ".";
                            }
                            else
                                NewText = "Vol. " + NewText + ".";
                        }
            }
        else
        {
            document.getElementById(divName).style.fontStyle = "normal";
            if(NewText.search("-")!=-1)
            {
                NewText = "(Vols. " + NewText + ").";
            }
            else
                NewText = "(Vol. " + NewText + ").";
        }
    }

    else if(textName == "edition")
    {
        var extn = "ed.).";
        var re2digit = /^\d{3}$/; //regular expression defining a 2 digit number

        var regRev1 = new RegExp("re[a-z]", "i")
        var regRev2 = new RegExp("re[a-z]+\\.\\s", "i")
        if(formName=="tv_series")
            {
                NewText =  "Season "+FLUprCase(NewText);
            }
        else if(formName=="parliament")
            {
                console.log('Test 111');
                NewText = FLUprCase(NewText) + ".";
                if(document.getElementById('legi_executiveorder') && document.getElementById('legi_executiveorder').checked)
                    {
                        NewText="Exec. Order No. "+NewText;
                    }
            }
        else if((NewText.search(regRev1)!=-1) ||(NewText.search(regRev2)!=-1) )
        {
            if(NewText.charAt(2)=="v")
                NewText = "(Rev. ed.).";
            else if (NewText.charAt(2)=="p")
                NewText = "(Reprint ed.).";
        }

        else if (NewText.search(re2digit))
        {
            if (NewText == "1" || NewText == "21")
                NewText = "(" + FLUprCase(NewText) + "st " + extn;
            else if (NewText == "2" || NewText == "22")
                NewText = "(" + FLUprCase(NewText) + "nd " + extn;
            else if (NewText == "3" || NewText == "23")
                NewText = "(" + FLUprCase(NewText) + "rd " + extn;
            else
                NewText = "(" + FLUprCase(NewText) + "th " + extn;
        }
        
        else
        {
            NewText = "(" + FLUprCase(NewText) + ".).";
        }
    }

    else if(textName == "accessed")
    {
        NewText = NewText.replace(/[()]/g,"");
        //if(performanceFlg)
          //  NewText = "Viewed " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ".";
        //else
           NewText = "Retrieved " + CapitalizeAfter(NewText.toString().toLowerCase(), " ");
    }
    else if(textName == "database")
    {
		NewText = FLUprCase(NewText) + ".";
		//NewText =  NewText ;//+ "." MIP
    }
    else if(textName == "http")
    {
		NewText = NewText ;//+ "." MIP
    }
    else if(!NewText.endsWith("."))
    {
        if(textName=="year" || textName=="pageBook" || textName == "role" ||
            textName=="subject" || textName == "record" ||
            ((textName=="descriptor") && reviewFlg) || ((textName=="descriptor") && !reviewFlg)){
        }
        else
            NewText = FLUprCase(NewText) + ".";
    }
	if(textName == 'year' && yearFlg)
    {	
		var idx=NewText.indexOf(' ');
		if(idx<0 || NewText.toLowerCase()=="in press") {
		//alert("called");
		//NewText = NewText.replace(/(/g,"");
		NewText = NewText.replace(/[()]/g,"");

		}
		else
		{
		var no;
		var arr = NewText.split(' ');
		if(arr.length==1){
			no = "";
		}else {
			no = arr[1];
		}
		if(arr[0].endsWith("."))	
			NewText = arr[0]+" " + no;
		else
			NewText = arr[0]+". " + no;	
		//NewText = str.toUpperCase().replace(/\b\w/g, function(match){return match.toLowerCase();});//FULowCase(
		//alert(NewText);
		}
    }
	//MIS_19_April_'13
	if(textName == 'date' && dateFlg)
    {	
		if(NewText.toLowerCase().indexOf('n.d.')>=0 || NewText.toLowerCase().indexOf('nd.')>=0)
                {
                    NewText = NewText.replace("N.d.","n.d.");
                    NewText = NewText.replace("Nd.","n.d.");
                }
                else if(NewText.toLowerCase().indexOf('nd')>=0)
                    {
                        NewText = NewText.replace("Nd","n.d.");
                    }
                else if(NewText.toLowerCase().indexOf('n.d')>=0)
                    {
                        NewText = NewText.replace("N.d","n.d.");
                    }
                else
                    {
                        NewText = FLUprCase(NewText) + ".";
                    }
    }
	
    /*chris added new way to handle chars in authors 17 July 09*/
    if(textName =="author"){
			NewText=HandleAuthors(NewText.replace(",,",","),textName);
                        NewText=NewText.replace(",,",",");
                        NewText=NewText.replace(", .",",");
                        NewText=NewText.replace(/\.{2,}\s*$/,'.');
	}
	if(textName=="editor" || textName=="trans" || textName=="producer" || textName=="revauthor")
    {
		NewText=HandleAuthors(NewText.replace(",,",","),textName);
                NewText=NewText.replace(",,",",");
		NewText=NewText.replace(", .",",");
                NewText=NewText.replace(/\.{2,}\s*$/,'.');
    }
    
   
    
    /*chris end of area.*/
    var matchStrc = /^author[0-9]+$/;
    var matchStrd = /^producer[0-9]+$/;
    var matchStre = /^editor[0-9]+$/;
    var matchStrf = /^trans[0-9]+$/;
    var matchStrg = /^revauthor[0-9]+$/;
    if(textName.search(matchStrc)==0 || textName.search(matchStrd)==0 || textName.search(matchStre)==0 || textName.search(matchStrf)==0 || textName.search(matchStrg)==0)
    {
		if(NewText.endsWith(".") && textName.search(matchStrc)==0)
			NewText = NewText.slice(0,-1);
		NewText=HandleAuthors(NewText.replace(",,",","),textName);
                
                if(NewText.endsWith(".."))
                    NewText = NewText.substr(0,NewText.length-1);
    }

    if(textName == "editor" && document.getElementById("CiteEditor"))
    {
        if(NewText!="")
        {
            if (reviewFlg) 
            {
                if(document.getElementById('author') && document.getElementById('author').value == "")
                    setInnerText("CiteEd", ", directed by");
                else
                    setInnerText("CiteEd", " Directed by");
            }
            else
                setInnerText("CiteEd",myTitle); 
        }
        else
            setInnerText("CiteEd","");

        if ( document.getElementById(textName).value!= "")
        {
			
            if(myTitle == ", Trans.)." || myTitle == ", Narr.)." || myTitle == ", Narrs.).")
            {
                NewText = "(" + NewText;
            }
			//remove last .
			NewText = NewText.slice(0,NewText.length-1); //LC02052015
			//alert(NewText);
                        /*var arrNT=NewText.split(' ');
                        var tmpstrNT='';
                        if(arrNT.length>1)
                            {
                                var tmpi;
                                for(tmpi=0;tmpi<(arrNT.length-1);++tmpi)
                                    {
                                        if(tmpi>0)
                                            {
                                                tmpstrNT+=' ';
                                            }
                                            var wrd=arrNT[tmpi];
                                            if(wrd.replace(".","").length==1)
                                            {
                                                wrd=wrd.replace(".","");
                                                wrd+='.';
                                            }
                                            tmpstrNT+=wrd;
                                    }
                                    tmpstrNT+=' '+arrNT[tmpi].replace(".","");
                                    NewText=tmpstrNT;
                            }*/
            
            if(formName=="parliament")
                {
                    NewText="(testimony of "+NewText+")";
                }
                        
            document.getElementById(divName).innerHTML = " "+NewText;
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            
        }
       
    }
    
    if(textName == "author" && document.getElementById("CiteAuthor"))
    {
        if(mapFlg)
        {
            
                setInnerText("CiteAuth",myTitle); 
        }
        
       
    }

    if(textName == "revauthor" && document.getElementById("CiteRevAuth") )
    {
        if(copyVal != "")
            setInnerText("CiteRevAuth",myTitle);
        else
            setInnerText("CiteRevAuth","");

    }

    if(textName == "trans" && document.getElementById("CiteTrans") )
    {
       // alert(myTitle)
        if(copyVal != "")
            setInnerText("CiteTra", myTitle);
        else
            setInnerText("CiteTra","");
        if (document.getElementById(textName).value!= "")
        {
            NewText = "(" + NewText;
			//remove last .
			NewText = NewText.slice(0,NewText.length-1);
            document.getElementById(divName).innerHTML = NewText;
        }
        else
            document.getElementById(divName).innerHTML = "";

    }

    if(textName == "producer" && document.getElementById("CiteProd") && getInnerText("CiteProd") != " (Producers).")
    {
        if(copyVal != "")
            setInnerText("CiteProd",myTitle);
        else
            setInnerText("CiteProd","");

    /*if(document.getElementById('author').value == "")
		{
			showDiv('CiteAuthor');
			document.getElementById('CiteAuthor').innerHTML = document.getElementById('CiteEd').innerText + document.getElementById('CiteEditor').innerText;
		}*/

    }

    var matchStr5 = /^trans[0-9]+$/;
    if(!textName.search(matchStr5))
    {
        for(var i=2; i<numOfTrans ; i++)
            setInnerText('CiteAndTRA'+i, "");

        var last = numOfTrans - 1;

        if(last == 2)
        {
            setInnerText('CiteCommaTRA2', "");
        }
        else
        {
            setInnerText('CiteCommaTRA'+last, ", ");
            setInnerText('CiteCommaTRA2', ", ");

            var index =0;
            var tmp ="";
        }


        if(textName == 'trans'+last)
        {
		if((document.getElementById('editor').value != "") && (document.getElementById('editor2').value != "")) 

            setInnerText('CiteAndTRA'+last, " &");
        }

        //chris changed innertext to inner html
        document.getElementById(divName).innerHTML = NewText;


    }

    var matchStr4 = /^revauthor[0-9]+$/;
    if(!textName.search(matchStr4))
    {
        for(var i=2; i<numOfRevAuthors ; i++)
            setInnerText('CiteAndRA'+i,"");

        var last = numOfRevAuthors - 1;

        if(last == 2)
        {
            setInnerText('CiteCommaRA2',"");
        }
        else
        {
            setInnerText('CiteCommaRA'+last, ", ");
            setInnerText('CiteCommaRA2', ", ");

            var index =0;
            var tmp ="";
        }


        if(textName == 'revauthor'+last)
        {
		if((document.getElementById('revauthor').value != "") && (document.getElementById('revauthor2').value != "")) 
                {
                    if(getFormName()=="creativeReview")
                    {
                        setInnerText('CiteAndRA'+last," & ");
                    }
                    else
                    {
                        setInnerText('CiteAndRA'+last," &");
                    }
                }
        }

        //chris changed inner text to innerhtml
        document.getElementById(divName).innerHTML = NewText;


    }

    var matchStr3 = /^producer[0-9]+$/;
    if(!textName.search(matchStr3))
    {
        for(var i=2; i<numOfProducers ; i++)
            setInnerText('CiteAndP'+i,"")

        var last = numOfProducers - 1;

        if(last == 2)
        {
            setInnerText('CiteCommaP2', "");
        }
        else
        {
            setInnerText('CiteCommaP'+last, ", ");
            setInnerText('CiteCommaP2', ", ");

            var index =0;
            var tmp ="";
        }

        if(textName == 'producer'+last)
        {
		if((document.getElementById('producer').value != "") && (document.getElementById('producer2').value != "")) 
            { setInnerText('CiteAndP'+last, " &"); }
         }

        //chris - changed innertext property to innerhtml
		
        document.getElementById(divName).innerHTML = NewText;
		
    }

    var matchStr = /^author[0-9]+$/;
    var matchStr2 = /^editor[0-9]+$/;
    if(!textName.search(matchStr) || !textName.search(matchStr2))
    {
       
        if(!textName.search(matchStr))
        {
			//NewText = ReplaceA(NewText,textName);

            for(var i=2; i<numOfAuthors ; i++)
            {
                setInnerText('CiteAndA'+i,"");
				setInnerText('CiteEnd'+i,"");
            }

            var last = numOfAuthors - 1;
            if(last == 2)
            {
				 var index2 =  getInnerText('CiteAuthor').length - 1;
                    var tmp2 = getInnerText('CiteAuthor');
                    var authVal=$("#author").val().trim();
                    if(authVal!='')
                    {
                        var arrAuth=authVal.split(" ");
                        if(arrAuth[arrAuth.length-1].length>1)
                        {
                           tmp2=trimLastChar(tmp2,".");
                        }
                    }
                    /*if(tmp2.endsWith("."))
                        tmp2 = tmp2.slice(0,index2);*/ //LC02052015
                    setInnerText('CiteAuthor', tmp2);
                    if(($('#author'+last).val())=="")
                        {
                            setInnerText('CiteCommaA2',"");
                            //numOfAuthors=numOfAuthors-1;
                        }
                        else
                            {   
                                setInnerText('CiteCommaA2',",");
                            }
            }
            else
            {

               // setInnerText('CiteCommaA'+last,"., "); //RD 4 REPET
               // setInnerText('CiteCommaA2',"., "); //RD 5 REPET
				
                                var secondLast=last-1;
                                console.log('last: '+secondLast);
                                var tmp2 = getInnerText('CiteAuthor'+secondLast);
                                var authVal=$("#author"+secondLast).val().trim();
                                if(authVal!='')
                                {
                                    var arrAuth=authVal.split(" ");
                                    if(arrAuth[arrAuth.length-1].length>1)
                                    {
                                       tmp2=trimLastChar(tmp2,".");
                                    }
                                }
                                setInnerText('CiteAuthor'+secondLast, tmp2);
                                
                                
				if(document.getElementById('CiteCommaA9')){
				setInnerText('CiteCommaA9'," ");
				}else
				{
                                    if(($('#author'+last).val())=="")
                                    {
                                        setInnerText('CiteCommaA'+last," ");
                                        //numOfAuthors=numOfAuthors-1;
                                    }
                                    else
                                        {   
                                            setInnerText('CiteCommaA'+last,", ");
                                        }

				}
                setInnerText('CiteCommaA2',", ");

                var index =0;
                var tmp ="";
            }

            if(textName == 'author'+last)
            {
		      if((document.getElementById('author').value != "") && (document.getElementById('author2').value != "")){ 
			  	if(document.getElementById('CiteAndA9')){
					setInnerText('CiteAndA'+last," ");
				}
				else{
                                    if(($('#author'+last).val())=="")
                                    {
                                        
					setInnerText('CiteAndA'+last,"");
                                        if(($('#author'+(last-1)).val())!="")
                                            {
                                                setInnerText('CiteAndA'+(last-1)," & ");
                                            }
                                    }
                                    else
                                        {   
					setInnerText('CiteAndA'+last," & ");
                                        }
					var  perNo = eval("document.perNo" +textName);
					if(perNo==1){
						setInnerText('CiteEnd'+last,".");
					}
				}
			  }
		    }
                    
            if(document.getElementById('chkauthor'))
                {   
                    clearGroupAll(document.getElementById('chkauthor'),'editor','CiteAuth');                    
                } 
                
                 if(formName=="podcast")
                       {
                           if(document.getElementById('chkproducer'))
                               {
                                   clearCreativeGroup(document.getElementById('chkproducer'),'host');
                               }
                       }

        }

        else
        {
            
            for(var i=2; i<numOfEditors ; i++)
                setInnerText('CiteAndE'+i,"");

            var last = numOfEditors - 1;

            if(last == 2)
            {
				/* var index2 =  getInnerText('CiteEditor').length - 1;
                    var tmp2 = getInnerText('CiteEditor');

                    if(tmp2.endsWith("."))
                        tmp2 = tmp2.slice(0,index2);
                    setInnerText('CiteEditor',tmp2);*/ //LC01052015 Let the  dot apper after name, this code was removing the dot
                setInnerText('CiteCommaE2',""); //LC03052015 comma added for editors before &
            }
            else
            {
                setInnerText('CiteCommaE'+last,", ");
                setInnerText('CiteCommaE2',", ");

                var index =0;
                var tmp ="";
				
            }

            if(textName == 'editor'+last)
            {
		    if((document.getElementById('editor').value != "") && (document.getElementById('editor2').value != "")) 
                setInnerText('CiteAndE'+last, " & ");
            }
            
              
        }
        
        
        /*if(formName=="tv_series" || getFormName()=="DigitalDVD")
            {*/
                if(isAllEditorsBlank()!=true)
                    {   
                        setInnerText("CiteEd",myTitle);                         
                    }
            /*}
            else
                {   
                    setInnerText("CiteEd",myTitle);                 
                }*/
        
        //chris - changed innertext property to innerhtml
		if(!textName.search(matchStr2))
			NewText = NewText.slice(0,NewText.length-1);
        document.getElementById(divName).innerHTML = NewText;
        putInterviewOfBy();
        if(firstFieldId=='author')
            {

                if(isAllAuthorsBlank()==true && formName!="review")
                {     
                    showDiv('CiteAuthor');
                    var fontStyle=$('#CiteEditor').css("font-style");
                    $("#CiteAuthor").css("font-style",fontStyle);
                    reformatEditor(other);

                }
            }


    /*if(document.getElementById('author').value == "")
		{
			showDiv('CiteAuthor');
			document.getElementById('CiteAuthor').innerHTML = document.getElementById('CiteEd').innerText + document.getElementById('CiteEditor').innerText;
			document.getElementById('VirCiteAuthor').innerHTML = document.getElementById('VirCiteEditor').innerText;
		}*/
        
    }

    else if(textName == 'author')
    {
		//alert(NewText);
		//NewText = ReplaceA(NewText,textName);
        if(NewText!="")
        {
            if(divName=="CiteAuthor")
            {
                $("#CiteAuthor").css("font-style",'normal');
            }
            ////chris - changed innertext property to innerhtml
            
            if(reviewFlg)
            {
                //document.getElementById(divName).innerHTML = ", by " + FLUprCase(NewText);//LC020715
                document.getElementById(divName).innerHTML =FLUprCase(NewText);
            }
            else
            {
                document.getElementById(divName).innerHTML = FLUprCase(NewText);
                
            }

            noAuthorFlg = false;
        }
        else
        {
            //if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML!='')
            //{
              //  lc_text=document.getElementById('CiteEditor').innerHTML;
                //if(lc_text.charAt(1)=="&")
                //{
                  //  lc_textnew=lc_text.replace(/\s*\&amp;\s*/, "");
                    //document.getElementById('CiteEditor').innerHTML=lc_textnew;
                //}
            //}
            document.getElementById(divName).innerHTML = "";
        }
        putInterviewOfBy();
        $('#previewEditors').remove();
        $('#CiteEditor').show();
        $('#CiteEd').show();
        $('#VirCiteEditor').show();
        if(formName!="review")
            {
                reprocessEditorChapterTitle();
            }
    }
   
    else if(textName == 'revauthor' && other =="tvdirector")
    {
		if(NewText!="")
                    {
                        var preS='';
                        if(isAllAuthorsBlank()!=true || isAllEditorsBlank()!=true)
                            {
                                preS='&nbsp;&';
                            }
                        document.getElementById(divName).innerHTML = preS+" " + FLUprCase(NewText);
                    }
		 else
            document.getElementById(divName).innerHTML = "";
    }
    else if(textName == 'revauthor' && reviewFlg)
    {
        document.getElementById(divName).innerHTML = FLUprCase(NewText);

        noAuthorFlg = false;
    }
    else if(textName == 'producer' && performerFlg)
    {
		if(NewText!="")
                    {
          document.getElementById(divName).innerHTML = "&nbsp;[Recorded by " + FLUprCase(NewText);
                    }
		 else
            document.getElementById(divName).innerHTML = "";
     }
	else if(textName=="year")
    {
        formatSource();
        
        if(NewText!="")
        {
            if(NewText=="n.d" || NewText=="nd." || NewText=="nd")
                {
                    NewText="n.d.";
                }
            //MIS_16_april_13
			if(reviewFlg)
                            {
                                NewText=inpressText(NewText,'CiteYear');
                document.getElementById(divName).innerHTML = "," + "&nbsp;" + NewText;
                            }
                            else if(formName=="constitutions_conventions")
                                {
                                    document.getElementById(divName).innerHTML = " " + "(repealed " + NewText + ").";
                                }
            else if (govFlg)
                {
                    NewText=inpressText(NewText,'CiteYear');
                    if(formName=="law_reports")
                       {
                           if((document.getElementById('law_circuit') && document.getElementById('law_circuit').checked && $("#record").val()!='') ||
                                   (document.getElementById('law_district') && document.getElementById('law_district').checked && $("#city").val()!='') || 
                               (document.getElementById('law_state') && document.getElementById('law_state').checked && $("#city").val()!=''))
                               {
                                   document.getElementById(divName).innerHTML = " " + NewText;
                               }
                               else
                                   {
                                       document.getElementById(divName).innerHTML = NewText;
                                   }
                       }
                       else
                           {
                               document.getElementById(divName).innerHTML = "&nbsp;" + NewText;
                           }
                }
                else
                {
                    NewText=inpressText(NewText,'CiteYear');
				document.getElementById(divName).innerHTML = "&nbsp;" + "(" + NewText + ").";
                }
	  }
        else
        {
			//chkPlcAndDate();//12-07-16 BY JT
            document.getElementById(divName).innerHTML = "";
            //chkYearDate();
        }
        
    }
	else if(textName == 'database'){
		 if(NewText!=""){
			if(other=="outsidehttp"){ 
				NewText = ucFirstAllWords(NewText);
				NewText = ReplaceAnd(NewText);
                                document.getElementById(divName).style.fontStyle='italic';
				if(getFieldValue('http')=='')
                                    {
                                        
                                        showDiv('CiteSource');
                                        setInnerText("CiteSource", " Available from");
                                        NewText = " "+NewText;
                                    }
                                    else
                                        {
                                            setInnerText("CiteSource", "");
                                            NewText = " "+NewText;
                                        }
                                        outsidehttpFlg=true;
			}else{	
				showDiv('CiteAccessed');
				setInnerText("CiteAccessed", " Retrieved from");
				NewText = ucFirstAllWords(NewText);
				NewText = ReplaceAnd(NewText);
			}	
			document.getElementById(divName).innerHTML = " " +  NewText;
		 }else{
			setInnerText("CiteAccessed", "");
            document.getElementById(divName).innerHTML = "";
		 }
	}
    else if(textName == 'http')
    {
        
      if(NewText!=""){
		//checkHttpalert();
		if(other=="noalert"){}else{
                    if(outsidehttpFlg==true)
                        {
                            Internetdb();
                        }
                        else{
			Internetpubplace();
                        }
        }
        //showDiv('CiteAccessed');
         // setInnerText("CiteAccessed", " Retrieved from");
         var strFrom =' Retrieved from';
                if((document.getElementById('retrievedDate') && document.getElementById('retrievedDate').checked==true) || (document.getElementById('accessed') && document.getElementById('CiteAccessed') && $("#accessed").val()!='' && $("#CiteAccessed").html()!=''))
                    {
                        strFrom =' from';
                    }
                    else
                        {
                            strFrom='';
                        }
                        console.log('strFrom '+strFrom);
          document.getElementById(divName).innerHTML =strFrom+" " + NewText;
		if((NewText.search(/http:\/\//) != 0 && NewText != "") && (NewText.search(/https:\/\//) != 0 && NewText != ""))        
        {
            checkDoiEligibility(NewText);
            if((NewText.toLowerCase().startsWith("doi:")) || (NewText.toLowerCase().startsWith("doi ")))
            {
				if(!document.getElementById('database')){
					//setInnerText("CiteAccessed", "");
				}
                NewText = NewText.replace("oi ", "oi: ");
                NewText = NewText.replace("oi:", "oi:");
                NewText = NewText.replace("OI ", "OI: ");
                
                        var tm=NewText.replace(/doi\:*/i,'').trim();
                        tm=makeDoiUrl(tm);
                        document.getElementById(divName).innerHTML = " " + tm;
                    
            }
            else if(checkDoiEligibility(NewText))
                {
                    var tm=makeDoiUrl(NewText);
                    document.getElementById(divName).innerHTML = " " + tm;
                }
            else
            {
                /*if(document.getElementById('accessed') && document.getElementById('accessed').value == ""){
                    showDiv('CiteAccessed');
                    setInnerText("CiteAccessed", " Retrieved "+$("#accessed").attr("placeholder"));
                }
				if(document.getElementById('database') && document.getElementById('database').value == ""){
					//showDiv('CiteAccessed');
					//setInnerText("CiteAccessed", " Retrieved from");
				}else if(!document.getElementById('database')){
					//showDiv('CiteAccessed');
					//setInnerText("CiteAccessed", " Retrieved from");
				}else if(document.getElementById('database') && document.getElementById('database').value != ""){
					var db = document.getElementById('CitePublication').innerHTML;
					if(other=="data")
						db = db.replace(/[.;]$/," web site:");	
					else
                                            {
                                                if(getFormName()!="AcademicDissertation" && getFormName()!="AcademicEdb")
                                                    {   
                                                        db = db.replace(/[.;]$/,":");                                                         
                                                    }
                                            }
					document.getElementById('CitePublication').innerHTML = db;
				}*/
				
				 document.getElementById(divName).innerHTML = strFrom+" http://" + NewText;
            }
		}
                var Plc=getInnerText("CitePlace").trim();
                var Cty=getInnerText("CiteCity").trim();
                if(Plc.indexOf('n.p.')>=0)
                    {
                        setInnerText("CitePlace","");
                    }
                    if(Cty.indexOf('n.p.')>=0)
                    {
                        setInnerText("CiteCity","");
                    }
      }
      else{
		if(document.getElementById('database') && document.getElementById('database').value == ""){
			//showDiv('CiteAccessed');
                        //setInnerText("CiteAccessed", "");
			//setInnerText("CiteAccessed", " Retrieved from");
		}else if(!document.getElementById('database')){
			//showDiv('CiteAccessed');
                        //setInnerText("CiteAccessed", "");
			//setInnerText("CiteAccessed", " Retrieved from");
		}else if(document.getElementById('database') && document.getElementById('database').value != ""){
			var db = document.getElementById('CitePublication').innerHTML;
			db = db.replace(/[:;]$/,".");
			document.getElementById('CitePublication').innerHTML = db;
		}
		document.getElementById(divName).innerHTML = "";
                //setInnerText("CiteAccessed", "");
		}
                if(outsidehttpFlg==true)
                    {
                        ReloadTextDiv2('database','CitePublication','outsidehttp');
                    }
    }
    else if(textName =="page" || ((textName=="pageJournal" || textName=="pageBook")))
    {
		id = textName;
    	NewText = document.getElementById(id).value;
		NewText = NewText.replace(/\s{2,}/g, ' ');
		//alert(NewText);	
		var pos = NewText.indexOf(' ');
		var pos1 = NewText.indexOf(',');
		//alert(pos1);
                
            var prevDiv=getPreviousFilledDiv(divName);    
            var srcType=getPageSectionGlobal();  
		if ( NewText!= "")
        {
            
            var eLocatorStr='';
            if(document.getElementById('chkeLocator') && document.getElementById('chkeLocator').checked)
                {
                    eLocatorStr=' Article';
                    if(NewText.match(/^e[0-9]+/))
                        {
                            eLocatorStr+=' ';
                        }
                        else
                            {
                                eLocatorStr+=' e';
                            }
                      NewText=NewText.trim();      
                }
                var tmpeTxt=eLocatorStr;
                if(tmpeTxt=='')
                    {
                        tmpeTxt=' ';
                    }
            
			if(pos!=-1)
			{	
			Text = NewText.split(' ');	
				if(pos1!=-1)
				{
										
					document.getElementById(divName).innerHTML = Text.join('&nbsp;') + ".";
					if((document.getElementById(divName).innerHTML.indexOf('&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('&nbsp;');	
						document.getElementById(divName).innerHTML = eLocatorStr+Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split(',,&nbsp;');	
						document.getElementById(divName).innerHTML = eLocatorStr+Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;,'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;,');	
						document.getElementById(divName).innerHTML = eLocatorStr+Text.join(',&nbsp;') ;	
					}
				}
                                else{
                                            document.getElementById(divName).innerHTML =tmpeTxt+FLUprCase(NewText)+".";
                                        
                                        
				}
console.log('CitePage:::1 '+$("#CitePage").html());
			}
                        
			else{
                                        
                            
				var tmpTxt='';
                            if(srcType=="books" || other=="bracket")// || formName=="parliament")
                                {
                            if(NewText.search("-")!=-1){
                              tmpTxt =  "pp. "+NewText; 
                            }else{
                                tmpTxt =  "p. "+NewText;
                                
                            }
                                }
                                else
                                    {
                                        tmpTxt=NewText;                                        
                                    }
                            
                            document.getElementById(divName).innerHTML =  tmpeTxt + tmpTxt + ".";
                            
                            console.log('CitePage::: 2'+$("#CitePage").html()+' '+prevDiv);
                            if(srcType=="books" || other=="bracket" || srcType=="periodicals")
                                {
                                    
                                    if(typeof prevDiv !="undefined" && prevDiv!='')                                        
                                        {
                                            var tm=$("#"+prevDiv).html();
                                            if(tm!='')
                                                {
                                                    tm=tm.replace(/\.$/,',');
                                                    $("#"+prevDiv).html(tm);
                                                }
                                        }
                                }
                                
                                console.log('CitePage:::3 '+$("#CitePage").html());
			}
                        
                        if(formName!="legislation")//parliament
                            {
                                if(textName=="pageBook" && (srcType=="books" || other=="bracket" || srcType=="reference"))
                                {
                                    formatEdVolPg();
                                }
                                if(typeof document.dontdisplaycitalrt == "undefined" || document.dontdisplaycitalrt==false)
                                    {
                                        mainCitationOnlyText(textName);
                                    }
                            }
                            else
                                {
                                    if(document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked)
                                        {
                                           // 
                                        }
                                        else
                                            {
                                               // formatEdVolPg();
                                            }
                                }
                            
		}
		else{
			 document.getElementById(divName).innerHTML = "";
                         if(textName=="pageBook" && (srcType=="books" || srcType=="reference"))
                                {
                                    formatEdVolPg();
                                }
                         if(srcType=="books" || srcType=="periodicals")
                                {
                                    
                                    if(typeof prevDiv !="undefined" && prevDiv!='')                                        
                                        {
                                            var tm=$("#"+prevDiv).html();
                                            if(tm!='')
                                                {
                                                    tm=tm.replace(/\,$/,'.');
                                                    $("#"+prevDiv).html(tm);
                                                }
                                        }
                                }
		}
                
                console.log('CitePage::: '+$("#CitePage").html());
	}
	else if(textName =="pageBook")
    {
		
        NewText = NewText.replace(/\s{2,}/g, ' ');
		//alert(NewText);	
                NewText=NewText.trim();
		var pos = NewText.indexOf(' ');
		var pos1 = NewText.indexOf(',');
		//alert(pos1);
                if(markBlankFlg==true)
                    NewText="";
		if ( NewText!= "")
        {
			if(pos!=-1)
			{	
			Text = NewText.split(' ');	
				if(pos1!=-1)
				{
										
					//document.getElementById(divName).innerHTML = Text.join('&nbsp;') + ".";
                                        document.getElementById(divName).innerHTML = Text.join('&nbsp;');
					if((document.getElementById(divName).innerHTML.indexOf('&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split(',,&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;,'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;,');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
				}else{
					//document.getElementById(divName).innerHTML = Text.join(',&nbsp;') + ".";
                                        document.getElementById(divName).innerHTML = Text.join(',&nbsp;');
					//---
					if((document.getElementById(divName).innerHTML.indexOf('-,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('-,&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join('-&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;-.'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;-');	
						document.getElementById(divName).innerHTML = Text.join('&nbsp;-') ;	
					}
					//--
				}
                                document.getElementById(divName).innerHTML=" pp. "+document.getElementById(divName).innerHTML;
					 formatEdVolPg();
			}
			else{
                            
                            
				var tmpTxt='';
                            if(NewText.search("-")!=-1){
                              tmpTxt =  "pp. "+NewText; 
                            }else{
                                tmpTxt =  "p. "+NewText;
                                
                            }
                            if(pageSec=="corporate" && formName=="conference_notes")
                                {
                                    tmpTxt="("+tmpTxt+").";
                                }
                                document.getElementById(divName).innerHTML =" "+tmpTxt;
                                if(pageSec=="corporate" && formName=="conference_notes")
                                    {
                                        //
                                    }
                                    else
                                        {
                                            formatEdVolPg();
                                        }
			}
		}
		else{
			 document.getElementById(divName).innerHTML = "";
			 formatEdVolPg();
		}
                if(retainAlertFlg==true)
                    {
                        var chapterBlankFlag=true;
                        if(document.getElementById('chapter') && $("#chapter").val()!="")
                        {
                            chapterBlankFlag=false;
                        }
                        if(chapterBlankFlag==true)
                            {
                                pageNumberRetain();
                            }   
                    }
	}
	
	
	else if(textName =="pageJournal")
    {
		id = "pageJournal";
    	NewText = document.getElementById(id).value;
		NewText = NewText.replace(/\s{2,}/g, ' ');
                NewText=NewText.trim();
		//alert(NewText);	
		var pos = NewText.indexOf(' ');
		var pos1 = NewText.indexOf(',');
		//alert(pos1);
		if ( NewText!= "")
        {
			if(pos!=-1)
			{	
			Text = NewText.split(' ');	
				if(pos1!=-1)
				{
									
					document.getElementById(divName).innerHTML = Text.join('&nbsp;') + ".";
					if((document.getElementById(divName).innerHTML.indexOf('&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split(',,&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;,'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;,');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
				}else{
					document.getElementById(divName).innerHTML = Text.join(',&nbsp;') + ".";
					//---
					if((document.getElementById(divName).innerHTML.indexOf('-,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('-,&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join('-&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;-.'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;-');	
						document.getElementById(divName).innerHTML = Text.join('&nbsp;-') ;	
					}
					//--
				}
                                if(newsFlg || displayPFlg){
                                    var tmp;
                                            tmp=document.getElementById(divName).innerHTML;
					if(tmp.search("-")!=-1 || tmp.search(",")!=-1){
					  tmp =  " pp. "+tmp;  
					}else{
						tmp =  " p. "+tmp;
					}
                                        document.getElementById(divName).innerHTML = tmp;
				}
			}
			else{
				if(newsFlg || displayPFlg){
					if(NewText.search("-")!=-1){
					  NewText =  " pp. "+NewText;  
					}else{
						NewText =  " p. "+NewText;
					}
				}
				if(document.getElementById('volume') && document.getElementById('volume').value!= ""){
					if(!document.getElementById('issue') || document.getElementById('issue').value== ""){
						document.getElementById(divName).innerHTML = ",&nbsp;" + NewText + ".";
					}else{
						document.getElementById(divName).innerHTML = "&nbsp;" + NewText + ".";
					}
					
				}else{
					document.getElementById(divName).innerHTML = " " + NewText + ".";
				}
			}
			
			if(document.getElementById("CiteIssue")!=null){
				var divValue = document.getElementById("CiteIssue").innerHTML;
				if(divValue!=""){
					if(divValue.endsWith(".")){
							var replacement =",";
							document.getElementById("CiteIssue").innerHTML = divValue.replace(/.([^.]*)$/,replacement+'$1');
						}
					}
				}
		}
		else{
			 document.getElementById(divName).innerHTML = "";
			 if(document.getElementById("CiteIssue")!=null){
				var divValue = document.getElementById("CiteIssue").innerHTML;
				if(divValue!=""){
					if(divValue.endsWith(",")){
							var replacement =".";
							document.getElementById("CiteIssue").innerHTML = divValue.replace(/,([^,]*)$/,replacement+'$1');
						}
					}
				}
		}
	}
	
    else if(textName=="edition")
    {
        if( NewText!= "")
        {
            document.getElementById(divName).innerHTML = "&nbsp;" + NewText;
            if(bookFlg)
            {
                formatEdVolPg();
            }
            else
            {
                document.getElementById(divName).innerHTML = "&nbsp;"+ NewText;
            }
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            if(bookFlg)
            {
                formatEdVolPg();
            }
        }
    }

    else if(textName=="volume")
    {
        if(journalFlg)
			CiteTitleFormat();
		
	if( NewText!= "")
        {
            console.log(NewText);
            
            document.getElementById(divName).innerHTML = NewText;
            
            
            
            if(bookFlg && formName!="legislation")//parliament //&& document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked))
            {
                formatEdVolPg();
            }
            else if(mapFlg)
            {
                formatVolIss();
            }else if(refFlg)
            {
                    document.getElementById(divName).innerHTML =  NewText;
            }
            else if(NovolFlg){
                if(formName!="law_reports" && document.getElementById('CiteSubject') && $("#CiteSubject").html().trim()!='')
                    {
                        var tmp=$("#CiteSubject").html();
                        tmp=tmp.replace(/\.*\:*$/,':');
                        $("#CiteSubject").html(tmp);
                    }
                    document.getElementById(divName).innerHTML = "&nbsp;"+NewText;
            }
            else
            {
                document.getElementById(divName).innerHTML = "&nbsp;"+ NewText;
            }
            
           
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            if(bookFlg)
            {
                formatEdVolPg();
            }
            else if(mapFlg)
            {
                formatVolIss();
            }
            else if(NovolFlg){
                if(document.getElementById('CiteSubject') && $("#CiteSubject").html().trim()!='')
                    {
                        var tmp=$("#CiteSubject").html();
                        tmp=tmp.replace(/\.*\:*$/,'.');
                        $("#CiteSubject").html(tmp);
                    }
            }
        }
    }

    else if(textName == "record")
    {
        var tmpHrs='';
        if(formName=="parliament")
            {
                if(document.getElementById('chkregulation') && document.getElementById('chkregulation').checked==true)
                    {
                        
                    }
                    else
                        {
                            if(document.getElementById('legi_hr') && document.getElementById('legi_hr').checked)
                                {
                                    tmpHrs='H.R. ';
                                }
                                else if(document.getElementById('legi_s') && document.getElementById('legi_s').checked)
                                    {
                            tmpHrs='S. ';
                        }
                        }
            }
            
        if( NewText!= "")
        {
            var tmpFlg=false;
            if(document.getElementById('chkregulation') && document.getElementById('chkregulation').checked==true && 
                    ((document.getElementById('legi_cfr') && document.getElementById('legi_cfr').checked==true)
                    || (document.getElementById('legi_executiveorder') && document.getElementById('legi_executiveorder').checked==true)))
                    {
                        NewText =NewText+ " C.F.R.";
                        tmpFlg=true;
                    }
                    else
                        {
                            NewText=tmpHrs+NewText;
                        }
            if(internetFlg)
            {
                document.getElementById(divName).innerHTML = "&nbsp;(Document. No. "  + FLUprCase(NewText) + ").";
            }
            //            else if(parFlg)
            //            {
            //                document.getElementById(divName).innerHTML = "&nbsp;(Cat. No. "  + FLUprCase(NewText) + ").";
            //            }
            else if(govFlg)
            {
                document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            }
            else if(reportFlg)
                {
                    if(NewText.toLowerCase().indexOf("publication no")>-1)
                        {
                            NewText=NewText.toLowerCase().replace(/publication no\.*\,*/, "Publication No.");
                        }
                        else if(NewText.toLowerCase().indexOf("report no")>-1)
                        {
                            NewText=NewText.toLowerCase().replace(/report no\.*\,*/, "Report No.");
                        }
                        else
                            {
                                NewText="Report No. " + FLUprCase(NewText);
                            }
                    document.getElementById(divName).innerHTML = "&nbsp;"+ "("+NewText+").";
                }
            else if(refFlg)
            {
				NewText = "Folder " + NewText;
                document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            }
            else if(formName=="parliament")
            {
                if(tmpFlg!=true)
                    {
                        document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
                    }
                    else
                        {
                            if(document.getElementById('not_yet_codified') && document.getElementById('not_yet_codified').checked)
                                {
                                    document.getElementById(divName).innerHTML = "to be codified at " + FLUprCase(NewText); 
                                    //to be codified at
                                }
                                else
                                    {   
                                        document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);                                        
                                    }
                        }
                if($("#volume").val()!='')
                    {
                        ReloadTextDiv2('volume','CiteVolume','legislation');
                    }
            }
            else if(formName=="law_reports")
            {
                NewText=NewText+getStNdRdTh(NewText);
                document.getElementById(divName).innerHTML = FLUprCase(NewText) + " Cir.";
            }
            else if(formName=="legislation")//parliament
                {
                    document.getElementById(divName).innerHTML = "&nbsp;"+FLUprCase(NewText);
                }
            else
                document.getElementById(divName).innerHTML = "&nbsp;"+ "(" + FLUprCase(NewText) + ").";
            
            if(formName=="edatabase" && document.getElementById('rerievedChk'))
                {
                    document.getElementById('rerievedChk').checked=false;
                    retrievedChk(document.getElementById('rerievedChk'));
                    $("#retrieved_chk_p").hide();
                }
        }
        else
            {
                tmpHrs=tmpHrs.trim();
                if(tmpHrs!='')
                    {
                        tmpHrs=" "+tmpHrs;
                    }
                document.getElementById(divName).innerHTML = tmpHrs;
                
                if(formName=="edatabase" && document.getElementById('rerievedChk'))
                {
                    $("#retrieved_chk_p").show();
                }
            }
        
        if(formName=="law_reports")
            {
                ReloadTextDiv2('year','CiteYear','gov');
            }
    }

    else if(textName == "subject")
    {
        if( NewText!= "")
        {
            NewText = ucFirstAllWords(NewText);
            NewText = ReplaceAnd(NewText);
            if(reviewFlg)
                document.getElementById(divName).innerHTML = "&nbsp;"+ NewText;
            else if(refFlg)
            {
                document.getElementById(divName).style.fontStyle = "normal";
                var tmp="&nbsp;"+ NewText;
                if(isFollowedByAny(divName) && formName!="law_reports")
                    {
                        tmp+=':';
                    }
                    else
                        {
                            tmp+='.';
                        }
                document.getElementById(divName).innerHTML = tmp;
            }
            else
                {
                var tmp="&nbsp;"+ NewText;
                    if(firstFieldId=="subject" || formName=='annual_report' || formName=="statistics" || formName=="standards" || formName=="law_reports")
                        {
                            tmp+=".";
                        }
                        else
                            {
                                tmp+=":";
                            }
                document.getElementById(divName).innerHTML = tmp;
                }
        }
        else
            document.getElementById(divName).innerHTML = "";
        
        if(firstFieldId=="subject" && (formName=="annual_report" || formName=="dictionary" || formName=="religious"))
            {
                if( NewText!= "")
                    {   
                        $("#CiteSubject").css("font-style",'normal');
                        
                    }
                if(document.getElementById('title') && $("#title").val().trim()!='')
                    {
                        reprocessTitle();
                    }
            }
            else if(formName=="review")
                {
                    document.getElementById('CiteSubject').style.fontStyle="italic";
                }
    }

    else if(textName == "issue")
    {
        if(journalFlg)
			CiteTitleFormat();
        if( NewText!= "")

        {
            //document.getElementById(divName).innerHTML = FLUprCase(NewText);
			// document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            if(mapFlg)
            {
                formatVolIss();
            }else if(journalFlg || other == "archive")
                {
                    document.getElementById(divName).innerHTML = FLUprCase(NewText);
                            
                }
            else
            {
                if(reportFlg)
                    {
                        document.getElementById(divName).innerHTML = "Issue &nbsp;"+ NewText;
                    }
                    else
                        {
                            document.getElementById(divName).innerHTML = "&nbsp;"+ NewText;
                        }
				//document.getElementById(divName).innerHTML = NewText;
            }
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            if(mapFlg)
            {
                formatVolIss();
            }
        }
    }
	//MIS_18_april_'13
	else if(textName == "date1"){
		if(NewText!= ""){
			if(document.getElementById('publisher')){
				publisher=document.getElementById('CitePublisher').innerHTML.trim();
				publisher=publisher.replace(".",",");	
				document.getElementById('CitePublisher').innerHTML =FLUprCase(publisher);
			}
			document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
		}else{
				//do nothing
			}
	}
	
    else if(textName == "publisher")
    {
        if( NewText!= "")
        {
            if(paperFlg!=true && posterFlg!=true)
            {
                NewText = ucFirstAllWords(NewText);
            }
			NewText = ReplaceAnd(NewText);
            document.getElementById(divName).innerHTML = "&nbsp;" + (NewText);
            if(republisherFlg==false)
				formatPubCity();

			if(other == 'archive'){
				formatPlPub('archive');	
			}else if(other == 'manuscript'){
				formatPlPub('manuscript');
			}else{
            	formatPlPub('other');
			}
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            formatPubCity();
			if(other == 'archive'){
				formatPlPub('archive');	
			}else if(other == 'manuscript'){
				formatPlPub('manuscript');
			}else{
            	formatPlPub('other');
			}
        }
        
        if(document.getElementById('chk_page') && document.getElementById('chk_highlight'))
            {
                var group = document.publication.blog_page;
                for (var i=0; i<group.length; i++) {
                        if (group[i].checked) {
                                chkUnchkBlogPage(group[i]);
                        }
                }
            }
            
        if(pageSec=="corporate" && formName=="presentation")
        {
            formatCorporatePresentation();
        }
    }
	else if(textName == "title")
    {
        if( NewText!= ""){
                            if(other1=='username')
                                {
                                    NewText=NewText.replace(/\.+$/,"").replace(/^\@/,"");
                                    NewText='[@'+NewText.toLowerCase()+']';
                                }
                                else if(other1=="article")
                                    {
                                        var prevDiv=getPreviousFilledDiv('CiteTitle');                         
                                        var tmpData=$("#"+prevDiv).html();
                                        tmpData=tmpData.replace(/\.*\,*$/,"");
                                        $("#"+prevDiv).html(tmpData);
                                        NewText='art. '+NewText;
                                    }
                            else if(formName=="lecture")
                            {
                                if(document.getElementById('chkNotes') && document.getElementById('chkNotes').checked)
                                    {
                                        NewText='[Lecture notes on '+NewText.toLowerCase()+']';
                                    }
                                    
                            }
                            else
                                {
                                    if(capitalizeTtlFlg){
                                        NewText = ucFirstAllWords(NewText);
                                            NewText = ReplaceAnd(NewText);
                                            NewText = FLUprCase(NewText);
                                            capitalizeTitleFlg=true;
                                    }else{
                                            NewText = FLUprCase(NewText);
                                            capitalizeTitleFlg=false;				
                                    }
                                }
                        
                        document.getElementById(divName).innerHTML = "&nbsp;" +  NewText;
                        
                        if(formName=="parliament")
                            {
                                if((document.getElementById('chkbill') && document.getElementById('chkbill').checked)
                                    || (document.getElementById('chkresolution') && document.getElementById('chkresolution').checked)
                        || (document.getElementById('chkregulation') && document.getElementById('chkregulation').checked))
                                {
                                    document.getElementById(divName).style.fontStyle='normal';
                                }
                                else
                                    {
                                        document.getElementById(divName).style.fontStyle='italic';
                                    }
                            }
                            
                            else if(formName=="conference")
                            {
                                if(document.getElementById('chkSession') && document.getElementById('chkSession').checked)
                                    {
                                        document.getElementById(divName).style.fontStyle="normal";
                                    }
                                    else
                                        {
                                            document.getElementById(divName).style.fontStyle="italic";
                                        }
                            }
                        
                        if(firstFieldId=='author')
                        {
                            
                            if(isAllAuthorsBlank()==true && isAllEditorsBlank()==true && isChapterBlank()==true && formName!="review")
                            {     
                                showDiv('CiteAuthor');
                                var fontStyle=$('#CiteTitle').css("font-style");
                                $("#CiteAuthor").css("font-style",fontStyle);
                                var ttlVal=document.getElementById('CiteTitle').innerHTML.replace('&nbsp;','').trim();
                                ttlVal=processSpCharDot(ttlVal);
                                document.getElementById('CiteAuthor').innerHTML=ttlVal;
                                document.getElementById('CiteTitle').innerHTML='';
                                if(formName=="sound_recording")
                                    {
                                        document.getElementById('CiteChapter').innerHTML=""
                                        $("#CiteChapter").css("font-style",'normaml');
                                    }
                            }
                            else if(formName=="sound_recording" && (isChapterBlank()==true))
                                {
                                    showDiv('CiteChapter');
                                    var fontStyle=$('#CiteTitle').css("font-style");
                                    $("#CiteChapter").css("font-style",fontStyle);
                                    var ttlVal=document.getElementById('CiteTitle').innerHTML.replace('&nbsp;','').trim();
                                    ttlVal=processSpCharDot(ttlVal);
                                    
                                    document.getElementById('CiteChapter').innerHTML=" "+ttlVal;
                                    document.getElementById('CiteTitle').innerHTML='';
                                }
                            /*else
                                {
                                    if(apa7Flg==true && document.getElementById('advance_online_app') && document.getElementById('advance_online_app').checked)
                                        {
                                            NewText=NewText.replace(/\.$/,"");
                                            document.getElementById(divName).innerHTML = "&nbsp;" +  NewText;
                                        }
                                }*/
                        }
                        else if(firstFieldId=='subject' && (formName=="annual_report" || formName=="dictionary" || formName=="religious"))
                            {
                                if($("#subject").val().trim()=='')
                                    {
                                        showDiv('CiteSubject');
                                        var fontStyle=$('#CiteTitle').css("font-style");
                                        $("#CiteSubject").css("font-style",fontStyle);
                                        var ttlVal=document.getElementById('CiteTitle').innerHTML.replace('&nbsp;','').trim();
                                        ttlVal=processSpCharDot(ttlVal);
                                        document.getElementById('CiteSubject').innerHTML=ttlVal;
                                        document.getElementById('CiteTitle').innerHTML='';
                                        
                                    }
                            }
		}
        else{
            document.getElementById(divName).innerHTML = "";
            if(firstFieldId=='author' && isAllAuthorsBlank()==true && formName!="review")
            {
                $("#CiteAuthor").css("font-style",'normal');
                if(isAllEditorsBlank()==true && isChapterBlank()==true)
                    $("#CiteAuthor").html("");
                
            }else if(other1=="article")
                                    {
                                        var prevDiv=getPreviousFilledDiv('CiteTitle');                         
                                        var tmpData=$("#"+prevDiv).html();
                                        tmpData=tmpData.replace(/\.*\,*$/,"")+".";
                                        $("#"+prevDiv).html(tmpData);
                                    }
            else if(firstFieldId=='subject' && (formName=="annual_report" || formName=="dictionary" || formName=="religious"))
            {
                $("#CiteSubject").css("font-style",'normal');
                    if($("#subject").val().trim()=='')
                    {
                        $("#CiteSubject").html("");
                    }
                
            }
	}
        
        if(pageSec=="corporate" && formName=="presentation")
        {
            formatCorporatePresentation();
        }
        
        //if(formName=="manuscript" || formName=="paper" || formName=="poster" || formName=="transcript")
            //{
                if(document.getElementById('chkFormat') && document.getElementById('chkFormat').checked)
                    {   
                        showHideFrmt('descriptor','CiteDescriptor',document.getElementById('chkFormat'));                        
                    }
            //}
        
        if(formName=="conference")
            {
                showHideSymposium(document.getElementById('chkSymposium'));
            }
            
            if(document.getElementById('chkWebinar'))
                {
                    showHideFrmtWebinar(document.getElementById('chkWebinar'));
                }
    }
	
    else if(textName == "city")
    {
        if( NewText!= "")
        {
            if(formName=="law_reports" && ((document.getElementById('law_district') && document.getElementById('law_district').checked) || 
                (document.getElementById('law_state') && document.getElementById('law_state').checked)))
                {
                    document.getElementById(divName).innerHTML = NewText;
                }
                else
                    {
			NewText = ucFirstAllWords(NewText);
			NewText = ReplaceAnd(NewText);	
                        
            document.getElementById(divName).innerHTML = "&nbsp;" + (NewText)+ "." ;
            formatPubCity();
                    }
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            formatPubCity();
			//chkPlcAndDate();//12-07-16 BY JT
                        //chkPlc();
        }
        
        
            
        if(formName=="law_reports" && ((document.getElementById('law_district') && document.getElementById('law_district').checked) || 
            (document.getElementById('law_state') && document.getElementById('law_state').checked)))
            {
                ReloadTextDiv2('year','CiteYear','gov');
            }
    }
	
    else if(textName == "place")
    {
        if( NewText!= "")
        {
			NewText = ucFirstAllWords(NewText);
			NewText = ReplaceAnd(NewText);
            document.getElementById(divName).innerHTML = "&nbsp;" + (NewText);
			if(other == 'archive'){
				formatPlPub('archive');	
			}else if(other == 'manuscript'){
				formatPlPub('manuscript');
			}else{
            	formatPlPub('other');
			}
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
			//chkPlcAndDate();//12-07-16 BY JT
                        //chkPlc();
			if(other == 'archive'){
				formatPlPub('archive');	
			}else if(other == 'manuscript'){
				formatPlPub('manuscript');
			}else{
            	formatPlPub('other');
			}
        }
    
    } 
    
   else if(textName == "role")
    {
        if( NewText!= "")
        {
            if(formName=="journal" || formName=="academic_journal")
                {
                    NewText=NewText.trim();
                    /*var subStr='Article ';
                    if(NewText.match(/^e[0-9]+/))
                        {
                            
                        }
                        else
                            {
                                subStr+='e';
                            }
                            NewText=subStr+NewText;*/
                            document.getElementById(divName).innerHTML = " "+ "" + FLUprCase(NewText) + ".";
                }
                else
                    {
                        if(singleAuthor)
                        {
                            document.getElementById(divName).innerHTML = "&nbsp;"+ "(" + FLUprCase(NewText) + ").";
                        }
                        else
                        {
                            if(NewText.charAt(NewText.length-1)=="s")
                            {
                                document.getElementById(divName).innerHTML = "&nbsp;"+ "(" + FLUprCase(NewText) + ").";
                            }
                            else
                            {
                                document.getElementById(divName).innerHTML = "&nbsp;"+ "(" + FLUprCase(NewText) + "s).";
                            }
            }
                    }
        }
        else
            document.getElementById(divName).innerHTML = "";
    }

    else if(textName == "descriptor" && reviewFlg)
    {
        if(NewText!="")
        {
            if(formName=="review")
                {
                    document.getElementById(divName).innerHTML = NewText;
                }
                else
                    {
                        document.getElementById(divName).innerHTML = FLUprCase(NewText);
                    }
        //LC010715 remove [] for review    
        showDiv('CiteRevOpen');
            setInnerText("CiteRevOpen", " [");
            showDiv('CiteRevClose');
            setInnerText("CiteRevClose", "].");
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            document.getElementById("CiteRevOpen").innerHTML = "";
            document.getElementById("CiteRevClose").innerHTML = "";
        }
    }
	else if(textName == 'descriptor' && academicFlg)
	{
        if(NewText!="")
        {
            document.getElementById(divName).innerHTML = "&nbsp;"+ "(" + FLUprCase(NewText) + ").";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
	}
    else if(textName == 'descriptor' && !reviewFlg)
    {
        if(NewText!="")
        {
            
                document.getElementById(divName).innerHTML = "&nbsp;[" + FLUprCase(NewText) + "].";
            
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
        
        if(pageSec=="corporate" && formName=="presentation")
        {
            formatCorporatePresentation();
        }
        
    }
	else if(textName == 'format')
    {
        if(NewText!="")
        {
            
            document.getElementById(divName).innerHTML = "&nbsp;[" + FLUprCase(NewText) + "].";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'source')
    {
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
            if(other=="wiki"){
				document.getElementById(divName).innerHTML = "&nbsp;from " + FLUprCase(NewText) + ".";
			}
                        else if(other=="squareBracket")
                        {
                            document.getElementById(divName).innerHTML = " [" + FLUprCase(NewText) + "].";
                        }
                        else if(formName=="parliament")
                            {
                                document.getElementById(divName).innerHTML = " s. " + FLUprCase(NewText) + ".";
                            }
                        else{
				document.getElementById(divName).innerHTML = " " + FLUprCase(NewText) + ".";
			}
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
    else if(textName=="original_year")
        {
            if(NewText!="")
                {
                   document.getElementById(divName).innerHTML = " " + NewText + ".";
                }
                else
                {
                    document.getElementById(divName).innerHTML = "";            
                }
        }
	else if(textName == 'chapter')
    {
        if(formName=="website" || formName=="webpage" || formName=="webpage/website")
            {
                
                        document.getElementById(divName).style.fontStyle="italic";
                    
                    
            }
            else if(formName=="conference")
                {
                    if(document.getElementById('chkSession') && document.getElementById('chkSession').checked)
                        {
                            document.getElementById(divName).style.fontStyle="italic";
                        }
                        else
                            {
                                document.getElementById(divName).style.fontStyle="normal";
                            }
                }
                
                if(formName=="constitutions_conventions")
                    {
                        if(NewText!='')
                            {
                                NewText=NewText.replace(/\.+$/,"");
                            }
                            
                        if(document.getElementById('chkConstitution') && document.getElementById('chkConstitution').checked)
                            {
                                if(document.getElementById('chkUS') && document.getElementById('chkUS').checked)
                                    {
                                        NewText="U.S.";
                                    }
                                    if(NewText!='')
                                        {
                                           NewText+=" Const" 
                                        }
                                    if(document.getElementById('chkAmended') && document.getElementById('chkAmended').checked)
                                    {
                                        NewText+=". amend";
                                    }
                                    
                            }
                            else if(document.getElementById('chkCharter') && document.getElementById('chkCharter').checked)
                                {
                                   
                                    if(document.getElementById('chkUn') && document.getElementById('chkUn').checked)
                                    {
                                        NewText="U.N.";
                                    }
                                    else if(document.getElementById('chkEu') && document.getElementById('chkEu').checked)
                                    {
                                        NewText="E.U.";
                                    }
                                    if(NewText!='')
                                        {
                                           NewText+=" Charter" 
                                        }
                                }
                    }
        if(NewText!="")
        {
            
            if(formName=="sound_recording")
                {
                    $("#CiteChapter").css("font-style",'normal');
                }
			if(NewText.indexOf(": ")!=-1){
				var New =NewText.split(' ');
				New[1] = FLUprCase(New[1]);
				//NewText = New.join(" ");
				NewText = ReplaceAnd(NewText);
				if(getFormName()=="referenceReligious")
                                {
                                    document.getElementById(divName).innerHTML = "&nbsp;" + NewText.replace(/\.+$/,"");
                                }
                                else
                                    {
                                        document.getElementById(divName).innerHTML = "&nbsp;" + (NewText) + ".";
                                    }
			}
			else
			{
                            if(getFormName()=="referenceReligious")
                            {
                                NewText=trimLastChar(ReplaceAnd(HandleAuthors(NewText),textName),".");
                                document.getElementById(divName).innerHTML = "&nbsp;" + NewText.replace(/\.+$/,"");
                            }
                            else
                                {   
                                    if(formName=="legislation")//parliament
                                        {
                                            NewText = ReplaceAnd(ucFirstAllWords(NewText));
                                        }
                                    document.getElementById(divName).innerHTML = "&nbsp;" + (NewText) + ".";
                                    
                                }
			}
                        if(other=="italic")
                        {
                            document.getElementById(divName).style.fontStyle="italic";
                        }
                        
                        if(firstFieldId=='author')
                        {
                            
                            if(isAllAuthorsBlank()==true && isAllEditorsBlank()==true && formName!="review")
                            {     
                                showDiv('CiteAuthor');
                                var fontStyle=$('#CiteChapter').css("font-style");
                                $("#CiteAuthor").css("font-style",fontStyle);
                                var chapVal=document.getElementById('CiteChapter').innerHTML.replace('&nbsp;','').trim();
                                chapVal=processSpCharDot(chapVal);
                                document.getElementById('CiteAuthor').innerHTML=chapVal;
                                document.getElementById('CiteChapter').innerHTML='';
                            }
                        }
                        
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            if(firstFieldId=='author' && isAllAuthorsBlank()==true && formName!="review")
            {
                $("#CiteAuthor").css("font-style",'normal');
                
            }
        }
        
        reprocessTitle();
        
        
    }
	else if(textName == 'record')
    {
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'year')
    {
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'author')
    {
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'city')
    {
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'descriptor')
    {
        if(NewText!="")
        {
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
        
    }
	else if(textName == 'subject')
    {
        if(NewText!="")
        {
            NewText = ucFirstAllWords(NewText);
            NewText = ReplaceAnd(NewText);
			//alert(FLUprCase(NewText));
            document.getElementById(divName).innerHTML = "&nbsp;" + NewText + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'issue')
    {
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
             
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText) + ".";
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
    }
	else if(textName == 'producer' && performanceFlg)
	{
        if(NewText!="")
        {
			//alert(FLUprCase(NewText));
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
	}   
        else if(textName == 'date')
            {
                if(NewText!="")
                     {                        
                            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
                     }

                    else
                    {
                        document.getElementById(divName).innerHTML = "";                       
                    }
            }
    else
    {
	
    
        if(NewText!="")
			if(textName == 'year') 
			   document.getElementById(divName).innerHTML = " "+ NewText;
                   
			else
                        {
                            putInterviewOfBy();
                            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
                            
                                     if(textName=='editor')
                                         {
                                            if(firstFieldId=='author')
                                                {

                                                    if(isAllAuthorsBlank()==true && formName!="review")
                                                    {     
                                                        showDiv('CiteAuthor');
                                                        var fontStyle=$('#CiteEditor').css("font-style");
                                                        $("#CiteAuthor").css("font-style",fontStyle);
                                                        reformatEditor(other);
                                                        reprocessChapterTitle();

                                                    }
                                                }
                                         }
                                         else if(textName=="accessed" && document.getElementById('http') && $("#http").val()!='')
                                            {
                                                ReloadTextDiv2('http','CiteHttp');
                                            }
                        }
                        
        else
        {
            document.getElementById(divName).innerHTML = "";
            putInterviewOfBy();
            if(textName=="editor")
            {
                if(firstFieldId=="author" && isAllAuthorsBlank()==true && formName!="review")
                {
                    reformatEditor(other);
                    $("#CiteAuthor").css("font-style",'normal');
                    $("#CiteAuthor").html('');
                    $("#CiteAuthor").html('');
                    reprocessChapterTitle();
                }
            }
        }
        
    }
   
   
   var matchStre = /^author[0-9]+$/;
   
    if(formName=="blu_ray_dvd" && (textName=="author" || textName.search(matchStre)==0))
        {
            clearDigitalProDir(document.getElementById('chkdirector'));
        }

   if(document.getElementById("chapter") && document.getElementById("title") && !noAuthorFlg)
    {		
	 if((textName == "chapter" && document.getElementById("chapter").value != "" && document.getElementById("title").value != "") || (textName == "title" && document.getElementById("title").value && document.getElementById("chapter").value != ""))
        {	
		if(otherFlg && !reviewFlg && !journalFlg && !internetFlg && !webpgFlg && !noInOnFlg && !bookFlg)
			inOn('on');
	
	      else if(reviewFlg || journalFlg || internetFlg || webpgFlg || noInOnFlg)
                inOn('');
      
	      else
                inOn('in');
        }
	
        else if((textName == "chapter" && (document.getElementById("chapter").value == "" || document.getElementById("title").value == "")) || (textName == "title" && (document.getElementById("title").value == "" || document.getElementById("chapter").value == "")))
            inOn('');
    }
    

    
    
    if(reportFlg)
            {
                formatRepVolPg();
            }
            if(refmanuFlg)
            {
                formatRefManu();
            }
            
            if(edissertionFlg)
                {
                    formatEdissertation();
                }
            
            if(getFormName()=="DigitalDVD")
                {
                    formatDigitalDVD();
                    var matchStr2 = /^editor[0-9]+$/;
                    if(!textName.search(matchStr2) || textName=="editor")
                    {
                       if(firstFieldId=='author')
                           {

                               if(isAllAuthorsBlank()==true && formName!="review")
                               {     
                                   showDiv('CiteAuthor');
                                   var fontStyle=$('#CiteEditor').css("font-style");
                                   $("#CiteAuthor").css("font-style",fontStyle);
                                   reformatEditor(other);
                                   reprocessChapterTitle();

                               }
                           }
                    }
                }
                else
                    {
                        formatEditor();
                    }
                    
                    if(getFormName()=="creativeReview")
                    {
                        
                        formatRevAuthor();
                    }
                    
                    
                    if(getFormName()=="digitalSound")
                        {
                            formatSoundRecording();
                            var matchStre = /^editor[0-9]+$/;
                            if(firstFieldId=='author')
                            {

                                if(isAllAuthorsBlank()==true && formName!="review")
                                {
                                    
                                            reformatEditor(other);
                                      
                                }
                            }
                        }
                    
    console.log("64: "+$("#CiteHttp").html());           
                
            if(exhibitFlg)
                formatExhibition();
            
            if(formName=="law_reports" && (textName=="record" || textName=="year" || textName=="city"))
                {
                    if($("#record").val()!='' || $("#year").val()!='' || $("#city").val()!='')
                        {
                            showDiv("CiteCommaStart");
                            showDiv("CiteCommaEnd");
                            $("#CiteCommaStart").html(" (");
                            $("#CiteCommaEnd").html(").");
                        }
                        else
                            {
                                hideDiv("CiteCommaStart");
                                hideDiv("CiteCommaEnd");
                                $("#CiteCommaStart").html("");
                                $("#CiteCommaEnd").html("");
                            }
                }
            console.log('111: '+$("#CiteHttp").html());
            
            if(formName=="tv_series")
                {
                    formatSeasonEpNo();
                }
            
	ReplaceDottoComma(divName,other);
        console.log('112: '+$("#CiteT").html());
        //if(getInTextFormat()=="DigitalInterview")
               // {
                    //formatDigiInter();
                   // formatEditor();
               // }
               
               if(formName=="review")
                   {
                       if(eligibleForReviewof())
                           {
                               showDiv("CiteRecord");
                               var revTxt="Review of ";
                               if(document.getElementById('descriptor') && $("#descriptor").val()!='')
                               {
                                   revTxt+='the ';
                               }
                               $("#CiteRecord").html(revTxt);
                           }
                           else
                               {
                                   $("#CiteRecord").html("");
                               }
                   }
               
               if(getFormatType()=="EditorCiteEd" || (formName=="tv_series" && isAllEditorsBlank()!=true))
                   {
                       clearCreativeProGroup('',textName);
                       if(formName=="tv_series" && $("#CiteIOn").html().trim()!="" && $("#CiteEd").html().trim()!='' && $("#CiteTitle").html().trim()!='')
                           {
                               var tmpCtEd=$("#CiteEd").html();
                               tmpCtEd=tmpCtEd.replace(/\.*\,*$/,",");
                               $("#CiteEd").html(tmpCtEd);
                           }
                   }
                   
                   if(getFormatType()=="AuthorCiteAuth")
                   {
                       clearCreativeProGroupAuth('',textName);
                   }
                   else if(formName=="visual_works")
                       {
                           clearCreativeProGroupAuth();
                       }
                   
                   if(formName=="podcast")
                       {
                           
                       }
                if(formName!="conference")
                {
                    globalFormat();
                }
              
               if(getFormName()=="BooksTranslation" && document.getElementById('chapter') && document.getElementById('chapter').value.trim()!='')
               {
                   if(document.getElementById('editor') && document.getElementById('editor').value.trim()!='')
                   {
                       document.getElementById('CiteChapter').innerHTML=trimLastChar(document.getElementById('CiteChapter').innerHTML,'.');
                   }
               }
        if(getFormName()=="creativeProgram" || getFormName()=="CreativePerformance" || getFormName()=="digitalPodcast" || getFormName()=="internetPodcast")
                        {
                            addRemoveAuthorDot('CiteEd');
                        }
                        else if(getFormName()=="digitalMovie" || getFormName()=="digitalTvSeries")
                        {
                            addRemoveAuthorDot('CiteTra');
                        }
                        
                        if(getFormName()=="internetEmail")
                            {
                                formatInternetEmail()
                            }
                            
                            if(getFormName()=="creativeReview")
                                {
                                    formatCreativeReview();
                                }
                                else if(getFormName()=="periodicalReview")
                                    {
                                        formatPeriodicalReview();
                                    }
                                    
        if(pageSec=="corporate" && formName=="presentation")
        {
            if(isFollowedBy('CiteTitle','CitePublisher') || isFollowedBy('CiteTitle','CiteCity'))
                {
                    var ttl=$("#CiteTitle").html().replace(/\.+$/,',');
                    $("#CiteTitle").html(ttl);
                }
        }
        
        
        if(formName=="survey")
            {
                if(document.getElementById('CiteDescriptor') && $("#CiteDescriptor").html().trim()!='')
                    {
                        var patt10 = new RegExp(/^CiteAuthor[0-9]+$/);
                        var prevDiv=getPreviousFilledDiv('CiteDescriptor');                         
                        if(prevDiv!='' && prevDiv!="author" && patt10.test(prevDiv)!=true)
                         {
                             var tmp=$("#"+prevDiv).html();
                             tmp=tmp.replace(/\,*\.*$/,"");
                             $("#"+prevDiv).html(tmp);
                         }
                    }
            }
                                    
            
            
            if(formName=="law_reports" && document.getElementById('law_supreme') && document.getElementById('law_supreme').checked)
                {
                    if($('#CiteSource').html()!='')
                        {
                            $("#CitePlace").html(' U.S.');
                            showDiv('CitePlace');
                        }
                        else
                            {
                                $("#CitePlace").html('');
                                hideDiv('CitePlace');
                            }
                }
                else if(formName=="parliament" && document.getElementById('chkregulation') && document.getElementById('chkregulation').checked
                 )
                    {
                        if(document.getElementById('not_yet_codified') && document.getElementById('not_yet_codified').checked)
                            {
                                if($("#record").val().trim()!='')
                                {
                                    showDiv("CiteCommaStart");
                                    showDiv("CiteCommaEnd");
                                    $("#CiteCommaStart").html(' (');
                                    $("#CiteCommaEnd").html(')');
                                }
                                else{
                                    $("#CiteCommaStart").html('');
                                    $("#CiteCommaEnd").html('');
                                }
                            }
                            else
                                {
                                    $("#CiteCommaStart").html('');
                                    $("#CiteCommaEnd").html('');
                                }
                        
                    }
                
                if(document.getElementById('chkFormat') && document.getElementById('chkFormat').checked)
                    {
                        var el=document.getElementById('chkFormat');
                        eval(el.getAttribute('onclick').replace(',this',",document.getElementById('chkFormat')"));   
                    }
            
            
              journalCiteTitleFormat();
              showPreviewChk();
              
 
}

//function for single character a to lowercase
function ReplaceA(str,field){
		var matchTag3=new RegExp(/\b(.|:|;)\s([A-Z])\b/g);
		if(field=="author"){
			var  perNo = document.perNoau1; 	
		}else{
			var  perNo = eval("document.perNo" +field);
		}
		//alert(str);
		var arrau = str.split(" ");
		//alert(arrau);
		for (i=0;i<arrau.length;i++)
		{
			if((typeof(arrau[i-1])!='undefined' && CheckIsWord(arrau[i-1])) && !CheckIsWord(arrau[i])){
				if(perNo == 1){
					var fval = document.getElementById(field).value;
					var arrval = fval.split(' ');
					//alert(arrval);
					if(typeof(arrval[i-1])!='undefined' && (!arrval[i-1].endsWith(":") && !arrval[i-1].endsWith(";") && !arrval[i-1].endsWith(".") && !arrval[i-1].endsWith(","))){
						//alert(arrau[i]);
						arrau[i] = arrau[i].toLowerCase();
					}
				}
			}
		}
	return arrau.join(" ");
}
//

function HandleAuthors(str)
{
  	field = arguments[1];
	if(field=="author"){
		var  perNo = document.perNoau1; 	
	}else{
		var  perNo = eval("document.perNo" +field);
	}
        if(getFormName()=="referenceReligious")
        {
            perNo=1;
            field="chapter";
        }
	var editortxt = false;
	var matchStre = /^editor[0-9]+$/;
        var isEditor=false;
	if(field=="editor" || field.search(matchStre)==0){
		var isEditor = true;
	}
    if(str=="")
        return "";
	//alert(str);	
        if((field=="author" && document.perNoau1>0) || (field=="editor" && document.perNoed1>0) || eval("document.perNo"+field)>0)
        {
            var str=$("#"+field).val().trim();
            if(field=="author")
                {   
                    str=trimLastChar(str,".")+'.';
                    
                }
            str=ReplaceAnd(ReplaceA(BeCapital(str),field),false);
            return str;
        }
        
    var arr= splitString(str.trim(),true);
    
    
    var Yau = 'perYes'+field;
    var noLowerFlg=false;
    var lstNmFstNmFlag=false;
    
    var arrConjFlg=noConjLowerFlg(field);
    noLowerFlg=arrConjFlg[0];
    lstNmFstNmFlag=arrConjFlg[1];
    
      var patt10E = new RegExp(/^[editor]+[2-9]$/);
    
    var arr2=str.trim().split(" ");
    var joinChar="";
    var wordCnt=0;
    var str1=$("#"+field).val();
    if(str1!='')
    {
        var tst1=/^\,{2,}/;
        if(tst1.test(str1.trim()))
        {
            str1=str1.replace(tst1, ",");
        }
    }
    var arr1=str1.trim().split(" ");
    for(i=0;i<arr1.length;++i)
        {
            if(arr1[i].trim()!='')
                {
                    wordCnt++;
                }
        }
        
       
        
        var Yau = 'perYes'+field;
    var noLowerFlg=false;
    var lstNmFstNmFlag=false;
    var fstNmLstNmFlag=false;
    
    var arrConjFlg=noConjLowerFlg(field);
    noLowerFlg=arrConjFlg[0];
    var lstNmFstNmFlag=arrConjFlg[1];
    var fstNmLstNmFlag=arrConjFlg[2];
    var noCommaFlg=false;;
        
         var allSingleFlag=false;
         arrAu=ucFirstAllWords(str1.trim()).split(" ");
        if(arrAu.length>0)
        {
            for(i=0;i<arrAu.length;++i)
            {
                if(arrAu[i].trim()!='' && arrAu[i].trim().replace(/\./g,"").trim().length>1)
                    {
                        allSingleFlag=false;
                        break;
                    }
                    allSingleFlag=true;
            }
        }
        
        if(allSingleFlag==true)
        {
            arr=arrAu;
            for(i=0;i<arrAu.length;++i)
                {
                    if(arr[i].replace(/\./g,"").trim().length==1)
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                }
                
                if(arr.length>1 && isEditor==false)
                {
                    arr[0]=arr[0].replace(/\./g,"").trim()+',';
                }
                console.log(arr.join(" "));
                return arr.join(" ");
        }
        else if(wordCnt>2 && lstNmFstNmFlag==true)
        {
            noCommaFlg=true;
            arr=ucFirstAllWords(str1.trim()).split(" ");
            
                       
                var i=0;
                var tmpSt='';
                var lastWPos=-1;
                var lastWPosOrig=-1;
                for(i=0;i<arr.length-1;++i)
                {
                    if(trimLastChar(arr[i],".").trim().length>1)
                        {
                            lastWPos=i;
                        }
                }
                
                for(i=0;i<arr.length;++i)
                {
                    if(trimLastChar(arr[i],".").trim().length>1)
                        {
                            lastWPosOrig=i;
                        }
                }
                
                for(i=0;i<=lastWPos;++i)
                {
                    if(arr[i].replace(/\./g,"").trim()==1)
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                    else
                    {
                        arr[i]=arr[i].trim();
                    }
                }
                if(lastWPos>=0)
                {
                    if(str1.indexOf(",")>=0)
                    {
                        arr[lastWPos]=arr[lastWPos].trim();
                    }
                    else
                    {
                       
                        if(lastWPosOrig==(arr.length-1))
                            {
                                
                            }
                            else
                                {               
                                    arr[lastWPos]=trimLastChar(arr[lastWPos],",").trim()+',';                                    
                                }
                    }
                    for(i=lastWPos+1;i<arr.length-1;++i)
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                }
                
                
        }
        else if(wordCnt==2 && lstNmFstNmFlag==true)
        {
            noCommaFlg=true;
            if(str1.indexOf(",")>=0)
            {
                
            }
            else
            {
                if(trimLastChar(arr[1],".").trim().length>1)
                    {
                        //
                    }
                    else
                        {
                            arr[0]=arr[0].replace(",","")+',';
                        }
            }
            
            var i=0;
            for(i=0;i<arr.length;++i)
                {
                    if(arr[i].replace(/\./g,"").trim().length==1)
                            {
                                arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                            }
                }
                
        }
        else if(fstNmLstNmFlag==true)
            {
                noCommaFlg=true;
                
                arr=ucFirstAllWords(str1.trim()).split(" ");
                
                
                var i=0;
                var tmpSt='';
                var firstWPos=-1;
                for(i=0;i<arr.length;++i)
                {
                    if(trimLastChar(arr[i],".").trim().length>1)
                        {
                            firstWPos=i;
                            break;
                        }
                }
                var toLp=0;
                if(firstWPos==-1)
                    {
                        toLp=arr.length;
                    }
                    else
                        {
                         toLp=firstWPos;  
                        }
                for(i=0;i<toLp;++i)
                {
                    if(arr[i].replace(/\./g,"").trim().length==1)
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                }
                if(firstWPos>=0)
                {
                    for(i=firstWPos;i<arr.length;++i)
                        {
                            if(arr[i].replace(/\./g,"").trim()==1)
                            {
                                arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                            }
                            else
                                {
                                    arr[i]=' '+arr[i];
                                }
                        }
                }
                
            
                
            }
    
  
    
    
    for (i=0;i<arr.length;i++)
    {
        //alert(arr[i]);
        if(i>0)
        {
            var firstIsWord=false;
            firstIsWord =CheckIsWord(arr[i-1]);

            var secondIsWord=false;
            secondIsWord =CheckIsWord(arr[i]);

			
			if(firstIsWord && !secondIsWord){
				if(perNo == 1){
					var fval = document.getElementById(field).value;
					var arrval = fval.split(' ');
					if(arrval[i]!=arr[i] && (!arrval[i-1].endsWith(":") && !arrval[i-1].endsWith(";") && !arrval[i-1].endsWith(".") && !arrval[i-1].endsWith(","))){
						arr[i] = arr[i].toLowerCase();
					}
				}
			}
                        if(noCommaFlg==true)
             {
                 var joinChar=" ";
             }
             else
                 {
            if((field=="editor" || patt10E.test(field)==true) && arr2.length>2)
            {
            }
            else
            {
                if(!firstIsWord && !secondIsWord){

                                    if(perNo == 1){	
                                            changeItem(arr,i-1,arr[i-1]+" ")
                                    }else{
                                            if(!CheckIsWord(arr[0]) && !CheckIsWord(arr[1]) && !editortxt){
                                                    changeItem(arr,i-1,arr[i-1]+", ")
                                            }else{
                                    changeItem(arr,i-1,arr[i-1]+". ")
                                            }
                                    }
                            }
                else if(!firstIsWord && secondIsWord){
                                    if(perNo == 1){
                                            if((typeof(arr[i-2])!='undefined' && CheckIsWord(arr[i-2]) && !arr[i-2].trim().endsWith(".")) && arr[i-1].toLowerCase()=="a"){
                                                    changeItem(arr,i-1,arr[i-1]+" ")
                                            }else{	
                                    changeItem(arr,i-1,arr[i-1]+" ")
                                            }
                                    }else{
                                        changeItem(arr,i-1,arr[i-1]+". ")
                                    }
                            }
                else if(firstIsWord && !secondIsWord){
                                    if(perNo == 1){	
                            changeItem(arr,i-1,arr[i-1]+" ")
                                    }else{
                                            changeItem(arr,i-1,arr[i-1]+", ")
                                    }
                            }
                else if(firstIsWord && secondIsWord){
             //   changeItem(arr,i-1,arr[i-1]+" ")
				if(perNo == 1){	
                	changeItem(arr,i-1,arr[i-1]+" ")
				}else{
					if(editortxt && arr[i-1].length==2)
						changeItem(arr,i-1,arr[i-1]+" ")
					else	
						changeItem(arr,i-1,arr[i-1]+" ")
				}
			}
            }
                 }
        }
    }
    var joinstr;
	/*if((perNo == 1 && field!="editor") || (perNo == 1 && field!="author")){
		joinstr = "";
	}else{*/
		joinstr = ".";
	//}
	//alert(arr.join("")+joinstr);
    if(noLowerFlg==true)
        {
            return ReplaceAnd(arr.join(joinChar)+joinstr,true);
        }
        else
            {   
                return ReplaceAnd(arr.join(joinChar)+joinstr);

            } 
    //return arr.join("")+joinstr;

}


function HandleAddAuthors(str)
{
    var arr= splitString(str.trim());

    for (i=0;i<arr.length;i++)
    {
        if(i>0)
        {
            var firstIsWord=false;
            firstIsWord =CheckIsWord(arr[i-1]);

            var secondIsWord=false;
            secondIsWord =CheckIsWord(arr[i]);

            if(!firstIsWord && !secondIsWord)
                changeItem(arr,i-1,arr[i-1]+".")

            else if(!firstIsWord && secondIsWord)
                changeItem(arr,i-1,arr[i-1]+". ")

            else if(firstIsWord && !secondIsWord)
                changeItem(arr,i-1,arr[i-1]+" ")

            else if(firstIsWord && secondIsWord)
                changeItem(arr,i-1,arr[i-1]+" ")
        }
    }
    return arr.join("")+".";
}

function changeItem(arr,indx,itm)
{
	itm = itm.replace(',,',',');
    arr[indx]=itm;
	return arr;
}

function CheckIsWord(strng)
{
    if(strng.length>1)
        return true;
    else
        return false;
}

function splitString(txt, removeComma)
{
     var matchTag1 = / /g;
    txt= txt.replace(matchTag1, "@");
    if(removeComma)
    {
        matchTag1= /,/g;
        txt= txt.replace(matchTag1, ",");
    }
    txt= txt.replace("..", ".");
    txt= CapitalizeAfter(txt,"@");
    txt= CapitalizeAfter(txt,",");
    txt=rtrim(txt,"@");
    var arr1= txt.split("@");
    return arr1.clean("");
}
//-----------OLD
//var id = "";
//var pg_no = "";
function chkPage()
{
	return false;
  
}
//-----------OLD
function chkAcademicDate()
{
    var dt = document.getElementById('date').value;
    if(!isDateYYYYMonth(dt)&& !isDateYYYY(dt) && !isDateMonthYYYY(dt) && !isDateYYYYMonthDD(dt))
    {
		jAlertMod1("Enter date in Year Month format","Alert","&nbsp;OK&nbsp;",function(c1){
		if(c1)
		{
			document.getElementById("date").focus();
			return false;
		}});
        document.getElementById("CiteDate").innerHTML = "";
        setTimeout('setFocus("date")', 10);
    }

}
function chkEdition()
{
    
    var edi = document.getElementById('edition').value.toLowerCase();
    if (isNaN(edi))
    {
        //        var re1 = new RegExp("\\brev\\s\\b[0-9]", "gi");
        //        var re2 = new RegExp("\\brevised\\s\\b[0-9]", "gi");
        //        var re3 = new RegExp("\\brev\\.\\s\\b[0-9]", "gi");
        //        var re4 = new RegExp("\\brevised\\.\\s\\b[0-9]", "gi");
        //
        //        if((edi.match(re1)) || (edi.match(re2)) || (edi.match(re3)) || (edi.match(re4)))
        //        {
        //        }
        if((edi == "rev") || (edi == "rev.") || (edi == "revised") || (edi == "revised.") || (edi == "reprint") )
        {}
        else
        {
			jAlertMod("Enter numerals or 'rev'/ 'rev.'/ 'revised'/ 'revised.'/ 'reprint'","Alert","&nbsp;OK&nbsp;",null);
            document.getElementById("CiteEdition").innerHTML = "";
            setTimeout('setFocus("edition")', 10);
        }
    }
    else
    {
        if (edi < 2) {
            jAlertMod("Edition is recorded for '2' and above only!","Alert","&nbsp;OK&nbsp;",null);
            setTimeout('setFocus("edition")', 10);
            document.getElementById("CiteEdition").innerHTML = "";
        }
    }
    
}

function chkVolume(flag)
{
   if(flag && flag=='journal')
	{
		var vol = document.getElementById('volume').value;
		var ck_VolIss = /^[A-Za-z0-9' ']{0,100}$/;
		if(!ck_VolIss.test(vol)){
			jAlertMod("Please enter alphanumerals only!","Alert","&nbsp;OK&nbsp;",null);
			document.getElementById("CiteVolume").innerHTML = "";
			setTimeout('setFocus("volume")', 10);
		}
	}
    else
	{
		var vol = document.getElementById('volume').value;
		if(vol.search("-")!=-1)
		{
			var vols=vol.split("-");
			if (isNaN(vols[0]) || isNaN(vols[1]))
			{
				jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
				document.getElementById("CiteVolume").innerHTML = "";
				setTimeout('setFocus("volume")', 10);
			}
		}
		else if(isNaN(vol))
		{
			jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
			document.getElementById("CiteVolume").innerHTML = "";
			setTimeout('setFocus("volume")', 10);
		}
}
    
}

function chkNum(field,divelem)
{
	var num = document.getElementById(field).value;
    if(isNaN(num))
    {
		jAlertMod1("Enter number only for this field.","Alert","&nbsp;OK&nbsp;",function(c1){
		if(c1)
		{
			document.getElementById(divelem).innerHTML = "";
			document.getElementById(field).value = '';
			document.getElementById(field).focus();
			return false;
		}});
    }
	
}
function chkIssue(flag)
{
   if(flag && flag=='journal')
	{
	var vol = document.getElementById('issue').value;
	var ck_VolIss = /^[A-Za-z0-9' ']{0,100}$/;
	if(!ck_VolIss.test(vol)){
		jAlertMod("Please enter alphanumerals only!","Alert","&nbsp;OK&nbsp;",null);
      	document.getElementById("CiteIssue").innerHTML = "";
      	setTimeout('setFocus("issue")', 10);
		}
	}
 
    else
    {
    var iss = document.getElementById('issue').value;
    if(isNaN(iss))
    {
		jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
        document.getElementById("CiteIssue").innerHTML = "";
        setTimeout('setFocus("issue")', 10);
    }
   }
}

var ed = "";
var vl = "";
var pg = "";
var ttl = "";
function formatEdVolPg()
{
	var ed = "";
	var vl = "";
	var pg = "";
	var ttl = "";
	if(document.getElementById('CiteTitle')!=null && document.getElementById('CiteTitle').innerHTML !=''){
		var ttl = document.getElementById('CiteTitle').innerHTML;
		ttl = ttl.replace(".","");
		if(!ttl.endsWith(".") && !Endwithpunctuation(ttl)){
			ttl1 = ttl+".";
		}else{
			ttl1 = ttl;		
		}
		if(document.getElementById('CiteEdition')!=null &&  document.getElementById('CiteEdition').innerHTML !='')
		{
			document.getElementById('CiteTitle').innerHTML = ttl;

		}else if(document.getElementById('CiteVolume')!=null && document.getElementById('CiteVolume').innerHTML !='')
		{
			document.getElementById('CiteTitle').innerHTML = ttl;

		}else if(document.getElementById('CitePage')!=null && document.getElementById('CitePage').innerHTML !='')
		{
			document.getElementById('CiteTitle').innerHTML = ttl;

		}else{
			document.getElementById('CiteTitle').innerHTML = ttl1;
		}
	}
 	//////
    if(document.getElementById('CiteEdition')!=null)
    {
        ed = document.getElementById('CiteEdition').innerHTML.trim();
    }

    if(document.getElementById('CiteVolume')!=null)
    {
        vl = document.getElementById('CiteVolume').innerHTML.trim();
    }
    
    if(document.getElementById('CitePage')!=null)
    {
        pg = document.getElementById('CitePage').innerHTML.trim();
    }
	
	ed = ed.replace("&nbsp;","");

	//alert("["+"ed:"+ed+"vl:"+vl+"pg:"+pg+']');
        console.log('ed:'+ed);
	ed = ed.replace("(","");
	ed = ed.replace(/\.*\)*\s*\.*\s*\,*$/,"");
	ed = ed.replace("&nbsp;","");
	ed=ed.trim();
        console.log('ed:'+ed);

	vl = vl.replace("(","");
	vl = vl.replace(/\.*\)*\s*\.*\s*\,*$/,"");
	vl = vl.replace("&nbsp;","");
	vl=vl.trim();

	pg = pg.replace("(","");
	pg = pg.replace(/\.*\)*\s*\.*\s*\,*$/,"");
	pg = pg.replace("&nbsp;","");
	pg=pg.trim();

	//alert("["+"ed:"+ed+"vl:"+vl+"pg:"+pg+']');

    if(ed!="" && vl!="" && pg!="")
    {
		
		ed=ed+'.,'
		vl= ' '+vl+'.,';

		ed= " ("+ed;
		pg=' '+pg+")."
    }
    else if(ed!="" && vl!="" && pg=="")
    {
		ed=" ("+ed+'., '
		vl=vl+")."
    }
    else if(ed!="" && vl=="" && pg!="")
    {
		ed= " ("+ed+".,";
		pg=" "+pg+")."
    }
    else if(ed!="" && vl=="" && pg=="")
    {
		ed= " ("+ed +")."
    }
    else if(ed=="" && vl!="" && pg!="")
    {
                vl= " ("+vl+'., ';
		pg=pg+")."
    }
    else if(ed=="" && vl!="" && pg=="")
    {
		vl= " ("+vl+")."
    }
    else if(ed=="" && vl=="" && pg!="")
    {
		pg= " ("+pg+")."
	}

	//alert("["+"ed:"+ed+"vl:"+vl+"pg:"+pg+']');

        console.log('ed:'+ed+' vl:'+vl+' pg:'+pg);

    if(document.getElementById('CiteEdition')!=null)
        document.getElementById('CiteEdition').innerHTML = ed;
    if(document.getElementById('CiteVolume')!=null)
        document.getElementById('CiteVolume').innerHTML = vl;
    if(document.getElementById('CitePage')!=null)
        document.getElementById('CitePage').innerHTML = pg;
}


function formatRepVolPg()
{
	var vol = "";
	var rep = "";
	var pg = "";
	
    if(document.getElementById('CiteVolume')!=null)
    {
        vol = document.getElementById('CiteVolume').innerHTML.trim();
    }

    if(document.getElementById('CiteRecord')!=null)
    {
        rep = document.getElementById('CiteRecord').innerHTML.trim();
    }
    
    if(document.getElementById('CitePage')!=null)
    {
        pg = document.getElementById('CitePage').innerHTML.trim();
    }
	
	vol = vol.replace("&nbsp;","");

	//alert("["+"vol:"+vol+"iss:"+iss+"pg:"+pg+']');

	vol = vol.replace("(","");
	vol = vol.replace(").","");
	vol = vol.replace("&nbsp;","");
	vol = vol.replace(",","");
	vol=vol.trim();

	rep = rep.replace("(","");
	rep = rep.replace(").","");
	rep = rep.replace("&nbsp;","");
        rep = rep.replace("&nbsp;","");
        rep = rep.replace("&nbsp;","");
	rep = rep.replace(",","");
	rep=rep.trim();

	pg = pg.replace("(","");
	pg = pg.replace(").","");
	pg = pg.replace("&nbsp;","");
	pg = pg.replace(",","");
	pg=pg.trim();

	//alert("["+"vol:"+vol+"iss:"+iss+"pg:"+pg+']');

    if(rep!="" && vol!="" && pg!="")
    {
		vol= vol.replace("&nbsp;", "");
		rep=rep+','
		vol=vol+','
		rep= rep.replace(",", ",&nbsp;");
		vol= vol.replace(",", ",&nbsp;");

		rep= "&nbsp;("+rep;
		pg=pg+")."
    }
    else if(rep!="" && vol!="" && pg=="")
    {
		rep=rep+','
		rep= rep.replace(",", ",&nbsp;");
		rep= "&nbsp;("+rep;
		vol=vol+")."
    }
    else if(rep!="" && vol=="" && pg!="")
    {
		rep=rep+','
		rep= rep.replace(",", ",&nbsp;");
		rep= "&nbsp;("+rep;
		pg=pg+")."
    }
    else if(rep!="" && vol=="" && pg=="")
    {
		rep= "&nbsp;("+rep +")."
    }
    else if(rep=="" && vol!="" && pg!="")
    {
		vol= vol.replace("&nbsp;", "");
		vol=vol+','
		vol= vol.replace(",", ",&nbsp;");
		vol= "&nbsp;("+vol;
		pg=pg+")."
    }
    else if(rep=="" && vol!="" && pg=="")
    {
		vol= vol.replace("&nbsp;", "");
		vol= "&nbsp;("+vol+")."
    }
    else if(rep=="" && vol=="" && pg!="")
    {
		pg= "&nbsp;("+pg +")."
	}

	//alert("["+"vol:"+vol+"iss:"+iss+"pg:"+pg+']');

    
    if(document.getElementById('CiteRecord')!=null)
        document.getElementById('CiteRecord').innerHTML = rep;
    if(document.getElementById('CiteVolume')!=null)
        document.getElementById('CiteVolume').innerHTML = vol;
    if(document.getElementById('CitePage')!=null)
        document.getElementById('CitePage').innerHTML = pg;
}



function formatRefManu()
{
	var sub = "";
	var pub = "";
        var cit= "";
        var htt="";


    if(document.getElementById('CiteSubject')!=null)
    {
        sub = document.getElementById('CiteSubject').innerHTML.trim();
    }
    if(document.getElementById('CitePublisher')!="")
    {
        pub=document.getElementById('CitePublisher').innerHTML.trim();
    }
    /*if(document.getElementById('CiteCity')!="")
    {
        cit=document.getElementById('CiteCity').innerHTML.trim();
    }*/
    if(document.getElementById('CiteHttp')!="")
    {
        htt=document.getElementById('CiteHttp').innerHTML.trim();
    }
    
	
        

	sub = sub.replace(".","");
	sub = sub.replace("&nbsp;","");
	sub = sub.replace(",","");
	sub=sub.trim();
        
        
        pub = pub.replace(".","");
	pub = pub.replace("&nbsp;","");
	pub = pub.replace(",","");
	pub=pub.trim();


    
    if(sub!="")
    {
        sub="&nbsp;"+sub;
        if(pub!="" || cit!="" || htt!="")
        {
            sub=sub+",";
        }
        else
            {
                sub=sub+'.';
            }
    }
    
    if(pub!="")
    {
        pub="&nbsp;"+pub;
        if(cit!="" || htt!="")
        {
            pub=pub+",";
        }
        else
            {
                pub=pub+'.';
            }
    }
    

    if(document.getElementById('CiteSubject')!=null)
        document.getElementById('CiteSubject').innerHTML = sub;
    if(document.getElementById('CitePublisher')!=null)
        document.getElementById('CitePublisher').innerHTML = pub;
}


function formatExhibition()
{
	
        var role="";
        var i=2;
        var authi=0;
        var auth;
        
        for(i=2;i<10;++i)
            {
                if(document.getElementById('CiteAuthor'+i) && document.getElementById('CiteAuthor'+i).innerHTML.trim()!='')
                    {
                        authi=i;
                    }
            }
            
            if(document.getElementById('CiteRole'))
                {
                    role=document.getElementById('CiteRole').innerHTML.trim();
                }
            
            if(authi>0 && role!='')
                {
                    auth=document.getElementById('CiteAuthor'+authi).innerHTML.trim();
                    auth=auth.replace(".","");
                    document.getElementById('CiteAuthor'+authi).innerHTML=auth;
                }
}


function formatDigiInter()
{
	var editor = "";


    if(document.getElementById('CiteEditor')!=null)
    {
        editor = document.getElementById('CiteEditor').innerHTML.trim();
    }
    
    if(editor!='')
    {
        var arrEdit;
        var temp;
        var str='';
        arrEdit=editor.split(" ");
        //if(arrEdit.length>1)
        //{
            
            var i=0;
            for(i=0;i<arrEdit.length;++i)
            {
                temp=arrEdit[i];
                
                    temp=arrEdit[i].trim();
                    temp=temp.replace(".","");
                    temp=temp.replace(",","");
                    temp+='.';
               
                
                if(i>0)
                {
                    str+=' ';
                }
               str+=temp;
            }
            document.getElementById('CiteEditor').innerHTML=str;
        //}
    }
    
}


function formatDigitalDVD()
{
	var author = "";
	var virAuthor = "";
        var editor= "";
        var virEditor="";
        var authi=0;
        var edii=0;
        var i=2;
         var temp;
        var arrTemp;
        var k=0;
        var j=0;


    if(document.getElementById('CiteAuthor') && document.getElementById('CiteAuthor').innerHTML.trim()!='')
    {
        
        author = document.getElementById('CiteAuthor').innerHTML.trim();
        document.getElementById('CiteAuthor').innerHTML=document.getElementById('CiteAuthor').innerHTML.trim();
        authi=1;
    }
    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
    {
        //put comma and dot bw first name and last name
        editor=document.getElementById('CiteEditor').innerHTML.trim().replace(/\.{1,}$/,"")+'.';
        temp=editor;
        
            document.getElementById('CiteEditor').innerHTML=temp;
            edii=1;
    }
    
   
    
    for(i=2;i<10;++i)
        {
            var flg=false;
            if(document.getElementById('CiteAuthor'+i) && document.getElementById('CiteAuthor'+i).innerHTML.trim()!='')
                {
                    //put comma each author
                   temp='';
                        if(author!='')
                        {
                            flg=true;
                        }
                        for(j=2;j<i;++j)
                        {
                            if(document.getElementById('CiteAuthor'+i) && document.getElementById('CiteAuthor'+i).innerHTML.trim()!='')
                            {
                                flg=true;

                                    
                            }
                        }
                        if(flg==true)
                        {
                            temp=', ';
                        }
                        document.getElementById('CiteAuthor'+i).innerHTML=formatDigitalDVDEditor(document.getElementById('CiteAuthor'+i).innerHTML.trim());
                        document.getElementById('CiteCommaA'+i).innerHTML=temp;
                        temp=document.getElementById('CiteEnd'+i).innerHTML;
                        temp=temp.replace(".","");
                        document.getElementById('CiteEnd'+i).innerHTML=temp;
                    authi=i;
                }
        }
        
        for(i=2;i<10;++i)
        {
            if(document.getElementById('CiteEditor'+i) && document.getElementById('CiteEditor'+i).innerHTML.trim()!='')
                {
                    //put comma and dot bw first name and last name
                    temp=document.getElementById('CiteEditor'+i).innerHTML.trim().replace(/\.{1,}$/,"")+'.';
                    
                        document.getElementById('CiteEditor'+i).innerHTML=temp;
                    edii=i;
                }
        }
        if(edii>1)
            {
                temp=document.getElementById('CiteEditor'+edii).innerHTML.trim().replace(/\,{1,}$/,"").replace(/\.{1,}$/,"")+'.';
                    
                        document.getElementById('CiteEditor'+edii).innerHTML=temp;
        if(edii>2)
            {
                if(document.getElementById('CiteAndE'+(edii)))
                    document.getElementById('CiteAndE'+(edii)).innerHTML="& ";
                if(document.getElementById('CiteAndE'+(edii+1)))
                    document.getElementById('CiteAndE'+(edii+1)).innerHTML="";
                if(document.getElementById('CiteCommaE'+(edii+1)))
                    document.getElementById('CiteCommaE'+(edii+1)).innerHTML="";
                
            }
            else if(edii==2)
                {
                    if(document.getElementById('CiteAndE'+(edii)))
                    document.getElementById('CiteAndE'+(edii)).innerHTML=" & ";
                if(document.getElementById('CiteAndE'+(edii+1)))
                    document.getElementById('CiteAndE'+(edii+1)).innerHTML="";
                if(document.getElementById('CiteCommaE'+(edii+1)))
                    document.getElementById('CiteCommaE'+(edii+1)).innerHTML="";
                }
            }
        if(authi>1 && edii>0)
        {
            if(document.getElementById('CiteAndA'+authi))
            {
               document.getElementById('CiteAndA'+authi).innerHTML="";
            }
        }
        if(authi>0 && edii>0)
        {
            
            editor=document.getElementById('CiteEditor').innerHTML.trim().replace(/\&nbsp;{1,}/,"").replace(/^\,{1,}/,"").replace(/\.{1,}$/,"")+'.';
            
            //console.log(editor);
            if(edii==1)
            {
                editor=editor.replace(/^\s*(\&amp\;)+\s*/g,"");
                editor=editor.replace(/^\s*\&+\s*/g,"");
                editor=' & '+editor;
            }
            else if(edii>1)
            {
               editor=editor.trim().replace(/^\,{1,}/,"").trim().replace(/^\,{1,}\s{1,}/,"").replace(/^\&amp;{1,}/,""); 
                editor=', '+editor;
            }
            document.getElementById('CiteEditor').innerHTML=editor;
        }
        if(document.getElementById('chkproducer') && document.getElementById('chkdirector'))
            {   
                clearDigitalProGroup('chkproducer','chkdirector');
                
            }
        addRemoveDotTra();
        
           currentAuthorNo=authi;
           insertDotNodirProd();
           dotInsertFlg=false;
}

function addRemoveDotTra()
{
    if(document.getElementById('CiteEd'))
            {
                if(checkBlank(document.getElementById('CiteEd').innerHTML)==true)
                    {
                        if(document.getElementById('CiteTra'))
                            {
                                var citeTra=document.getElementById('CiteTra').innerHTML;
                                if(checkBlank(citeTra)==false)
                                    {
                                        citeTra=citeTra.replace(".","");
                                        citeTra+='.';
                                        document.getElementById('CiteTra').innerHTML=citeTra;
                                    }
                            }
                    }
            }
}

function insertDotNodirProd()
{
    var prodDirFlg=false;
    var authi;
    var temp;
    authi=currentAuthorNo;
    
            if((document.getElementById('CiteEd') && checkBlank(document.getElementById('CiteEd').innerHTML)==false) || (document.getElementById('CiteTra') && checkBlank(document.getElementById('CiteTra').innerHTML)==false))
            {
                prodDirFlg=true;
            }
            if(prodDirFlg==false)
            {
                if(authi>=0)
                {
                    var temp1;
                    if(authi==0 || authi==1)
                    {
                        authi='';
                    }
                    temp1=document.getElementById('CiteAuthor'+authi).innerHTML.trim();
                    temp=clearBlanksandExtras(temp1);
                    if(temp!='')
                    {
                        arrTemp=temp.split(" ");
                        if(arrTemp.length==1 || (arrTemp.length>1 && arrTemp[1].length>1))
                        {
                            document.getElementById('CiteAuthor'+authi).innerHTML=temp+'.';
                            //dotInsertFlg=true;
                        }
                    }
                }
            }
            else if((document.getElementById('CiteTra') && checkBlank(document.getElementById('CiteTra').innerHTML)==false))
            {
                if(document.getElementById('CiteAuthor')!=null && document.getElementById('CiteAuthor').innerHTML.trim())
                {

                    document.getElementById('CiteAuthor').innerHTML=formatDigitalDVDEditor(document.getElementById('CiteAuthor').innerHTML.trim());
                   
                }
                var i;
                for(i=2;i<10;++i)
                    {
                        if(document.getElementById('CiteAuthor'+i) && document.getElementById('CiteAuthor'+i).innerHTML.trim()!='')
                            {
                                //put comma and dot bw first name and last name
                                temp=document.getElementById('CiteAuthor'+i).innerHTML.trim();

                                    document.getElementById('CiteAuthor'+i).innerHTML=formatDigitalDVDEditor(temp);
                            }
                    }
            }
}

function removeDotdirProd()
{
    var authi=currentAuthorNo;
    if(dotInsertFlg==true && (document.getElementById('CiteTra') && checkBlank(document.getElementById('CiteTra').innerHTML)==false))
    {
        if(currentAuthorNo<=1)
        {
            authi='';
            
        }
        document.getElementById('CiteAuthor'+authi).innerHTML=clearBlanksandExtras(document.getElementById('CiteAuthor'+authi).innerHTML);
    }
}

function checkBlank(str)
{
    str=str.trim();
    str=str.replace("&nbsp;","");
    str=str.trim();
    if(str=='')
        {
            return true;
        }
        return false;
}

function clearBlanksandExtras(str)
{
    str=str.replace("&nbsp;","");
    str=str.trim();
    str=str.replace(",","");
    str=str.replace(".","");
    str=str.trim();
    return str;
}


function formatDigitalDVDEditor(temp)
{
   /* var k=1;
    temp=temp.replace(/\,/g, "");
        temp=temp.replace(/\./g, "");
        temp=temp.trim();
        //console.log(temp);
        if(temp!='')
            {
                arrTemp=temp.split(" ");
                if(arrTemp.length>1 && arrTemp[1].length<=1)
                    {
                    temp=arrTemp[0]+',';
                    for(k=1;k<arrTemp.length;++k)
                        {
                            temp+=' '+arrTemp[k]+'.';
                        }
                    }
            }*/
            return temp;
}

function formatEdissertation()
{
	var descriptor = "";
	var pub = "";
        var city='';


    if(document.getElementById('CiteDescriptor')!=null)
    {
        descriptor = document.getElementById('CiteDescriptor').innerHTML.trim();
    }
    if(document.getElementById('CitePublisher')!=null)
    {
        pub=document.getElementById('CitePublisher').innerHTML.trim();
    }
    if(document.getElementById('CiteCity')!=null)
        {
            city=document.getElementById('CiteCity').innerHTML.trim();
        }
    
    
	
        

	descriptor = descriptor.replace("[","");
        descriptor = descriptor.replace(",","");
        descriptor = descriptor.replace(".","");
        descriptor = descriptor.replace("&nbsp;","");
	descriptor = descriptor.replace("]","");
	descriptor=descriptor.trim();
        
        //console.log(descriptor);
        
        pub = pub.replace("[","");
        pub = pub.replace(",","");
        pub = pub.replace(".","");
        pub = pub.replace("&nbsp;","");
	pub = pub.replace("]","");
	pub=pub.trim();
        
        
        
        city = city.replace("[","");
        city = city.replace(",","");
        
        city = city.replace(".","");
        city = city.replace(".","");
        city = city.replace("&nbsp;","");
	city = city.replace("]","");
	city=city.trim();
        


    
    if(descriptor!='' && pub!='' && city!='')
        {
            descriptor=' ['+descriptor+',';
            pub='&nbsp;'+pub+',';
            city='&nbsp;'+city+']';
        }
        else if(descriptor!='' && pub!='' && city=='')
            {
                descriptor='['+descriptor+',';
                pub='&nbsp;'+pub+']';
            }
            else if(descriptor!='' && pub=='' && city!='')
                {
                    descriptor=' ['+descriptor+',';
                    city='&nbsp;'+city+']';
                }
                else if(descriptor=='' && pub!='' && city!='')
                {
                    pub=' ['+pub+',';
                    city='&nbsp;'+city+']';
                }
                
    
    
    
    else if(descriptor=='' && pub!='' && city=='')
                    {
                        pub=' ['+pub+']';
                    }
                    else if(descriptor!='' && pub=='' && city=='')
                        {
                            descriptor=' ['+descriptor+']';
                        }
                        else if(descriptor=='' && pub=='' && city!='')
                            {
                                city=' ['+city+']';
                            }

    if(document.getElementById('CiteDescriptor')!=null)
        {
            if(descriptor!="")
                {
                    descriptor=" "+descriptor;
                }
            document.getElementById('CiteDescriptor').innerHTML = descriptor;
        }
    if(document.getElementById('CitePublisher')!=null)
        document.getElementById('CitePublisher').innerHTML = pub;
    if(document.getElementById('CiteCity')!=null)
        document.getElementById('CiteCity').innerHTML = city;
}


function afterFormat(div,divArr)
{
    //console.log(div);
    //console.log(divArr);
	var varTemp=false;
        var tempVal;
        var dat='';
        var i;
        if(typeof div == "undefined" || typeof divArr == "undefined" || div == "" || divArr=="" || divArr == null)
            {
                exit;
            }
        for(i=0;i<divArr.length;++i)
            {
                if(document.getElementById(divArr[i])!=null)
                {
                    tempVal=document.getElementById(divArr[i]).innerHTML.trim();
                    tempVal = tempVal.replace("&nbsp;","");
                    tempVal=tempVal.trim();
                    if(tempVal!='')
                        {
                            varTemp=true;
                            break;
                        }
                }
            }


    if(document.getElementById(div)!=null)
    {
        dat = document.getElementById(div).innerHTML.trim();
    }
    
        


    if(dat!='')
        {
            
            dat=dat.substring(0,(dat.length - 1));
            dat=trimLastChar(dat,".");
            if(dat!='')
                {
                    dat=dat+'.';
                }
            /*if(varTemp==true && getFormName()!="booksChapter")
                {
                    dat+=',';

                }
                else
                    {
                        dat+='.';
                    }*/
        if(document.getElementById(div)!=null)
                document.getElementById(div).innerHTML = ' '+dat;
        }
}


var publ = "";
var city = "";
var verse = "";
function formatPubCity()
{
    if(document.getElementById('CitePublisher')!=null)
    {
        publ = document.getElementById('CitePublisher').innerHTML.trim();
    }
    if(document.getElementById('CiteCity')!=null)
    {
        city = document.getElementById('CiteCity').innerHTML.trim();
		
    }
    if(publ!="" && city!="")
    {
        publ= publ.replace(".", ",");
    }
    else if(publ!="" && city=="")
    {
        publ = publ.replace(",",".")
    }
    if(document.getElementById('CitePublisher')!=null)
        document.getElementById('CitePublisher').innerHTML = publ;
    if(document.getElementById('CiteCity')!=null)
        document.getElementById('CiteCity').innerHTML = city;
	//MIS_15_april_13
	if(verse!=""){
		if(document.getElementById('CiteVolume')!=null)
			document.getElementById('CiteVolume').innerHTML = verse;	
	}
}


var pub2="";
var place2="";
function formatPlPub(whichForm)
{
    var formName=getCleanedFormName();
    
    if(document.getElementById('CitePlace')!=null)
    {
        place2 = document.getElementById('CitePlace').innerHTML.trim();
    }
    if(document.getElementById('CitePublisher')!=null)
    {
        pub2 = document.getElementById('CitePublisher').innerHTML.trim();
		pub2=pub2.replace(",",".");
    }
	if(document.getElementById('http') && document.getElementById('http').value != ""){
				Internetpubplace();	
	}
        var tempPlc=place2.replace("&nbsp;","").trim();
	if(place2!="" && pub2!="")
    {
    		//place2= place2.replace(".",":");
		if(whichForm == 'archive'){
    		//do nothing
		}else if(whichForm == 'manuscript'){
			//do nothing
			pub2=pub2.replace(".",",");
		}else{
                    
                        if(tempPlc.indexOf('n.p.')>=0)
                        {
                            if(tempPlc.indexOf(":")<0)
                                place2= place2+":";
                        }
                        else
                        {			
                            place2= place2.replace(".",":"); //comma between city and venue LC230615
                        }
		}
    }
    else if(place2!="" && pub2=="")
    {
        if(tempPlc.indexOf('n.p.')>=0)
        {
            place2=place2.replace(":","");
        }
        else
        {
    		place2=place2.replace(":",".");
        }
                place2=place2.replace(",",".");
          
     }
     
     if(formName=="conference")
         {
             place2=place2.replace(":",",");
             pub2=pub2.replace(",",".")
             pub2=pub2.replace(":",",");
             place2=place2.replace(",",".")
         }
         
         console.log("pub2: "+pub2);
         console.log("place2: "+place2);
         
    if(document.getElementById('CitePlace')!=null)
        document.getElementById('CitePlace').innerHTML = place2;
    if(document.getElementById('CitePublisher')!=null)
        document.getElementById('CitePublisher').innerHTML =pub2;
        

}

var mapVol = "";
var mapIss = "";
function formatVolIss()
{
    if(document.getElementById('CiteVolume')!=null)
    {
        mapVol = document.getElementById('CiteVolume').innerHTML.trim();
    }
    if(document.getElementById('CiteIssue')!=null)
    {
        mapIss = document.getElementById('CiteIssue').innerHTML.trim();
    }

    if(mapVol!="" && mapIss!="")
    {
        mapVol= mapVol.replace(").", ",&nbsp;");
        mapIss=  mapIss.replace("(", "");
    }
    else if(mapVol!="" && mapIss=="")
    {
        mapVol = mapVol.replace(",&nbsp;",").")
    }
    else if(mapVol=="" && mapIss!="")
    {
        mapIss= mapIss.replace("(", "");
        mapIss= "(" + mapIss;
    }
    if(document.getElementById('CiteVolume')!=null)
        document.getElementById('CiteVolume').innerHTML = mapVol;
    if(document.getElementById('CiteIssue')!=null)
        document.getElementById('CiteIssue').innerHTML = mapIss;
}
/*chris - end of functions*/
function showDiv(id)
{
    if (document.getElementById)
    {

        if(document.getElementById(id)!=null)
        {
            document.getElementById(id).style.visibility = 'visible';
            document.getElementById(id).style.position = 'relative';
            document.getElementById(id).style.left = 'auto';
            document.getElementById(id).style.top = 'auto';
        }
    }
    else
    {
        if (document.layers)
        { // Netscape 4
            document.hideshow.visibility = 'visible';
        }
        else
        { // IE 4
            document.all.hideshow.style.visibility = 'visible';
        }
    }
}

/*chris added new method to handle line breaks and br tags 01 July 09*/
function replaceBR(instr)
{
    var matchTag1 = /<br*?>/g;
    var matchTag2 = /<BR*?>/g;
    var str=instr.replace(matchTag1, "�");
    return str.replace(matchTag2, "�")
}
function replaceNBSP(istr)
{
    var matchTag1 = /&nbsp;/g;
    var str=istr.replace(matchTag1, " ");
    return str;
}
function replaceSpecial(instr)
{
    var matchTag1 = /�/g;
    var str=instr.replace(matchTag1, "\r\n");
    return str;
}
function replaceNewLineBR(str)
{
    str=str.replace(new RegExp( "\\n", "g" ),"<br>").replace(new RegExp( "\\r", "g" ),"");
    return str;
}
/*chris end of 2 functions*/

function getText(srcPnlID)
{
	 	//MI_15_march_13
		/*if(document.getElementById('author').value== "")
		{
			document.getElementById('CiteYear').innerHTML="";
		}*/
		var content="";
            var found = $("#"+srcPnlID).find("span");
				//alert(found.length);
				//alert($("#"+srcPnlID).html());
                if(found.length >0)
                {					
                    for( i=0; i < found.length; i++){
                        if($(found[i]).attr('id')!='annotation')
                            {
                        /*if ($(found[i]).attr('id') == 'CiteTitle' && $.trim(removeNewLine($(found[i]).text()))!= "")*/
                        if ($(found[i]).css('font-style') == 'italic' && $.trim(removeNewLine($(found[i]).text()))!= "")
						{
                            content=content+"^i^"+ removeNewLine($(found[i]).text())+"^ii^";
							//content=content.replace(",","");
							
                        }
						else if ($(found[i]).attr('id')=='VirCiteAuthor'  || $(found[i]).attr('id')=='VirCiteEditor'
                                             || $(found[i]).attr('id')=='VirCiteTrans' || $(found[i]).attr('id')=='VirCiteProducer'
                                  || $(found[i]).attr('id')=='VirCiteRevAuthor') {
							//do nothing
						}
						else {
							content=content+removeNewLine($(found[i]).text());
						}
						//alert($(found[2]).text());
				     }
                    }
					 
                }
            content=$.trim(removeNewLine(content));
		content=content.replace(/\^i\^/g, "<i>");

            content=content.replace(/\^ii\^/g, "</i>");
			return content;

 

}

function savePrevPanl1(srcPnlID , destPnlID, log,ssoLogin)
{
            
  if(log==true)
  {	
    if($.trim(getInnerText(srcPnlID)) != "")
    {
     
        
        if(document.getElementById('CiteHttp'))
            {
                var htVal=$("#CiteHttp").html().trim();
                if(htVal=='')
                    {
                        setInnerText("CiteAccessed","");
                        
                    }
            }
        
        //chkPlcAndDate();
       
        chkYearDate();
        
        if(reviewFlg && getFormName()!="creativeReview" && getFormName()!="periodicalReview")
        {
            if( document.getElementById('descriptor') && document.getElementById('descriptor').value != "")
                chkTitle('descriptor');
			
        }
        else if(document.getElementById('editor') && document.getElementById('editor').value != "")
        {
            
            /*if(firstFieldId=='author' && isAllAuthorsBlank()==true)
                   {
                       
                   }
                   else */if(getFormName()!="DigitalDVD")
                            chkTitle('editor');
        
        }
        else if( document.getElementById('chapter') && document.getElementById('chapter').value != "")
        {
            
            var firstFieldId=$(".cssform input:text").first().attr('id');
            if(firstFieldId=='author' && isAllAuthorsBlank()==true)
                   {
                       //
                   }
                   else
                   {
                    //chkTitle('chapter'); 
                }
                
        }
		else if(document.getElementById('title') && document.getElementById('title').value != "")
                {
                    
                    var firstFieldId=$(".cssform input:text").first().attr('id');
                   if(firstFieldId=='author' && isAllAuthorsBlank()==true)
                   {
                       //
                   }
                   else
                   {
                    //chkTitle('title');
                }
            
        }
		else if(document.getElementById('publisher') && document.getElementById('publisher').value != "")
            chkTitle('publisher');
        else if(document.getElementById('http') && document.getElementById('http').value != "")
            chkTitle('http');
        else if(getFormName()=="creativeReview" || getFormName()=="periodicalReview")
        {
                chkTitle(); 
        }
        
        if(getFormGroup()=="academic")
        {
            var isTtl=document.getElementById('CiteTitle').innerHTML;
            isTtl = isTtl.replace(",", "");
            document.getElementById('CiteTitle').innerHTML=isTtl;
                   
        }
        else if(getFormName()=="creativeReview" || getFormName()=="periodicalReview")
        {
            var lastRevAuthor;
            var lastEditor;
            var reviewedTitle;
            var frmt;
            reviewedTitle=getInnerText('CiteSubject').trim();
            frmt=getInnerText('CiteDescriptor').trim(); 
            lastRevAuthor=getLastRevAuthorNo()
            lastEditor=getLastEditorNo();
            if(frmt=='' && reviewedTitle=='' && lastRevAuthor==1 && lastEditor==1 && document.getElementById('CiteYear'))
            {
                document.getElementById('CiteYear').innerHTML=document.getElementById('CiteYear').innerHTML.replace("&nbsp;","").replace(",","");
            }
            if(lastEditor!=1 && frmt=='' && reviewedTitle=='' && lastRevAuthor==1 && document.getElementById('CiteEd'))
                {
                    document.getElementById('CiteEd').innerHTML=document.getElementById('CiteEd').innerHTML.replace(", ","");
                }
                
                //put square brackets because if nothing is there then also n.d. will be there
                document.getElementById('CiteRevOpen').innerHTML=' [';
            document.getElementById('CiteRevClose').innerHTML='].';
                
        }
        
		var sortedArr = new Array();
		/*$('.tabContent #publicationtype .cssform input').each(function() {
			if ($(this).val() != '') {
				$(this).trigger('keyup');
				$(this).trigger('onchange');
				$(this).trigger('onclick');
			}
		});*/
		
        citationCount=0;
        $('.previewcitation').each(function(index)
        {
            var annot=$("#ckb"+$(this).attr("id")).attr('data-annotation');
            var citaId=$("#ckb"+$(this).attr("id")).attr('data-id');
            
            $("#ckb"+$(this).attr("id")).remove();
            
            sortedArr[citationCount]= new Array(3);
			sortedArr[citationCount][1] = $(this).find('span').html();
            sortedArr[citationCount][0] = $(this).text().trim();
            sortedArr[citationCount][2]=  "citation"+parseInt(citationCount+1);             
            sortedArr[citationCount][3]=annot;
            sortedArr[citationCount][4]=citaId;
            citationCount++;
			
            
        });
	
        var cnt=parseInt(sortedArr.length);
	sortedArr[cnt]= new Array(3);
        sortedArr[cnt][1] = getText(srcPnlID);
        sortedArr[cnt][0] = $("#"+srcPnlID).text().trim();
		sortedArr[cnt][2]="citation"+sortedArr.length;
                if(document.getElementById('annotation'))
        {
            var tmpAnn=$("#annotation").html();
            if(tmpAnn!='')
                {
                    tmpAnn=tmpAnn.replace(/\"/g,"####");
                    tmpAnn=tmpAnn.replace(/\'/g,"~~~~");
                }
            sortedArr[cnt][3]=tmpAnn;
        }
        else
        {
            sortedArr[cnt][3]='';
        }
        
        
        sortedArr[cnt][4]="";
        
	var citationID=	"citation"+sortedArr.length;
        if(document.getElementById('curCitaId'))
            {
                $("#curCitaId").val(citationID);
            }
            else
                {
                    $("body").append('<input type="hidden" id="curCitaId" value="'+citationID+'" />');
                }
        citationCount++;
		
        sortedArr.multiSort(0);
		var temp = "";
        var checked='checked';
        if(document.dblog==true || (typeof saveMyCiteBottom != "undefined" && saveMyCiteBottom==true))
            {
                
                checked='checked';
            }
        for (i=0 ; i <= sortedArr.length - 1 ; i++)
        {
             var temp1 = "<div class='citation previewcitation' id='"+ sortedArr[i][2] +"' ><input type='checkbox' ";
            if(checked=="checked" && "ckb"+sortedArr[i][2]=="ckbcitation"+sortedArr.length)
                {
                    temp1+='checked';
                }
                temp1+=" data-annotation='"+sortedArr[i][3]+"'";
                temp1+=" data-id='"+sortedArr[i][4]+"'";
            temp1+=" class='deletecitation' id=ckb"+sortedArr[i][2] +" name='data"+sortedArr[i][2]+"'/> <span id=data"+sortedArr[i][2] +">"+ sortedArr[i][1] +"</span></div>" ;
            temp=temp+temp1;
        }
        
        if(ssoLogin!='')
            {
            }
            else
                {
                $("#"+destPnlID).html(temp);
            }
            
        if($.trim($("#svPnl").text())!="")
        {
         $('#chk-unchk').css('display','block');   
        }
       
        
                
                $('#previewChkDiv').css('display','none');
                                    $("#previewChkDiv").html('');
                
        if(document.getElementById('sc3'))
            document.getElementById('sc3').style.display = "none";

        if(document.getElementById('date'))
        {
            document.getElementById('date').style.visibility = "visible";
            document.getElementById('date').value = "";
        }
        if(document.getElementById('observed'))
        {
            document.getElementById('observed').style.visibility = "visible";
            document.getElementById('observed').value = "";
        }

        if($.trim($("#svPnl").text())!="" || (ssoLogin!='' && temp1!='' ))
        {
			
        //var content="";
        if(ssoLogin!=''){
            var content=temp1;
        }
        else
            {
		var content=temp;
            }
		
		content=content.replace(/&nbsp;/g , " ");
		content=content.replace(/&/g , "##");
                
                var saveSessionUrl='savesession.php';
                var async=true;
                if(ssoLogin!='')
                    {
                        saveSessionUrl='savesession_sso.php';
                        async=false;
                    }

		var whichStyle =getSectionName();
                var wSite='';
                if(typeof whichSiteObj != "undefined")
                {
                    wSite=whichSiteObj.wSite;
                }
        	$.ajax({
			  type: 'POST',
			  url: base_url+ 'students/scripts/'+saveSessionUrl,
			  context: document.body,
                          async: async,
			  data: "html="+encodeURIComponent(content)+"&whichstyle="+whichStyle+"&whichsite="+wSite,
                          success: function(data)
                          {
                              if(typeof newDesign == "undefined" || newDesign!=true)
                                  {
                                        if(document.getElementById('dskCiteWebForm'))
                                            OpenVerticalMenu();
                                  }
                                  else
                                      {
                                          resetAutoSearchform();
                                      }
                          }
			});
			
			try{
				$(".cssform input").spellchecker("remove");
			}
			catch(e){
			}
        }
    }
}
else
{
     //       RegisterAlert();
      

}


}

//Get Array Name
function getArr(arrName)
{
    var tmpArr;
    switch(arrName)
    {
        case "bookPanel":
            tmpArr = bookPanelArr;
            break;
    }

    return tmpArr;
}

function clearLast()
{

    var text=  $("#bookPanel").text();
    if(text.trim()!="")
    {
        clearPanel("bookPanel");
    }
    else
    {
        if( citationCount>0)
        {
            $("div#citation"+ citationCount).remove();
            citationCount--;
        }
    }
}

//Clear piew panel
function clearPanel(panelArr,resetNum)
{
	//for reset personal author flag MI_28-04-2012
	document.perYesau1=0;
	document.perNoau1=0;
	document.perYesau2 = 0;
	document.perNoau2 = 0;
	document.chapteralert = false;
	document.perYeseditor=0;
	document.perNoeditor=0;
	document.intextonly = false;
        document.mainciteOnly = false;
        document.retainpagealert=false;
	document.retain = false;
	edatahttp = false;
	retainhttp = false;
	//end
	for(YAU=2;YAU<10;YAU++){
		AF = 'perYesauthor'+YAU;
		if(eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NAU=2;NAU<10;NAU++){
		NF = 'perNoauthor'+NAU;
		if(eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
	for(YED=2;YED<10;YED++){
		AF = 'perYeseditor'+YED;
		if(eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NED=2;NED<10;NED++){
		NF = 'perNoeditor'+NED;
		if(eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
	
    var tmpArr;
    tmpArr = getArr(panelArr);
    
    
    $(".optionalTxt").hide();
        resizeAnnotationFld();
        
        
    var formName=getCleanedFormName();
    var pageSec=getPageSectionGlobal();
    
    if(document.getElementById('print'))
        {
            if(formName=="journal" || formName=="academic_journal")
                {
                    if(document.getElementById('pageJournal'))
                        {
                            $("#pageJournal").val('');
                        }
                }
            clearchkpi(document.getElementById('print'));
        }

    if (typeof resetNum != "undefined")
    {
        numOfAuthors = 2;
        numOfEditors = 2;
        numOfProducers = 2;
        numOfRevAuthors = 2;
        numOfTrans = 2;
        noAuthorFlg = false;
    }
    document.getElementById(panelArr).innerHTML = "";
    document.getElementById(panelArr).innerHTML = srcSec;

    if(document.getElementById('authorSec'))
    {
        document.getElementById('authorSec').innerHTML = "";
    }

    if(document.getElementById('editorSec'))
    {
        document.getElementById('editorSec').innerHTML = "";
    }

    if(document.getElementById('producerSec'))
    {
        document.getElementById('producerSec').innerHTML = "";
    }


    if(document.getElementById('revauthorSec'))
    {
        document.getElementById('revauthorSec').innerHTML = "";
    }

    if(document.getElementById('transSec'))
    {
        document.getElementById('transSec').innerHTML = "";
    }

    var bookPanelArr = new Array("CiteAuthor","VirCiteAuthor","CiteYear","CiteDate","CiteChapter","CiteIOn","CiteEditor","VirCiteEditor","CiteEd","CiteTitle","CiteDescriptor","CiteSubject","CiteTrans","VirCiteTrans","CiteTra","CiteEdition","CiteIssue","CiteVolume","CitePage","CitePlace","CitePublisher","CiteAccessed","CitePublication","CiteHttp","CiteProducer","VirCiteProducer","CiteProd","CiteRevAuthor","VirCiteRevAuthor","CiteRevAuth","CiteRecord","CiteSource","CiteCity","CiteRole","CiteRevOpen","CiteRevClose","CiteObserved","citeFormat","CiteCommaStart","CiteCommaEnd","CiteAuth","CiteOriginalYear");

    if(document.getElementById('http'))
        {
            $("#http").val('');
        }
    
    retrievedChk();
    if($('form[name=publication]').length)
        {
            document.publication.reset();
        }
    chkUnchkBlogPage();
    if(formName == "law_reports" && document.getElementById('law_supreme'))
        {
            $("#volume").val('');
            $("#year").val('');
            
            checkLawReportJuri(document.getElementById('law_supreme'));
            $("#CitePlace").html('');
            $("#CiteSource").html('');
        }
        else if(formName=="patents" && document.getElementById('juri_chk'))
            {
                showHideJuri(document.getElementById('juri_chk'));
            }
            else if(formName=="parliament")
                {
                    $("#record").val('');
                    $("#title").val('');
                    if(document.getElementById('legis_congress'))
                        {
                            $("#volume").val('');
                            showHideChamber(document.getElementById('legis_congress'));
                        }
                    chkBillRepo();
                    chkHrs();
                }
                else if(formName=="legislation")//parliament
                    {
                        $("#record").val('');
                        checkhsc(document.getElementById('chkhsc'));
                    }
                    else if(formName=="sound_recording")
                        {
                            checkShowHideVol(document.getElementById('sound_volume'));
                            chkAlbumTrack(document.getElementById('sound_track'));
                        }
                        else if(formName=="tv_series")
                            {
                                chkTvEpisode(document.getElementById('chkEpisode'),true);
                            }
                            else if(formName=="conference")
                                {
                                    showHideSymposium(document.getElementById('chkNotes'));
                                    showHideSymposium(document.getElementById('chkSymposium'));                                    
                                    chngEditChair();
                                }
                                else if(formName=="course_notes")
                                    {
                                        cnShowHideFrmt();
                                    }
                                    else if(formName=="data")
                                        {
                                            dsShowHideFrmt();  
                                            unpulishedChkbx();
                                        }
                                        else if(formName=="presentation" && document.getElementById('chkVideo'))
                                            {
                                                showHidePresenIntChk(document.getElementById('print'));
                                            }
                                            else if(formName=="newsletter" || formName=="encyclopaedia" || formName=="academic_journal"
                                             || formName=="ejournal" || formName=="journal" || (pageSec=="periodicals" && formName=="interview")
                                                    || pageSec=="creative" || pageSec=="books" || formName=="review")
                                                {
                                                    
                                                    document.publication.reset();
                                                    if(document.getElementById('chkauthor') && formName=="edited")
                                                        {
                                                            showHideEditorBlock(document.getElementById('chkauthor'));
                                                        }
                                                    
                                                    if(document.getElementById('chkReprint'))
                                                    {
                                                        showHideOrigYear(document.getElementById('chkReprint'));
                                                    }
                                                    if(document.getElementById('transSpecial') && document.getElementById('original_pear_p'))
                                                    {
                                                    
                                                        showHideOrigYear(document.getElementById('transSpecial'));
                                                    }
                                                    if(document.getElementById('chkNwsEdited'))
                                                        {
                                                            showHideEdtr(document.getElementById('chkNwsEdited'));
                                                        }
                                                        if(document.getElementById('chkNwsEdition'))
                                                            {
                                                                showHideEdition(document.getElementById('chkNwsEdition'));
                                                            }
                                                            if(document.getElementById('chkNwsVolume'))
                                                                {
                                                                    showHideVolume(document.getElementById('chkNwsVolume'));
                                                                }                                                                
                                                                if(document.getElementById('chkNwsIssue'))
                                                                    {
                                                                        showHideIssue(document.getElementById('chkNwsIssue'));
                                                                    }
                                                                    
                                                                        if(document.getElementById('chkJournal'))
                                                                            {
                                                                                showHideVolIss(document.getElementById('chkJournal'));
                                                                            }
                                                }
                                                else if(formName=="wiki")
                                                    {
                                                        showHideWikipedia();
                                                    }
                                                    else if(formName=="lecture")
                                                        {
                                                            document.publication.reset();
                                                            showHideLectIntChk(document.getElementById('print'));
                                                        }
                                                        else if(formName=="edatabase")
                                                            {
                                                                if(formName=="edatabase" && document.getElementById('rerievedChk'))
                                                                {
                                                                    $("#retrieved_chk_p").show();
                                                                }
                                                            }

    if(document.getElementById('chkUsername'))
        {
            showHideUsername();
        }
        
        if(document.getElementById('chk_page_nos'))
            {
                showHidePageNo();
            }
            
            if(formName=="video" && document.getElementById('chkTedConferences'))
                {
                    showHideTedConferencesLect();
                }
                if(document.getElementById('chkConstitution'))
                    {
                        showHideConstitution(document.getElementById('chkConstitution'));
                        addUsAmend();
                          showHideRepealed();
                    }
                    var frmName=getFormName();
                    if(frmName=="citeweb_journal")
                        {
                            magNewsChk();
                        }
//    document.getElementById('CiteAuthor').style.fontStyle = "normal";

}

//Email Function
function email(id)
{
	
     var section=getSectionName();
	     if(getInnerText('bookPanel') != "")
        chkPlcAndDate();

    //clearEditor();
    if(reviewFlg)
    {
        if( document.getElementById('descriptor') && document.getElementById('descriptor').value != "")
            chkTitle('descriptor');
    }
    else if(document.getElementById('editor') && document.getElementById('editor').value != "")
        chkTitle('editor');
    else if( document.getElementById('chapter') && document.getElementById('chapter').value != "")
        chkTitle('chapter');
    else if(document.getElementById('title') && document.getElementById('title').value != "")
        chkTitle('title');
    else if(document.getElementById('publisher') && document.getElementById('publisher').value != "")
        chkTitle('publisher');
    else if(document.getElementById('http') && document.getElementById('http').value != "")
        chkTitle('http');
	
    if($.trim($("#svPnl").text())!="")
        {
            var n=$('.deletecitation:checked').length;
            if(n>0)
            {
        var content="";
	  
        $('.deletecitation:checked').each(function(index)
        {
			var par = $(this).parent("div");
                        var idChk=$(par).children('input').attr('id');
			content1 = $(par).children("span").html();
			content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'><span>"+content1+"</span></div>"; 
                        if(document.getElementById('annot-'+idChk) && document.getElementById('annot-'+idChk).style.display!="none")
                        {
                            var cntAnnot=$('#annot-'+idChk).html();
                            content1+="<div style='width: 600px; height: auto; white-space: normal;'>"+cntAnnot+"</div>";
                        }
                        content1+="<br/>";
			content=content+content1;
                    

	      });
   
			content=content.replace(/&nbsp;/g , " ");
			content=content.replace(/&/g , "##");
                        content=content.replace(/%20/g , "#####");
   		
     var txtToEmail = "<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
   	
    //var txtToEmailReal = document.getElementById(id).innerText;
	var txtToEmailReal =id;
	
	txtToEmail = removeNewLine(txtToEmail);
	
    var emailAddr = document.getElementById('emailAddr').value;
	
	if(echeck(emailAddr))
    {
		
        var lngth = txtToEmail.length;
      //  var qurt = lngth/4;
         document.getElementById('emailedData1').value = txtToEmail;
      //  document.getElementById('emailedData2').value = txtToEmail.substring(qurt , qurt+qurt);
       // document.getElementById('emailedData3').value = txtToEmail.substring(qurt+qurt , qurt+qurt+qurt);
       // document.getElementById('emailedData4').value = txtToEmail.substring(qurt+qurt+qurt , lngth);

        if(txtToEmailReal != "")
        {	
		$.ajax({ 
               type: 'POST',
		   async:false,
               url: base_url+ 'students/scripts/phpMailer.php',
               data: "html="+txtToEmail+"&emailAddr="+emailAddr+"&set=email&format="+section+"&time="+new Date().toString().substring(4,28),
		   success: function(data){
				//alert(data);
   				if(data == 'An error has occured.' )
					{
                                jAlertMod("An error has occured, please report this to the website administrator.","Failure","&nbsp;OK&nbsp;",null);
					}
					else
				if(data == 'success' )
				  	{
					  $("img.btn_close").parent("a").trigger("click");
					  jAlertMod("Your CiteMaker references have been e-mailed. ","Success","&nbsp;OK&nbsp;",null);					
					  $('#fade , .popup_block').fadeOut(function() {
							$('#fade, a.close').remove();  //fade them both out
					  });
					}					
					  }

	      });
    }
 }
    }
            else
            {
             jAlertMod("Please select citation to email.","Alert","&nbsp;OK&nbsp;",null);   
            }
        }
	
return false;
}


function email_intext(){
  var section=getSectionName();
  var content="";
  $('.chkIntext:checked').parent().each(function(index){
		var inpt = $(this).html();
		var par = $(this);
		$(par).children('input').remove();
		content1 = $(par).html();
		$(par).html(inpt);
		
		content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'>"+content1+"</div><br />"; 
		content=content+content1;
		//content=content.replace("&nbsp;",""); 


	});
	content=content.replace(/&nbsp;/g , " ");
	content=content.replace(/&/g , "##");

	var txtToEmail = "<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
	txtToEmail = removeNewLine(txtToEmail);
	var emailAddr1 = document.getElementById('mail_id').value;
	if(echeck(emailAddr1)){
        var lngth = txtToEmail.length;
        document.getElementById('emailedData5').value = txtToEmail;
		$.ajax({
               type: 'POST',
			   async:false,
			   url: base_url+ 'students/scripts/phpMailer.php',
               data: "html="+txtToEmail+"&emailAddr1="+emailAddr1+"&set=email1&format="+section+"&time="+new Date().toString().substring(4,28),
		  	 success: function(data){
   				if(data =='An error has occured.' ){
                  jAlertMod("An error has occured, please report this to the website administrator.","Failure","&nbsp;OK&nbsp;",null);
				}else if(data =='success' ){
				  jAlertMod("Your CiteMaker references have been e-mailed. ","Success","&nbsp;OK&nbsp;",null);					 
				}
				$('#fade , .popup_block').fadeOut(function() {
						$('#fade, a.close').remove();  //fade them both out
					});
			}					
	      });
	}
return false;		
}

function clearEditor()
{
    if(document.getElementById('author').value == "")
    {
        document.getElementById('CiteEd').innerText = "";
        document.getElementById('CiteEditor').innerText = "";
        document.getElementById('VirCiteEditor').innerHTML = "";
    }
}
//Email Check
//When changing from page to another one
function onPgChange()
{
    ask4Save();
}
function onPgChange1()
{
    ask4Save1();
}


//Check if there's smth to read from the clipboard



String.prototype.trim = function()
{
    return this.replace(/^\s+|\s+$/, '');
};
function onPgLoad()
{

}

function inOn(inOnStr)
{
    showDiv('CiteIOn');

    if(inOnStr == "in")
        setInnerText('CiteIOn', " In");
    else if(inOnStr == "on")
        setInnerText('CiteIOn', " On");
    else if(inOnStr == ":")
        //chris removed extra space 20 July 2009
        setInnerText('CiteIOn', ":");
    else
        setInnerText('CiteIOn',"");
}

//show Email Section
function showEmailDiv(secID)
{
    document.getElementById(secID).style.display=(document.getElementById(secID).style.display!="block")? "block" : "none";
    document.getElementById('emailAddr').value = "";
}

//show Email Section
function showEmailDiv2()
{
	secID = 'emailSec1';
    document.getElementById(secID).style.display=(document.getElementById(secID).style.display!="block")? "block" : "none";
    document.getElementById('emailAddr1').value = "";
}

//show Email Section
function showEmailDiv3()
{
	secID = 'emailSec2';
    document.getElementById(secID).style.display=(document.getElementById(secID).style.display!="block")? "block" : "none";
    document.getElementById('emailAddr2').value = "";
}

function onPgClose()
{

 
}

/*chris changed method to validate 10 July 09*/
function ValidateDate(dtElement,clrElement,dateFormat)
{
    if(typeof clrElement == "undefined")
        clrElement="CiteAccessed";
    
    if(typeof dateFormat=="undefined")
        {
            var dateFormat='';
        }

    var dt=document.getElementById(dtElement);
	
    if(dt.value.trim()=='')
    {}
    else
    { 
        if(dtElement=="accessed")
        {
        if (isDateMonthDDYYYY(dt.value))
            {
            return true;
        }
        else
        {
			jAlertMod1('Enter date in "Month Date Year" format.',"Alert","&nbsp;OK&nbsp;",function(c1){
			if(c1)
			{
				document.getElementById(clrElement).innerHTML="";
                                        document.getElementById(dtElement).value="";
                                        document.getElementById(dtElement).focus();
				return false;
			}});
            return false;
        }
    }
        else
        {
            if(dateFormat=='YMd')
                {
                    var dtv=dt.value.replace(/\,/g,"");
                    if(isDateYYYYMonthDD(dtv) || isDateYYYY(dtv))
                        {
                            return true;
                        }
                        else
                            {
                                jAlertMod1('Enter date in "Year Month Date" or "Year" format.',"Alert","&nbsp;OK&nbsp;",function(c1){
                                    if(c1)
                                    {
                                            document.getElementById(clrElement).innerHTML="";
                                                    document.getElementById(dtElement).value="";
                                                    document.getElementById(dtElement).focus();
                                            return false;
                                    }});
                        return false;
                            }
                }
            else if (isDateDDMMYYYY(dt.value)|| isDateMMDDYYYY(dt.value) || isDateDDMonthYYYY(dt.value) || isDateMonthDDYYYY(dt.value) ||
                isDateYYYYMonth(dt.value) || isDateYYYY(dt.value) || isDateMonthYYYY(dt.value) || isDateYYYYMonthDD(dt.value) || dt.value.toLowerCase()=="in press")
                {
                    return true;
                }
                else
                {
                            jAlertMod1('Enter date in "Year Month Date" or "Year Month" format.',"Alert","&nbsp;OK&nbsp;",function(c1){
                            if(c1)
                            {
                                    document.getElementById(clrElement).innerHTML="";
                                            document.getElementById(dtElement).value="";
                                            document.getElementById(dtElement).focus();
                                    return false;
                            }});
                return false;
            }
        }
    }
    return true;
}

function init() {
	//alert(456);
	//copy_intext();
	var n = $('.deletecitation:checked').length;
	//if(n>0){
	clip11 = new ZeroClipboard.Client();
	clip11.setHandCursor( true );
	
	clip11.addEventListener('mousedown', function (client) {
	
	var content="";
	$("#d_clip_container").parent().addClass("active");
        var previewChkFlag=false;
                if(document.getElementById('previewChk') && $('#previewChk:checked').length>0 && $("#bookPanel").text().trim()!='')
                    {
                        previewChkFlag=true;
                        
                    }
	if($.trim($("#svPnl").text())!="" || previewChkFlag==true)
	{
            if(previewChkFlag==true)
                {
                    content=content+getText('bookPanel')+"<br/>\r\n \r\n";
                }
		$('.deletecitation:checked').parent().each(function(index){
			content=content+$.trim($(this).children("span").html())+"<br/>\r\n \r\n";
		})
		//if(document.dblog==true){
			if(content=="")
			{
				jAlertMod("Select a checkbox before clicking Copy button.","Alert","&nbsp;OK&nbsp;",null);
				return false;
			}
			else{
				clip11.setText(content);	
			}
		/*}else{
			RegisterAlert();
		}*/
		
	
	}
	else{
			
		clip11.addEventListener('Complete', function () {
				if($.trim($("#svPnl").text())==""){
						jAlertMod("No citation found. Save your citation(s) first.","Alert","&nbsp;OK&nbsp;",null);
						return false;
				}
		});
	}
	});
	clip11.addEventListener('mouseOver', function (client) {
		$("#d_clip_container").parent().addClass("active");
		
	});
	clip11.addEventListener('mouseOut', function (client) {
		//$("#svPnl").parent().removeClass("active");
		$("#d_clip_container").parent().removeClass("active");
		
	});
	
	//Complete //load
	/*clip11.addEventListener('load', function () {
		if($.trim($("#svPnl").text())==""){
				jAlertMod("No citation found. Save your citation(s) first.","Alert","&nbsp;OK&nbsp;",null);
				return false;
		}
	});*/
	
	clip11.glue('d_clip_button','d_clip_container');
	/*else {
		if(!$('#svPnl').html()){
			jAlertMod("Click save at foot of form before clicking Copy.","Alert","&nbsp;OK&nbsp;",null);
		}else{
			jAlertMod("Click the checkbox alongside in-text before clicking Copy","Alert","&nbsp;OK&nbsp;",null);
		}
	}*/
                
}

// CiteTitle Format for APA journal forms
function CiteTitleFormat(other){
	var ttl = document.getElementById('CiteTitle').innerHTML;
	tit = ttl.replace(".",",");
	tit1 = ttl.replace(",",".");
        var tabName=getTabName();
        if(tabName=="corporate" || tabName=="periodical")
            {
                ttl=ttl.replace(",",".");
            }
            else
                {
                        if(document.getElementById('volume') && document.getElementById('volume').value!= ""){
                                document.getElementById('CiteTitle').innerHTML = tit;
                        }else if(document.getElementById('issue') && document.getElementById('issue').value!= ""){
                                document.getElementById('CiteTitle').innerHTML = tit;
                        }else if(document.getElementById('volume') && document.getElementById('volume').value == ""){
                                document.getElementById('CiteTitle').innerHTML = tit1;
                        }else if(document.getElementById('issue') && document.getElementById('issue').value == ""){
                                document.getElementById('CiteTitle').innerHTML = tit1;

                        }
                }
}

//For Blog date 02112013

function dateValidation(dtElement,clrElement)
{
    if(typeof clrElement == "undefined")
        clrElement="CiteAccessed";

    var dt=document.getElementById(dtElement);
	
    if(dt.value.trim()=='')
    {}
    else
    {
		if (isDateYYYYMonthDD(dt.value) || isDateYYYYMonth(dt.value) || isDateYYYY(dt.value))
		 {
			 return true;
		 }else{
            dt.focus();
            dt.value="";
            document.getElementById(clrElement).innerHTML="";
            setTimeout('setFocus("'+dtElement+'")',10);
			jAlertMod1("Enter date in Year Month Date format","Alert","&nbsp;OK&nbsp;",function(c1){
			if(c1)
			{
				document.getElementById(clrElement).focus();
				return false;
			}});
            return false;
		 }
	}
    return true;
}

function ReplaceInternetS(){	
    var months_arr = new Array("january","february","march","april","may","june","july","august","september","october","november","december");
    
    var formName=getCleanedFormName();
    var pageSec=getPageSectionGlobal();
    var currentTime = new Date();	
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var curDate=year+', '+months_arr[month-1]+' '+day;
    if(document.getElementById('year'))	
    	$("#year").attr("placeholder", year);
    if(document.getElementById('accessed'))
		$("#accessed").attr("placeholder", FLUprCase(months_arr[month-1]) + " " + day + ", " + year);
            if((formName=="paper" || formName=="poster") && document.getElementById('date'))
                {
                    $("#date").attr("placeholder", FLUprCase(months_arr[month-1]) + " " + day + ", " + year);
                }
                else if(formName=="constitutions_conventions" && document.getElementById('date'))
                {
                    $("#date").attr("placeholder", day + " " + FLUprCase(months_arr[month-1]) + " " + year);
                }
                else if(pageSec=="internet" && document.getElementById('date'))
                {
                    $("#date").attr("placeholder", year+", "+FLUprCase(months_arr[month-1]) + " " + day);
                }
    
	$('#publicationtype a').each(function(index, element) {
        if($(element).html()=="Internet Sourced [click +]"){
			$(element).attr("id","intexplink");
		}else if($(element).html()=="Internet Sourced [click here]"){
			$(element).attr("id","intexplink");
			$(element).html("Internet Sourced [click +]");
		}
    });
}
retainhttp = false;
function Internetpubplace(){
			document.getElementById('http').onchange = httponchangedonothing;
			
}

function Internetdb(){
			if((document.getElementById("database") && document.getElementById('database').value != "") && !retainhttp){
				jConfirmMod2("<center>APA does not require Database information for online sources.<br/>It is preferable to cite the publication title (e.g. journal name) if known.</center>","Alert","&nbsp;Remove&nbsp;","&nbsp;Retain&nbsp;",function(a1) {
					if(a1){	
							if(document.getElementById("database"))
								document.getElementById('database').value = '';
                                                            if(document.getElementById('record'))
                                                                document.getElementById('record').value='';
							setInnerText("CitePublication", "");
							setInnerText("CiteSource", "");
                                                        setInnerText("CiteRecord","");
							if(document.getElementById("http"))
								document.getElementById("http").focus();
							retainhttp = false;
							//isValidURL('http');
                                                        //document.getElementById('http').onblur = httponchangedonothing;
						}
						else
						{ 
							retainhttp = true;
							document.getElementById("http").focus();					
							//isValidURL('http');
                                                        //document.getElementById('http').onblur = httponchangedonothing;
						}
				});
			}else{
				document.getElementById('http').onchange = httponchangedonothing;
			}
}
function Endwithpunctuation(string){
	var patren=/[!?,;:]$/;
    if((patren.test(string))) {
       return true;
    }else{
		return false;
	}
}
function removeDotFromEnd(which){
	var lang = getInnerText(which).trim();
	lang = lang.replace(/[.;]$/,"");	
	setInnerText(which, " "+lang);
}
function httponchangedonothing(){
	isValidURL('http');
}
edatahttp = false;
function checkHttpalert(){
	if(document.getElementById('database')){
		if(document.getElementById('database').value!=''){
			if(!edatahttp){
				jAlertMod("A URL is not required when citing a well known database.","Alert","&nbsp;OK&nbsp;",function(r1){
					$("#http").val('');
					setInnerText("CiteHttp", "");
					document.getElementById('http').focus();
					edatahttp = true;
					isValidURL('http');
				});
			}	
		}else{
			edatahttp = false;
			document.getElementById('http').onchange = httponchangedonothing;
		}		
	}
}
function checksitename(){
	if(document.getElementById('source')){
		if(document.getElementById('source').value!=''){
			var name = getInnerText("CiteSource").trim();
			name = name.replace(/[.;]$/,":");
			setInnerText("CiteSource", " "+name);
		}
	}	

}

function changeformat(elem,whichForm) {
	var group = document.publication.chkpub;
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
	if($(elem).attr("id")=="published"){
		if(whichForm=="archive"){
			document.getElementById('CiteChapter').style.fontStyle = "italic";
		}
	}else{
		if(whichForm=="archive"){
			document.getElementById('CiteChapter').style.fontStyle = "normal";
		}
	}
}

function checkparl(which){
	var group = document.publication.chkparl;
	for (var i=0; i<group.length; i++) {
		if (group[i] != which) {
			group[i].checked = false;
		}
	}
	if($(which).val()=="Bill"){
		palname = getInnerText("CiteAuthor");
		palname = palname.replace(" Parliamentary Debates.","");
		setInnerText("CiteAuthor", palname);
	}else if($(which).val()=="Deb"){
		palname = getInnerText("CiteAuthor");
		palname = palname + " Parliamentary Debates.";
		setInnerText("CiteAuthor", palname);
	}else if($(which).val()=="hansard"){
		if(which.checked){
			palname = " Parliamentary debates (Official Hansard)";
			setInnerText("CiteTitle", palname);
		}else{
			ReloadTextDiv2('title','CiteTitle');
		}
	}
}

function checkedition(ele){
	var group = document.publication.chkedition;
	var edtext = '';
	for (var i=0; i<group.length; i++) {
		if (group[i].checked) {
			edtext = edtext + group[i].value+'. ';
		}
	}
	if(edtext!=''){
		edtext = " (" + edtext + ' ed).';
		showDiv('CiteEdition');
		setInnerText("CiteEdition", edtext);
		ReloadTextDiv2('volume','CiteVolume');
		ReloadTextDiv2('pageBook','CitePage');
	}else{
		ReloadTextDiv2('edition','CiteEdition');
		ReloadTextDiv2('volume','CiteVolume');
		ReloadTextDiv2('pageBook','CitePage');
		document.getElementById('edition').focus();
	}	
	
}
function clearGroup(elem,which){
	var group = document.publication.chkeditor;
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
	var editorVal = getInnerText("CiteEditor2").trim();
	var firsteditorVal = getInnerText("CiteEditor").trim(); 
	if(firsteditorVal!=''){
		if(which == 'translator' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Ed. and Trans.)");
			 }else{
				 setInnerText("CiteEd", " (Eds. and Trans.)");
			 }
		}else if(which == 'reviser' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Rev.)");
			 }else{
				 setInnerText("CiteEd", " (Revs.)");
			 }
		}else{
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Ed.)");
			 }else{
				 setInnerText("CiteEd", " (Eds.)");
			 }
		}
	}
}
function clearTranGroup(elem,which){
	var group = document.publication.chkeditor;
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
	var editorVal = getInnerText("CiteEditor2").trim();
	var firsteditorVal = getInnerText("CiteEditor").trim(); 
	if(firsteditorVal!=''){
		if(which == 'translator' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", ", Ed. and Trans.).");
			 }else{
				 setInnerText("CiteEd", ", Eds. and Trans.).");
			 }
		}else if(which == 'reviser' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Rev.)");
			 }else{
				 setInnerText("CiteEd", " (Revs.)");
			 }
		}else{
			 if(editorVal==''){
				 setInnerText("CiteEd", ", Trans.).");
			 }else{
				 setInnerText("CiteEd", ", Trans.).");
			 }
		}
	}
}
function cleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
      if (actual[i]){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}
function ReplaceDottoComma(divName,other){
	var SpanArr = new Array();
	var DivText ="";
	var commaflag = false;
        var formName=getCleanedFormName();
	$('#bookPanel span').filter(":visible").each(function(index)
     {
		 if($(this).html()!=''){
				SpanArr[index] = $(this).attr("id");
		 }
	});
	SpanArr = cleanArray(SpanArr);
	var interviewFlg = false;
	var legislationFlag = false;
        
	if (typeof other != "undefined"){
            if(formName!="law_reports")
                {
		 if(other == "interview" || other == "interviewer" || other=="creative" || other=="writer" || other=="Recipient")
			interviewFlg = true;
		 if(other == "legislation" || other == "gov" || other == "parliament" || other=="curator" || other=="patents" || divName=="citeFormat" || other=="wiki")	
			commaflag = true;
                }  
		 if(other == "legislation" && (divName=="CiteIssue" || divName=="CiteVolume")){
			commaflag = false;
		 }		 
    }
    
	var matchSE1 = /^CiteCommaE[0-9]+$/;
	var matchSE2 = /^CiteAndE[0-9]+$/;
	var matchSRA1 = /^CiteCommaRA[0-9]+$/;
	var matchSRA2 = /^CiteAndRA[0-9]+$/;
	var matchST1 = /^CiteCommaTRA[0-9]+$/;
	var matchST2 = /^CiteAndTRA[0-9]+$/;	
	var matchSP1 = /^CiteCommaP[0-9]+$/;		
	var matchSP2 = /^CiteAndP[0-9]+$/;		
	for(i=0;i<SpanArr.length;i++){
		if(SpanArr[i].search(matchSE1)==0 || SpanArr[i].search(matchSE2)==0 || SpanArr[i].search(matchSRA1)==0 
			|| SpanArr[i].search(matchSRA2)==0 || SpanArr[i].search(matchST1)==0 || SpanArr[i].search(matchST2)==0
			|| SpanArr[i].search(matchSP1)==0 || SpanArr[i].search(matchSP2)==0){
			SpanArr.splice(i,1);
		}
	}

	if(document.getElementById(divName)!=null)
	 {
	   var DivText = document.getElementById(divName).innerHTML;
	 }
	if(DivText!=""){
		var SpanIn = $.inArray(divName, SpanArr);//SpanArr.indexOf(divName);//
		Divchange = SpanArr[SpanIn-1];
	}else{
		Divchange = SpanArr[SpanArr.length-1];		
	}
	
	if(typeof Divchange!="undefined"){
		var divVal = document.getElementById(Divchange).innerHTML;
		if(DivText!="" && !divVal.endsWith(".") && Divchange=="CiteEd"){
			var Key = SpanArr.indexOf(Divchange);
			Divchange = SpanArr[Key-1];
		}
	}
	if(Divchange=='CiteHttp' && divName!='CiteRole'){
		var commaflag = true;
	}
	if(DivText!="" && (DivText.endsWith("]."))){
			var commaflag = true;
	}
        
        
        
        if(DivText.replace("&nbsp;","").match(/^\s*\(/)!=null && DivText.replace("&nbsp;","").match(/^\s*\(/)!='null' 
                && formName=="legislation")//parliament// && document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked)
            {
                var commaflag = true;
            }
            
            if((Divchange=="CiteVolume" || Divchange=="CiteIssue") && formName=="law_reports")
                {
                    var commaflag = true;
                }
            
	if(Divchange=="CiteCommaStart"  ||  Divchange=="CiteIOn" || Divchange=="CiteRevAuth"  || (Divchange=="CiteTra" && interviewFlg) 
			|| Divchange=="CiteProd" || Divchange=="VirCiteAuthor" || Divchange=="VirCiteRevAuthor" || Divchange=="VirCiteEditor" || Divchange=="VirCiteTrans"|| Divchange=="VirCiteProducer" || (Divchange=="CiteEd" && interviewFlg)){
		if(Divchange=="CiteCommaStart"){
			var commaflag = true;		
		}
		var Key = SpanArr.indexOf(Divchange);
		Divchange = SpanArr[Key-1];
	}
        var dottocommaFlg=false;
        var nextDivId='';
        if(document.getElementById('CiteIOn'))
            {
                nextDivId=getNextDiv('CiteIOn');
                console.log('nextDivId: '+nextDivId);
                if(nextDivId=="CiteEditor")
                    {
                        if(Divchange=="CiteEd" && divName=="CiteTitle")
                            {
                                console.log('##');
                                dottocommaFlg=true;
                            }
                    }
            }
        
	if(typeof Divchange!="undefined"){
		if(DivText!=""){
			if(document.getElementById(Divchange)!=null)
			{
				var divValue = document.getElementById(Divchange).innerHTML;
                                console.log('Divchange:: '+Divchange);
				if(((formName=="parliament" || formName=="law_reports" || formName=="legislation")
                                        && (Divchange=="CiteTitle" || (formName=="legislation" && Divchange=="CiteChapter") || 
                                        (formName=="parliament" && Divchange=="CiteEdition" && document.getElementById('chkregulation') && document.getElementById('chkregulation').checked==true && document.getElementById('legi_executiveorder') && document.getElementById('legi_executiveorder').checked==true)                                
                                        || (Divchange=="CiteIssue" && document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked==true) ||
                                        (Divchange=="CiteRecord" 
                                        && ((document.getElementById('chkbill') && document.getElementById('chkbill').checked==true) 
                                        || (document.getElementById('chkresolution') && document.getElementById('chkresolution').checked==true))
                                        )
                            )) || (formName=="conference" && (Divchange=="CitePublisher" || Divchange=="CiteCity")))//parliament
                                    {
                                        divValue = divValue.replace(/\.$/,",");	
					document.getElementById(Divchange).innerHTML = divValue;
                                    }                                    
                                    else if(dottocommaFlg==true)
                                        {
                                            var strInOn=$("#CiteIOn").html().trim().replace("&nbsp;","");
                                            console.log('strInOn: '+strInOn);
                                            if(strInOn!='' && strInOn.toLowerCase()=="in")
                                                {
                                                    
                                                    divValue = divValue.replace(/\,*\.*$/,",");
                                                }
                                                else
                                                    {
                                                        //divValue = divValue.replace(/\,*\.*$/,",");                
                                                    }
                                            document.getElementById(Divchange).innerHTML = divValue;
                                        }
				else if(commaflag){
					if(Divchange=="CiteSeries" || Divchange=="CiteEd" || Divchange=="CiteAuthor"){
						document.getElementById(Divchange).innerHTML = divValue;
					}else{
						divValue = divValue.replace(/[.;]$/,"");
						divValue = divValue.replace(/[,;]$/,"");	
						document.getElementById(Divchange).innerHTML = divValue;
					}
				}
			}
                        
                        var pageSec=getPageSectionGlobal();
                        if(formName=="conference" || pageSec=="books" || pageSec=="creative" || pageSec=="reference")
                            {
                                var nextFilledDiv=getNextFilledDiv(divName);
                                if(nextFilledDiv=="CiteEd" || nextFilledDiv=="CiteAuth")
                                    {
                                        nextFilledDiv=getNextFilledDiv(nextFilledDiv);

                                    }

                                    if(nextFilledDiv!='')
                                        {
                                            ReplaceDottoComma(nextFilledDiv,other);
                                        }
                            }
		}
                else{
			if(document.getElementById(Divchange)!=null)
			{
                            if(Divchange=="CiteHttp")
                                {
                                    
                                }
                                else
                                    {
                                        var divValue = document.getElementById(Divchange).innerHTML;
                                        if(((formName=="parliament" || formName=="law_reports" || formName=="legislation")
                                                && (Divchange=="CiteTitle" || (formName=="legislation" && Divchange=="CiteChapter") || 
                                                (formName=="parliament" && Divchange=="CiteEdition" && document.getElementById('chkregulation') && document.getElementById('chkregulation').checked==true && document.getElementById('legi_executiveorder') && document.getElementById('legi_executiveorder').checked==true)                                
                                                || (Divchange=="CiteIssue" && document.getElementById('chkpubliclaw') && document.getElementById('chkpubliclaw').checked==true) ||
                                                (Divchange=="CiteRecord" 
                                                && ((document.getElementById('chkbill') && document.getElementById('chkbill').checked==true) 
                                                || (document.getElementById('chkresolution') && document.getElementById('chkresolution').checked==true))
                                                )
                                    )) || (formName=="conference" && (Divchange=="CitePublisher" || Divchange=="CiteCity")))//parliament
                                            {
                                                divValue = divValue.replace(/\,$/,".");	
                                                document.getElementById(Divchange).innerHTML = divValue;
                                            }
                                            else if(dottocommaFlg==true)
                                                {
                                                    divValue = divValue.replace(/\.*\,*$/,".");	
                                                document.getElementById(Divchange).innerHTML = divValue;
                                                }
                                        else if(commaflag){
					if(Divchange=="CiteSeries" || Divchange=="CiteEd"){
						document.getElementById(Divchange).innerHTML = divValue;
					}else{
						if(!divValue.endsWith(".") && divValue.trim()!='___')
							divValue = divValue+".";	
						document.getElementById(Divchange).innerHTML = divValue;
					}
				}
                                    }
			}
		}
	}
}
function showHideAdvanceOnlinePub(elem)
{
    var formName=getFormName();
    var CiteDiv='CiteDescriptor';
    if(formName=="citeweb_journal")
        {
            CiteDiv='CiteRole';
        }
    showDiv(CiteDiv);
	if(elem.checked){
		setInnerText(CiteDiv, " Advance online publication.");
                ReloadTextDiv2('title','CiteTitle','journal','capitalizeTitle');
		ReplaceDottoComma(CiteDiv);
	}else{
		setInnerText(CiteDiv, "");
                ReloadTextDiv2('title','CiteTitle','journal','capitalizeTitle');
                ReplaceDottoComma(CiteDiv);
	}
}
function checkchkabstract(elem){
	var volume = getInnerText("citeFormat");
	showDiv('citeFormat');
	if(elem.checked){
		setInnerText("citeFormat", " [Abstract].");
		ReplaceDottoComma("citeFormat");
	}else{
		setInnerText("citeFormat", "");
		ReloadTextDiv2('chapter','CiteChapter','journal');
	}
}

function checkchkspecialissue(elem){
	var volume = getInnerText("CiteRecord");
	showDiv('CiteRecord');
	if(elem.checked){
		setInnerText("CiteRecord", " [Special issue].");
		ReplaceDottoComma("CiteRecord");
	}else{
		setInnerText("CiteRecord", "");
		//ReloadTextDiv2('chapter','CiteChapter','journal');
	}
}

function checkchkTransSpecial(elem){
	
	if(elem.checked){
            showDiv('CiteSource');
		$("#translationrec").show();
                ReplaceDottoComma("CiteSource");
	}else{
            hideDiv('CiteSource');
            setInnerText("CiteSource", "");
            $("#source").val('');
		$("#translationrec").hide();
		//ReloadTextDiv2('chapter','CiteChapter','journal');
	}
        
        //showHideOrigYear(elem);
        
}

function clearCreativeGroup(elem,which){
	var group = document.publication.chkproducer;
        var isChecked=elem.checked;//LC 30052015
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
        elem.checked=isChecked; //LC 30052015
	var editorVal = getInnerText("CiteAuthor2").trim();
	var firsteditorVal = getInnerText("CiteAuthor").trim(); 
        var txt;
        var dot='';
	if(firsteditorVal!=''){
		if(which == 'director' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Director).");
			 }else{
				 setInnerText("CiteEd", " (Directors).");
			 }
		}else if(which == 'choreographer' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Choreographer).");
			 }else{
				 setInnerText("CiteEd", " (Choreographers).");
			 }
		}else if(which == 'conductor' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Conductor).");
			 }else{
				 setInnerText("CiteEd", " (Conductors).");
			 }
		}else if(which == 'host' && elem.checked){
                    if(getFormName()=="creativeProgram")
                        {
                            dot='.';
                        }
			 if(editorVal==''){
                             txt=" (Host)";
				 setInnerText("CiteEd", txt+dot);
			 }else{
                             txt=" (Hosts)";
				 setInnerText("CiteEd", txt+dot);
			 }
		}else if(which == 'producer' && elem.checked){
                    if(getFormName()=="creativeProgram")
                        {
                            dot='.';
                        }
			 if(editorVal==''){
                             txt=" (Producer)";
				 setInnerText("CiteEd", txt+dot);
			 }else{
                             txt=" (Producers)";
				 setInnerText("CiteEd", txt+dot);
			 }
		}else if(which == 'exec_producer' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " (Executive producer)");
			 }else{
				 setInnerText("CiteEd", " (Executive producers)");
			 }
		}
		else if(which == 'other' && elem.checked){
			 if(editorVal==''){
				 setInnerText("CiteEd", " and others.");
			 }else{
				 setInnerText("CiteEd", " and others.");
			 }
		}else{
			 if(editorVal==''){
				 setInnerText("CiteEd", " ");
			 }else{
				 setInnerText("CiteEd", " ");
			 }
		}
	}
}


function clearCreativeProGroup(elem,textName){
	
        var elem1=false;
        var elem2=false;
        var authorCnt=0;
        var i=2;
        var formName=getCleanedFormName();
        /*if(getFormatType()=="EditorCiteEd" && typeof elem != "undefined" && elem!='')
        {
            var group = document.publication.chkproducer;
            var isChecked=elem.checked;
            for (var i=0; i<group.length; i++) {
                    if (group[i] != elem) {
                            group[i].checked = false;
                    }
            }
            elem.checked=isChecked;
        }*/
        if(document.getElementById('chkproducer'))
        elem1=document.getElementById('chkproducer').checked;
    
        if(document.getElementById('chkdirector'))
        elem2=document.getElementById('chkdirector').checked;
    
        if(document.getElementById('chkexecprod'))
        elem2=document.getElementById('chkexecprod').checked;
    
        if(getFormatType()=="EditorCiteEd" || formName=="tv_series")
            {
                
                if(getInnerText("CiteEditor").trim()!='')
                    {
                        authorCnt=1;
                    }

                    for(i=2;i<10;++i)
                    {
                        if(getInnerText("CiteEditor"+i).trim()!='')
                        {
                            authorCnt++;
                        }
                    }
            }
            else
                {
                    if(getInnerText("CiteAuthor").trim()!='')
                    {
                        authorCnt=1;
                    }

                    for(i=2;i<10;++i)
                    {
                        if(getInnerText("CiteAuthor"+i).trim()!='')
                        {
                            authorCnt++;
                        }
                    }
                }
    
	 
        var txt;
        var dot='';
        var dir;
        var prod;
        setInnerText("CiteEd","");
	if(authorCnt>0){
            if(authorCnt==1)
            {
                dir='Director';
                prod='Producer'
                if(getFormName()=="digitalTvSeries")
                    {
                        dir='Executive Producer'
                    }
            }
            else  
            {
                dir='Directors';
                prod='Producers'
                if(getFormName()=="digitalTvSeries")
                    {
                        dir='Executive Producers'
                    }
            }
            if(elem1==true && elem2==true)
            {
                setInnerText("CiteEd"," ("+prod+" & "+dir+").");
            }
            else if(elem1==true)
            {
                setInnerText("CiteEd"," ("+prod+").");
            }
            else if(elem2==true)
            {
                setInnerText("CiteEd"," ("+dir+").");
            }
            else
                {
                    setInnerText("CiteEd","");
                }
	}
        
        var matchStr2 = /^editor[0-9]+$/;
                   var firstFieldId=$(".cssform input:text").first().attr('id');
                       if(textName=='editor' || !textName.search(matchStr2))
                                         {
                                            if(firstFieldId=='author')
                                                {

                                                    if(isAllAuthorsBlank()==true)
                                                    {     
                                                        showDiv('CiteAuthor');
                                                        var fontStyle=$('#CiteEditor').css("font-style");
                                                        $("#CiteAuthor").css("font-style",fontStyle);
                                                        reformatEditor();
                                                        reprocessChapterTitle();

                                                    }
                                                }
                                         }
}


function clearDigitalGroup(){
	elem1 = document.getElementById('chkwriter');
	elem2 = document.getElementById('chkdirector');
	
	var editorVal = getInnerText("CiteAuthor2").trim();
	var firsteditorVal = getInnerText("CiteAuthor").trim(); 
	if(firsteditorVal!=''){
		if(elem1.checked){
			 if(editorVal==''){
				 setInnerText("CiteTra", " (Writer)");
			 }else{
				 setInnerText("CiteTra", " (Writers)");
			 }
		}else if(elem2.checked){
			 if(editorVal==''){
				 setInnerText("CiteTra", " (Director)");
			 }else{
				 setInnerText("CiteTra", " (Directors)");
			 }
		}
		else{
			 if(editorVal==''){
				 setInnerText("CiteTra", " ");
			 }else{
				 setInnerText("CiteTra", " ");
			 }
		}
		
		if(elem1.checked && elem2.checked){
			 if(editorVal==''){
				setInnerText("CiteTra", " (Writer & Director)");				 
			 }else{
				setInnerText("CiteTra", " (Writers & Directors)");
			 }
		}
	}
}
function clearDigitalProGroup(e1,e2){
	elem1 = document.getElementById(e1);
	elem2 = document.getElementById(e2);
	
	var editorVal = getInnerText("CiteAuthor2").trim();
	var firsteditorVal = getInnerText("CiteAuthor").trim(); 
        var firstDirValue=getInnerText("CiteEditor").trim(); 
        lc_substr='';
        if(firstDirValue!='')
            {
                lc_substr='';
            }
	if(firsteditorVal!=''){
		if(elem1.checked){
			 if(editorVal==''){
				 setInnerText("CiteTra", " (Producer)"+lc_substr);
			 }else{
				 setInnerText("CiteTra", " (Producers)"+lc_substr);
			 }
		}else if(elem2.checked){
			 if(editorVal==''){
				 setInnerText("CiteTra", " (Director)");
			 }else{
				 setInnerText("CiteTra", " (Directors)");
			 }
		}
		else{
			 if(editorVal==''){
				 setInnerText("CiteTra", " ");
			 }else{
				 setInnerText("CiteTra", " ");
			 }
                         if(getFormName()=="DigitalDVD")
                         {
                             setInnerText("CiteTra", "");
                         }
		}
		
		if(elem1.checked && elem2.checked){
			 if(editorVal==''){
				setInnerText("CiteTra", " (Producer & Director)"+lc_substr);				 
			 }else{
				setInnerText("CiteTra", " (Producers & Directors)"+lc_substr);
			 }
		}
	}
        else
        {
            if(getFormName()=="DigitalDVD")
                         {
                             setInnerText("CiteTra", "");
                         }
        }
        lc_clearGroup();
}

function ReplacedotTocolon(wherelem,whichelem){
	if($("#"+wherelem).val()!=''){
		subval = getInnerText(whichelem);
		subval = subval.replace(/[.;]$/,":");
		setInnerText(whichelem,subval);
	}else{
		subval = getInnerText(whichelem);
		subval = subval.replace(/[:;]$/,".");
		setInnerText(whichelem,subval);
	}
}



function clearGlobalGroup()
{
    var formName=getCleanedFormName();
    if(document.getElementById('formName') && document.getElementById('formName').value=="CreativePerformance")
    {
        if(document.getElementById('chkproducer').checked==true)
        {    
            clearCreativeGroup(document.getElementById('chkproducer'),'director');
        }
        else if(document.getElementById('chkchoreographer').checked==true)
        {      
            clearCreativeGroup(document.getElementById('chkchoreographer'),'choreographer');
        }
        else if(document.getElementById('chkconductor').checked==true)
        {      
            clearCreativeGroup(document.getElementById('chkconductor'),'conductor');
        }
    }
    else if(document.getElementById('formName') && document.getElementById('formName').value=="BooksEdited")
    {
        clearGroupAll(document.getElementById('chkauthor'),'editor','CiteAuth');
    }
    else if(getFormName()=="creativeProgram")
    {
        clearCreativeProGroup();
    }
    else if(formName=="tv_series")
        {
            clearDigitalGroup();
        }
}


function globalFormat()
{
    if(document.getElementById('CitePlace') && document.getElementById('CiteCity'))
    {
        var ven='';
        var city='';
        if(document.getElementById('CitePlace')!=null)
        {
            ven = document.getElementById('CitePlace').innerHTML.trim();
        }
        if(document.getElementById('CiteCity')!=null)
        {
            city=document.getElementById('CiteCity').innerHTML.trim();
        }
        ven = ven.replace(".","");
	ven = ven.replace(",","");
	ven=ven.trim();
        
        city = city.replace(".","");
	city = city.replace(",","");
	city=city.trim();
        if(ven!='')
        {
            if(city!='')
            {
                ven+=',';
            }
            else
            {
                ven+='.';
            }
        }
        if(document.getElementById('CitePlace')!=null)
        document.getElementById('CitePlace').innerHTML = ven;
    }
}



function clearGroupAll(elem,which,div){
    
	var editorVal = '';
        if(document.getElementById('author2'))
            {
                editorVal =$("#author2").val().trim();
            }
	var firsteditorVal='';
        if(document.getElementById('author'))
            {
               firsteditorVal = $("#author").val().trim()
            }
	if(firsteditorVal!=''){
		if(which == 'editor' && elem.checked){
			 if(editorVal==''){
				 setInnerText(div, " (Ed.).");
			 }else{
				 setInnerText(div, " (Eds.).");
			 }
		}else{
			 if(editorVal==''){
				 setInnerText(div, " ");
			 }else{
				 setInnerText(div, " ");
			 }
		}
	}
        if(elem.checked==false)
            {
                setInnerText(div, " ");
            }
}


function lc_clearGroup()
{
    if(document.getElementById('lc_editor'))
        {
            lc_flag=true;
            if(($('#author').val())!='')
                {
                    lc_flag=false;
                }
                
                for(i=2;i<9;++i)
                        {
                            if(document.getElementById('author'+i))
                                {
                                    if(($('#author'+i).val())!='')
                                        {
                                            lc_flag=false;
                                            break;
                                        }
                                }
                        }
                        
                        if(lc_flag==true)
                            {
                                setInnerText("CiteTra", "");
                            }
        }
}


function lc_adjustAnds()
{
    if(document.getElementById('lc_editor'))
        {
			document.perNo.editor = 1;
            citeEditorText=getInnerText('CiteEditor');
            if(citeEditorText=="")
                {
                    for(i=9;i>=2;--i)
                        {
                            if(document.getElementById('CiteAndA'+i))
                                {
                                    setInnerText('CiteAndA'+i," & ");
                                    break;
                                }
                        }

                        setInnerText('middleSpan',"");

                }
                else
                    {
                        for(i=9;i>=2;--i)
                        {
                            if(document.getElementById('CiteAndA'+i))
                                {
                                    setInnerText('CiteAndA'+i,"");
                                    break;
                                }
                        }
                        lc_flag=true;
                        for(i=2;i<9;++i)
                        {
                            if(document.getElementById('CiteEditor'+i))
                                {
                                    lc_flag=false;
                                    break;
                                }
                        }
                        if(lc_flag==true)
                            {
                                if(document.getElementById('author') && document.getElementById('author').value !='')
									setInnerText('middleSpan'," & ");
                            }
                        else
                            {
                                setInnerText('middleSpan',"");
                            }
                    }
        }
}

function showHideEditorBlock(elem)
{
    var formName=getCleanedFormName();
    if(formName=="edited")
        {
            if(document.getElementById('chkNwsEdited'))
                {
                    if(elem.checked)
                        {
                            $("#editorChkSpan").hide();
                            document.getElementById('chkNwsEdited').checked=false;
                        }
                        else
                            {
                                showInline('editorChkSpan');
                                document.getElementById('chkNwsEdited').checked=true;
                            }
                }
                
        }
    if(elem.checked==true)
        {
            document.getElementById('editorp').style.display="none";
            document.getElementById('editor').value="";
            document.getElementById('editchkp').style.display="none";
            document.getElementById('chktranslator').checked=false;
            document.getElementById('chkreviser').checked=false;
            document.getElementById('editorSec').style.display="none";
            document.getElementById('editorSec').innerHTML="";
            document.getElementById('addEditdiv').style.display="none";
            document.getElementById('VirCiteEditor').style.display="none";
            document.getElementById('VirCiteEditor').innerHTML="";
            document.getElementById('CiteEditor').style.display="none";
            document.getElementById('CiteEditor').innerHTML="";
            document.getElementById('CiteEd').style.display="none";
            document.getElementById('CiteEd').innerHTML="";
            document.getElementById('CiteAuth').style.display="inline";
            numOfEditors=2;
        }
        else
            {
                document.getElementById('editorp').style.display="block"; 
                document.getElementById('editchkp').style.display="block";
                document.getElementById('editorSec').style.display="block";
                document.getElementById('addEditdiv').style.display="block";               
                document.getElementById('VirCiteEditor').style.display="inline";
                document.getElementById('CiteEditor').style.display="inline";
                document.getElementById('CiteEd').style.display="inline";
                document.getElementById('CiteAuth').style.display="none";
            }
}



function getFormatType()
{
    var formatType='';
    if(document.getElementById('formatType'))
        {
            formatType=document.getElementById('formatType').value;
        }
        return formatType;
}

function getInTextFormat()
{
    var inTextFormat='';
    if(document.getElementById('inText'))
        {
            inTextFormat=document.getElementById('inText').value;
        }
        return inTextFormat;
}

function getTabName()
{
    var tabName='';
    if(document.getElementById('tabName'))
        {
            tabName=document.getElementById('tabName').value;
        }
        return tabName;
}

function formatEditor()
{
    var tempi=0;
    var i=2;
    var flag;
    var j=2;
    var cnt=0;
    
    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
    {
        var a=doEditorFormatting(document.getElementById('CiteEditor').innerHTML.trim());
        document.getElementById('CiteEditor').innerHTML=a;
        cnt++;
    }
    for(i=2;i<10;++i)
        {
            if(document.getElementById('CiteEditor'+i) && document.getElementById('CiteEditor'+i).innerHTML.trim()!='')
                {
                    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
                        {
                            document.getElementById('CiteEditor').innerHTML=doEditorFormatting(document.getElementById('CiteEditor').innerHTML.trim());
                            //console.log('CiteEditor='+document.getElementById('CiteEditor').innerHTML);
                            tempi=i;
                            cnt++;
                        }
                        for(j=2;j<=i;++j)
                            {
                                if(document.getElementById('CiteEditor'+j) && document.getElementById('CiteEditor'+j).innerHTML.trim()!='')
                                {
                                    document.getElementById('CiteEditor'+j).innerHTML=doEditorFormatting(document.getElementById('CiteEditor'+j).innerHTML.trim());
                                    //console.log('CiteEditor'+j+'='+document.getElementById('CiteEditor'+j).innerHTML);
                                }
                            }
                }
        }      
        
        
        if(getInTextFormat()=="DigitalInterview")
        {
            if(tempi<2)
                {
                    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
                        {
                            document.getElementById('CiteEditor').innerHTML=document.getElementById('CiteEditor').innerHTML+'.';
                        }
                }
            else
                {
                    if(document.getElementById('CiteEditor'+tempi) && document.getElementById('CiteEditor'+tempi).innerHTML.trim()!='')
                    {
                        document.getElementById('CiteEditor'+tempi).innerHTML=document.getElementById('CiteEditor'+tempi).innerHTML+'.';
                    }
                }
                if(getLastAuthorNo()==1)
                    {
                        setInnerText("CiteEd","");
                    }
        }
        
        placeCommanAnd();
        
        if(cnt>2)
        {
            document.getElementById('CiteCommaE'+tempi).innerHTML=",";
        }
}

function doEditorFormatting(temp)
{
    //console.log('temp='+temp);
    //temp=temp.replace(",","");
    //temp=temp.replace(".","");
    temp=temp.trim();
    //console.log('temp='+temp);
    var arr=temp.split(" ");
    var i=0;
    var temp1='';
    var temp2='';
    //console.log('arr='+arr);
    if(arr.length==2)
        {
            arr[0]=arr[0].replace(".","").trim();
            arr[1]=arr[1].replace(".","").trim();
            //console.log('arr[0]='+arr[0]);
            //if(arr[0].length==1)
              //  {
              if(arr[1].trim()!='')
                  {
                    arr[1]=arr[1].replace(".","");
                    //console.log(arr[0]);
                    if(arr[0].replace("&nbsp;","").replace("(","").trim().length>1)
                    {
                        return arr[0]+' '+arr[1];
                    }
                    return arr[0]+'. '+arr[1];
                  }
               // }
        }
        /*else if(arr.length>0)
            {
                for(i=0;i<arr.length;++i)
                    {
                        temp1=arr[i];
                        if(i>0)
                            {
                                temp2+=' ';
                            }
                        temp2+=temp1.replace(".","");
                    }
                    return temp2;
            }*/
            return temp;
}

function formatRevAuthor()
{
    var tempi=0;
    var i=2;
    var flag;
    var j=2;
    var cnt=0;
    
    if(document.getElementById('CiteRevAuthor') && document.getElementById('CiteRevAuthor').innerHTML.trim()!='')
    {
        document.getElementById('CiteRevAuthor').innerHTML=doEditorFormatting(document.getElementById('CiteRevAuthor').innerHTML.replace("&nbsp;","").trim());
        cnt++;
    }
    for(i=2;i<10;++i)
        {
            if(document.getElementById('CiteRevAuthor'+i) && document.getElementById('CiteRevAuthor'+i).innerHTML.trim()!='')
                {
                    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
                        {
                            document.getElementById('CiteRevAuthor').innerHTML=doEditorFormatting(document.getElementById('CiteRevAuthor').innerHTML.replace("&nbsp;","").trim());
                            //console.log('CiteEditor='+document.getElementById('CiteEditor').innerHTML);
                            tempi=i;
                            cnt++;
                        }
                        for(j=2;j<=i;++j)
                            {
                                if(document.getElementById('CiteRevAuthor'+j) && document.getElementById('CiteRevAuthor'+j).innerHTML.trim()!='')
                                {
                                    document.getElementById('CiteRevAuthor'+j).innerHTML=doEditorFormatting(document.getElementById('CiteRevAuthor'+j).innerHTML.replace("&nbsp;","").trim());
                                    //console.log('CiteEditor'+j+'='+document.getElementById('CiteEditor'+j).innerHTML);
                                }
                            }
                }
        }      
        
}



function placeCommanAnd()
{
    var temp1='';
    var temp2='';
    var temp3='';
    var flg=false;
    var i=2;
    var j=2;
    for(i=2;i<10;++i)
        {
            if(document.getElementById('CiteAndE'+i))
                {
                    document.getElementById('CiteCommaE'+i).innerHTML='';
                    if(i>2)
                    document.getElementById('CiteAndE'+i).innerHTML='';
                }
        }
    for(i=2;i<10;++i)
        {
            if(document.getElementById('CiteEditor'+i) && document.getElementById('CiteEditor'+i).innerHTML.trim()!='')
                {
                    //console.log(document.getElementById('CiteEditor'+i).innerHTML);
                    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
                        {
                            flg=true;
                            //console.log('flg='+flg);
                        }
                        for(j=2;j<i;++j)
                            {
                            if(document.getElementById('CiteEditor'+j) && document.getElementById('CiteEditor'+j).innerHTML.trim()!='')
                                {
                                    document.getElementById('CiteCommaE'+j).innerHTML='';
                                    document.getElementById('CiteAndE'+j).innerHTML='';
                                    //console.log('CiteCommaE'+j+'='+document.getElementById('CiteCommaE'+j).innerHTML);
                                    if(flg==true)
                                        {
                                            document.getElementById('CiteCommaE'+j).innerHTML=', ';
                                            //console.log('CiteCommaE'+j+'='+document.getElementById('CiteCommaE'+j).innerHTML);
                                        }
                                        flg=true;
                                }
                            }
                                    //document.getElementById('CiteCommaE'+i).innerHTML='';
                                   // document.getElementById('CiteAndE'+i).innerHTML='';
                                    if(flg==true)
                                        {
                                            document.getElementById('CiteAndE'+i).innerHTML=' & ';
                                        }
                }
        }
}


//add remove authors' dot if citeEd or citeTra is null and authors first name is not single char
function addRemoveAuthorDot(divId)
{
    var temp1;
    var author;
    var authi;
    var i=2;
    if(document.getElementById(divId))
        {
            temp1=getInnerText(divId).replace("&nbsp;","").trim();
            if(temp1!="")
                {
                    authi=getLastAuthorNo();
                    console.log('authi='+authi);
                    if(authi!=1)
                        {
                            author=getInnerText('CiteAuthor'+authi);
                            console.log('author='+author);
                            if(author!='')
                                {
                                    var arr=author.split(" ");
                                    var len=arr.length;
                                    console.log('len='+len);
                                    if(len>0)
                                        {
                                            if(arr[len-1].trim()!='')
                                                {
                                                    var temp;
                                                    temp=trimLastChar(arr[len-1],'.');
                                                    console.log('temp='+temp);
                                                    if(temp.length>1)
                                                        {
                                                            setInnerText('CiteAuthor'+authi,trimLastChar(author,'.'));
                                                            if(document.getElementById('CiteEnd'+authi))
                                                                {
                                                                    document.getElementById('CiteEnd'+authi).innerHTML="";
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                }
                else
                    {
                        authi=getLastAuthorNo();
                        if(authi!=1)
                            {
                                author=getInnerText('CiteAuthor'+authi);
                                if(author!='')
                                    {
                                        var arr=author.split(" ");
                                        var len=arr.length;
                                        if(len>0)
                                            {
                                                if(arr[len-1].trim()!='')
                                                    {
                                                        var temp;
                                                        temp=trimLastChar(arr[len-1],'.');
                                                        if(temp.length>1)
                                                            {
                                                                setInnerText('CiteAuthor'+authi,trimLastChar(author,'.')+'.');
                                                                if(document.getElementById('CiteEnd'+authi))
                                                                {
                                                                    document.getElementById('CiteEnd'+authi).innerHTML="";
                                                                }
                                                            }
                                                    }
                                            }
                                    }
                            }
                    }
        }
}



function trimLastChar(str,charToRemove)
{
    var arr=str.split(charToRemove);
    var i;
    var str1='';
    if(arr.length>0)
        {
          for(i=0;i<arr.length;++i)
          {
              if(arr[i].replace("&nbsp;","").trim()!='')
                {
                    if(i>0)
                        {
                            str1+=charToRemove;
                        }
                    str1+=arr[i];
                }
          }
          return str1;
        }
        return str;
}


function getLastAuthorNo()
{
    var i=2;
    var authi=1;
    var author;
    if(document.getElementById('CiteAuthor') && document.getElementById('CiteAuthor').innerHTML.trim()!='')
                        {
                            author=document.getElementById('CiteAuthor').innerHTML.trim();
                            authi='';
                        }
                        for(i=2;i<10;++i)
                            {
                                if(document.getElementById('CiteAuthor'+i) && document.getElementById('CiteAuthor'+i).innerHTML.trim()!='')
                                {
                                    if(authi=='' && i==2)
                                    {
                                        if(document.getElementById('CiteCommaA2'))
                                        {
                                            document.getElementById('CiteCommaA2').innerHTML=", ";
                                        }
                                    }
                                    author=document.getElementById('CiteAuthor'+i).innerHTML.trim();
                                    authi=i;
                                }
                            }
                            return authi;
}



function getLastEditorNo()
{
    var i=2;
    var edii=1;
    var editor;
    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
                        {
                            editor=document.getElementById('CiteEditor').innerHTML.trim();
                            edii='';
                        }
                        for(i=2;i<10;++i)
                            {
                                if(document.getElementById('CiteEditor'+i) && document.getElementById('CiteEditor'+i).innerHTML.trim()!='')
                                {
                                    editor=document.getElementById('CiteEditor'+i).innerHTML.trim();
                                    edii=i;
                                }
                            }
                            return edii;
}



function getLastRevAuthorNo()
{
    var i=2;
    var revAuthi=1;
    var revAuthor;
    if(document.getElementById('CiteRevAuthor') && document.getElementById('CiteRevAuthor').innerHTML.trim()!='')
                        {
                            revAuthor=document.getElementById('CiteRevAuthor').innerHTML.trim();
                            revAuthi='';
                        }
                        for(i=2;i<10;++i)
                            {
                                if(document.getElementById('CiteRevAuthor'+i) && document.getElementById('CiteRevAuthor'+i).innerHTML.trim()!='')
                                {
                                    revAuthor=document.getElementById('CiteRevAuthor'+i).innerHTML.trim();
                                    revAuthi=i;
                                }
                            }
                            return revAuthi;
}

function getFirstEditorNo()
{
    var i=2;
    var edii=1;
    var editor;
    if(document.getElementById('CiteEditor') && document.getElementById('CiteEditor').innerHTML.trim()!='')
                        {
                            editor=document.getElementById('CiteEditor').innerHTML.trim();
                            edii='';
                            return edii;
                        }
                        for(i=2;i<10;++i)
                            {
                                if(document.getElementById('CiteEditor'+i) && document.getElementById('CiteEditor'+i).innerHTML.trim()!='')
                                {
                                    editor=document.getElementById('CiteEditor'+i).innerHTML.trim();
                                    edii=i;
                                    return edii;
                                }
                            }
                            return edii;
}



function getFirstNo(id)
{
    var i=2;
    var edii=1;
    var editor;
    if(document.getElementById(id) && document.getElementById(id).innerHTML.trim()!='')
                        {
                            editor=document.getElementById(id).innerHTML.trim();
                            edii='';
                            return edii;
                        }
                        for(i=2;i<10;++i)
                            {
                                if(document.getElementById(id+i) && document.getElementById(id+i).innerHTML.trim()!='')
                                {
                                    editor=document.getElementById(id+i).innerHTML.trim();
                                    edii=i;
                                    return edii;
                                }
                            }
                            return edii;
}



function makeItalic(id,elem)
{
    if(document.getElementById(id))
    {
        if(elem.checked==true)
        {
            document.getElementById(id).style.fontStyle="italic";
        }
        else
        {
            document.getElementById(id).style.fontStyle="normal";
        }
    }
}

function makeNormalItalic(id,elem)
{
    if(document.getElementById(id))
    {
        if(elem.checked==true)
        {
            document.getElementById(id).style.fontStyle="normal";            
        }
        else
        {
            document.getElementById(id).style.fontStyle="italic";
        }
    }
}

function changePpCc(textName,divName,other,elem)
{
    var temp;
    
    var group = document.publication.colmn_page;
                for (var i=0; i<group.length; i++) {
                    console.log('aa1');
                        if (typeof elem!="undefined" && group[i] != elem) {
                            console.log('aa2');
                                group[i].checked = false;
                        }
                }
                
    if(document.getElementById('CitePage') && document.getElementById('CitePage').innerHTML.trim()!="")
    {
        
        
        if(document.getElementById('clmchk'))
        {
            
            
            
            temp=document.getElementById('CitePage').innerHTML;
            temp=temp.replace("cc.","");
            temp=temp.replace("c.","").trim();
            temp=temp.replace("pp.","");
            temp=" "+temp.replace("p.","").trim();
            if(document.getElementById('clmchk').checked==true)
            {
                var NewText=$("#pageBook").val().trim();
                if(NewText.search("-")!=-1){
                              temp =  " cc."+temp; 
                            }else{
                                temp =  " c."+temp;
                                
                            }
                document.getElementById('CitePage').innerHTML=temp;
            }
            else if(document.getElementById('pgchk').checked==true)
            {
                var NewText=$("#pageBook").val().trim();
                if(NewText.search("-")!=-1){
                              temp =  " pp."+temp; 
                            }else{
                                temp =  " p."+temp;
                                
                            }
                document.getElementById('CitePage').innerHTML=temp;
            }
            else
            {
                
                document.getElementById('CitePage').innerHTML=temp;
            }
        }
    }
    
    setInText(textName,divName,other);
}

function formatInternetEmail()
{
    var format;
    var date;
    var auth;
    format=getInnerText("citeFormat");
    date=getInnerText("CiteDate");
    auth=getInnerText("CiteAuthor").trim();
    if(auth!='')
    {
        var arr;
        arr=auth.split(" ");
        if(arr.length==1)
        {
            auth=auth.replace(".","");
            setInnerText("CiteAuthor",auth);
        }
    }
    if(format.replace("&nbsp;","").trim()!='')
        {
            format=trimLastChar(format,".");
            if(date.replace("&nbsp;","").replace(".","").trim()!='')
                {
                    setInnerText("citeFormat",format);
                }
                else
                    {
                        setInnerText("citeFormat",format+'.')
                    }
        }
}

function makeKeywordsCapital(inStr)
{

    var Arrstr = new Array('pdf','dvd','cd');
    var matchTag2 = /\b(&)\b/gi;
	str=inStr.replace(matchTag2, "&");
	for(i=0;i<Arrstr.length;i++){
		matchtag = new RegExp('\\b('+Arrstr[i]+')\\b','gi');
		str = str.replace(matchtag, Arrstr[i].toUpperCase());
	}
    return str;
}

function formatSoundRecording()
{
    var i;
    if($("#bookPanel #CiteEd").length)
        {
            setInnerText("CiteEd","");
        }
        
        if(document.getElementById('sound_album'))
            {
                if(document.getElementById('sound_album').checked)
                {
                    showDiv("CiteDescriptor");
                    $("#frmt").hide();
                    $("#descriptor").val('');
                    if(!isAllAuthorsBlank() && !isAllEditorsBlank())
                        {
                            $("#CiteDescriptor").html('');
                        }
                        else
                            {
                                if($("#title").val().trim()!='')
                                    {
                                        $("#CiteDescriptor").html(' [Album]');
                                    }
                                    else
                                        {
                                            $("#CiteDescriptor").html('');
                                        }
                            }
                    
                }
                else
                    {
                        $("#frmt").show();
                        if($("#descriptor").val().trim()=='')
                            {
                                $("#CiteDescriptor").html('');
                            }
                    }
            }
        
        i=getLastEditorNo();
        if(i==1 || getLastAuthorNo()==1)
            {
                setInnerText("CiteAuth","");
                setInnerText("CiteProd","");
            }
            else
                {
                    var j=getLastAuthorNo();
                    var str='recorded by';
                    if($("#chapter").val().trim()!='')
                        {
                            if(document.getElementById('sound_song') && document.getElementById('sound_song').checked)
                                {
                                    str='song '+str;
                                }
                                else if(document.getElementById('sound_audio') && document.getElementById('sound_audio').checked)
                                {
                                    str='audio '+str;
                                }
                        }
                        else if($("#title").val().trim()!='')
                            {
                                str='album '+str;
                            }
                            str=FLUprCase(str);
                    $("#bookPanel #CiteAuth").html(" ["+str);
                    //setInnerText("CiteAuth"," [Recorded by");
                    setInnerText("CiteProd","].");
                }
        
        
}

function journalCiteTitleFormat()
{
    var formName=getCleanedFormName();
    var frm=getFormName();
    if(getTabName()=="corporate" || getTabName()=="periodicals" || formName=="journal"  || formName=="academic_journal" || frm=="citeweb_journal")
        {
            var vol='';
            var iss='';
            var page='';
            
            if(document.getElementById('CiteVolume'))
                {
                    vol=document.getElementById('CiteVolume').innerHTML.trim();
                    vol=vol.replace(",","");
                                    vol=vol.replace(".","");
                }
                if(document.getElementById('CiteIssue'))
                {
                    iss=document.getElementById('CiteIssue').innerHTML.trim();
                    iss=iss.replace("&nbsp;","");
                    iss=iss.replace(",","");
                    iss=iss.replace(".","");
                }
                if(document.getElementById('CitePage'))
                {
                    page=document.getElementById('CitePage').innerHTML;
                    //page=document.getElementById('CitePage').innerHTML.trim();
                    //page=page.replace(",","");
                }
                
                if(vol=='' && iss!="")
                    {
                        iss=' '+iss;
                    }
                    
                    console.log('vol:'+vol);
                    console.log('iss:'+iss);
                    if(page=="" && iss!="")
                        {
                            iss=iss+".";
                        }
                        else if(page !="" && iss!="")
                            {
                                iss+=",";
                            }
                            if(vol!="" && iss=="" && page!="")
                                {
                                    
                                    vol=vol+',';
                                }
                                if(document.getElementById('CiteVolume'))
                                    {                                
                                        document.getElementById('CiteVolume').innerHTML=vol;
                                    }
                                if(document.getElementById('CiteIssue'))
                                    {
                                        document.getElementById('CiteIssue').innerHTML=iss;
                                    }
                                    if(document.getElementById('CitePage'))
                                    {
                                        document.getElementById('CitePage').innerHTML=page;
                                    }
        }
}


function formatCreativeReview()
{
    var date;
    var reviewTtl;    
    var frmt;
    var reviewdTtl;
    var lastAuthor;
    var lastEditor;
    var lastRevAuthor;
    var reviewTitle;
    var reviewedFormat;
    var reviewedTitle;
    var year;
    var temp;
    reviewedFormat=getInnerText('CiteDescriptor').trim();
    reviewedTitle=getInnerText('CiteSubject').trim();
    year=getInnerText('CiteYear');
    
    date=getInnerText('CiteDate').trim();
    reviewTtl=getInnerText('CiteChapter').trim();
    frmt=getInnerText('CiteDescriptor').trim();
    reviewdTtl=getInnerText('CiteSubject').trim();
    lastAuthor=getLastAuthorNo();
    lastEditor=getLastEditorNo();
    lastRevAuthor=getLastRevAuthorNo();
    var flg=false;
    
    var pageSec=getPageSectionGlobal();
    
    
    //if(reviewdTtl=='')
        //{
            //setInnerText('CiteRevAuth','');
           // setInnerText('CiteEd','');
            //var flg=true;
        //}
        //else
            //{
                /*if(lastEditor!=1)
                {
                    
                    setInnerText('CiteEd',', directed by');
                }*/
                if(lastRevAuthor!=1)
                    {
                        var prevDiv=getPreviousFilledDiv('CiteRevAuth');
                        if(isAllRevAuthorsBlank==true || prevDiv=="CiteRecord")
                        {
                            $("#CiteRevAuth").html("");
                        }
                        else
                            {
                            var strComma='';
                            if(prevDiv=="CiteSubject")
                            {
                                strComma=',';
                            }

                            if(pageSec=="books" && document.getElementById('chkedi') && document.getElementById('chkedi').checked)
                            {
                                    $('#CiteRevAuth').html(strComma+" edited by ");
                            }
                            else if(pageSec=="creative")
                            {
                                var val=getRevCheckVal();
                                    if(val!='')
                                    {
                                        $("#CiteRevAuth").html(strComma+" "+val+" by ");
                                    }
                                    else
                                    {
                                        $('#CiteRevAuth').html(strComma+' by ');
                                    }
                            }
                            else
                            {
                                var tmp;

                                    tmp=strComma+' by ';
                                $('#CiteRevAuth').html(tmp);
                            }
                        }
                    }
           // }
            
            if(lastEditor!=1 && getLastRevAuthorNo()!=1)
                {
                    
                    setInnerText('CiteEd',', directed by');
                }
                
                
                if((reviewedFormat=='' && reviewedTitle=='') && (lastEditor!=1 || lastRevAuthor!=1 || year!=''))
                    {
                        if(document.getElementById('CiteChapter'))
                            {
                                reviewTitle=document.getElementById('CiteChapter').innerHTML.trim();
                                reviewTitle=reviewTitle.replace(".","");
                                document.getElementById('CiteChapter').innerHTML=reviewTitle;
                            }
                    }
            
    var i;
    var j;
    if(document.getElementById('CiteRevAuthor') && document.getElementById('CiteRevAuthor').innerHTML.trim()!='')
    {
        document.getElementById('CiteRevAuthor').innerHTML=trimLastChar(document.getElementById('CiteRevAuthor').innerHTML.trim(),'.').replace(",","");
    }
    
    for(j=2;j<=9;++j)
    {
        if(document.getElementById('CiteRevAuthor'+j) && document.getElementById('CiteRevAuthor'+j).innerHTML.trim()!='')
        {
            document.getElementById('CiteRevAuthor'+j).innerHTML=trimLastChar(document.getElementById('CiteRevAuthor'+j).innerHTML.trim(),'.').replace(",","");
        }
    }
    
    if((flg==true && lastRevAuthor!=1 && (lastAuthor!=1 || date=='' || reviewTtl=='' || frmt=='')) || (frmt!='' && reviewedTitle==''))
                    {
                        document.getElementById('CiteRevAuthor').innerHTML=' '+document.getElementById('CiteRevAuthor').innerHTML.trim();
                    }
                     
                    
   putSquareBrackets();   
   reviewedTitle=reviewedTitle.replace("&nbsp;","");
   var firstRevAuthor=getFirstNo('CiteRevAuthor');
   var firstEditor=getFirstNo('CiteEditor');
   
   if(document.getElementById('CiteYear'))
       {
           document.getElementById('CiteYear').innerHTML=document.getElementById('CiteYear').innerHTML.replace(",&nbsp;","");
           if(frmt!='' || reviewedTitle!='' || lastRevAuthor!=1 || firstEditor!=1)
            {
                year=document.getElementById('CiteYear').innerHTML;
                if(year!='')
                {
                    document.getElementById('CiteYear').innerHTML=',&nbsp;'+document.getElementById('CiteYear').innerHTML;
                }
            }
       }
   
   if(firstRevAuthor!=1)
       {
           document.getElementById('CiteRevAuthor'+firstRevAuthor).innerHTML=document.getElementById('CiteRevAuthor'+firstRevAuthor).innerHTML.trim();
       }
       if(firstEditor!=1)
           {
               document.getElementById('CiteEditor'+firstEditor).innerHTML=document.getElementById('CiteEditor'+firstEditor).innerHTML.replace("&nbsp;","").trim();
           }
   if((frmt!='' || reviewedTitle!='') && firstRevAuthor!=1)
       {
           document.getElementById('CiteRevAuthor'+firstRevAuthor).innerHTML=' '+document.getElementById('CiteRevAuthor'+firstRevAuthor).innerHTML;
       }
       
       if((frmt!='' || reviewedTitle!='' || lastRevAuthor!=1) && firstEditor!=1)
       {
           document.getElementById('CiteEditor'+firstEditor).innerHTML='&nbsp;'+document.getElementById('CiteEditor'+firstEditor).innerHTML;
       }
       
       
       if(document.getElementById('CiteRevAuthor') && document.getElementById('CiteRevAuthor').innerHTML.trim()=='')
       {
           document.getElementById('CiteRevAuthor').innerHTML=document.getElementById('CiteRevAuthor').innerHTML.trim();
       }
   
   if(frmt!='' && reviewedTitle!='')
   {
       document.getElementById('CiteSubject').innerHTML='&nbsp;'+reviewedTitle;
   }
   else
   {
       document.getElementById('CiteSubject').innerHTML=reviewedTitle;
   }
   date=document.getElementById('CiteDate').innerHTML.replace("&nbsp;","");
   if(date.trim()=='')
       {
           document.getElementById('CiteDate').inneHTML='&nbsp;'+document.getElementById('CiteDate').inneHTML;
       }
}


function formatPeriodicalReview()
{
    
    var lastAuthor;
    var lastEditor;
    var reviewTitle;
    var reviewedTitle;
    var temp;
    var frmt;
    var year;
    
    year=getInnerText('CiteYear');
    reviewedTitle=getInnerText('CiteSubject').trim();
    frmt=getInnerText('CiteDescriptor').trim(); 
    lastAuthor=getLastAuthorNo();
    lastEditor=getLastEditorNo();
    /*if(reviewedTitle=='')
        {
            setInnerText('CiteEd','');
        }
        else
            {*/
                if(lastEditor!=1)
                {
                    var prevDiv=getPreviousFilledDiv('CiteEd');
                        if(isAllRevAuthorsBlank==true || prevDiv=="CiteRecord")
                        {
                            $("#CiteEd").html("");
                        }
                        else
                            {
                            var strComma='';
                            if(prevDiv=="CiteSubject")
                            {
                                strComma=',';
                            }
                    
                            setInnerText('CiteEd',strComma+' by');
                    }
                }
            //}
      
   
           
   putSquareBrackets();   
   reviewedTitle=reviewedTitle.replace("&nbsp;","");
   var firstEditor=getFirstNo('CiteEditor');
   if(firstEditor!=1)
           {
               document.getElementById('CiteEditor'+firstEditor).innerHTML=document.getElementById('CiteEditor'+firstEditor).innerHTML.replace("&nbsp;","").trim();
           }
 
       if((frmt!='' || reviewedTitle!='') && firstEditor!=1)
       {
           document.getElementById('CiteEditor'+firstEditor).innerHTML='&nbsp;'+document.getElementById('CiteEditor'+firstEditor).innerHTML;
       }
   
   if(document.getElementById('CiteYear'))
       {
           document.getElementById('CiteYear').innerHTML=document.getElementById('CiteYear').innerHTML.replace(",&nbsp;","");
           if(frmt!='' || reviewedTitle!='' || firstEditor!=1)
            {
                year=document.getElementById('CiteYear').innerHTML;
                if(year!='')
                {
                    document.getElementById('CiteYear').innerHTML=',&nbsp;'+document.getElementById('CiteYear').innerHTML;
                }
            }
       }
   
   if(frmt!='' && reviewedTitle!='')
   {
       document.getElementById('CiteSubject').innerHTML='&nbsp;'+reviewedTitle;
   }
   else
   {
       document.getElementById('CiteSubject').innerHTML=reviewedTitle;
   }
   
   date=document.getElementById('CiteDate').innerHTML.replace("&nbsp;","");
   if(date.trim()=='')
       {
           document.getElementById('CiteDate').inneHTML='&nbsp;'+document.getElementById('CiteDate').inneHTML;
       }
            
}


function putSquareBrackets()
{
    var reviewTitle='';
    var date='';
    var lastAuthor;
    var format='';
    var reviewedTitle='';
    var year='';
    var lastRevAuthor;
    var lastEditor;
    
    lastAuthor=getLastAuthorNo();
    lastRevAuthor=getLastRevAuthorNo();
    lastEditor=getLastEditorNo();
    
    if(document.getElementById('CiteDate'))
    {
        date=document.getElementById('CiteDate').innerHTML.trim();
    }
    if(document.getElementById('CiteDescriptor'))
    {
        format=document.getElementById('CiteDescriptor').innerHTML.trim();
    }
    if(document.getElementById('CiteChapter'))
    {
        reviewTitle=document.getElementById('CiteChapter').innerHTML.trim();
    }
    if(document.getElementById('CiteSubject'))
    {
        reviewedTitle=document.getElementById('CiteSubject').innerHTML.trim();
    }
    if(document.getElementById('CiteYear'))
    {
        year=document.getElementById('CiteYear').innerHTML.trim();
    }
    
    var space=' ';
    if(lastAuthor!=1 || date!='' || reviewTitle!='')
    {
        space=' ';
    }
    if(document.getElementById('CiteRevOpen') && document.getElementById('CiteRevClose'))
    {
        
        if(reviewedTitle!='' || format!='' || year!='' || lastRevAuthor!=1 || lastEditor!=1)
        {
            
            showDiv('CiteRevOpen');
            showDiv('CiteRevClose');
            document.getElementById('CiteRevOpen').innerHTML=space+'[';
            document.getElementById('CiteRevClose').innerHTML='].';
        }
        else
        {
           
            document.getElementById('CiteRevOpen').innerHTML='';
            document.getElementById('CiteRevClose').innerHTML='';
        }
    }
    
    
}

function hideDiv(id){
    if (document.getElementById) 
    { 
        if(document.getElementById(id)!=null)
        {
            document.getElementById(id).style.visibility = 'hidden';

            document.getElementById(id).style.position = 'absolute'; 

            document.getElementById(id).style.left = '-100';

            document.getElementById(id).style.top = '0';
        }
    } 
    else 
    { 
        if (document.layers) 
        { // Netscape 4 
            document.hideshow.visibility = 'hidden'; 
        } 
        else 
        { // IE 4 
           document.all.hideshow.style.visibility = 'hidden'; 
        } 
    } 
}

function putInterviewBy()
{
    var authorNo,editorNo;
    authorNo=getLastAuthorNo();
    editorNo=getLastEditorNo();
    if(authorNo!=1 && editorNo!=1 && isAllAuthorsBlank()===false)
        {
            if(document.getElementById('CiteEd'))
                {
                    document.getElementById('CiteEd').innerHTML=" Interview by";
                }
        }
        else
            {
                document.getElementById('CiteEd').innerHTML="";
            }
}

function putInterviewOf()
{
    var authorNo,editorNo;
    authorNo=getLastAuthorNo();
    editorNo=getLastEditorNo();
    if(authorNo!=1 && editorNo!=1  && isAllAuthorsBlank()===false)
        {
            if(document.getElementById('CiteEd'))
                {
                    document.getElementById('CiteEd').innerHTML=" Interview of";
                }
        }
        else
            {
                document.getElementById('CiteEd').innerHTML="";
            }
}

function getFieldValue(id)
{
    if(document.getElementById(id))
        {
            return document.getElementById(id).value.trim();
        }
        return '';
}

function getFormGroup()
{
    var formGroup='';
    if(document.getElementById('formGroup'))
        {
            formGroup=document.getElementById('formGroup').value;
        }
        return formGroup;
}

function reformatEditor(other)
{
    if(typeof other == "undefined")
    {
        other='';
    }
    
        var field='editor';
    
             if(getFormName()=="BooksTranslation")
                    {
                        $('#bookPanel #CiteChapter').html($('#bookPanel #CiteChapter').html()+'.');
                    }

                var soundRecordStart='';
                var soundRecordEnd='';
                if(getFormName()=="digitalSound")
                    {
                        //soundRecordStart=getInnerText("CiteAuth")+' ';
                        //soundRecordEnd=getInnerText("CiteProd");
                        soundRecordStart='';
                        soundRecordEnd='';
                        setInnerText("CiteAuth","");
                        setInnerText("CiteProd","");
                    }
                var edi = $('#bookPanel #CiteEditor').html();
                
                
                var virEdiCnt=0;
                
                    edi = edi.replace("(","");

                    edi = edi.replace("&nbsp;","");
                    edi = edi.replace("&amp;","");
                    var isLastWrd=false;
                    var fstNmLstNmFlag=fNameLnameFrmt(field);
                                       
                var eds = $('#bookPanel #CiteEd').html();

                            eds = eds.trim();

                            eds = eds.replace(" ,","");
                            eds = eds.replace("(","");
                            eds = eds.trim();
                            if(eds.indexOf('),')!=-1)
                                    eds =eds.replace("),","");

                                if(eds.indexOf(').,')!=-1)
                                {
                                    eds =eds.replace(").,","");
                                    eds ="("+eds+").";
                                }
                                if(eds.indexOf(').')!=-1)
                                {
                                    eds =eds.replace(").","");
                                    eds ="("+eds+").";
                                }
                           
                            eds =eds.replace(", ","");
                            var  perNo = document.perNoeditor; 
                            
                            var allSingleFlag=false;
         arrAu=ucFirstAllWords($("#publicationtype .cssform #editor").val().trim()).split(" ");
        if(arrAu.length>0)
        {
            for(i=0;i<arrAu.length;++i)
            {
                if(arrAu[i].trim()!='' && arrAu[i].trim().replace(/\./g,"").trim().length>1)
                    {
                        allSingleFlag=false;
                        break;
                    }
                    allSingleFlag=true;
            }
        }
        
        if(allSingleFlag==true)
        {
            arr=arrAu;
            for(i=0;i<arrAu.length;++i)
                {
                    if(arr[i].replace(/\./g,"").trim().length==1)
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                }
                
                if(arr.length>1)
                {
                    var tm=arr[arr.length-1];
                    var kk=0;
                    for(kk=arr.length-2;kk>=0;--kk)
                        {
                            arr[kk+1]=arr[kk];
                        }
                        arr[0]=tm;
                    arr[0]=arr[0].replace(/\./g,"").trim()+',';
                }
                edi=arr.join(" ");
        }
        else 
            {
                               
                                    if(perNo>0)
                                    {
                                        if($("#publicationtype .cssform #"+field).length)
                                        {
                                            edi=$("#publicationtype .cssform #"+field).val();
                                            edi = ucFirstAllWords(edi);
                                            edi = ReplaceAnd(edi);
                                            
                                        }
                                        edi=edi.trim()+' ';
                                        //
                                    }
                                    else
                                    {
                                
                                        var arr12=reformatEd(field);
                                        edi=arr12[0];
                                        isLastWrd=arr12[1];
                                
                                    }
            }
                                
                                
                                    



                //Chris added to account for translator

                            //var edi2 =  document.getElementById('VirCiteEditor').getElementsByTagName('span');
                            var edi2=$("#bookPanel #VirCiteEditor").find("span");
                        var strSpan='';
                            
                            
                            for (var i = 0; i < edi2.length; i++) {

                                    //omitting undefined null check for brevity
                                    var elemId=edi2[i].id;
                                    edit = document.getElementById(edi2[i].id).innerHTML;
                                    if (edi2[i].id.lastIndexOf("CiteEditor", 0) === 0) {

                                            filedno = edi2[i].id.charAt(edi2[i].id.length - 1);

                                            var  addperNo = eval("document.perNoeditor"+filedno);
                                            
                                            
                                            var allSingleFlag=false;
         arrAu=ucFirstAllWords($("#publicationtype .cssform #editor"+filedno).val().trim()).split(" ");
        if(arrAu.length>0)
        {
            var ik;
            for(ik=0;ik<arrAu.length;++ik)
            {
                if(arrAu[ik].trim()!='' && arrAu[ik].trim().replace(/\./g,"").trim().length>1)
                    {
                        allSingleFlag=false;
                        break;
                    }
                    allSingleFlag=true;
            }
        }
        
        if(allSingleFlag==true)
        {
            arr=arrAu;
            var ik;
            for(ik=0;ik<arrAu.length;++ik)
                {
                    if(arr[ik].replace(/\./g,"").trim().length==1)
                    {
                        arr[ik]=arr[ik].replace(/\./g,"").trim()+'.';
                    }
                }
                
                if(arr.length>1)
                {
                    arr[0]=arr[0].replace(/\./g,"").trim()+',';
                }
                edit=arr.join(" ");
                
                virEdiCnt++;
        }
        else
            {
                                            
                                if(addperNo>0)
                                {
                                    if($("#publicationtype .cssform #"+field+filedno).length)
                                    {
                                        edit=$("#publicationtype .cssform #"+field+filedno).val();
                                        edit = ucFirstAllWords(edit);
                                        edit = ReplaceAnd(edit);                                        
                                    }
                                    //edit=trimLastChar(edit.trim(),".").trim()+'. ';
                                    virEdiCnt++;
                                }
                                else
                                {
                                
                                    var arr12=reformatEd(field+''+filedno);
                                    edit=arr12[0];
                                    isLastWrd=arr12[1];
                                    virEdiCnt++;
                                                                
                                }
            }
                                
                                                
                                                
                                            

                                    }
                                    strSpan+='<span id="auth_'+elemId+'">'+edit+'</span>';
                            }
                            //if(virEdiCnt>0)
                            //{
                            if(eds!='')
                                eds=' '+eds;
//                            }

                            if(eds!='')
                                {
                                eds = "<span>"+eds+"</span>";
                                }
                                else
                                    {
                                        edi=edi.trim();
                                    }
                                    if(virEdiCnt>0)
                                    {
                                        edi=edi.trim();
                                    }
                                    var st='';
                                    var en='';
                                    var firstEdi=getFirstEditorNo();
                                    var lastEdi=getLastEditorNo();



        if(getFormName()=="digitalSound" && getLastAuthorNo()!=1)
            {
                                    if(edi!='')
                                        {
                                            edi=soundRecordStart+edi;
                                            if(virEdiCnt<=0)
                                                {
                                                    edi+=soundRecordEnd;
                                                }

                                        }



                                        if(edi=='' && virEdiCnt>0)
                                            {
                                                st=soundRecordStart;
                                                if(firstEdi!='' && firstEdi>1)
                                                    {
                                                        $("#bookPanel #CiteEditor"+firstEdi).html(st+$("#bookPanel #CiteEditor"+firstEdi).html());
                                                    }
                                            }

                                            if(virEdiCnt>0)
                                                {
                                                    en=soundRecordEnd;
                                                    if(lastEdi!='' && lastEdi>1)
                                                    {
                                                        $("#bookPanel #CiteEditor"+lastEdi).html($("#bookPanel #CiteEditor"+lastEdi).html()+en);
                                                    }
                                                }
            }


                $("#bookPanel #CiteAuthor"+lastEdi).html(edi);
                


                
                            $('#bookPanel #previewEditors').remove();
                            $('#bookPanel #VirCiteAuthor').append('<span id="previewEditors">'+strSpan+eds+'</span>')
                            $('#bookPanel #CiteEditor').hide();
                            $('#bookPanel #CiteEd').hide();
                            $('#bookPanel #VirCiteEditor').hide();
                

}

function putInterviewOfBy()
{
    if(getFormName()=="digitalInterview" || getFormName()=="periodicalInterview")
                                {
                                    putInterviewBy();
                                }
                                /*else if(getFormName()=="periodicalInterview")
                                    {
                                       putInterviewOf(); 
                                    }*/
}

function displayRetrieveDate ()
{
    if(document.getElementById('accessed'))
    {
        if($("#accessed").val().trim()=="")
        {
            showDiv('CiteAccessed');
            setInnerText("CiteAccessed", " Retrieved "+$("#accessed").attr("placeholder"));
        }
    }
}

function chkFormat(id)
{
    var formName=getCleanedFormName();
    if(document.getElementById(id) && $("#"+id).val()=='')
        {
            if(formName=="learning_management_system" && $("#title").val()=="")
                {
                    //do nothing
                }
                else
                    {
            var obj=document.getElementById(id);
             var frmt=obj.getAttribute("placeholder").trim();
             $("#"+id).val(frmt);
             eval(obj.getAttribute('onkeyup'));
             $("#"+id).val('');
                    }
        }
}

function addRemoveRetDate()
{
    if(document.getElementById('retrievedDate'))
        {
            if(document.getElementById("retrievedDate").checked==true)
                {
                    showDiv('CiteAccessed');
                    var currentDate=getCurrentDate();
                    $("#CiteAccessed").html(' Retrieved '+currentDate);
                    
                }
                else
                    {
                        $("#CiteAccessed").html('');
                    }
                    
                    ReloadTextDiv2('http','CiteHttp');
        }
}

function generateWCIntextAPA(bibTexFlg)
{
    if(typeof bibTexFlg == "undefined")
        {
            var bibTexFlg=false;
        }
        var chkId='chkResultsWCS';
        if(bibTexFlg==true)
            {
                chkId='bibx-saved-citation-chk';
            }
    var jsn=JSON.parse($("#"+chkId+":checked").attr("data-json"));
    var strAuth='';
    if(typeof jsn.author != "undefined")
        {
            var i;
            var authorCnt=0;
            var firstAuthor='';
            for(i=0;i<jsn.author.length;++i)
                {
                    
                    if(jsn.author[i]!='')
                        {
                            if(authorCnt==0)
                                {
                                    firstAuthor=jsn.author[i];
                                }
                            authorCnt++;
                            var auth1=jsn.author[i];
                            var arrAuth=auth1.split(" ");
                            var temp=''
                            var strAuthi='';
                            if(arrAuth.length>1)
                                {
                                    var j;
                                    var flg=false;
                                    for(j=1;j<arrAuth.length;++j)
                                        {
                                            temp+=arrAuth[j].trim()+' ';
                                            if(arrAuth[j].trim().length>1)
                                            {
                                                flg=true;
                                            }
                                        }
                                        strAuthi=arrAuth[0];
                                        if(flg==true)
                                        {
                                            strAuthi+=' '+temp.trim();
                                        }
                                        if(i!=jsn.author.length-1)
                                            strAuthi+=', ';
                                }
                                else
                                    {
                                        strAuthi=auth1;
                                        if(i!=jsn.author.length-1)
                                            strAuthi+=', ';
                                    }

                            if(i==jsn.author.length-1 && jsn.author.length>1)
                            {
                                if(strAuth!='')
                                {
                                    strAuth=strAuth.replace(/\,\s+$/," ");
                                }
                                
                                strAuth+='& ';
                            }
                            strAuth+=strAuthi;

                        }

                            
                }
                
                if(authorCnt>=6)
                    {
                        var pattu=new RegExp(/^[A-z]{1}[.|\s]+$/);

                        //strAuthor = strAuthor + ' et al.';
                        word=processExtraDotComma('',firstAuthor).split(' ');

                        if(pattu.test(word[0])!=true)
                        {
                                strAuth = FLUprCase(word[0]) + ' et al.';
                        }
                        else
                        { 
                            strAuth = FLUprCase(word[1]) + ' et al.';
                        }
                    }
        }       
            
            var strTitle='';
            var strPlace='';
        if(typeof jsn.title != "undefined")
            {
                if(document.getElementById('dskCiteWebResult'))
                    {
                        strTitle='"'+jsn.title+'"';
                    }
                    else
                        {
                            strTitle='<i>'+jsn.title+'</i>';
                        }
            }
            
            
            var strPub='';
            if(typeof jsn.publisher != "undefined")
            {
                strPub=jsn.publisher;
                
            }
            
            var strYear='';
            if(typeof jsn.year != "undefined")
            {
                strYear=jsn.year;                
            }
            
            if(strYear=='')
            {
                strYear='n.d.';
            }
            
            var strFinal='';
            if(strAuth!='')
            {
                strFinal=strAuth;
            }
            else if(strTitle!='')
            {
                strFinal=strTitle;
            }
            else if(strPub!='')
            {
                strFinal=strPub;
            }
            return '('+strFinal+', '+strYear+')`'+strFinal+' ('+strYear+')';
}

function reformatEd(field)
{
    var edi='';
    var isLastWrd=false;
    if(document.getElementById(field))
                        {
                            edi=$("#"+field).val().trim();
                            edi = ucFirstAllWords(edi);
                            edi = ReplaceAnd(edi,true);
                            var arrEdi=edi.split(" ");
                            var k=0;
                            var firstWPos=-1;
                            for(k=0;k<arrEdi.length;++k)
                            {
                                if(arrEdi[k].trim().length>1)
                                {
                                    firstWPos=k;
                                    break;
                                }
                            }
                            var commaFlg=false;
                            if(edi.indexOf(",")>=0)
                            {
                                commaFlg=true;
                            }
                            if(firstWPos==0)
                                {
                                    if(arrEdi.length==1)
                                        {
                                            edi=arrEdi[0];
                                        }
                                        else
                                            {
                                                edi='';
                                                if(arrEdi[arrEdi.length-1].length>1)
                                                    {
                                                        edi=arrEdi[arrEdi.length-1];
                                                        if(commaFlg==false)
                                                            edi+=',';
                                                        for(k=0;k<arrEdi.length-1;++k)
                                                        {
                                                            edi+=' '+arrEdi[k];
                                                        }
                                                       isLastWrd=true; 
                                                    }
                                                    else
                                                        {
                                                            var lastWPos=-1;
                                                            for(k=arrEdi.length-1;k>=0;--k)
                                                                {
                                                                   if(arrEdi[k].replace(/\./g,"").length>1)
                                                                       {
                                                                           lastWPos=k;
                                                                           break;
                                                                       }
                                                                }
                                                                
                                                                for(k=0;k<=lastWPos;++k)
                                                                    {
                                                                        edi+=arrEdi[k]+' ';
                                                                    }
                                                                edi=edi;
                                                                if(commaFlg==false)
                                                                    edi=edi.trim()+', ';
                                                                for(k=lastWPos+1;k<arrEdi.length;++k)
                                                                    {
                                                                        edi+=arrEdi[k]+'. ';
                                                                    }
                                                                    edi=edi.trim();
                                                        }
                                               
                                            }
                                }
                                else if(firstWPos==-1)
                                    {
                                        if(arrEdi.length>0)
                                            edi=arrEdi.join(".");
                                    }
                                    else
                                        {
                                            var firstName='';
                                            var lastName='';
                                            for(k=0;k<firstWPos;++k)
                                                {
                                                    firstName+=arrEdi[k]+'. ';
                                                }
                                               for(k=firstWPos;k<arrEdi.length;++k)
                                                {
                                                    lastName+=arrEdi[k]+' ';
                                                } 
                                                edi=lastName.trim()+', '+firstName.trim();
                                        }
                        }
                        edi=edi.trim();
                        var arr=new Array();
                        arr[0]=edi;
                        arr[1]=isLastWrd;
                        return arr;
}

function addField(authors,formatNum,titlName,numOfAuthors,tabVal,tmpValArr,secRef,hint,alphabet)
{
    authors = authors + '<div class="'+classWrap+'"><label class="'+labelCol+' control-label">'+formatNum+' '+ titlName +'</label><div class="'+inputCol+'"><input type="text" class="form-control" value="" id="author'+numOfAuthors+'" tabindex="'+tabVal+'" data-div="CiteAuthor'+numOfAuthors+'" placeholder="'+titlName+' '+alphabet[numOfAuthors-1]+'"/>'+hint+'</div></div>';
    
    document.getElementById(secRef).innerHTML = authors;
    for (var k = 2; k < numOfAuthors; k++)
    {
            tmpVar = 'author'+k;
            document.getElementById(tmpVar).value = tmpValArr[k];
    }



    //alert("t "+ panelArr);
    //add new span to the piew panel
    var newSpan = document.getElementById("VirCiteAuthor").innerHTML;
    newSpan = newSpan + '<span id="CiteCommaA'+numOfAuthors+'"></span><span id="CiteAndA'+numOfAuthors+'"></span><span id="CiteAuthor'+numOfAuthors+'"></span><span id="CiteEnd'+numOfAuthors+'"></span>';
    document.getElementById("VirCiteAuthor").innerHTML = newSpan;

    //newSpan = document.getElementById("VirCiteAuthor").innerHTML;
    document.getElementById("VirCiteAuthor").innerHTML=  newSpan+"<span> </span>"; 

            
            return authors;
}

function clearCreativeProGroupAuth(elem,textName){
	
        var elem1=false;
        var elem2=false;
        var elem3=false;
        var authorCnt=0;
        var i=2;
        /*if(getFormatType()=="AuthorCiteAuth" && typeof elem != "undefined" && elem!='')
        {
            var group = document.publication.chkproducer;
            var isChecked=elem.checked;
            for (var i=0; i<group.length; i++) {
                    if (group[i] != elem) {
                            group[i].checked = false;
                    }
            }
            elem.checked=isChecked;
        }*/
        if(document.getElementById('chkproducer'))
        elem1=document.getElementById('chkproducer').checked;
    
        if(document.getElementById('chkdirector'))
        elem2=document.getElementById('chkdirector').checked;    
    
        if(document.getElementById('chkCurator'))
        elem3=document.getElementById('chkCurator').checked;
    
    console.log('elem3:  '+elem3);
    
        if(getFormatType()=="AuthorCiteAuth")
            {
                
                if(getInnerText("CiteAuthor").trim()!='')
                    {
                        authorCnt=1;
                    }

                    for(i=2;i<10;++i)
                    {
                        if(getInnerText("CiteAuthor"+i).trim()!='')
                        {
                            authorCnt++;
                        }
                    }
            }
            else
                {
                    authorCnt=getFilledAuthorCount();
                }
           
	 
        var txt;
        var dot='';
        var dir;
        var prod;
        var cur;
        console.log('authorCnt:'+authorCnt);
        setInnerText("CiteEd","");
	if(authorCnt>0){
            if(authorCnt==1)
            {
                dir='Director';
                prod='Producer';
                cur='Curator';
            }
            else  
            {
                dir='Directors';
                prod='Producers';
                cur='Curators';
            }
            
            console.log('ll');
            
           if(elem1==true && elem2==true)
            {
                setInnerText("CiteAuth"," ("+prod+" and "+dir+").");
            } 
           else if(elem1==true)
            {
                setInnerText("CiteAuth"," ("+prod+").");
            }
            else if(elem2==true)
            {
                setInnerText("CiteAuth"," ("+dir+").");
            }
            else if(elem3==true)
                {
                    setInnerText("CiteAuth"," ("+cur+").");
                }
            else
                {
                    setInnerText("CiteAuth","");
                }
	}
        
        
}

function formatCorporatePresentation()
{
    var presFlag=false;
    var presTxt='';
    if(document.getElementById('CiteTitle') && $("#CiteTitle").html().trim()!="")
    {
        presFlag=true;
    }
    
    if(document.getElementById('CitePublisher') && $("#CitePublisher").html().trim()!="")
    {
        presFlag=true;
    }
    
    if(presFlag==true)
    {
        presTxt=' Presented at';
    }
    
    if(presFlag==true && document.getElementById('CiteDescriptor') && $("#CiteDescriptor").html().trim()!="")
    {
        var tmp=$("#CiteDescriptor").html();
        tmp=tmp.replace(/\.+$/,'');
        $("#CiteDescriptor").html(tmp);
        presTxt=presTxt.toLowerCase();
    }
    
    if(presFlag==true)
    {
        showDiv("CiteSource");
    }
    else if(document.getElementById('CiteDescriptor') && $("#CiteDescriptor").html().trim()!="")
    {
        var tmp=$("#CiteDescriptor").html();
        tmp=tmp+".".replace(/\.+$/,'.');
        $("#CiteDescriptor").html(tmp);
    }
    console.log("presTxt: "+presTxt);
        $("#CiteSource").html(presTxt);
    
}

function isFollowedBy(divName,followedBy){
	var SpanArr = new Array();
	var flag=false;
        var myF=false;
	$('#bookPanel span').each(function(index)
     {
         
         if($(this).css('display')!='none' && $(this).parent().css('display')!='none')
             {
                 if($(this).text().trim()!='' && flag==true){
                    if($(this).attr("id")!="undefined" && $(this).attr("id")==followedBy)
                    {
			myF=true;
                    }
		}
                
                 if($(this).attr("id")!="undefined" && $(this).attr("id")==divName)
                 {
                     flag=true;
                 }
		
             }
	});
        return myF;
}

function pageNumberRetain(){
  
			if((document.getElementById("pageBook") && document.getElementById('pageBook').value !="") 
                                && (typeof document.retainpagealert == "undefined" || document.retainpagealert == "" || !document.retainpagealert)){
				jConfirmMod2("<center>Page numbers are required if you choose to cite only part of a book.<br/><br/>If you click \"Remove\" page number(s) will only appear in your in-text reference.</center>","Alert","&nbsp;Remove&nbsp;","&nbsp;Retain&nbsp;",function(a1) {
					if(a1){
							/*if(document.getElementById("pageBook"))
								document.getElementById('pageBook').value = '';*/
                                                            document.retainpagealert=false;
                                                            ReloadTextDiv2('pageBook','CitePage','books','markBlank');
						}
						else
						{ 
							document.retainpagealert = true;
						}
				});
			
			}else{
				
			}
}

function eligibleForReviewof()
{
    var cnt=0;
    var pageSec=getPageSectionGlobal();
    
    if(document.getElementById('descriptor') && $("#descriptor").val()!='')
        {
            cnt++;
        }
        if(document.getElementById('subject') && $("#subject").val()!='')
            {
                cnt++;
            }
            if((pageSec=="creative" || pageSec=="books") && isAllRevAuthorsBlank()!=true)
                {
                    cnt++;
                }
                if(pageSec=="periodicals" && isAllEditorsBlank()!=true)
                    {
                        cnt++;
                    }
                    if(cnt>0)
                        {
                            return true;
                        }
                        else
                            {
                                return false;
                            }
}

function chkRevDir(elem)
{
    var group = document.publication.chkRevGrp;
    for (var i=0; i<group.length; i++) {
        if (group[i] != elem) {
            group[i].checked = false;
        }
    }
    
    
    var prevDiv=getPreviousFilledDiv('CiteRevAuth');
    if(isAllRevAuthorsBlank==true || prevDiv=="CiteRecord")
        {
            $("#CiteRevAuth").html("");
        }
        else
            {
                var strComma='';
                if(prevDiv=="CiteSubject")
                {
                    strComma=',';
                }
                if(elem.checked==true)
                {
                    var val=elem.value;
                    $("#CiteRevAuth").html(strComma+" "+val+" by ");
                }
                else
                {
                    $("#CiteRevAuth").html(strComma+" by ");
                }
            }
}

function chkRevEdi(elem)
{
     var prevDiv=getPreviousFilledDiv('CiteRevAuth');
    if(isAllRevAuthorsBlank==true || prevDiv=="CiteRecord")
        {
            $("#CiteRevAuth").html("");
        }
        else
            {
                var strComma='';
                if(prevDiv=="CiteSubject")
                {
                    strComma=',';
                }
                if(elem.checked==true)
                {
                    $("#CiteRevAuth").html(strComma+" edited by ");
                }
                else
                {
                    $("#CiteRevAuth").html(strComma+" by ");
                }
            }
}

function getRevCheckVal()
{
    var group = document.publication.chkRevGrp;
    var val='';
        for (var i=0; i<group.length; i++) {
            if (group[i].checked) {
                val=group[i].value;
            }
        }
        return val;
}

function clearchkpi(elem) {

    var group = document.publication.chkprint;

    for (var i=0; i<group.length; i++) {

        if (group[i] != elem) {

            group[i].checked = false;

        }

    }

    elem.checked=true;

    var formName=getCleanedFormName();
    var pageSec=getPageSectionGlobal();
    if($(elem).attr("id" )=="internet" ){
        $("#page_no_label").hide();
        $("#page_article_label").show();
        /*if(pageSec=="creative" && formName=="image_graph_or_table")
        {
            //chkBookPeri(document.getElementById('bookChk'));
            $("#bookPeriChkP").hide();
        }
            
        //internet
        $(".optionalTxt").show();
        $(".optionalTxtPrint").hide();
        $("#publisherfield" ).hide();

        $("#placefield" ).hide();
        */
        $("#intexplink" ).hide();

        $(".switchcontent" ).show();

        if(document.getElementById("place"))
            {
                if($("#place").val()=="")
                {
                    if(document.istablet)
                        {
                            $("#place").parent().parent().hide();
                        }
                        else
                            {
                                $("#place").parent().hide();
                            }                    
                }
            }
            /*
        if(document.getElementById("publisher"))
            {
                if($("#publisher").val()=="")
                    {
                        if(document.istablet)
                            {
                                $("#publisher").parent().parent().hide();
                            }
                            else
                                {
                                    $("#publisher").parent().hide();
                                }
                        
                    }
            }*/
        
        $(".showInternet").show();
        $(".hideInternet").hide();

        /*if(formName!="data")
        {
            if(document.getElementById('descriptor'))
            {
                $("#descriptor").parent().hide();
                $("#descriptor").val('');
                if(document.getElementById('CiteDescriptor'))
                {
                    $("#CiteDescriptor").html('');
                    $("#CiteDescriptor").hide();
                }
            }
        }*/
    }
    else
    {
        $("#page_no_label").show();
        $("#page_article_label").hide();
        if(formName=="journal" || formName=="academic_journal" || formName=="magazine" || formName=="newspaper" || formName=="review" || formName=="interview")
            {
                if(document.getElementById('chkeLocator'))
                    {
                        document.getElementById('chkeLocator').checked=false;
                        var el=document.getElementById('chkeLocator');
                        eval(el.getAttribute('onclick'));
                    }
            }
        /*if(pageSec=="creative" && formName=="image_graph_or_table")
                {
                    //chkBookPeri(document.getElementById('bookChk'));
                    $("#bookPeriChkP").show();
                }
        //print
        $(".optionalTxt").hide();
        $(".optionalTxtPrint").show();
        $("#publisherfield" ).show();

        $("#placefield" ).show();
        */
        $("#intexplink" ).show();

        $(".switchcontent" ).hide();

        $(".showInternet").hide();
        $(".hideInternet").show();
        
        if(document.getElementById("place"))
            {
                if(document.istablet)
                            {
                                $("#place").parent().parent().show();
                            }
                            else
                                {
                                    $("#place").parent().show();
                                }
                
                if($("#place").val()!="")
                {
                    var el=document.getElementById("place");
                    eval(el.getAttribute('onkeyup'));
                }
            }
            /*
        if(document.getElementById("publisher"))
            {
                if(document.istablet)
                {
                    $("#publisher").parent().parent().show();
                }
                else
                    {
                        $("#publisher").parent().show();
                    }
                if($("#publisher").val()!="")
                    {
                        var el=document.getElementById("publisher");
                        eval(el.getAttribute('onkeyup'));
                    }
            }*/

       /* if(formName!="data")
            {
                if(document.getElementById('descriptor'))
                    {
                        $("#descriptor").parent().show();
                        if(document.getElementById('CiteDescriptor'))
                            {
                               document.getElementById('CiteDescriptor').style.display='inline';
                            }
                    }
            }*/
            
            if(document.getElementById('accessed'))
                {
                    $("#accessed").val('');
                    $("#http").val('');
                }
            $("#http").val('');
            var arr = document.forms["publication"].elements;
                        
                    for (var i = 0; i < arr.length; i++) {
                      var el = arr[i];
                       var cmBtnId=el.getAttribute("id");
                       var cmBtnType=el.getAttribute("type");
                       var val=el.value.trim();
                       if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text")
                           {                       
                            
                                if(typeof newDesign !="undefined" && newDesign==true)
                                   {
                                       if(cmBtnId=="accessed" && document.getElementById('CiteAccessed'))
                                           {
                                               eval(el.getAttribute('onkeyup'));
                                           }
                                           
                                           if(cmBtnId=="http" && document.getElementById('CiteHttp'))
                                           {
                                               eval(el.getAttribute('onkeyup'));
                                           }
                                   }
                                   else
                                       {
                            
                                            if(cmBtnId=="accessed" || cmBtnId=="http")
                                            {
                                                eval(el.getAttribute('onkeyup'));
                                            }
                                       }
                            
                                                                                
                           }
                    }
    }


    /*if(formName=="data")
    {
         $("#CiteCommaStart").html("");
         $("#CiteRecord").html("");
         $("#CitePublication").html("");
         $("#CiteDescriptor").html("");
         $("#CitePublisher").html("");
         $("#CitePlace").html("");
         $("#CiteIssue").html("");
         $("#CiteDate").html("");
         $("#CiteBracketStart").html("");
         $("#CiteBracketEnd").html("");
            
        var arr = document.forms["publication"].elements;
                    
                for (var i = 0; i < arr.length; i++) {
                  var el = arr[i];
                   var cmBtnId=el.getAttribute("id");
                   var cmBtnType=el.getAttribute("type");
                   var val=el.value.trim();
                   if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='')
                       {
                           if($(elem).attr("id" )=="internet" ){
                               
                               if(cmBtnId=="record" || cmBtnId=="publication" || cmBtnId=="accessed" || cmBtnId=="http")
                               {
                                   eval(el.getAttribute('onkeyup'));
                               }
                               
                           }
                           else
                               {
                        
                                    if(cmBtnId=="descriptor" || cmBtnId=="publisher" || cmBtnId=="place" || cmBtnId=="issue" || cmBtnId=="date")
                                    {
                                        eval(el.getAttribute('onkeyup'));
                                    }
                        
                               }                                              
                       }
                }
            
    }*/

    //generateFootNote();
}
function chkBookPeri(elem)
{
    var group = document.publication.bookPeriChk;
    for (var i=0; i<group.length; i++) {
        if (group[i] != elem) {
            group[i].checked = false;
        }
    }
    elem.checked=true;
    
    if(elem.value=="book")
        {
            $(".showOnReset").show();
            $(".hideOnReset").hide();
            $("#CiteVolume").html('');
            $("#CiteIssue").html('');
        }
        else
        {
            $(".showOnReset").hide();
            $(".hideOnReset").show();
            $("#CiteEd").html('');
            $("#CiteEditor").html('');
            $("#VirCiteEditor").html('');
            $("#CitePlace").html('');
            $("#CiteEditor").html('');
            $("#CitePublisher").html('');
            $("#CiteEdition").html('');
        }
        
        var arr = document.forms["publication"].elements;
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
               var patt12 = new RegExp(/^[editor]+[2-9]$/);
               if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='')
                   {
                       if(elem.value=="book")
                           {
                               if(cmBtnId=='editor' || patt12.test(cmBtnId)==true || cmBtnId=='place' || cmBtnId=="volume" || cmBtnId=="edition" || cmBtnId=='publisher')
                                {
                                    eval(el.getAttribute('onkeyup'));
                                }
                           }
                           else
                               {
                                   if(cmBtnId=="volume" || cmBtnId=="issue")
                                    {
                                        eval(el.getAttribute('onkeyup'));
                                    }
                               }
                       if(cmBtnId=="accessed" || cmBtnId=="http" || cmBtnId=="year" || cmBtnId=="page")
                           {
                               eval(el.getAttribute('onkeyup'));
                           }
                   }
            }
}

function websiteWebpageChk(elem)
{
    var group = document.publication.websiteChk;
    for (var i=0; i<group.length; i++) {
        if (group[i] != elem) {
            group[i].checked = false;
        }
    }
    elem.checked=true;
    
    ReloadTextDiv2('chapter','CiteChapter');
}


function mainCitationOnlyText(textName){
   var secName=getSectionName();
   
   
        var doNothingFlag=false;
        inTextOnly=true;
      if(document.getElementById(textName).value.trim()=="")
          doNothingFlag=true;
     
        if(doNothingFlag==false)
       {
                        var globalAlertFlg=getGlobalLS('stopAlertFlagMainCite');
                        if(!document.mainciteOnly && globalAlertFlg!="set"){
                            
                         jAlertMod("Page number(s) will appear in the main citation only.\n\
                 \n\
                 <center><input type=\"checkbox\" onclick=\"setAlertFlag(this)\" id=\"stopAlertCheck\" /> Do not show this alert again.</center>","Alert","&nbsp;OK&nbsp;",function(){
                                         $("#"+textName).focus();
                                         document.mainciteOnly = true;
                                         if(stopAlertFlag==true)
                                         {
                                             setGlobalLS('stopAlertFlagMainCite','set');
                                         }
                                 });
                         }
        }
   
   
}


function chkUnchkBlogPage(elem){
    if(typeof elem != "undefined" && elem!='')
        {
            var group = document.publication.blog_page;
            for (var i=0; i<group.length; i++) {
                    if (group[i] != elem) {
                            group[i].checked = false;
                    }
            }
            //elem.checked=true;
        }
        
        if(typeof elem != "undefined" && elem.checked)
            {
                $("#frmt").hide();
                
            }
            else
                {
                    $("#frmt").show();
                }
        $("#descriptor").val('');
                $("#CiteDescriptor").html('');
                
                var str='';
                if(document.getElementById('publisher'))
                    {
                        str=$("#publisher").val().trim();
                        if(str!='')
                            {
                                str=ucFirstAllWords(str)+" ";
                            }
                    }
	if(document.getElementById('chk_page') && document.getElementById('chk_page').checked) //page
            {
                
                $("#rerieved_chk_p").show();
                $("#CiteDescriptor").html(" ["+str+"Page].");
            }
            else if(document.getElementById('chk_profile') && document.getElementById('chk_profile').checked) //page
            {
                
                $("#rerieved_chk_p").show();
                $("#CiteDescriptor").html(" ["+str+"Profile].");
            }
            else if(document.getElementById('chk_blog') && document.getElementById('chk_blog').checked) //post
                {
                    $("#ret_date").hide();
                    $("#CiteAccessed").html('');
                    $("#accessed").val('');
                    if(document.getElementById('rerievedChk'))
                    {
                        document.getElementById('rerievedChk').checked=false;
                    }
                    $("#rerieved_chk_p").hide();
                    $("#CiteDescriptor").html(" ["+str+"Post].");
                    
                }                
                else if(document.getElementById('chk_highlight') && document.getElementById('chk_highlight').checked)//highlight
                    {
                        $("#rerieved_chk_p").show();
                        
                        
                        showDiv("CiteDescriptor");
                        $("#CiteDescriptor").html(" ["+str+"Highlight].");
                    }
                    if(document.getElementById('http') && $("#http").val()!='')
                        {   
                            ReloadTextDiv2('http','CiteHttp');                        
                        }
}

function retrievedChk(elem)
{
    if(typeof elem != "undefined" && elem!='' && elem.checked==true)
        {
            $("#ret_date").show();
        }
        else
            {
                $("#ret_date").hide();
                    $("#CiteAccessed").html('');
                    $("#accessed").val('');
            }
            if(document.getElementById('http') && $("#http").val()!='')
                {   
                    ReloadTextDiv2('http','CiteHttp');                        
                }
}

function checkLawReportJuri(elem,which){
	var group = document.publication.law_juri;
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
    elem.checked=true;
    var val=elem.value;
    
    if(val=="supreme")
        {
            $("#juri_p").hide();
            $("#place").val('');
            if(getNextFilledDiv('CitePlace')!='')
                {
                $("#CitePlace").html(' U.S.');
                showDiv('CitePlace');
                }
        }
        else
            {
                $("#CitePlace").html('');
            }
            
            if(val=="circuit")
                {
                    $("#circuit_no_p").show();
                    $("#record").val('');
                    $("#juri_p").hide();
                    $("#place").val('');
                    $("#CitePlace").html('');
                    
                    $("#volume_no_p").show();
                    
                    $("#series_no_l").show();
                    $("#volume_no_l").hide();
                }
                else
                    {
                        $("#circuit_no_p").hide();
                        $("#record").val('');
                        $("#CiteRecord").html('');
                        
                        $("#volume_no_p").hide();
                        $("#CiteIssue").html('');
                        
                        $("#series_no_l").hide();
                    $("#volume_no_l").show();
                    }
            
            if(val=="district" || val=="state")
                {
                    
                    if(val=="state")
                        {
                            $("#state_reporter_name_p").show();
                            $("#district_name_p").hide();
                            $("#city").val('');
                            $("#CiteCity").html('');
                        }
                        else
                            {
                                $("#state_reporter_name_p").hide();
                                $("#subject").val('');
                                $("#CiteSubject").html('');
                                $("#district_name_p").show();
                                //$("#city").val('');
                            }
                    $("#volume_no_p").show();
                    $("#juri_p").hide();
                    $("#place").val('');
                    $("#CitePlace").html('');
                    $("#series_no_l").show();
                    $("#volume_no_l").hide();
                }
                else
                    {
                        $("#district_name_p").hide();
                        $("#city").val('');
                        $("#CiteCity").html('');
                        $("#state_reporter_name_p").hide();
                        $("#subject").val('');
                        $("#CiteSubject").html('');
                    }
                    
                    if(val=="other")
                        {
                            $("#juri_p").show();
                        }
            
    
    if($("#volume").val().trim()!='')
                {   
                    ReloadTextDiv2('volume','CiteVolume');
                    
                }
            
            ReloadTextDiv2('year','CiteYear','gov');
            formatSource();
}

function showHideJuri(elem)
{
    if(elem.checked)
        {
            $("#juri_p").hide();
            $("#issue").val('');
            $("#CiteIssue").html('');
        }
        else
            {
                $("#juri_p").show();
                $("#CiteIssue").html('');
            }
}

function showHideChamber(elem)
{
    var group = document.publication.legis_chamber;
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
    elem.checked=true;
    var val=elem.value;
    
    if(val!="Other" && val!="Parliament")
        {
            $("#chamber_p").hide();
            $("#issue").val('');
            $("#CiteIssue").html('');
            
            if((document.getElementById('chktestimony') && document.getElementById('chktestimony').checked==true)
                || (document.getElementById('chkreport') && document.getElementById('chkreport').checked==true))
                {
                    $("#title_p").hide();
                    $("#CiteTitle").html('');
                    $("#title").val('');
                }
            
            $("#hrs_p, #cfre_p, #bill_res_p, #congress_no_p").removeClass("hideme");
            
            $("#subdivision_p").hide();
            
            $("#source").val('');
            $("#CiteSource").html('');
        }
        else
            {
                
                $("#record").val('');
                $("#volume").val('');
                $("#CiteRecord").html('');
                $("#CiteVolume").html('');
            
                $("#title_p").show();
                $("#hrs_p, #cfre_p, #bill_res_p, #congress_no_p").removeClass("hideme");
                $("#hrs_p, #cfre_p, #bill_res_p, #congress_no_p").addClass("hideme");
                
                $("#chamber_p").show();
                $("#subdivision_p").show();
            }
            
            if(val=="Parliament")
                {
                    $("#congress_no_p").hide();
                    $("#volume").val('');
                    $("#CiteVolume").html('');
                }
                else
                    {
                        if(!document.getElementById('chkreport') || document.getElementById('chkreport').checked==false)
                            {
                                $("#congress_no_p").show();
                            }
                    }
            
            if(document.getElementById('volume') && $("#volume").val().trim()!='')
                {
                    ReloadTextDiv2('volume','CiteVolume','legislation');
                }
}

function getStNdRdTh(NewText)
{
    NewText=trim(NewText);
    
    if(NewText=='' || isNaN(NewText))
        {
            return '';
        }
        else
            {
                var intNewText=parseInt(NewText);
                
                if(intNewText>=11 && intNewText<20)
                    {
                        return 'th';
                    }
                else if (NewText.match(/1$/)!=null && NewText.match(/1$/)!='null')
                    return 'st';
                else if (NewText.match(/2$/)!=null && NewText.match(/2$/)!='null')
                    return 'nd';
                else if (NewText.match(/3$/)!=null && NewText.match(/3$/)!='null')
                    return 'rd';
                else
                    return 'th';
            }
}

function chkBillRepo(elem)
{
    var group = document.publication.chklegis;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
        var val='';
    //elem.checked=true;
    if(typeof elem != "undefined" && elem.checked)
        {
            var val=elem.value;
            
            if(val=="Regulation")
                {
                    $("#hrs_p").hide();
                    $("#cfre_p").show();
                    $("#congress_chk_p").hide();
                    chkCfre(document.getElementById('legi_cfr'));
                }
                else
                    {
                        
                        $("#exec_od_no_p").hide();        
                        $("#edition").val('');
                        $("#CiteEdition").html('');
                        $("#page_no_p").hide();
                        $("#page").val('');
                        $("#CitePage").html('');
                
                        $("#congress_chk_p").show();
                        $("#cfre_p").hide();
                        $("#cfr_no_l").hide();
                        $("#ser_no_l").hide();
                        $("#cong_ses_no_l").show();
                        
                        $("#chamber_p").hide();
                        $("#issue").val('');
                        $("#CiteIssue").html('');
                    }
            
            if(val=="Bill" || val=="Report" || val=="Resolution" || val=="Testimony")
                {
                    if(val!="Testimony")
                        {
                            $("#hrs_p").show();
                            $("#bill_res_p").show();
                            $("#testimony_p").hide();
                            $("#editor").val('');
                            $("#CiteEditor").html('');
                        }
                    if(val=="Report")
                        {
                            $("#bill_res_l").hide();
                            $("#report_no_l").show();
                        }
                        else if(val=="Testimony")
                            {
                                $("#hrs_p").hide();
                                $("#bill_res_p").hide();
                                $("#testimony_p").show();
                                $("#record").val('');
                                $("#CiteRecord").html('');
                            }
                        else
                            {
                                $("#bill_res_l").show();
                                $("#report_no_l").hide();   
                            }
                }
                else
                    {
                        $("#testimony_p").hide();
                        $("#hrs_p").hide();
                        
                        if(val=="Regulation")
                            {
                                $("#bill_res_p").show();
                            }
                            else
                                {
                                    $("#bill_res_p").hide();
                                }
                                
                        $("#editor").val('');
                            $("#CiteEditor").html('');
                            $("#record").val('');
                            $("#CiteRecord").html('');
                    }

             if(val=="Report")
             {
                 $("#congress_no_p").hide();
                 if(document.getElementById('legis_other') && document.getElementById('legis_other').checked)
                     {
                         $("#title_p").show();
                     }
                     else
                         {
                            $("#title_p").hide();
                            $("#CiteTitle").html('');
                            $("#title").val('');
                         }
                 $("#chamber_p").hide();
                 $("#CiteIssue").html('');
                 $("#CiteVolume").html('');
                 $("#volume").val('');
                 
             }
             else if(val=="Resolution")
                 {
                     if(document.getElementById('legis_other') && document.getElementById('legis_other').checked)
                     {
                         $("#title_p").show();
                     }
                     else
                         {
                            $("#title_p").hide();
                            $("#CiteTitle").html('');
                            $("#title").val('');
                         }
                     $("#congress_no_p").show();
                 }
             else
            {
             $("#congress_no_p").show();
             
             if(val!=="Regulation")
                 {
                    $("#chamber_p").show();             
                    $("#title_p").show();
                 }
            }
         
         ReloadTextDiv2('record','CiteRecord');
        }
        else
            {
                $("#bill_res_p").hide();
                $("#hrs_p").hide();
                $("#CiteRecord").html('');
                $("#congress_no_p").show();
                $("#title_p").show();
                $("#editor").val('');
                $("#CiteEditor").html('');  
                $("#testimony_p").hide();
                $("#editor").val('');
                $("#CiteEditor").html('');
                
                $("#ser_no_l").hide();
                $("#cong_ses_no_l").show();
                
                $("#exec_od_no_p").hide();        
                $("#edition").val('');
                $("#CiteEdition").html('');
                
                $("#page_no_p").hide();
                $("#page").val('');
                $("#CitePage").html('');
                $("#cfre_p").hide();
            }
            
            
            if(val=="Bill" || val=="Resolution")
                {
                    //$("#jurisdiction_l").show();
                    //$("#chamber_l").hide();
                    //$("#issue").attr("placeholder","jurisdiction");
                }
                else
                    {
                        //$("#jurisdiction_l").hide();
                        //$("#chamber_l").show();
                        //$("#issue").attr("placeholder","chamber");
                         
                    }
            
            if(val=="Regulation")
                {
                    $("#title_l").hide();
                    $("#title_no_l").show();                                        
                }
                else
                    {
                        $("#title_l").show();
                        $("#title_no_l").hide();                        
                    }
                    
                    notCodifiedCommonTxt();
                    
                    $("#date_proposed_p").hide();
                        $("#date").val('');
                        $("#CiteDate").html('');
                        
                        document.getElementById('not_yet_codified').checked=false;
                        
                        $("#CiteCommaStart").html('');
                        $("#CiteCommaEnd").html('');
                        
            
            if($("#title").val().trim()!='')
                {
                    ReloadTextDiv2('title','CiteTitle');
                }
                else
                    {
                        document.getElementById('CiteTitle').style.fontStyle='italic';
                    }
            
            if(document.getElementById('legis_congress'))
                {
                    showHideChamber(document.getElementById('legis_congress'));
                }
}

function chkHrs(elem)
{
    var group = document.publication.legi_hrs;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
    ReloadTextDiv2('title','CiteTitle');
    ReloadTextDiv2('record','CiteRecord');
}

function chkNumCircuit(field,divelem) {
        var num = document.getElementById(field).value;
       var formName=getCleanedFormName();
       
       var errorFlag=false;
       var intNum=parseInt(num);
       if(isNaN(num) || intNum<1 || intNum>12)
           {
               errorFlag=true;
           }
      
    if(errorFlag==true)
    {
		jAlertMod1("Please enter a number between 1 and 12.","Alert","&nbsp;OK&nbsp;",function(c1){
		if(c1)
		{
			document.getElementById(divelem).innerHTML = "";
			document.getElementById(field).value = '';
			document.getElementById(field).focus();
                        if(formName=="law_reports")
                            {   
                                ReloadTextDiv2('year','CiteYear','gov');                                
                            }
			return false;
		}});
    }
	
}

function processDistrictName(NewText)
{
    var str='';
    if(NewText!='')
        {
            NewText = ucFirstAllWords(NewText);
            var flg=false;
            var arr=NewText.split(' ');
            var i=0;
            
            for(i=0;i<arr.length;++i)
                {
                    if(arr[i].length==1 && flg!=true)
                        {
                            str+=arr[i]+'.';
                        }
                        else
                            {
                                flg=true;
                                str+=' '+arr[i];
                            }
                }
        }
        return str.trim();
}


function formatSource()
{
    var formName=getCleanedFormName();
    if(formName=="law_reports")
        {
            if(document.getElementById('law_supreme') && document.getElementById('law_supreme').checked)
                {
                    if($("#source").val()=='')
                        {
                            showDiv('CiteSource');
                            $("#CiteSource").html(" ___");
                        }
                }
                else if($("#source").val()=='')
                    {
                            $("#CiteSource").html("");
                    }
                
        }
}

function checkhsc(which){
	var group = document.publication.chkparl;
	for (var i=0; i<group.length; i++) {
		if (group[i] != which) {
			group[i].checked = false;
		}
	}
        which.checked=true;
        
        var prevChecked=$("#previousChecked").val();
        
	if($(which).val()=="hsc" && prevChecked!="hsc"){
            $("#volume_no_p").hide();
            $("#page_column_no_p").hide();
            $("#pageBook").val('');
            $("#volume").val('');
            $("#CitePage").html('');
            $("#CiteVolume").html('');
            $("#section_p").show();
            $("#section_l").show();
            $("#public_law_no_l").hide();
            $("#column_no_chk").hide();
            $("#title_no_p").show();
            $("#issue").val('');
            $("#CiteIssue").html('');
            $("#chamber_house_p").hide();
            $("#source").val('');
            $("#CiteSource").html('');
            $("#debate_proceed_p").hide();
            document.getElementById('clmchk').checked=false;
            chkdebateprocfun();
            
	}else if($(which).val()=="hansard" && prevChecked!="hansard"){
		$("#volume_no_p").show();
                $("#page_column_no_p").show();
                $("#section_p").hide();
                $("#title_no_p").hide();
                $("#record").val('');
                $("#issue").val('');
                
                $("#CiteRecord").html('');
                $("#CiteIssue").html('');
                $("#column_no_chk").show();  
                
                $("#pageBook").val('');
                $("#CitePage").html('');
                
                $("#volume").val('');
                $("#CiteVolume").html('');
                
                $("#section_l").show();
                $("#public_law_no_l").hide();
                
                $("#volume_no_l").show();
                $("#statue_no_l").hide();
                
                $("#page_column_l").show();
                $("#page_no_l").hide();
                
                $("#chamber_house_p").show();
                $("#debate_proceed_p").show();
	}
        else if($(which).val()=="publiclaw" && prevChecked!="publiclaw")
            {
                $("#volume_no_p").show();
                $("#page_column_no_p").show();
                $("#section_p").show();
                $("#issue").val('');
                $("#CiteIssue").html('');
                $("#title_no_p").hide();
                $("#record").val('');
                $("#CiteRecord").html('');
                document.getElementById('clmchk').checked=false;
                $("#column_no_chk").hide();
                
                $("#pageBook").val('');
                $("#CitePage").html('');
                
                $("#volume").val('');
                $("#CiteVolume").html('');
                
                $("#section_l").hide();
                $("#public_law_no_l").show();
                
                $("#volume_no_l").hide();
                $("#statue_no_l").show();
                
                $("#page_column_l").hide();
                $("#page_no_l").show();
                
                $("#chamber_house_p").hide();
                $("#source").val('');
                $("#CiteSource").html('');
                
                $("#debate_proceed_p").hide();
                chkdebateprocfun();
                
            }
        $("#previousChecked").val($(which).val());
        ReloadTextDiv2('record','CiteRecord');
}

function chkdebateprocfun(elem)
{
    var group = document.publication.chkdebateproc;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
        
        var tmp='';
        
      if(typeof elem != "undefined" && elem.checked==true)
      {
          if(elem.value=="debates")
              {
                  tmp=' Parliamentary Debates.';
              }
              else
                  {
                      tmp=' Record of Proceedings.';
                  }
                  
                  $("#name_of_act_l").hide();
                  $("#jurisdiction_l").show();
                  $("#chapter").attr('placeholder','jurisdiction');
                  $("#optTxt").show();
      }
      else
          {
              tmp='';
              $("#name_of_act_l").show();
              $("#chapter").attr('placeholder','name of act');
                  $("#jurisdiction_l").hide();
                  $("#optTxt").hide();
          }
          if(tmp!='')
              {
                  showDiv('CiteDescriptor');
              }
              else
                  {
                    hideDiv('CiteDescriptor');
                  }
                  
                  
                  $("#CiteDescriptor").html(tmp);
}

function chkCfre(elem)
{
    var group = document.publication.legi_cfre;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
        elem.checked=true;
        var val='';
        if(elem.checked)
            {
                val=elem.value;
            }
            
            /*if(document.getElementById('legi_cfr') && val=='')
                {
                    document.getElementById('legi_cfr').checked=true;
                }*/
            
            $("#chamber_p").hide();
            $("#issue").val('');
            $("#CiteIssue").html('');
            if(val=="Executive")
                {
                    $("#exec_od_no_p").show();
                    $("#title_p").hide();
                    $("#title").val('');
                    $("#CiteTitle").html('');
                    
                    $("#ser_no_l").hide();
                    $("#cong_ses_no_l").show();
                    $("#congress_no_p").hide();
                    
                    $("#volume").val('');
                    $("#CiteVolume").html('');
                    
                    $("#page_no_p").show();
                    
                        
                      $("#date_proposed_p").hide();
                        $("#date").val('');
                        $("#CiteDate").html('');
                        
                        document.getElementById('not_yet_codified').checked=false;  
                        
                }
                else
                    {    
                        $("#title_p").show();
                        $("#exec_od_no_p").hide();
                        $("#edition").val('');
                        $("#CiteEdition").html('');
                        
                        $("#cfr_no_l").show();
                        $("#bill_res_l").hide();
                        $("#report_no_l").hide();

                        $("#ser_no_l").show();
                        $("#cong_ses_no_l").hide();
                        $("#congress_no_p").show();

                        $("#record").val('');
                        $("#volume").val('');
                        $("#CiteRecord").html('');
                        $("#CiteVolume").html('');
                        
                        $("#page_no_p").hide();
                        $("#page").val('');
                        $("#CitePage").html('');
                        
                    }
                    
                    
                    notCodifiedCommonTxt();
                    
                    
                    if($("#record").val().trim()!='')
                        {   
                            ReloadTextDiv2('record','CiteRecord');                            
                        }
}

function clearDigitalProDir(elem){
    
        var authCnt=getFilledAuthorCount()
        var substr='';
        if(elem.checked==true)
            {
                if(authCnt==1)
                    {
                        substr=' (Director).';
                    }
                    else if(authCnt>1)
                        {
                    substr=' (Directors).';
                }
            }
                
                $("#CiteEd").html(substr);
}

function checkDigitalSound(elem)
{
 
    var group = document.publication.digital_sound;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
        
    formatSoundRecording();
        
}

function checkShowHideVol(elem)
{
  if(elem.checked)
  {
      $("#volume_p").show();
  }
  else
      {
          $("#volume_p").hide();
          $("#volume").val('');
          $("#CiteVolume").html('');
      }
}

function formatLectTitle(elem)
{
    if(elem.checked==true)
        {
            $("#description_p").hide();
            $("#descriptor").val('');
            $("#CiiteDescriptor").html('');
        }
        else
            {
                $("#description_p").show();
            }
       if($("#title").val().trim()!='')
       {   
           ReloadTextDiv2('title','CiteTitle');           
       }
}

function chkTvEpisode(elem,flg)
{
    if(typeof flg =="undefined")
        {
            var flg=false;
        }
 
    var group = document.publication.tv_ep;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
      elem.checked=true;
      
      if(elem.value=="series")
          {
              $("#writer_p").hide();
              $("#author").val('');
              $("#writer_chk_p").hide();
              $("#authorSec").hide();
              $("#authorSec").html('');
              $("#add_writer_link").hide();
              
              $("#director_p").hide();
              $("#revauthor").val('');
              $("#revauthorSec").hide();
              $("#revauthorSec").html('');
              $("#add_director_link").hide();  
              
              $("#session_p").hide();
              $("#edition").val('');
              $("#CiteEdition").html('');
              
              $("#episode_no_p").hide();
              $("#volume").val('');
              $("#CiteVolume").html('');
              
              $("#CiteCommaStart").html('');
              $("#CiteCommaStart").html('');
              
              ReplaceDottoComma('CiteEdition','');
              
              var htm=$("#producer_block").html();
              htm=htm.replace("'bookPanel',24","'bookPanel',1");
              $("#sc2").after('<div id="producer_block_1">'+htm+'</div>');              
              $("#producer_block").remove();
              
              var i=1;
              $('#producer_block_1 input[type=text]').each(function(index){
                  $(this).attr('tabindex',i);
                  i++;
              });
              
          }
          else
              {
                  
                    $("#writer_p").show();
                    $("#writer_chk_p").show();
                    $("#authorSec").show();
                    $("#add_writer_link").show();
                    
                    $("#session_p").show();
                    $("#episode_no_p").show();

                    $("#director_p").show();
                    $("#revauthorSec").show();
                    $("#add_director_link").show();
                    if(document.getElementById('producer_block_1'))
                        {
                            var htm=$("#producer_block_1").html();
                            htm=htm.replace("'bookPanel',1","'bookPanel',24");
                            if(typeof htm !="undefined")
                                {
                                     $("#frmt").after('<div id="producer_block">'+htm+'</div>');
                                }
                            $("#producer_block_1").remove();
                        }
                    var i=23;
                    $('#producer_block input[type=text]').each(function(index){
                  $(this).attr('tabindex',i);
                  i++;
              });
                    
                  
              }
              
              Reset(srcVar);
              if(flg==false)
                  {
              var arr = document.forms["publication"].elements;
                        
                    for (var i = 0; i < arr.length; i++) {
                      var el = arr[i];
                       var cmBtnId=el.getAttribute("id");
                       var cmBtnType=el.getAttribute("type");
                       var val=el.value.trim();
                       if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='')
                           {                       
                            
                                eval(el.getAttribute('onkeyup'));
                                                                                
                           }
                    }
                  }
}


function chkAlbumTrack(elem,flg)
{
    if(typeof flg =="undefined")
        {
            var flg=false;
        }
 
    var group = document.publication.digital_album;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
      elem.checked=true;
      if(elem.value=="album")
          {
              $("#track_ttl_p").hide();
              $("#chapter").val('');
              $("#CiteChapter").html('');
              $("#audio_sound_p").hide();
              ReloadTextDiv2('chapter','CiteChapter','on');
          }
          else
              {
                $("#track_ttl_p").show();
                $("#audio_sound_p").show();
              }
    formatSoundRecording();
}

function chkNotCodified(elem)
{
    if(elem.checked)
        {
            $("#date_proposed_p").show();
            $("#year_p").hide();
            $("#year").val('');
            $("#CiteYear").html('');
        }
        else
            {
                $("#year_p").show();
                $("#date_proposed_p").hide();
                $("#date").val('');
                $("#CiteDate").html('');
            }
            
            ReloadTextDiv2('record','CiteRecord');
}

function notCodifiedCommonTxt()
{
    if(document.getElementById('chkregulation') && document.getElementById('chkregulation').checked &&
            document.getElementById('legi_cfr') && document.getElementById('legi_cfr').checked)
                        {
                            $("#not_yet_codified_p").show();
                        }
                        else
                            {
                                $("#not_yet_codified_p").hide();
                            }
                    
                    
                    
}

function showHideSymposium(elem)
{
    if(elem.checked)
        {
            if($("#CiteTitle").html().trim()!="")
                {
                    showDiv("CiteDescriptor");
                    $("#CiteDescriptor").html(" ["+elem.value+"]");
                    return false;
                }
        }
       
                $("#CiteDescriptor").html("");
          
            
}

function chkNotesSession(elem)
{
    
    var group = document.publication.notes_session;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
      elem.checked=true;
      
      if(elem.value=="session")
          {
              $("#conference_session_p").show();
              $("#city_state_p").show();
              $("#page_no_p").hide();
              $("#page").val('');
              $("#CitePage").html('');
              showHideConfSession();
              $("#editor_chk_p").hide();
          }
          else
              {
                $("#CiteRecord").html('');
                $("#CiteCity").html('');
                $("#city").val('');
                $("#page_no_p").show();
                $("#conference_session_p").hide();
                $("#city_state_p").hide();                  
                $("#editor_chk_p").show();
              }
      
      ReloadTextDiv2('chapter','CiteChapter');
      ReloadTextDiv2('title','CiteTitle');
}

function showHideConfSession()
{
    if(document.getElementById('chkConferenceSession') && document.getElementById('chkConferenceSession').checked)
        {
            showDiv('CiteRecord');
            $("#CiteRecord").html(' [Conference session]');
        }
        else
            {
                $("#CiteRecord").html('');
            }
}

function cnShowHideFrmt(elem)
{
    if(typeof elem == "undefined")
        {
            $("#citeFormat").html('');
            $("#frmt").show();
        }
        else
            {
                if(elem.checked)
                    {
                        $("#frmt").hide();
                        $("#format").val('');
                        showDiv("citeFormat");
                        $("#citeFormat").html(' [Course notes]');
                    }
                    else
                        {
                            $("#citeFormat").html('');
                            $("#frmt").show();
                        }
            }
}

function dsShowHideFrmt(elem)
{
    if(typeof elem == "undefined")
        {
            $("#frmt").show();
        }
        else
            {
                if(elem.checked)
                    {
                        $("#frmt").hide();
                        $("#format").val('');
                        if($("#CiteTitle").html().trim()!='')
                            {
                                showDiv("citeFormat");
                                $("#citeFormat").html(' [Data Set]');
                                return;
                            }

                    }
                    else
                        {
                            $("#frmt").show();
                        }
            }
        
                $("#citeFormat").html('');
                
            
}

function unpulishedChkbx(elem)
{
    if(typeof elem == "undefined")
        {
            
        }
        else
            {
                if(elem.checked)
                    {
                        $("#data_title_p").hide();
                        $("#title").val('');
                        $("#CiteTitle").html('');
                        $("#description_l").show();
                        $("#format_l").hide();
                        dsShowHideFrmt();
                        $("#data_set_p").hide();
                        $("#ret_chk_p").show();
                            
                            ReloadTextDiv2('format','citeFormat');
                            
                            return;
                    }
                    

                        ReloadTextDiv2('format','citeFormat');
            }
            
            $("#data_title_p").show();
                            $("#description_l").hide();
                            $("#format_l").show();
                            $("#data_set_p").show();
              
                            if(document.getElementById('rerievedChk'))
                            {
                                document.getElementById('rerievedChk').checked=false;
                            }
                            $("#CiteAccessed").html('');
                            $("#accessed").val('');
                            $("#ret_chk_p").hide();
                            $("#ret_date").hide();
}

function showHideDbRecord(elem)
{
    if(elem.checked)
        {
            showDiv('citeFormat');
            $("#citeFormat").html(' [Database record]');
        }
        else
            {
                $("#citeFormat").html('');
            }
}

function showHideFrmt(fldId,divId,elem)
{
    var prevDiv=getPreviousFilledDiv(divId);
    if(elem.checked)
        {
            $("#frmt").hide();
            $("#"+fldId).val('');
            $("#"+divId).html('');
            if(prevDiv!='')
                {
                    $("#"+divId).html(" "+elem.value+".");
                    showDiv(divId);
                }
        }
        else
            {
                $("#frmt").show();
                $("#"+fldId).val('');
                $("#"+divId).html('');
            }
}

function showHideEdtr(elem)
{
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#editorSec").show();
            $("#editor_p,#editorp,#editchkp,#rev_aut_p,#revauthorSec,#rev_edi_chk_p").show();
            $("#add_editor_p,#addEditdiv").show();
            $("#sc2").show();
            
            $("#andEditor_p").show();
           
        }
        else
            {
                $("#revauthorSec,#editorSec").html('');
                $("#revauthorSec,#editorSec").hide();
                $("#editor_p,#editorp,#editchkp,#rev_aut_p,#rev_edi_chk_p").hide();
                $("#VirCiteEditor,#CiteRevAuthor").html('');
                $("#CiteEditor,#CiteRevAuthor").html('');
                $("#add_editor_p,#addEditdiv").hide();
                $("#sc2").hide();
                $("#CiteEd,#CiteRevAuth").html('');
                
                $("#andEditor_p").hide();
                
                $("#revauthor,#editor").val('');
                
                if(document.getElementById('revauthor'))
                    {
                        var el=document.getElementById('revauthor');
                        eval(el.getAttribute('onkeyup')); 
                    }
            }
}

function showHideVolume(elem)
{
    var formName=getCleanedFormName();
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#volume_p").show();
        }
        else
            {
                
                $("#volume").val('');
                $("#CiteVolume").html(''); 
                if(document.getElementById('volume'))
                    {
                        var el=document.getElementById('volume');
                        eval(el.getAttribute('onkeyup')); 
                    }
                $("#volume_p").hide();
            }
}

function showHideIssue(elem)
{
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#issue_p").show();
        }
        else
            {
                $("#issue").val('');
                $("#CiteIssue").html('');
                var el=document.getElementById('issue');
                eval(el.getAttribute('onkeyup'));
                $("#issue_p").hide();
            }
}

function showHideEdition(elem)
{
     if(document.getElementById('chkReprint'))
                {
                    document.getElementById('chkReprint').checked=false;
                    showHideOrigYear(document.getElementById('chkReprint'));
                }  
                
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#edition_p").show();
            $("#ednRevFac_p").show();
            $("#reprint_chk_p").show();
            console.log('here');
        }
        else
            {
                $("#edition").val('');
                $("#CiteEdition").html('');
                $("#ednRevFac_p").hide();
                    console.log('there');           
                var el=document.getElementById('edition');
                eval(el.getAttribute('onkeyup')); 
                
                $("#edition_p").hide();
                $("#reprint_chk_p").hide();
                
            }
            
            
}


function chngEditChair(elem)
{
    var editorCnt=getFilledEditorCount();
    var plcHl='';
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#chair_l").hide();
            $("#editor_l").show();
            $("#addChairDiv").hide();
            $("#addEditorDiv").show();
            plcHl='editor';
            console.log('aa1');
        }
        else
            {
                $("#chair_l").show();
                $("#editor_l").hide();
                $("#addChairDiv").show();
                $("#addEditorDiv").hide();
                plcHl='chair';
                console.log('aa2');
            }
            console.log('plcHl',plcHl);
            $("#editor").attr("placeholder",alphabets[0]+' '+plcHl);
            
            var i=1;
            for(i=1;i<=editorCnt;++i)
                {
                    var j=0;
                    if(i==1)
                        {
                            j='';
                        }
                        else
                            {
                                j=i;
                            }
                            $("#editor"+j).attr("placeholder",alphabets[i-1]+' '+plcHl);
                            if(i>1)
                                {
                                    var htm=$("#editor"+j).parent().parent().children("label").html();
                                    htm=htm.replace("editor",plcHl).replace('chair',plcHl);
                                    $("#editor"+j).parent().parent().children("label").html(htm);
                                }
                }
                var myTitle=getChairEditorTxt();
                $("#CiteEd").html(myTitle);
                var firstFieldId=$(".cssform input:text").first().attr('id');
                if(firstFieldId=="author" && editorCnt>0)
                    {
                        console.log('11');
                        authorCnt=getFilledAuthorCount();
                        if(authorCnt<=0)
                            {
                                console.log('22');
                                if(document.getElementById('editor'))
                                {
                                    console.log('33');
                                    var el=document.getElementById('editor');
                                    eval(el.getAttribute('onkeyup'));
                                }
                            }
                    }
                
}

function getChairEditorTxt()
{
    var myTitle='';
    if(getFilledEditorCount()>0)
        {
            myTitle=" (Chair).";
            if(getFilledEditorCount()>1)
            {
                myTitle=" (Chairs).";
            }
            if(document.getElementById('chkNotes') && document.getElementById('chkNotes').checked 
                    && document.getElementById('chkConfEditor') && document.getElementById('chkConfEditor').checked)
                {
                    myTitle=" (Ed).";
                    if(getFilledEditorCount()>1)
                    {
                        myTitle=" (Eds).";
                    }
                }
        }
        return myTitle;
}

function chkPresentationFrmt(elem)
{
  var group = document.publication.power_video;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
 showHideFrmt('descriptor','CiteDescriptor',elem);        
}

function showHidePresenIntChk(elem)
{
    if(elem.value=="print")
        {
            chkPresentationFrmt(document.getElementById('chkPowerPnt'));
            $('#span_video_chk').hide();
            document.getElementById('chkTedConferences').checked=false;
            $("#CiteSource").html('');
            $("#CiteTitle").html('');
            $("#ted_conf_p").hide();
            $("#venue_p").show();
            $("#place_p").show();
            $("#event_title_p").show();
        }
        else
            {
                document.getElementById('span_video_chk').style.display='inline-block';
                $("#ted_conf_p").show();
                $("#venue_p").hide();
                $("#place_p").hide();
                $("#publisher").val('');
                $("#city").val('');
                $("#CitePublisher").html('');
                $("#CiteCity").html('');
            }
}

function showHideLectIntChk(elem)
{
    if(elem.value=="print")
        {
            document.getElementById('chkTedConferences').checked=false;
            $("#ted_conf_p").hide();
        }
        else
            {
                $("#ted_conf_p").show();
            }
            showHideTedConferencesLect(document.getElementById('chkTedConferences'));
}

function showHideTedConferences(elem)
{
    if(elem.checked)
        {
            $("#event_title_p").hide();
            $("#title").val('');
            showDiv("CiteTitle");
            document.getElementById('CiteTitle').style.fontStyle="normal";
            showDiv("CiteSource");
            $("#CiteSource").html(' Presented at');
            $("#CiteTitle").html(' TED Conferences.');
        }
        else
            {
                $("#event_title_p").show();
                $("#CiteSource").html('');
                $("#CiteTitle").html('');
            }
}

function showHideTedConferencesLect(elem)
{
    var formName=getCleanedFormName();
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#description_p").hide();
            $("#descriptor").val('');
            showDiv("CiteDescriptor");
            $("#CiteDescriptor").html(' TED Conferences.');
            if(formName!='video')
                {
                    $("#department_p").hide();
                    $("#institution_p").hide();
                    $("#publisher").val('');
                    $("#city").val('');
                    $("#CitePublisher").html('');
                    $("#CiteCity").html('');
                }
        }
        else
            {
                $("#description_p").show();
                $("#CiteDescriptor").html('');
                if(formName!="video")
                    {
                        $("#department_p").show();
                        $("#institution_p").show();
                    }
            }
}

function showHideOrigYear(elem)
{
    if(typeof elem != "undefined" && elem.checked)
        {
            $("#original_pear_p").show();
            
            if(document.getElementById('transSpecial'))
                {
                    
                }
                else
                    {
                        $("#edition").val('');
                        $("#CiteEdition").html('');
                        var el=document.getElementById('edition');
                        eval(el.getAttribute('onkeyup'));

                        $("#edition_p").hide();
                    }
            
        }
        else
            {
                $("#original_pear_p").hide();
                
                            $("#original_year").val('');
                            $("#CiteOriginalYear").html('');
                if(document.getElementById('transSpecial'))
                    {
                        
                    }
                    else
                        {
                            $("#edition_p").show();
                        }
            }
}


function showHideVolIss(elem)
{
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#volume_p").show();
            $("#issue_p").show();
        }
        else
            {
                $("#volume").val('');
                $("#issue").val('');
                $("#CiteVolume").html('');
                $("#CiteIssue").html('');
                
           if(document.getElementById('volume'))
           {
                var el=document.getElementById('volume');
                eval(el.getAttribute('onkeyup'));
           }
            
            if(document.getElementById('issue'))
                {
                    var el=document.getElementById('issue');
                    eval(el.getAttribute('onkeyup'));
                }
            
                
                $("#volume_p").hide();
                $("#issue_p").hide();
            }
}

function showHideWikipedia(elem)
{
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#publisher_p").hide();
            $("#title").val('');
            $("#CiteTitle").html('');
            showDiv("CiteTitle");
            showDiv("CiteIOn");
            $("#CiteTitle").html(" Wikipedia.");
            $("#CiteIOn").html(" In");
        }
        else
            {
                $("#CiteIOn").html('');
                $("#CiteTitle").html('');
                $("#publisher_p").show();
            }
}

function showInline(id)
{
    if(document.getElementById(id))
        {
            document.getElementById(id).style.display="inline-block";
        }
}

function eLocatorChk(elem)
{
    if(document.getElementById('pageJournal'))
        {
            if($("#pageJournal").val().trim()!='')
                {
                    ReloadTextDiv2('pageJournal','CitePage');
                }
        }
        /*if(typeof elem != "undefined" && elem.checked)
            {
                $("#article_no_p").show();
            }
            else
                {
                    $("#article_no_p").hide();
                    $("#role").val('');
                    $("#CiteRole").html('');
                }*/
}


function showHideRetDate(elem)
{
    if(document.getElementById('retrievedDate'))
        {
            if(document.getElementById("retrievedDate").checked==true)
                {
                    showDiv('CiteAccessed');
                    var currentDate=getCurrentDate();
                    $("#CiteAccessed").html(' Retrieved '+currentDate);
                    
                }
                else
                    {
                        $("#CiteAccessed").html('');
                    }
                    
                    ReloadTextDiv2('http','CiteHttp');
        }
}

function showHideUsername(elem)
{
    if(typeof elem !="undefined" && elem.checked==true)
        {
            $("#username_p").show();
        }
        else
            {
                $("#username_p").hide();
                $("#title").val('');
                $("#CiteTitle").html('');
            }
}

function showHidePageNo(elem)
{
    if(typeof elem !="undefined" && elem.checked)
        {
            $("#page_no_p").show();
        }
        else
            {
                $("#page_no_p").hide();
                $("#pageBook").val('');
                $("#CitePage").html('');
            }
}

function showHideFrmtWebinar(elem)
{
    if(typeof elem!="undefined" && elem.checked)
        {
            $("#frmt").hide();
            $("#descriptor").val('');
            $("#CiteDescriptor").html('');
            if($("#CiteTitle").html().trim()!='')
                {
                    var tmp=$("#CiteTitle").html().replace(/\.*\,*$/,"");
                    $("#CiteTitle").html(tmp);
                    $("#CiteDescriptor").html(" "+elem.value+".");
                    showDiv('CiteDescriptor');
                }
            
        }
        else
            {
                $("#frmt").show();
                $("#descriptor").val('');
                $("#CiteDescriptor").html('');
                if($("#CiteTitle").html().trim()!='')
                {
                    var tmp=$("#CiteTitle").html().replace(/\.*\,*$/,".");
                    $("#CiteTitle").html(tmp);
                }
            }
}

function formatSeasonEpNo()
{
    var season='';
    var epNo='';
    if(document.getElementById('CiteEdition'))
        season=$("#CiteEdition").html().replace("&nbsp;","").trim();
    if(document.getElementById('CiteVolume'))
        epNo=$("#CiteVolume").html().replace("&nbsp;","").trim();
    
    if(season!='')
        {
            season=season.replace(/\.*\,*$/,"");
        }
        
    if(epNo!='')
        {
            epNo=epNo.replace(/\.*\,*$/,"");
        }    
        
        if(season!='' || epNo!='')
            {
                $("#CiteCommaStart").html(" (");
                $("#CiteCommaEnd").html(")");
                showDiv("CiteCommaStart");
                showDiv("CiteCommaEnd");
            }
            else
                {
                    $("#CiteCommaStart").html("");
                    $("#CiteCommaEnd").html("");
                    hideDiv("CiteCommaStart");
                    hideDiv("CiteCommaEnd");
                }
            if(season!='' && epNo!='')
                {
                    season=season+",";
                    epNo=" "+epNo;
                }
                
                $("#CiteEdition").html(season);
                $("#CiteVolume").html(epNo);
                
}

function showHideConstitution(elem)
{
    var group = document.publication.constitution_frm;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
      elem.checked=true;
      var val=elem.value;
      if(val=="constitution")
          {
              addUnEu();
              $("#jurisdiction_chk_p").show();
              $("#uneu_chk_p").hide();
              $("#repealed_p").show();
              $("#section_p").show();
              $("#para_p").hide();
              $("#CiteIssue").html('');
              $("#issue").val('');
              $("#year_date_p").hide();
              $("#CiteDate").html();
              $("#date").val('');
              $("#jurisdiction_l").show();
              $("#chapter").attr('placeholder','jurisdiction');
              $("#convention_l").hide();
              $("#article_p").show();
          }
          else if(val=="charter")
              {
                  addUsAmend();
                  showHideRepealed();
                  $("#jurisdiction_chk_p").hide();
                  $("#uneu_chk_p").show();
                $("#repealed_p").hide();
                
                $("#year_repealed_p").hide();
                $("#year").val('');
                $("#CiteYear").html('');
                $("#section_p").hide();
                $("#volume").val('');
                $("#CiteVolume").html('');
                $("#para_p").show();
                $("#year_date_p").hide();
                $("#date").val('');
                $("#CiteDate").html('');
                
              $("#jurisdiction_l").show();
              $("#chapter").attr('placeholder','jurisdiction');
              $("#convention_l").hide();
              $("#article_p").show();
              }
              else if(val=="convention")
                  {
                      addUsAmend();
                      showHideRepealed();
                      addUnEu();
                      $("#jurisdiction_chk_p").hide();
                      $("#uneu_chk_p").hide();
                        $("#repealed_p").hide();
                        $("#year_repealed_p").hide();
                        $("#year").val('');
                        $("#CiteYear").html('');

                        $("#section_p").hide();
                        $("#volume").val('');
                        $("#CiteVolume").html('');

                        $("#para_p").hide();
                        $("#issue").val('');
                        $("#CiteIssue").html('');
                
                      $("#year_date_p").show();
                      
              $("#jurisdiction_l").hide();
              $("#convention_l").show();
              $("#chapter").attr('placeholder','convention name');
              $("#article_p").hide();
              $("#title").val('');
              $("#CiteTitle").html('');
                  }
                  
                  
                  var arr = document.forms["publication"].elements;
                        
                    for (var i = 0; i < arr.length; i++) {
                      var el = arr[i];
                       var cmBtnId=el.getAttribute("id");
                       var cmBtnType=el.getAttribute("type");
                       var val=el.value.trim();
                       if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='')
                           {                       
                            
                                eval(el.getAttribute('onkeyup'));
                                                                                
                           }
                    }
}

function addUsAmend(elem)
{
    /*var group = document.publication.us_amend;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}*/
        if(typeof elem !="undefined" && document.getElementById('chkUS') && document.getElementById('chkUS').checked)
            {
                $("#jurisdiction_p").hide();
            }
            else
                {
                    $("#jurisdiction_p").show();
                }
                
                if(document.getElementById('chapter'))
                {
                    var el=document.getElementById('chapter');
                    eval(el.getAttribute('onkeyup'));
                }
}

function addUnEu(elem)
{
    var group = document.publication.un_eu;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
        if(typeof elem !="undefined" && elem.checked)
            {
                $("#jurisdiction_p").hide();
            }
            else
                {
                    $("#jurisdiction_p").show();
                }
                
                if(document.getElementById('chapter'))
                {
                    var el=document.getElementById('chapter');
                    eval(el.getAttribute('onkeyup'));
                }
}

function showHideRepealed(elem)
{
    if(typeof elem != "undefined" && elem.checked)
        {
            $("#year_repealed_p").show();
        }
        else
            {
                if(document.getElementById('chkRepealed'))
                    {
                        document.getElementById('chkRepealed').checked=false;
                    }
                $("#year_repealed_p").hide();
                $("#year").val('');
                $("#CiteYar")
            }
}

function magNewsChk(elem)
{
  var group = document.publication.mag_news;
	for (var i=0; i<group.length; i++) {
		if (typeof elem=="undefined" || group[i] != elem) {
			group[i].checked = false;
		}
	}
 if(typeof elem != "undefined" && elem.checked)
 {
     $("#sectionTitleDiv").show();
     if(elem.value=="magazine")
         {
             $("#issueDiv").show();
             $("#volumeDiv").show();
             $("#yearPublishedDiv").hide();
             $("#year").val('');
             $("#CiteYear").html('');
             $("#datePublishedDiv").show();
             $("#newspaper-ttl-label").hide();
             $("#journal-ttl-label").hide();
             $("#magazine-ttl-label").show();
             if(document.getElementById('date'))
                 {
                     if($("#date").val().trim()!='')
                         {
                     var el=document.getElementById('date');
                    eval(el.getAttribute('onkeyup'));
                         }
                 }
         }
         else if(elem.value=="newspaper")
             {
                $("#issueDiv").hide();
                $("#volumeDiv").hide();
                $("#CiteIssue").html('');
                $("#CiteVolume").html('');
                $("#volume").val('');
                $("#issue").val('');
             $("#newspaper-ttl-label").show();
             $("#journal-ttl-label").hide();
             $("#magazine-ttl-label").hide();
             }
             
             if(document.getElementById('chkFormat'))
                 {
                    uncheckAllJournalChk(); 
                    checkchkabstract(document.getElementById('chkFormat'));
                 }
             $("#abstractChkDiv").hide();
             $("#onlineAppChk").hide();
             
 }
 else
     {
         $("#sectionTitleDiv").hide();
         $("#CiteDescriptor").html('');
         $("#descriptor").val('');
         $("#issueDiv").show();
         $("#volumeDiv").show();
         
         $("#datePublishedDiv").hide();
            $("#date").val('');
            $("#CiteDate").html('');
            $("#yearPublishedDiv").show();
            
            $("#abstractChkDiv").show();
            $("#onlineAppChk").show();
            
            
             $("#newspaper-ttl-label").hide();
             $("#journal-ttl-label").show();
             $("#magazine-ttl-label").hide();
     }
}

function uncheckAllJournalChk()
{
    if(document.getElementById('chkFormat'))
        {
            document.getElementById('chkFormat').checked=false;
        }
        if(document.getElementById('chkRecord'))
            {
                document.getElementById('chkRecord').checked=false;
            }
           if(document.getElementById('transSpecial'))
            {
                document.getElementById('transSpecial').checked=false;
            }
        if(document.getElementById('advance_online_app'))
        {
            document.getElementById('advance_online_app').checked=false;
            showHideAdvanceOnlinePub(document.getElementById('advance_online_app'));
        }
}
