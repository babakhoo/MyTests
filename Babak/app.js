(function () {
    
    
    var apiKey = "5zafgdhm15ic7xzx";

        var el = new Everlive(apiKey);
		
        var groceryDataSource = new kendo.data.DataSource({
            type: "everlive",        
            offlineStorage: "Contact-offline",
            transport: {
                typeName: "Contacts"
            },           
           
            schema: {                              
                model: {
                                id: Everlive.idField ,
                                fields: {                                            
                                    Name:   { type: "string" },
                                     Tel:   { type: "string" } 
                                }
                            }
                        }
        });
                            
        
   	function test()
    {        
        alert("test!");        
    }
    
     window.Test= function() {
        
        Testonline();
    }
      window.stopTest= function() {
        
        stopTest();
    }
    function Testonline2()
    {
        alert("working!");  
        var dataSource=groceryDataSource;
        var online = localStorage["Contact-offline"] == "true" || localStorage["Contact-offline"] === undefined;
        
		alert("I am ..."+online);             
    }
    var pollId;
    function stopTest()
    {
        clearInterval(pollId);        
        alert("stoped!");
    }
    
  	function Testonline()
    {           
        // make a request to some URL every 5 seconds to see if Internet access is available
        pollId = setInterval(function() {
            $.ajax({
                // use an URL from the same domain to adhere to the same origin policy
                url: "http://demos.telerik.com/"
            })
            .done(function() {
                // the ajax request succeeded - we are probably online.
                alert("online!");  
               
            })
            .fail(function() {
                // the ajax request failed - we are probably offline.
                alert("offline!");  
                
            });
        }, 5000);
    }
    function OnlineDoThings()
    {
        // go in offline mode
    groceryDataSource.online(false);
    // make some changes
    groceryDataSource.at(0).set("ProductName", "Updated");
    // sync to accept the changes (the data source persists the change in localStorage)
    groceryDataSource.sync();
        // get the offline data
    var offlineData = dataSource.offlineData();
    console.log(offlineData[0].__state__); // displays "update"
        //__state__  indicates the type of change: "create", "update" or "destroy". 
        
        //------------------How Do I Check the Currently Used Local Storage Space?-------------------------
            
      // check amount of used offline storage space for a specific key
    JSON.stringify(localStorage.getItem("your-offlineStorage-key-here")).length
    // check overall used offline storage space
    JSON.stringify(localStorage).length    
        
    // optionally go back online (the data source syncs the change with the remote service)
    groceryDataSource.online(true);
    }
    
    
    var app, selectedContact, selectedContactId;
	
    document.addEventListener('deviceready', function () {  
        navigator.splashscreen.hide();
        app = new kendo.mobile.Application(document.body, {skin: 'flat', transition: 'slide'});
    }, false);

    function onError() {
        alert("Sorry, but there was error!");
        
    }
    
    // Handles iOS not returning displayName or returning null
    function getName(c) {
    	if(c.name.formatted) return c.name.formatted;
    	if(c.name.givenName && c.name.familyName) return c.name.givenName + " " + c.name.familyName;
    	return "No Name Listed";
    }    
    
   
        // My new scripts :
    window.getAllContacts = function() {
    var options = new ContactFindOptions();
    options.filter = "";           
    options.multiple = true;       
    var fields = ["*"];  
    navigator.contacts.find(fields, onContactSuccess, onError, options);
}

function onContactSuccess(contacts) {  
    var c=contacts;
    test();
    Testonline();
    return;
    /*
    var template = kendo.template($("#contacts-template").html());
    var dataSource = new kendo.data.DataSource({ data: contacts });
    dataSource.bind("change", function () {
        $("#contacts-list").html(kendo.render(template, dataSource.view()));
    });
    dataSource.read();
    */
    
    console.log("gotContacts, number of results "+c.length);
    picDiv = document.querySelector("#pictures");
    picDiv.innerHTML += "<H4>number of results: '"+c.length+"'</H4>";
    var total=0;
    var itemToAdd;
    for(var i=0, len=c.length; i<len; i++) {        
        if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {            
            
            picDiv.innerHTML += "<H4>"+c[i].displayName+"</H4>";
            picDiv.innerHTML += "<H5>"+c[i].phoneNumbers[0].value+"</H5>";
                                                                     	            
            	if(c[i].photos && c[i].photos.length > 0) {            
           			 picDiv.innerHTML += "<img src='"+c[i].photos[0].value+"'>";
        			}
            var itemToAdd = { 'Name': c[i].displayName, 'Tel': c[i].phoneNumbers[0].value};
            groceryDataSource.add(itemToAdd);                    
        }        
    } 
     groceryDataSource.sync();
        	 alert("synced!");     
}
    
    // End ...
    
    // new part :
    window.getContactDetails = function(e) {
    selectedContactId = e.view.params.id;
    var options = new ContactFindOptions();
    options.filter = e.view.params.id;           
    options.multiple = true;       
    var fields = ["*"];   
    navigator.contacts.find(fields, onContactDetailSuccess, onError, options);
        
}


    
function onContactDetailSuccess(contacts) {
    for (var i = 0; i < contacts.length; i++) 
    {  
        if (contacts[i].id == selectedContactId)
        {
            $("#contact-name").text(getName(contacts[i]));

            if (contacts[i].phoneNumbers) {
                $("#contact-phone").text(contacts[i].phoneNumbers[0].value);
            } else {
                $("#contact-phone").text("");
            }

            if (contacts[i].photos && contacts[i].photos.length) {
                $(".largeProfile").attr("src", contacts[i].photos[0].value);
            } else {
                $(".largeProfile").attr("src", "styles/blankProfile.png");
            }

            selectedContact = contacts[i];

            break;
        }
    }  
}
    
    //End
    
    window.updatePhoto = function() {
    navigator.camera.getPicture(onPhotoSuccess, onError, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}

function onPhotoSuccess(imageURI) {
    $(".largeProfile").attr("src", imageURI);
    var photo=[];
    photo[0] = new ContactField('photo', imageURI, false)
    selectedContact.photos = photo;
    selectedContact.save();
    
    //new thing :
    if (window.plugins && window.plugins.toast) {
    window.plugins.toast.showShortCenter("The profile picture has been updated!");
	}
    
}        
        
    //End
    
}());

    
