/**
 * activityFeedCtrl is an array of objects, each of which represents an activity.
 */
var activityFeedCtrl = new Array();

/**
 * communityMembers is an array of objects, each of which represents a community member.
 */
var communityMembers = new Array();

/**
 * activityInfoForCalendar is an array of objects which contain details about the 'title', 'author' and 'duedate'
 * of an activity. 
 * 
 *  Information from an object at a specific index can be retrieved by:
 *  	activityInfoForCalendar[i].author;
 *  	activityInfoForCalendar[i].date.day;
 *  	activityInfoForCalendar[i].date.month;
 *  	activityInfoForCalendar[i].date.year;
 *  	activityInfoForCalendar[i].title;
 * 
 */
var activityInfoForCalendar = new Array();
var incomingDataArray = new Array();

/** Id of the selected list item from the incoming requests list */
var selectedActivity = null;

function wlCommonInit(){
	getConnectionsData();
	console.log("WLCOMMONINIT called");
}

function loadCommunityMembers(){
	var communityMembersInvocationData = {
		       adapter : "getConnectionsInfo",
		       procedure : "getCommunityMembers"
		};
		       
		var options = {
		       onSuccess : loadCummunityMembersSuccess,
		       onFailure : loadCommunityMembersFailure,
		       timeout: 30000
		};
		
		WL.Client.invokeProcedure(communityMembersInvocationData, options);
}

function loadCummunityMembersSuccess(data){
    if(!data || !data.invocationResult || !data.invocationResult.feed || data.invocationResult.feed.entry.length == 0){
           //WL.Logger.debug("Members not found");
    }
    
    var communityMembersList = data.invocationResult.feed.entry;

   // WL.Logger.debug("communityMembersList.length = " + communityMembersList.length);
    var index = 1; 
    //get the names of members of the community
    for(var i=0; i<communityMembersList.length; i++){
    	communityMembers.push(communityMembersList[i]);
           {
        	   index = i+1;
                  //WL.Logger.debug("Member = " + communityMembersList[i].title.CDATA);
                  $("#designers").append('<li><a href="#designerPopup" data-rel="popup"><h3>'+communityMembersList[i].title.CDATA+'</h3></a></li>').listview('refresh');;
                  //$("#designerCheckbox").append('<input type="checkbox" name="checkbox-'+ index +'a" id="checkbox-'+ index +'a" class="custom" /> <label for="checkbox-'+ index +'a">'+communityMembersList[i].title.CDATA +'</label>').checkboxradio('refresh');
                  //var newSet = '<fieldset data-role="controlgroup" class="cbGroup' + index + '"></fieldset>';
                  //$('.designerCheckbox').append(newSet);
                  var newBox = '<input type="radio" name="radio-choice" id="radio-' + index + '" class="custom" value="' + communityMembersList[i].title.CDATA + '"/> <label for="radio-'+ index + '">'+ communityMembersList[i].title.CDATA +'</label>';
                 //$(".cbGroup" + index).append(newBox).trigger('create');
                  $(".designerCheckbox").append(newBox).trigger('create');
           }
    }
   // console.dir(communityMembers);
}

function loadCommunityMembersFailure(data){
    WL.Logger.debug("Error");
}

