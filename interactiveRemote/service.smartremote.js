/*
 *  @author Samsung
 *  @Remark File Used to construct Interactive Feature
 */
 
(function($) {
    //Interactive Plugin Variable 
	var _g_tigger = {
		PL_APPCOMMON_MESSAGE_XML_INPUT : 46,
		pluginAppCommon : null
	};

	/*  
	 * @purpose function for sending items to smart device
	 * @param   type,itemObjArr ,menuID
	 * @return	
	 */
	
	$.sfSmartRemote = function(type, itemObjArr, menuID) {
		type = type.toLowerCase();
        //Initialization for Interactive Remote
		if (type =='init')
		{
			_g_tigger.pluginAppCommon = document.getElementById('pluginObjectAppCommon');
			_g_tigger.pluginAppCommon.OnMessage = itemObjArr;
			_g_tigger.pluginAppCommon.SubscribeEvent(_g_tigger.PL_APPCOMMON_MESSAGE_XML_INPUT);
		}
		//Destroying for Interactive Remote
		else if (type =='destroy')
		{
			_g_tigger.pluginAppCommon.UnsubscribeEvent(_g_tigger.PL_APPCOMMON_MESSAGE_XML_INPUT);
		}
		//parsing response received from smart device
		else if (type == 'parse' || type == 'parser') {	// change from 'parser'
			var str = itemObjArr;
			var rlt = str.split("/");
			var xmlData = rlt[1];
			for (i = 2; i < rlt.length; i++) {
				xmlData = xmlData + "/" + rlt[i];
			}
			if (window.DOMParser) {
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(xmlData, "text/xml");
			} else // Internet Explorer
			{
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(xmlData);
			}
			return xmlDoc;
		}
		
        //Sending SourceItem to Smart Device
		else if (type == 'source') {
			var xmlBufferData = "";
			xmlBufferData = makeSourceHeader(xmlBufferData, menuID);
			if (itemObjArr.constructor == Array) {
				for ( var i = 0; i < itemObjArr.length; i++) {
					xmlBufferData = makeSourceItem(xmlBufferData,
							itemObjArr[i].type, itemObjArr[i].typeDefault,
							itemObjArr[i].identifier, itemObjArr[i].title,
							itemObjArr[i].description, itemObjArr[i].image,
							itemObjArr[i].onClick, itemObjArr[i].onTrue,
							itemObjArr[i].onFalse, itemObjArr[i].multiTitles,
							itemObjArr[i].multiURLs, itemObjArr[i].typeVoice,
							itemObjArr[i].voiceSelect, itemObjArr[i].typeItems,
							itemObjArr[i].typeMode, itemObjArr[i].titlelinebreak,
							itemObjArr[i].desclinebreak, itemObjArr[i].multiIcons, 
							itemObjArr[i].multiTitlesHead, itemObjArr[i].multiURLsHead, 
							itemObjArr[i].multiSizeHead, itemObjArr[i].multiTitlesRow,
							itemObjArr[i].multiURLsRow, itemObjArr[i].multiSizeRow,
							itemObjArr[i].multiSelectFlag,
							itemObjArr[i].selectType,
							itemObjArr[i].selectflag);
				}
			} else {
					xmlBufferData = makeSourceItem(xmlBufferData, itemObjArr.type,
							itemObjArr.typeDefault, itemObjArr.identifier,
							itemObjArr.title, itemObjArr.description,
							itemObjArr.image, itemObjArr.onClick,
							itemObjArr.onTrue, itemObjArr.onFalse,
							itemObjArr.multiTitles, itemObjArr.multiURLs,
							itemObjArr.typeVoice, itemObjArr.voiceSelect,
							itemObjArr.typeItems, itemObjArr.typeMode,
							itemObjArr.titlelinebreak, itemObjArr.desclinebreak,
							itemObjArr.multiIcons, itemObjArr.multiTitlesHead,
							itemObjArr.multiURLsHead, itemObjArr.multiSizeHead,
							itemObjArr.multiTitlesRow, itemObjArr.multiURLsRow,
							itemObjArr.multiSizeRow, itemObjArr.multiSelectFlag,
							itemObjArr.selectType,itemObjArr.selectflag);
			}
			xmlBufferData = makeSourceFooter(xmlBufferData);
			_g_tigger.pluginAppCommon.SendEvent_XML_Sync(xmlBufferData);

		}
		
		//Sending MenuIterm to Smart Device
		else if (type == 'menu') {
			var xmlBufferData = "";
			xmlBufferData = makeMenuHeader(xmlBufferData);
			if (itemObjArr.constructor == Array) {
				for ( var i = 0; i < itemObjArr.length; i++) {
					xmlBufferData = makeMenuItem(xmlBufferData,
							itemObjArr[i].identifier, itemObjArr[i].type,
							itemObjArr[i].title, itemObjArr[i].name,
							itemObjArr[i].icon, itemObjArr[i].onClick,
							itemObjArr[i].onEvent, itemObjArr[i].onHistory,
							itemObjArr[i].multiTitles, itemObjArr[i].multiURLs,
							itemObjArr[i].hiddenTitles, itemObjArr[i].hiddenURLs,itemObjArr[i].user_identifier);
				}
			} else {
					xmlBufferData = makeMenuItem(xmlBufferData,
							itemObjArr.identifier, itemObjArr.type,
							itemObjArr.title, itemObjArr.name, itemObjArr.icon,
							itemObjArr.onClick, itemObjArr.onEvent,
							itemObjArr.onHistory, itemObjArr.multiTitles,
							itemObjArr.multiURLs, itemObjArr.hiddenTitles,
							itemObjArr.hiddenURLs,itemObjArr.user_identifier);
			}
			xmlBufferData = makeMenuFooter(xmlBufferData);
			_g_tigger.pluginAppCommon.SendEvent_XML_Sync(xmlBufferData);

		}
		
		//Creating POPUP Item to Smart Device
		else if (type == 'showpopup' || type == 'popup') {	// change from "popup"
			var xmlBufferData = "";
			xmlBufferData = makePopupMessageHeader(xmlBufferData);
			xmlBufferData = makePopupItem(xmlBufferData, itemObjArr.title,
					itemObjArr.descr, itemObjArr.buttonNames,
					itemObjArr.buttonURLs);
			xmlBufferData = makePopupFooter(xmlBufferData);
			_g_tigger.pluginAppCommon.SendEvent_XML_Sync(xmlBufferData);
			
		}

		//Creating POPUP Item off from Smart Device
		else if (type == 'hidepopup' || type == 'popupoff') {	// chage from 'popupoff'
			var xmlBufferData = "";
			xmlBufferData = makePopupMessageHeader(xmlBufferData);
			xmlBufferData = makePopupOffItem(xmlBufferData);
			xmlBufferData = makePopupFooter(xmlBufferData);
			_g_tigger.pluginAppCommon.SendEvent_XML_Sync(xmlBufferData);
			

		} 
		
		//Loading an image on a Smart Device
		else if (type == 'showloading' || type == 'loadingimage') {	// change from 'loadingimage'
			var xmlBufferData = "";
			xmlBufferData = makeLoadingHeader(xmlBufferData);
			xmlBufferData = makeLoadingItem(xmlBufferData,itemObjArr.title);
			xmlBufferData = makeLoadingFooter(xmlBufferData);
			_g_tigger.pluginAppCommon.SendEvent_XML_Sync(xmlBufferData);
			
		}
		 
		//Loading an image off on Smart Device
		else if(type == 'hideloading' || type == 'loadingimageoff')	// change from 'loadingimageoff'
		{
			var xmlBufferData = "";
			xmlBufferData = makeLoadingHeader(xmlBufferData);
			xmlBufferData = makeLoadingOffItem(xmlBufferData);
			xmlBufferData = makeLoadingFooter(xmlBufferData);
			_g_tigger.pluginAppCommon.SendEvent_XML_Sync(xmlBufferData);
		
		}
		else if(type=='getfile')
		{
		var str=itemObjArr;
		var xmlhttp;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET", str, false);
		xmlhttp.send();
		return xmlhttp.responseText;

		}
        else if(type=='webcontrol')
        {
        var xmlData = makeSourceHeader(xmlData, itemObjArr.menuId);
        if(itemObjArr.userId != '') {
            xmlData += "<user_identifier>"+itemObjArr.userId+"</user_identifier>";
        }
        if(itemObjArr.backKey != '') {
            xmlData += "<backKey>"+itemObjArr.backKey+"</backKey>";
        }
        xmlData = makeSourceFooter(xmlData);
        xmlData=xmlData+itemObjArr.webData;
        _g_tigger.pluginAppCommon.SendEvent_XML_Sync( xmlData);
        }
	}
	
	/*
	 * @brief   convertXMLSpecialChar 
	 * @purpose Generating XML String 
	 * @remarks 
	 * @param   str 
	 * @return   XMLString
	 */
	function convertXMLSpecialChar(str) {
		if (str != null && str != "") {
			str = str.replace(/&/gi, "&amp;");
			str = str.replace(/</gi, "&lt;");
			str = str.replace(/>/gi, "&gt;");
			str = str.replace(/\n/gi, "\r\n");
			str = str.replace(/\f/gi, "");
			str = str.replace(/\r/gi, "");
			str = str.replace(/\t/gi, "");
			str = str.replace(/" "/gi, "");
			str = str.replace(//gi,"");

		}
		return str;
	}
	
	/*
	 * @brief   makeSourceHeader
	 * @remarks Create header for source items 
	 * @param   XMLBuffer, menuID 
	 * @return  XMLBuffer
	 */
	function makeSourceHeader(XMLBuffer, menuID) {
		XMLBuffer = "<source><menuID>" + menuID + "</menuID>";
		return XMLBuffer;
	}

	/*
	 * @brief   makeSourceItem 
	 * @remarks XML Source Item Body Creation
	 * @param   XMLBuffer ,type, typeDefault, identifier, title,
	 * @param   description, image, onClick, onTrue, onFalse, 
	 * @param   multiTitles, multiURLs
	 * @return  XMLBuffer
	 */

	function makeSourceItem(XMLBuffer, type, typeDefault, identifier, title,
			description, image, onClick, onTrue, onFalse, multiTitles,
			multiURLs, typeVoice, voiceSelect, typeItems, typeMode, titleLineBreak, descLineBreak,
			multiIcons, multiTitlesHead, multiURLsHead, multiSizeHead, multiTitlesRow, multiURLsRow, multiSizeRow, multiSelectFlag, 
			selectMode,selectFlag) {
		title = convertXMLSpecialChar(title);
		description = convertXMLSpecialChar(description);
		image = convertXMLSpecialChar(image);
		onClick = convertXMLSpecialChar(onClick);
		onTrue = convertXMLSpecialChar(onTrue);
		onFalse = convertXMLSpecialChar(onFalse);
			if (type!= "table" && selectMode != null && selectMode  != ""){
			XMLBuffer = XMLBuffer +"<select>"+selectMode+"</select>";
		}			
		XMLBuffer = XMLBuffer + "<sourceItem>";
		if (type != null && type != ""){
			if(typeDefault != null && typeDefault != ""){
				XMLBuffer = XMLBuffer + "<type default=\""+ typeDefault + "\">" + type + "</type>";
			}
            else if(type!="table" && selectFlag !=null && selectFlag !="")
                {
                    XMLBuffer = XMLBuffer + "<type selected=\""+selectFlag+"\">"+type+"</type>";
                }
			else if(typeVoice != null && typeVoice !=""){
				if(voiceSelect !=null && voiceSelect !=""){
					XMLBuffer = XMLBuffer + "<type voice=\""+ typeVoice + "\" voice_select=\""+ voiceSelect + "\">" + type + "</type>";
				}
				else{
					XMLBuffer = XMLBuffer + "<type voice=\""+ typeVoice + "\">" + type + "</type>";
				}
			}
			else if(typeItems != null && typeItems != ""){
				XMLBuffer = XMLBuffer + "<type items=\""+ typeItems + "\">" + type + "</type>";
			}
			else if(typeMode != null && typeMode != ""){
				XMLBuffer = XMLBuffer + "<type mode=\""+ typeMode + "\">" + type + "</type>";
			}
			else{
				XMLBuffer = XMLBuffer + "<type>" + type + "</type>";
			}
		}
		if (identifier != null && identifier != "")
			XMLBuffer = XMLBuffer + "<identifier>" + identifier
					+ "</identifier>";
		if (title != null && title != ""){
			if(titleLineBreak !=null && titleLineBreak !=""){
				XMLBuffer = XMLBuffer +"<title linebreak=\""+ titleLineBreak 
						+ "\">" + title +"</title>";
			}
			else {
				XMLBuffer = XMLBuffer + "<title>" + title + "</title>";
			}
		}
		if (description != null && description != ""){
			if(descLineBreak !=null && descLineBreak !=""){
				XMLBuffer = XMLBuffer +"<description linebreak=\""+ descLineBreak + "\">" +description+"</description>";
			}
			else{
				XMLBuffer = XMLBuffer + "<description>" + description
					+ "</description>";
			}
		}
		if (image != null && image != "")
			XMLBuffer = XMLBuffer + "<image>" + image + "</image>";
		if (onClick != null && onClick != "")
			XMLBuffer = XMLBuffer + "<onClick>" + onClick + "</onClick>";
		if (onTrue != null && onTrue != "")
			XMLBuffer = XMLBuffer + "<onTrue>" + onTrue + "</onTrue>";
		if (onFalse != null && onFalse != "")
			XMLBuffer = XMLBuffer + "<onFalse>" + onFalse + "</onFalse>";
		if (multiTitles != null && multiTitles.length > 0) {
			XMLBuffer = XMLBuffer + "<multiTitles>";
			for (var i = 0; i < multiTitles.length; i++) {
				if (type == "combobox" && multiIcons && multiIcons[i] != undefined && multiIcons[i] != null) {
					XMLBuffer = XMLBuffer + "<title icon =\"" + multiIcons[i] + "\">" + multiTitles[i] + "</title>";
				}
				else {
					XMLBuffer = XMLBuffer + "<title>" + multiTitles[i] + "</title>";
				}
			}
			XMLBuffer = XMLBuffer + "</multiTitles>";
		}
		if (multiURLs != null && multiURLs.length > 0) {
			XMLBuffer = XMLBuffer + "<multiURLs>";
			for (var i = 0; i < multiURLs.length; i++) {
				XMLBuffer = XMLBuffer + "<url>" + multiURLs[i] + "</url>";
			}
			XMLBuffer = XMLBuffer + "</multiURLs>";
		}
		if(type == "table") {
			if(selectMode != null && selectMode  != "") {
				XMLBuffer = XMLBuffer +"<table select=\""+ selectMode + "\">";
			}
			else{
				XMLBuffer = XMLBuffer + "<table>";
			}
			if(multiTitlesHead != null && multiTitlesHead.length > 0){
				XMLBuffer = XMLBuffer + "<head>";
				for(var i = 0 ; i < multiTitlesHead.length ; i++){
					if (multiSizeHead && multiSizeHead[i] != undefined && multiSizeHead[i] != null) {
						XMLBuffer = XMLBuffer + "<col size=\"" + multiSizeHead[i] + "\">";
					}
					else{
						XMLBuffer = XMLBuffer + "<col>";
					}
					if (multiTitlesHead && multiTitlesHead[i] != undefined && multiTitlesHead[i] != null) {
                        multiTitlesHead[i]  = convertXMLSpecialChar(multiTitlesHead[i]);
						XMLBuffer = XMLBuffer + "<title>" + multiTitlesHead[i] + "</title>";
					}
					if (multiURLsHead && multiURLsHead[i] != undefined && multiURLsHead[i] != null) {
						XMLBuffer = XMLBuffer + "<url>" + multiURLsHead[i] + "</url>";
					}
					XMLBuffer = XMLBuffer + "</col>";
				}
				XMLBuffer = XMLBuffer + "</head>";
			}
			if(multiTitlesRow != null && multiTitlesRow.length >0){
				for (var i = 0; i < multiTitlesRow.length; i++) {
					XMLBuffer = XMLBuffer + "<row>";
					if(selectMode != null && selectMode  != ""){
						XMLBuffer = XMLBuffer + "<selected>";
						if (multiSelectFlag && multiSelectFlag[i] != undefined && multiSelectFlag[i] != null) {
							XMLBuffer = XMLBuffer + multiSelectFlag[i];
						}
						XMLBuffer = XMLBuffer + "</selected>";
					}
					for (var j = 0; j < multiTitlesRow[i].length; j++) {
						if (multiSizeRow && multiSizeRow[i] != undefined && multiSizeRow[i][j] != null) {
							XMLBuffer = XMLBuffer + "<col size=\"" + multiSizeRow[i][j] + "\">";
						}
						else{
							XMLBuffer = XMLBuffer + "<col>";
						}
						if (multiTitlesRow && multiTitlesRow[i] != undefined && multiTitlesRow[i][j] != null) {
                            multiTitlesRow[i][j]  = convertXMLSpecialChar(multiTitlesRow[i][j]);
							XMLBuffer = XMLBuffer + "<title>" + multiTitlesRow[i][j] + "</title>";
						}
						if (multiURLsRow && multiURLsRow[i] != undefined && multiURLsRow[i][j] != null) {
							XMLBuffer = XMLBuffer + "<url>" + multiURLsRow[i][j] + "</url>";
						}
						XMLBuffer = XMLBuffer + "</col>";
					}
					XMLBuffer = XMLBuffer + "</row>";
				}
			}
			XMLBuffer = XMLBuffer + "</table>";
		}
		XMLBuffer = XMLBuffer + "</sourceItem>";
		return XMLBuffer;
	}

	/*
	 * @brief   makeSourceFooter
	 * @remarks XML Footer Creation 
	 * @param   XMLBuffer 
	 * @return  XMLBuffer
	 */

	function makeSourceFooter(XMLBuffer) {
		XMLBuffer = XMLBuffer + "</source>";

		return XMLBuffer;
	}

	/*
	 * @brief 	makeMenuHeader
	 * @remarks Header Creation for Menu
	 * @param 	XMLBuffer 
	 * @return 	XMLBuffer
	 */

	function makeMenuHeader(XMLBuffer) {
		XMLBuffer = "<menu>";
		return XMLBuffer;
	}
	
	/*
	 * @brief 	makeMenuItem
     * @remarks XML Menu Body Creation 
	 * @param  	XMLBuffer,identifier, type, title, name, icon,
	 * @param 	onClick, onEvent, onHistory, multiTitles, multiURLs
	 * @return 	XMLBuffer
	 */
	function makeMenuItem(XMLBuffer, identifier, type, title, name, icon,
			onClick, onEvent, onHistory, multiTitles, multiURLs, hiddenTitles, hiddenURLs, userIdentifier) {
		title = convertXMLSpecialChar(title);
		name = convertXMLSpecialChar(name);
		icon = convertXMLSpecialChar(icon);
		onClick = convertXMLSpecialChar(onClick);
		onEvent = convertXMLSpecialChar(onEvent);
		onHistory = convertXMLSpecialChar(onHistory);
        if (userIdentifier != null && userIdentifier != "")
			XMLBuffer = XMLBuffer + "<user_identifier>" + userIdentifier + "</user_identifier>";
            
		XMLBuffer = XMLBuffer + "<menuItem>";


		if (identifier != null && identifier != "")
			XMLBuffer = XMLBuffer + "<identifier>" + identifier
					+ "</identifier>";
		if (type != null && type != "")
			XMLBuffer = XMLBuffer + "<type>" + type + "</type>";
		if (title != null && title != "")
			XMLBuffer = XMLBuffer + "<title>" + title + "</title>";
		if (name != null && name != "")
			XMLBuffer = XMLBuffer + "<name>" + name + "</name>";
		if (icon != null && icon != "")
			XMLBuffer = XMLBuffer + "<icon>" + icon + "</icon>";
		if (onClick != null && onClick != "")
			XMLBuffer = XMLBuffer + "<onClick>" + onClick + "</onClick>";
		if (onEvent != null && onEvent != "")
			XMLBuffer = XMLBuffer + "<onEvent>" + onEvent + "</onEvent>";
		if (onHistory != null && onHistory != "")
			XMLBuffer = XMLBuffer + "<onHistory>" + onHistory + "</onHistory>";
		if (multiTitles != null && multiTitles.length > 0) {
			XMLBuffer = XMLBuffer + "<multiTitles>";
			for (i = 0; i < multiTitles.length; i++) {
				XMLBuffer = XMLBuffer + "<title>" + multiTitles[i] + "</title>";
			}
			XMLBuffer = XMLBuffer + "</multiTitles>";
		}
		if (multiURLs != null && multiURLs.length > 0) {
			XMLBuffer = XMLBuffer + "<multiURLs>";
			for (i = 0; i < multiURLs.length; i++) {
				XMLBuffer = XMLBuffer + "<url>" + multiURLs[i] + "</url>";
			}
			XMLBuffer = XMLBuffer + "</multiURLs>";
		}
		if(hiddenTitles != null && hiddenTitles.length > 0){
			XMLBuffer = XMLBuffer + "<hiddenTitles>";
			for(i=0;i<hiddenTitles.length;i++){
				XMLBuffer = XMLBuffer + "<title>" + hiddenTitles[i] + "</title>";
			}
			XMLBuffer = XMLBuffer + "</hiddenTitles>";
		}
		if(hiddenURLs != null && hiddenURLs.length > 0){
			XMLBuffer = XMLBuffer + "<hiddenURLs>";
			for(i=0;i<hiddenURLs.length;i++){
				XMLBuffer = XMLBuffer + "<url>" + hiddenURLs[i] + "</url>";
			}
			XMLBuffer = XMLBuffer + "</hiddenURLs>";
		}
        
            
		XMLBuffer = XMLBuffer + "</menuItem>";

		return XMLBuffer;
	}
	/*
	 * @brief 	makeMenuFooter 
	 * @remarks XML Menu Footer Cration 
	 * @param 	XMLBuffer
	 * @return 	XMLBuffer
	 */
	function makeMenuFooter(XMLBuffer) {
		XMLBuffer = XMLBuffer + "</menu>";
		return XMLBuffer;
	}

	/*
	 * @brief 	makePopupMessageHeader
	 * @remarks XML Popup Header Creation
     * @param 	XMLBuffer 
	 * @return 	XMLBuffer
	 */
	function makePopupMessageHeader(XMLBuffer) {
		XMLBuffer = "<message>";
		return XMLBuffer;
	}
	
	/*
	 * @brief   XML Popup Metadata 
	 * @remarks XML Popup Body Creation 
	 * @param   XMLBuffer,title, descr, buttonNames, buttonURLs
	 * @return  XMLBuffer
	 */
	function makePopupItem(XMLBuffer, title, descr, buttonNames, buttonURLs) {

		title = convertXMLSpecialChar(title);
		descr = convertXMLSpecialChar(descr);

		if (title != null && title != "")
			XMLBuffer = XMLBuffer + "<title>" + title + "</title>";
		if (descr != null && descr != "")
			XMLBuffer = XMLBuffer + "<text>" + descr + "</text>";
		if (buttonNames != null && buttonNames.length > 0) {
			XMLBuffer = XMLBuffer + "<buttonNames>";
			for (i = 0; i < buttonNames.length; i++) {
				XMLBuffer = XMLBuffer + "<name>" + buttonNames[i] + "</name>";
			}
			XMLBuffer = XMLBuffer + "</buttonNames>";
		}
		if (buttonURLs != null && buttonURLs.length > 0) {
			XMLBuffer = XMLBuffer + "<buttonURLs>";
			for (i = 0; i < buttonURLs.length; i++) {
				XMLBuffer = XMLBuffer + "<onClick>" + buttonURLs[i]
						+ "</onClick>";
			}
			XMLBuffer = XMLBuffer + "</buttonURLs>";
		}
		return XMLBuffer;
	}

	/*
	 * @brief   makePopupFooter
	 * @remarks Popup XML Footer Creation 
	 * @param   XMLBuffer
     * @return  XMLBuffer
	 */
	function makePopupFooter(XMLBuffer) {
		XMLBuffer = XMLBuffer + "</message>";
		return XMLBuffer;
	}
	
	/*
	 * @brief 	makePopupOffItem
	 * @remarks XML Creation for closing Popup 
	 * @param   XMLBuffer
	 * @return  XMLBuffer
	 */
	function makePopupOffItem(XMLBuffer) {
		XMLBuffer = XMLBuffer
		XMLBuffer = XMLBuffer + "<action>"
		XMLBuffer = XMLBuffer + "close";
		XMLBuffer = XMLBuffer + "</action>";
		return XMLBuffer;
	}

	/*
	 * @brief    makeLoadingHeader
	 * @remarks  XML Loading Header Creation
     * @param    XMLBuffer 
	 * @return   XMLBuffer
	 */
	function makeLoadingHeader(XMLBuffer) {
		XMLBuffer = XMLBuffer + "<loading>";
		return XMLBuffer;
	}

	/*
	 * @brief    makeLoadingItem
	 * @remarks  XML Loading Body Creation 
	 * @param    XMLBuffer,title
	 * @return   XMLBuffer
	 */
	function makeLoadingItem(XMLBuffer, title) {
		title = convertXMLSpecialChar(title);
		if (title != null && title != ""){
			XMLBuffer = XMLBuffer + "<title>" + title + "</title>";
			XMLBuffer = XMLBuffer + "<type>" + "open" + "</type>";
		}
		else{
			XMLBuffer = XMLBuffer + "<type>" + "openbg" + "</type>";
		}
		return XMLBuffer;
	}
	
	/*
	 * @brief    makeLoadingFooter
	 * @remarks  Loading XML Footer Creation
	 * @param    XMLBuffer
	 * @return   XMLBuffer
	 */
	function makeLoadingFooter(XMLBuffer) {
		XMLBuffer = XMLBuffer + "</loading>";
		return XMLBuffer;
	}
	
	/*
	 * @brief makeLoadingOffItem
	 * @remarks XML Creation for closing Loading
	 * @param XMLBuffer 
	 * @return XMLBuffer
	 */
	function makeLoadingOffItem(XMLBuffer) {
		XMLBuffer = XMLBuffer + "<type>"
		XMLBuffer = XMLBuffer + "close";
		XMLBuffer = XMLBuffer + "</type>";
		return XMLBuffer;
	}
    
    
})(jQuery);
