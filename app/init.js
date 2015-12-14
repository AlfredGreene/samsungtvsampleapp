alert("init.js loaded.");

function onStart() {
	// TODO : Add your Initilize code here
    $.get( "https://httpbin.org/ip", function( data ) {
      alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");
      alert( "YOUR IP ADDRESS IS: "+data.origin );
    });alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");
    
    // include file
    var arrPathToIncluded = new Array();
    arrPathToIncluded.push('app/Controller.js');
    
    sf.core.loadJS(arrPathToIncluded, function(){ 
        Controller.initialize([{
                name:"Friends",
                // url:"XML/category1.xml"
                url: 'http://punkrock.io/XML/category1.xml'
            },{
                name:"Workmates",
                url:"XML/category2.xml"
            },{
                name:"#trending",
                url:"XML/category3.xml"
            }]);
      
            Controller.start(Controller.categoryData[0]);         
    });
   	sf.service.SmartRemote.init('iRemoteNews.iRemoteInput');
    iRemoteNews.sendCategoryInfo();

}

function onDestroy () {
	// stop your XHR or Ajax operation and put codes to distroy your application here
    $.sfSmartRemote('destroy');
}