function updateActivity(notes, duedate){
	
	//WL.Logger.debug("notes = " + notes);
	
	//WL.Logger.debug("due date = " + duedate);
	duedate = duedate.split('/');
	
	console.log("selectedActivity = " + selectedActivity);
	
	var selectedActivityIndex = -1;
	for(var i=0; i<activityFeedCtrl.length; i++){
		if(activityFeedCtrl[i].id == selectedActivity){
			selectedActivityIndex = i;
			break;
		}
	}
	
	//WL.Logger.debug("selectedActivityIndex = " + selectedActivityIndex);
	
	var activityUpdateForm = document.getElementById("activityUpdateForm");
	var selectedCommunityMember = ($('input[name=radio-choice]:checked',activityUpdateForm).val());
	
	var assignedTo = new Object();
	
	for(var i=0; i<communityMembers.length; i++){
		if(selectedCommunityMember == communityMembers[i].contributor.name){
			assignedTo.name = communityMembers[i].contributor.name;
			assignedTo.email = communityMembers[i].contributor.email;
			assignedTo.userid = communityMembers[i].contributor.userid;
			break;
		}
	}
	
	var input = "<?xml version='1.0' encoding='utf-8'?>";
	input += 		"<entry xmlns='http://www.w3.org/2005/Atom' xmlns:snx='http://www.ibm.com/xmlns/prod/sn' xmlns:app='http://www.w3.org/2007/app'>";
	input += 			"<id>" + activityFeedCtrl[selectedActivityIndex].id + "</id>";
	input += 			"<title type='text'>" + activityFeedCtrl[selectedActivityIndex].title.CDATA + "</title>";
	input += 			"<updated>" + activityFeedCtrl[selectedActivityIndex].updated + "</updated>";
	input += 			"<published>" +  activityFeedCtrl[selectedActivityIndex].published+ "</published>";
	input += 			"<author>";
	input += 				"<name>" + activityFeedCtrl[selectedActivityIndex].author.name + "</name>";
	input += 				"<email>" + activityFeedCtrl[selectedActivityIndex].author.email + "</email>";
	input += 				"<snx:userid>" + activityFeedCtrl[selectedActivityIndex].author.userid + "</snx:userid>";
	input += 				"<snx:ldapid>" + activityFeedCtrl[selectedActivityIndex].author.ldapid + "</snx:ldapid>";
	input += 				"<snx:userState>" + activityFeedCtrl[selectedActivityIndex].author.userState + "</snx:userState>";
	input += 			"</author>";
	input += 			"<category scheme='" + activityFeedCtrl[selectedActivityIndex].category[0].scheme + "' term='" + activityFeedCtrl[selectedActivityIndex].category[0].term + "' label='" + activityFeedCtrl[selectedActivityIndex].category[0].label + "'/>";
	input += 			"<category scheme='" + activityFeedCtrl[selectedActivityIndex].category[1].scheme + "' term='" + activityFeedCtrl[selectedActivityIndex].category[1].term + "' label='" + activityFeedCtrl[selectedActivityIndex].category[1].label + "'/>";
	input +=			"<snx:duedate>" + duedate[2] + "-" + duedate[0] + "-" + duedate[1] + "T04:00:00Z</snx:duedate>";
	input += 			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[0].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[0].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[0].href + "'/>";
	input += 			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[1].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[1].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[1].href + "'/>";
	input +=			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[2].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[2].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[2].href + "'/>";
	input += 			"<app:collection href='" + activityFeedCtrl[selectedActivityIndex].collection.href + "'>";
	input += 				"<title type='text'>" + activityFeedCtrl[selectedActivityIndex].collection.title.CDATA + "</title>";
	input += 				"<app:categories href='" + activityFeedCtrl[selectedActivityIndex].collection.categories.href + "'/>";
	input += 			"</app:collection>";
	input += 			"<snx:activity>" + activityFeedCtrl[selectedActivityIndex].activity + "</snx:activity>";
	input += 			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[3].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[3].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[3].href + "'/>";
	input += 			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[4].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[4].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[4].href + "'/>";
	input += 			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[5].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[5].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[5].href + "'/>";
	input += 			"<link rel='" + activityFeedCtrl[selectedActivityIndex].link[6].rel + "' type='" + activityFeedCtrl[selectedActivityIndex].link[6].type + "' href='" + activityFeedCtrl[selectedActivityIndex].link[6].href + "'/>";
	input += 			"<snx:position>" + activityFeedCtrl[selectedActivityIndex].position + "</snx:position>";
	input += 			"<snx:depth>" + activityFeedCtrl[selectedActivityIndex].depth + "</snx:depth>";  
	input += 			"<snx:permissions>" + activityFeedCtrl[selectedActivityIndex].permissions + "</snx:permissions>";
	input += 			"<snx:icon>" + activityFeedCtrl[selectedActivityIndex].icon + "</snx:icon>";
	input += 			"<summary type='text'>" + notes + "</summary>";
	input += 			"<snx:commUuid>" + activityFeedCtrl[selectedActivityIndex].commUuid + "</snx:commUuid>";
	input += 			"<snx:themeId>" + activityFeedCtrl[selectedActivityIndex].themeId + "</snx:themeId>";
	input += 		"</entry>";
	
	var activityLocation = null;
	
	for(var i=0; i<activityFeedCtrl[selectedActivityIndex].link.length; i++){
		if(activityFeedCtrl[selectedActivityIndex].link[i].rel=="edit"){
			activityLocation = activityFeedCtrl[selectedActivityIndex].link[i].href.substring(activityFeedCtrl[selectedActivityIndex].link[i].href.indexOf('/',8));
			break;
		}
	}
	
    //WL.Logger.debug("activity Location = " + activityLocation);
		
	//post changes to a selected activity
	var activityUpdateInvocationData = {
			adapter : "getConnectionsInfo",
			procedure : "updateActivity",
			parameters : [input, activityLocation]
	};
	
	var activityUpdateOptions = {
			onSuccess : updateActivitySuccess,
			onFailure : updateActivityFailure,
			timeout: 30000
	};
	
	WL.Client.invokeProcedure(activityUpdateInvocationData, activityUpdateOptions);
	 
	createToDoItem(activityFeedCtrl[selectedActivityIndex], assignedTo);
	
}

