var iRemoteNews = {
   userID: new Array(),
   user:"",
   firstTime : true,
   tvState : "List",
   myData :new Array(),
   firstData: ""
};


iRemoteNews.iRemoteInput=function(remoteString) {
	var oldTextList=null;
    
	var xmlDoc = sf.service.SmartRemote.parse(remoteString);
        $(xmlDoc).find("user_identifier").each(function() {
		if($(xmlDoc).find("user_identifier").length != 0) {
			var str = $(xmlDoc).find("user_identifier").text();
            iRemoteNews.user = str;
              if(iRemoteNews.userID.indexOf(str) < 0){ 
                    iRemoteNews.userID.push({id:str, state:"List", catId:0, newsId:0, watch:true});
                    
                    iRemoteNews.myData[(iRemoteNews.userID.length -1)] =  iRemoteNews.firstData; 
              }      
            }
            });
            
            $(xmlDoc).find("menu").each(function() {
		if($(xmlDoc).find("menu").length != 0) {
			var str = parseInt($(xmlDoc).find("menu").text());
            if(str == 0){
              Controller.mobileStart(Controller.categoryData[0], 0, iRemoteNews.user);
            }
             else if(str == 1){
           Controller.mobileStart(Controller.categoryData[1], 1, iRemoteNews.user);
            }
             else if(str == 2){
            Controller.mobileStart(Controller.categoryData[2], 2, iRemoteNews.user);
            }
            }});
            
            
             $(xmlDoc).find("title").each(function() {
            if($(xmlDoc).find("title").length != 0) {
			var str = $(xmlDoc).find("title").text();
            var splitArr = str.split("||");
            var indexTitle = parseInt(splitArr[0]);
            var indexCat = parseInt(splitArr[1]);
                for(var i=0; i<iRemoteNews.userID.length; i++){
                    if(iRemoteNews.user == iRemoteNews.userID[i].id){
                        break;
                    }
                }
                iRemoteNews.userID[i].newsId= indexTitle;
                iRemoteNews.userID[i].state= "Detail";
                iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.user);
            }});
            
          
            
             $(xmlDoc).find("button").each(function() {
                      for(var i=0; i<iRemoteNews.userID.length; i++){
                        if(iRemoteNews.user == iRemoteNews.userID[i].id){
                            break;
                        }           
                     }   
		if($(xmlDoc).find("button").length != 0) {
			var str = $(xmlDoc).find("button").text();                      
            if(str == "back"){
             if(iRemoteNews.userID[i].state== "Detail"){
                var catIndex = iRemoteNews.userID[i].catId;
                Controller.mobileStart(Controller.categoryData[catIndex], catIndex, iRemoteNews.user);
               }              
              else if(iRemoteNews.userID[i].state== "List"){   
                 var addDiv = "";
                var popupDiv = "<div id='popupBg' style='position:absolute; top:0px; left:0px; z-index:98;'><p></p></div><div id='popup'><img style='position:absolute; top:5%; left:5%; z-index:100; width:90%;height:90%;align:center;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/usa_popup_bg.png' /><div style='position:absolute; z-index:110; top:13%; left:10%;color:white; width:80%; text-align:center;'><br /><div style='position:relative; top:12%; width:80%; left:10%; color:#000000; background-color:#cccccc; text-align:center;' onclick='finishAll()'><b>Finish All User</b></div><div style='position:relative; top:17%; width:80%; left:10%; color:#000000; background-color:#cccccc; text-align:center;' onclick='finishMe()'><b>Finish only me</b></div><div style='position:relative; top:22%; width:80%; left:10%; color:#000000; background-color:#cccccc; text-align:center;' onclick='onClickClose()'><b>Cancel</b></div></div></div>";
               	var htmlData = sf.service.SmartRemote('getFile',"mobileHTML/news.html");
                  for(var idx=0; idx<iRemoteNews.userID.length; idx++){               
    
                            if(idx == i){
                              addDiv += "<div id='div"+(i+1)+"'>"+iRemoteNews.myData[i]+popupDiv+"</div>";
                            }                     
                      }
                htmlData = htmlData.replace("[$divZs$]", addDiv);
                  SendTiggerPlus("menu0", iRemoteNews.user, htmlData, "tag");                                    
                      
               } 
            }
                       
                else if(str == "prev"){
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    indexTitle--;
                    if(indexTitle < 0){
                        indexTitle = Controller.mobileArr[indexCat].length - 1;
                    }
                    iRemoteNews.userID[i].newsId = indexTitle;
                    iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.user);
                }
                
                 else if(str == "next"){
                    var indexCat = iRemoteNews.userID[i].catId;
                    var indexTitle = iRemoteNews.userID[i].newsId;
                    indexTitle++;
                    if(indexTitle > Controller.mobileArr[indexCat].length - 1){
                        indexTitle = 0;
                    }
                iRemoteNews.userID[i].newsId = indexTitle;
                iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.user);
            }
            
            else if(str == "watch"){
                var scene = sf.scene.get("Main");
                  scene.categoryIdx = iRemoteNews.userID[i].catId;
                  $('#MainCategoryList').sfList('move', iRemoteNews.userID[i].catId);
                delete scene.arrArticles;        
                Controller.arrArticles = Controller.mobileArr[iRemoteNews.userID[i].catId];
                sf.scene.get('Main').initMainpage(Controller.arrArticles);   
                sf.scene.focus('Main');
                Controller.start(Controller.categoryData[scene.categoryIdx]);
                $('#MainCategoryList').sfList('blur');
                 scene.arrList[scene.titleIdx].style.backgroundImage = "url(none)";
                scene.arrTitles[scene.titleIdx].style.color = "#eeeeee";
               scene.categoryFlag = false;
                scene.articleIdx = iRemoteNews.userID[i].newsId;
                scene.titleIdx = iRemoteNews.userID[i].newsId%7;
                scene.showTitleList(scene.articleIdx);
                $('#MainScroll').sfScroll('move', parseInt(scene.articleIdx/7));  
               sf.scene.hide('Main');
               sf.scene.show('Contents', {index: iRemoteNews.userID[i].newsId, array: Controller.mobileArr[iRemoteNews.userID[i].catId]});    // pass the index of articles and array contains article data.
                sf.scene.focus('Contents');
                 iRemoteNews.userID[i].watch = false;
                 var indexCat = iRemoteNews.userID[i].catId;
                var indexTitle = iRemoteNews.userID[i].newsId;
                 iRemoteNews.titleDetail(Controller.mobileArr[indexCat][indexTitle], iRemoteNews.user);
            }
            
            else if(str == "me")
            {
            var menuMeta = null;
                    menuMeta = {
                        type : "remote",
                        user_identifier : iRemoteNews.user
                    }
                    sf.service.SmartRemote.sendMenuItem(menuMeta);                  
                    iRemoteNews.myData.splice(i,1);
                    iRemoteNews.userID.splice(i,1);              
            }
            
            else if(str == "all"){
          var widgetAPI = new Common.API.Widget(); 
            widgetAPI.sendReturnEvent (); 
                  
                 }                        
            }});
                       
            }
            
