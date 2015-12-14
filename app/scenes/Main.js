alert('SceneMain.js loaded');

function SceneMain() {
	this.titleIdx = 0;       // title index
 	this.articleIdx = 0;     // article index
	this.arrTitles = new Array();	// Array of Title Divs
  	this.arrList = new Array();      // Array of Title List Divs
   	this.title_max_num = 7;
   	this.arrArticles = [];
   	this.titlebar = null;
  
   	// category
   	this.categoryList = null;
   	this.categoryIdx = 0;    // category index (url)
   	this.categoryFlag = new Boolean(true);
   
   	// date
   	this.nowDate = new Date();
   	this.day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   	this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   
   	// page
   	this.totalPage = 0;
   	this.currentPage = 0;
   
   	// scroll
   	this.scroll = null; 
}

SceneMain.prototype.initialize = function () { 
	alert("SceneMain.initialize()");
	// this function will be called only once when the scene manager show this scene first time
	// initialize the scene controls and styles, and initialize your variables here 
	// scene HTML and CSS will be loaded before this function is called

    // Title Bar
    this.titlebar = document.getElementById("MainTitleBar");
    this.titlebar.innerHTML = "News Service";
    
    // Category List
    this.categoryList = document.getElementById("MainCategoryList");
    $('#MainCategoryList').sfList({
        data:[Controller.categoryData[0].name,Controller.categoryData[1].name,Controller.categoryData[2].name],
        itemsPerPage:3,
    });
    $('#MainCategoryList').sfList('focus');

    // date
    var mainDate = document.getElementById("MainDate");

    var date = this.day[this.nowDate.getDay()];
    date += ",  ";
    date += this.month[this.nowDate.getMonth()];
    date += "  ";
    date += this.nowDate.getDate();
    date += ",  ";
    date += this.nowDate.getFullYear();
    mainDate.innerHTML = date;
 
    // initialize sfKeyHelp
    $('#Mainkeyhelp').sfKeyHelp({
		'iconset' : 'WHITE',
        'leftright' : 'Category/List',
		'return': 'End'
	});
}

SceneMain.prototype.initMainpage = function (Array) { 
    this.arrArticles = Array;

    // total page
    this.totalPage = parseInt(((this.arrArticles.length - 1) / this.title_max_num) + 1); 
 
    // scroll
    this.scroll = document.getElementById("MainScroll");  
    this.adjustScrollBar();

    this.showMainpage(this.articleIdx);
}

SceneMain.prototype.handleShow = function (data) {
	alert("SceneMain.handleShow()");
    iRemoteNews.tvState = "List";
	// this function will be called when the scene manager show this scene 
    if(data) {
        this.blurTitle(this.titleIdx);
        this.articleIdx = data.Index;
         
        this.titleIdx = this.articleIdx%this.title_max_num;

        this.showTitleList(this.articleIdx - this.titleIdx);
        this.highlightTitle(this.titleIdx);
        this.adjustScrollBar();
    }
}

SceneMain.prototype.showMainpage = function (articleIndex) {
    // title
    this.showTitleList(articleIndex);
    if(this.categoryIdx == 0){
        Controller.mobileArr[0] = this.arrArticles;
     }
     if(iRemoteNews.firstTime){
        iRemoteNews.sendCategoryData(this.arrArticles);
        iRemoteNews.firstTime = false;
    }
}

SceneMain.prototype.showTitleList = function (index) {  // this index is starting index of articles shows firtst. 
    alert("SceneMain.showTitleList()");

    // page Number
    var showPage = document.getElementById("MainPageNumber");

    this.currentPage = parseInt(this.articleIdx / this.title_max_num);
    var page = this.currentPage + 1;
    page += "/";
    page += this.totalPage;
    showPage.innerHTML = page;

    for (var i=0; i < this.title_max_num; i++) {
        this.arrTitles[i] = document.getElementById("MainListTitle"+i);
        this.arrList[i] = document.getElementById("MainList"+i);
    }

    var article = null;
    
    for(var a = 0; a < this.title_max_num; a++) {
        article = this.arrArticles[index + a];
        if(article) {
            this.arrTitles[a].innerHTML = this.wrapInTable(article.title, "", "MainListTitle_style");
        }
        else {
            this.arrTitles[a].innerHTML = "";
        }
    }
}

SceneMain.prototype.wrapInTable = function (pStrContents, pStyle, pClass) {  // insert the contents in table
	var retValue = "";
	var strStyle = "";
	var strClass = "";
	if (pStyle) {
		strStyle = " style='" + pStyle + "' ";
	}
	if (pClass) {
		strClass = " class='" + pClass + "' ";
	}
	retValue += "<table cellpadding='0px' cellspacing='0px'>";
	retValue += "<tr>";
	retValue += "<td" + strStyle + strClass + ">";
	retValue += "<nobr>";
	retValue += pStrContents;
	retValue += "</nobr>";
	retValue += "</td>";
	retValue += "</tr>";
	retValue += "</table>";
	
	alert("SceneMain.wrapInTable() returns [" + retValue + "]");
	return retValue;
}

SceneMain.prototype.highlightTitle = function (index) {
    this.arrList[index].style.backgroundImage = "url(images/newsImg/left_category_highlight.png)"; 
    this.arrTitles[index].style.color = "#000000";
}