function updateActivitySuccess(data){
	 WL.Logger.debug("updated activity feed");
}

function updateActivityFailure(data){
	 WL.Logger.debug("Activity feed update error");
}

function createToDoItem(toDoItem, assignedTo){
	
	var input = "<?xml version='1.0' encoding='utf-8'?>";
	input += 		"<entry xmlns='http://www.w3.org/2005/Atom' xmlns:snx='http://www.ibm.com/xmlns/prod/sn' xmlns:app='http://www.w3.org/2007/app' xmlns:thr='http://purl.org/syndication/thread/1.0'>";
	input +=			"<category scheme='http://www.ibm.com/xmlns/prod/sn/type' term='todo' label='To Do'/>";
	input +=			"<content type='html'>This is a test to-do item</content>";
	input +=			"<title type='text'>" + toDoItem.title.CDATA + "</title>";
	input += 			"<snx:assignedto name='" + assignedTo.name + "' userid='" + assignedTo.id + "'>" + assignedTo.email + "</snx:assignedto>";
	input += 			"<snx:activity>" + toDoItem.activity + "</snx:activity>";
	input += 		"</entry>";
	
	var toDoItemURL = toDoItem.collection.href.substring(toDoItem.collection.href.indexOf('/',8));
	
	var toDoItemData = {
		adapter : 'getConnectionsInfo',
		procedure : 'createToDoItem',
		parameters : [input, toDoItemURL]
	};
	
	var toDoItemOptions = {
		onSuccess : toItemCreationSuccess,
		onFailure : toDoItemCreationFailure
	};
	
	WL.Client.invokeProcedure(toDoItemData, toDoItemOptions);
}

function toItemCreationSuccess(data){
	WL.Logger.debug("to-do item created successfully");
}

function toDoItemCreationFailure(data){
	WL.Logger.debug("failed to create to-do item");
}

getConnectionsData = function(){
	if(isLoaded == false){
	$.mobile.loading( 'show' ,{ theme: "b", text: "Loading requests..."});
	WL.Logger.debug("in getConnectionsdata functions");
	var invocationData = {
		adapter : 'getConnectionsInfo',
		procedure : 'getData',
		parameters : []
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess : getDataSuccess,
		onFailure : getDataFailure
	});
	}
};

var isLoaded = false; 



getDataSuccess = function(response){
	
	console.log("Success getting data!!");
	var data = response.invocationResult.feed.entry;
	//var user = JSON.parse(data);
	
	//WL.Logger.debug("length = " + data.length);
	var count = 1;
	for(var i=0; i<data.length; i++){
		
		activityFeedCtrl.push(data[i]);
		
		
		if(!data[i].hasOwnProperty('duedate')){
			WL.Logger.debug(count++ + "  title = " + data[i].title.CDATA);
			WL.Logger.debug("owner = " + data[i].author.name);
			WL.Logger.debug("request date = " + data[i].published);
			
			var incomingData = new Object();
			incomingData.id = data[i].id;
			incomingData.title = data[i].title.CDATA;
			incomingData.author = data[i].author.name;
			incomingData.date = new Object();
			incomingData.date.year = data[i].published.substring(0,4);
			incomingData.date.month = data[i].published.substring(5,7);
			incomingData.date.day = data[i].published.substring(8,10);
			
			incomingDataArray.push(incomingData);
			
			//$("#incomingRequests").append('<li id=' + data[i].id + '><a href="html/request.html"><h3>'+ data[i].title.CDATA +'</h3> <p>Requested By: '+ data[i].author.name +'</p><p class="ui-li-aside"><strong>'+ data[i].published +'</strong></p></a></li>').listview('refresh');
		}
		if(data[i].hasOwnProperty('duedate')){
			var activityData = new Object();
			activityData.title = data[i].title.CDATA;
			activityData.author = data[i].author.name;
			activityData.date = new Object();
			activityData.date.year = data[i].duedate.substring(0,4);
			activityData.date.month = data[i].duedate.substring(5,7);
			activityData.date.day = data[i].duedate.substring(8,10);
			
			activityInfoForCalendar.push(activityData);
			//$("#compRequests").append('<li><a href="html/request.html"><h3>'+ data[i].title.CDATA +'</h3> <p>Assigined to: '+ data[i].author.name +'</p><p class="ui-li-aside"><strong>'+ data[i].published +'</strong></p></a></li>').listview('refresh');
		}
	}
	//console.dir(activityFeedCtrl[0]);
	
	console.dir(incomingDataArray);
	
	buildCalendar();
	
	$.mobile.loading('hide');
};