iRemoteNews.sendCategoryInfo=function() {

	var menuMeta = new Array();
	menuMeta[0] = {
		identifier : "menu0",
		type : "webcontrol",
		title : "News Service",
        name : "News Service",
		icon : "example/f.png",
		onClick : "action?menu=0"
	}
	sf.service.SmartRemote.sendMenuItem(menuMeta);
}



iRemoteNews.sendCategoryData = function(arr, ind, userID){
    //var htmlData = sf.service.SmartRemote.readFile("mobileHTML/news.html");
	var htmlData = sf.core.readFile("mobileHTML/news.html");
    if(!userID){
        userID  = '';
    } 
    if(!ind){
        ind = 0;
    }    
    
    if(userID){
            for(var i=0; i<iRemoteNews.userID.length; i++){
                if(userID == iRemoteNews.userID[i].id){
                    break;
                }
            }
        
        iRemoteNews.userID[i].catId = ind;
         iRemoteNews.userID[i].state= "List";
          iRemoteNews.userID[i].watch= true; 
          var index = i;
     }   
        var catData = "";
    
        var firstMenuAction="getMenuAction("+0+")";
		var secMenuAction="getMenuAction("+1+")";
		var thirdMenuAction="getMenuAction("+2+")";
        
        if(ind == 0){
            firstMenuAction="";
        }
        else if(ind == 1){
             secMenuAction="";
        }
        else if(ind == 2){
            thirdMenuAction="";
        }
        
      	var catData="";
        catData += "<div id='headerTopId' style='width:100%; height:69px; position:absolute; top:0px;' ontouchend='touchEnd(2);' ontouchstart='touchMove(3);' ontouchmove='touchMove(3);'><table style='position:absolute; top:0px; width:100%;' cellpadding='0px' cellspacing='0px' border='0px'><tr height='69' style='position:absolute;top:0px;z-index:11; font-size:80%;'>";
        catData += "<td id='cat0' width='33%' style='height:69px; text-align:center; color:#ffffff;'onclick='"+firstMenuAction+"'>Coorporate</td>";
        catData += "<td width='2' style='background-color:#000000;'><p></p></td>";
        catData += "<td id='cat1' width='33%' style='height:69px; text-align:center; color:#ffffff;'onclick='"+secMenuAction+"'>Exhibition</td>";
        catData += "<td width='2' style='background-color:#000000;'><p></p></td>";
        catData += "<td id='cat2' width='33%' style='height:69px; text-align:center; color:#ffffff;'onclick='"+thirdMenuAction+"'>Product</td></tr>";                   
        catData += "<tr height='69' style='position:absolute; top:0px; z-index:10;'>";
        
        
        if(ind == 0)
        {
        catData += "<td  id='cat0text' style='text:align:center;'><img id='cat0image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_press.png' /></td>";
        catData += "<td width='2'><img style='width:2px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_line.png' /></td>";
        catData += "<td  id='cat1text' style='text:align:center;'><img id='cat1image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_bg.png' /></td>";
        catData += "<td width='2'><img style='width:2px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_line.png' /></td>";
        catData += "<td  id='cat2text' style='text:align:center;'><img id='cat2image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_bg.png' /></td></tr></table></div>";
        }
        else if(ind== 1)
        {
        catData += "<td  id='cat0text' style='text:align:center;'><img id='cat0image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_bg.png' /></td>";
         catData += "<td width='2'><img style='width:2px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_line.png' /></td>";
        catData += "<td  id='cat1text' style='text:align:center;'><img id='cat1image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_press.png' /></td>";
        catData += "<td width='2'><img style='width:2px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_line.png' /></td>";
        catData += "<td  id='cat2text' style='text:align:center;'><img id='cat2image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_bg.png' /></td></tr></table></div>";
        }
        else if(ind== 2)
        {
        catData += "<td  id='cat0text' style='text:align:center;'><img id='cat0image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_bg.png' /></td>";
        catData += "<td width='2'><img style='width:2px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_line.png' /></td>";
        catData += "<td  id='cat1text' style='text:align:center;'><img id='cat1image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_bg.png' /></td>";
        catData += "<td width='2'><img style='width:2px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_line.png' /></td>";
        catData += "<td  id='cat2text' style='text:align:center;'><img id='cat2image' style='width:100%; height:69px;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_5_press.png' /></td></tr></table></div>";
        }

  
  for(var i = 0 ;i < arr.length; i++){
            var correctTitle = arr[i].title.replace(/"/g,'&#34;');
            correctTitle = correctTitle.replace(/'/g,'&#39;');        
            catData += "<div style='width:100%;position:relative; top:69px; font-size: 80%; border-bottom:1px solid white' onclick='getTitleAction("+i+","+ind+")'>"+correctTitle+"</div>";
        }
        
        if(userID){
            iRemoteNews.myData[index] = catData;
        }
        else{
            iRemoteNews.firstData = catData;
        }
        
    htmlData = htmlData.replace("[$divZs$]", catData);
    SendTiggerPlus("menu0", userID, htmlData, "tag");
    
}





 iRemoteNews.titleDetail = function(arr, userID){
        var htmlData = sf.core.readFile("mobileHTML/news.html");
        for(var i=0; i<iRemoteNews.userID.length; i++){
            if(userID == iRemoteNews.userID[i].id){
                break;
            }
    }
    
     var correctTitle = arr.title.replace(/"/g,'&#34;');
     correctTitle = correctTitle.replace(/'/g,'&#39;');
     
     var correctDesc= arr.description.replace(/"/g,'&#34;');
     correctDesc = correctDesc.replace(/'/g,'&#39;');
      
        var prevAction="prev()";
        var nextAction="next()";
        var detailData = "<div id='id1' style='background-color:#000000; color:#ffffff;'>";
         detailData+="<div id='id2' style='background-color:#000000; color:#ffffff; background-image:url(/user/NewsTutorialWidget_540p/Resource/mobileImage/tab_sub_bg.png);width:100%;left:10%;'><table><tr style='color:#ffffff'><td><img id='prevImg1' style='display:block; height:40%;' src='/user/NewsTutorialWidget_540p/Resource/mobileImage/btn_arrow_left_nor.png'   onclick='"+prevAction+"' /> </td><td align='center'>"+correctTitle+"</td><td><img id='nextImg1' style='display:block; height:40%;'src='/user/NewsTutorialWidget_540p/Resource/mobileImage/btn_arrow_right_nor.png'   onclick="+nextAction+"></td></tr></table></div>";
         detailData += "<div style='text-align:justify;'>"+correctDesc+"</div></div>";

       var listScene = sf.scene.get("Main");
       var detailScene = sf.scene.get("Contents");
   
       if(iRemoteNews.tvState == "Detail" && listScene.categoryIdx == iRemoteNews.userID[i].catId && detailScene.contentsIdx == iRemoteNews.userID[i].newsId){
        iRemoteNews.userID[i].watch = false;
       }
       else{
         iRemoteNews.userID[i].watch = true;
       }
   
   if(iRemoteNews.userID[i].watch){
     detailData +="<div id='but' style='position:absolute; left:30%; '><INPUT type='button' style='align:center;' value='Watch in TV' onclick='watchInTv()' /></div><div id='but2'><INPUT type='button' style='display:none;background-image:url(/user/NewsTutorialWidget_540p/Resource/mobileImage/btn_257_sel.png) ;align:center;' value='Watch in TV'/></div>";
   }
     
    htmlData = htmlData.replace("[$divZs$]", detailData);
    
       SendTiggerPlus("menu0", userID, htmlData, "tag");
    
 }
 
 
 
 function SendTiggerPlus(menuID,userID, htmlData, tag) {
    var sendObject={
        webData:htmlData,
        menuId:menuID,
        userId :userID,
        backKey : (tag==null)?'':tag
    }
    sf.service.SmartRemote.webControl(sendObject);
}
 

 