SceneMain.prototype.blurTitle = function (index) {

    this.arrList[index].style.backgroundImage = "url(none)";
    this.arrTitles[index].style.color = "#eeeeee";
}

SceneMain.prototype.adjustScrollBar = function () {
    alert("SceneMain.adjustScrollBar()");
    
    if(this.totalPage <= 1) {
    	this.hideScrollBar();
    }
    else {
    	this.showScrollBar();
    }
}

SceneMain.prototype.showScrollBar = function () {
    alert("SceneMain.showScrollBar()");
    $('#MainScroll').sfScroll({
        pages: this.totalPage
    });
    $('#MainScroll').sfScroll('move', 0);
    $('#MainScroll').sfScroll('show');
}

SceneMain.prototype.hideScrollBar = function () {
    alert("SceneMain.hideScrollBar()");
    $('#MainScroll').sfScroll('hide');
}


SceneMain.prototype.handleHide = function () {
	alert("SceneMain.handleHide()");
	// this function will be called when the scene manager hide this scene  
}

SceneMain.prototype.handleFocus = function () {
	alert("SceneMain.handleFocus()");
	// this function will be called when the scene manager focus this scene
}

SceneMain.prototype.handleBlur = function () {
	alert("SceneMain.handleBlur()");
	// this function will be called when the scene manager move focus to another scene from this scene
}

SceneMain.prototype.upArticle = function () {
    this.blurTitle(this.titleIdx);
    this.articleIdx--;
    this.titleIdx--;
    
    if(this.titleIdx < 0) {
        this.titleIdx = this.title_max_num - 1; 
        
        if(this.articleIdx < 0) {
            this.articleIdx = this.arrArticles.length - 1;  // move to last article
            this.titleIdx = this.articleIdx % this.title_max_num;  
        }
        this.showTitleList(this.articleIdx - this.titleIdx);
        $('#MainScroll').sfScroll('move', this.currentPage);            
    }
    this.highlightTitle(this.titleIdx);
}

SceneMain.prototype.downArticle = function () {
    this.blurTitle(this.titleIdx);
    this.articleIdx++;
    this.titleIdx++;
    if(this.articleIdx % this.title_max_num == 0 || this.articleIdx > this.arrArticles.length - 1) {  
        this.titleIdx = 0;
        
        if(this.articleIdx > this.arrArticles.length - 1) { // if last index is focused, move to first index.
            this.articleIdx = 0;
        }
        this.showTitleList(this.articleIdx);
        $('#MainScroll').sfScroll('move', this.currentPage);
    }            
    this.highlightTitle(this.titleIdx);
}

SceneMain.prototype.refreshCategory = function () {
    this.blurTitle(this.titleIdx);
    this.titleIdx = 0; 
    this.articleIdx = 0;    
    delete this.arrArticles;           
    Controller.start(Controller.categoryData[this.categoryIdx]);
}




SceneMain.prototype.handleKeyDown = function (keyCode) {
	alert("SceneMain.handleKeyDown(" + keyCode + ")");
	// TODO : write an key event handler when this scene get focued
	switch (keyCode) {
		case sf.key.LEFT:
            if(this.categoryFlag == false) {
                this.categoryFlag = true;
                $('#MainCategoryList').sfList('focus');
                this.blurTitle(this.titleIdx);
            }
			break;
		case sf.key.RIGHT:
            if(this.categoryFlag == true) {
                this.categoryFlag = false;
                $('#MainCategoryList').sfList('blur');
                this.highlightTitle(this.titleIdx);
            }
            else {
            	// change to the Contents scene
                sf.scene.hide('Main');
                Controller.showContents(this.articleIdx);
            }
            break;
		case sf.key.UP:
            if(this.categoryFlag == false) {
                this.upArticle();
            }
            else {   // If the focus move to category.   
                this.categoryIdx--;
                if(this.categoryIdx < 0) {
                    $('#MainCategoryList').sfList('move', 2);
                    this.categoryIdx = 2;
                }    
                else {
                    $('#MainCategoryList').sfList('prev');
                }
                this.refreshCategory();       
            }
            break;
		case sf.key.DOWN:
            if(this.categoryFlag == false) {
                this.downArticle();
            }
            else {   // If the focus move to category.        
                this.categoryIdx++;
                if(this.categoryIdx > 2) {
                    $('#MainCategoryList').sfList('move', 0);
                    this.categoryIdx = 0;
                }
                else {
                    $('#MainCategoryList').sfList('next');
                }  
                this.refreshCategory();    
            }
			break;
		case sf.key.ENTER:
            if(this.categoryFlag == false) {	// TitleList
                // change to the Contents scene
                sf.scene.hide('Main');
                Controller.showContents(this.articleIdx);
            }
            else {	// Category
            	this.categoryFlag = false;
                $('#MainCategoryList').sfList('blur');
                this.highlightTitle(this.titleIdx);
            }
			break;
		case sf.key.RETURN:
			if(this.categoryFlag == false) {
                this.categoryFlag = true;
                $('#MainCategoryList').sfList('focus');
                this.blurTitle(this.titleIdx);
                sf.key.preventDefault();    // Block default action of the RETURN key. Without this line, this application exits to Smart Hub.
            }
			break;
	}
}