getDataFailure = function(response) {
	console.log("error getting data from connections API");
	$.mobile.loading('hide');
};

$(document).on("pageinit", "#pending", function(event) {
	//getConnectionsData();
	isLoaded = true;
	//console.log(activityInfoForCalendar[0].date.day);
	//WL.Logger.debug("Loading the pending page");
	//WL.Logger.debug(incomingDataArray.length);
	for(var i=0;i<incomingDataArray.length;i++){
		$("#incomingRequests").append('<li id=' + incomingDataArray[i].id + '><a href="html/request.html"><h3>'+ incomingDataArray[i].title +'</h3> <p>Requested By: '+ incomingDataArray[i].author +'</p><p class="ui-li-aside"><strong>'+ incomingDataArray[i].date.month+"-"+incomingDataArray[i].date.day+"-"+incomingDataArray[i].date.year +'</strong></p></a></li>').listview('refresh');
		WL.Logger.debug("clicked = " + incomingDataArray[i].id);
	}
	
	$('#incomingRequests li').click(function(e){
		WL.Logger.debug("clicked = " + this.id);
		selectedActivity = this.id;
	});
	
	
});

$(document).on("pageinit", "#completed", function(event) {
	//getConnectionsData();
	for(var i=0;i<activityInfoForCalendar.length;i++){
		$("#compRequests").append('<li><a href="html/request.html"><h3>'+ activityInfoForCalendar[i].title +'</h3> <p>Assigined to: '+ activityInfoForCalendar[i].author +'</p><p class="ui-li-aside"><strong>'+ activityInfoForCalendar[i].date.month+"-"+activityInfoForCalendar[i].date.day+"-"+activityInfoForCalendar[i].date.year +'</strong></p></a></li>').listview('refresh');
		
	}
});

$(document).on("pageinit", "#accept", function(event) {
	loadCommunityMembers();
});

$(document).on("pageinit", "#designerPage", function(event) {
	loadCommunityMembers();
});


buildCalendar = function () {
	var selector = 6;
	console.log("buildCalendar Called");
	//$(".ui-grid-d div:nth-child("+selector+")").removeClass("ui-bar-c").addClass("ui-bar-b pend");
	for (var i = 0; i < activityInfoForCalendar.length; i++) {
		var date = parseInt(activityInfoForCalendar[i].date.day);
		selector = date+5;
		//console.log("Inside for loop"+ selector);
		$(".ui-grid-d div:nth-child("+selector+")").removeClass("ui-bar-c").addClass("ui-bar-b pend");
		}
	
	
	$( ".pend" ).on( "tap", function( ) {
		var clicked = new String();
		var clickTitle = new String();
		var clickDate = new String();
		var clickDesigner = new String();

		
		//WL.Logger.debug("clicked = " + this.id);
		clicked = this.id;
		if(clicked<=9){
			clicked = "0"+clicked;
		}
		
		for(var i=0; i<activityInfoForCalendar.length;i++){
			//WL.Logger.debug("clicked = " + activityInfoForCalendar[i].date.day);
			//WL.Logger.debug("clicked = " + clicked);
			
			if(activityInfoForCalendar[i].date.day == clicked){
				clickTitle = activityInfoForCalendar[i].title;
				clickDate = activityInfoForCalendar[i].date.day+"-"+activityInfoForCalendar[i].date.month+"-"+activityInfoForCalendar[i].date.year;
				clickDesigner = activityInfoForCalendar[i].author;
			}
		}
		//WL.Logger.debug("clicked = " + clickTitle);
		$("#headerPop").empty();
		$("#headerPop").append("<h3>"+clickTitle+"</h3>");
		$("#popContent").empty();
		$("#popContent").append("<h3>Deadline</h3>"+"<p>"+clickDate+"</p>"+"<h3>Designers</h3><p>"+clickDesigner+"</p>");
		
		$("#dynPopup").popup("open");
	} );
	
};

