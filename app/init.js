alert("init.js loaded.");

function onStart() {
	

    var initData = [
        {
            name:"Friends",
            url: 'http://punkrock.io/XML/category1.xml'
        },{
            name:"Workmates",
            url:"XML/category2.xml"
        },{
            name:"#trending",
            url:"XML/category3.xml"
        }
    ];

    $.get( "http://159.203.113.84/api/user", function( data ) {
      
      initData = [];

      for(var i in data){

        alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");

        var user = data[i];
        alert("ID: "+user.id ); 
        alert("NAME: "+user.name );        

        for(var p in user.posts){
            var post = user.posts[p];
            alert(post.content_html);
        }


        var json = {
            name: user.name,
            // url: 'http://punkrock.io/XML/category1.xml'
            url: 'http://159.203.113.84/api/friend/'+user.id+'/post/xml'
        };
        initData.push(json);

        alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");alert("****************************");

      }

      main();

    });
    






    function main(){
        var arrPathToIncluded = new Array();
        arrPathToIncluded.push('app/Controller.js');
        
        sf.core.loadJS(arrPathToIncluded, function(){ 
            Controller.initialize(initData);
          
                Controller.start(Controller.categoryData[0]);         
        });
       	sf.service.SmartRemote.init('iRemoteNews.iRemoteInput');
        iRemoteNews.sendCategoryInfo();
    }
}

function onDestroy () {
	// stop your XHR or Ajax operation and put codes to distroy your application here
    $.sfSmartRemote('destroy');
}


