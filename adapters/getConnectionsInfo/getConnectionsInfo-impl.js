/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */


function getStories(interest) {
	path = getPath(interest);
	
	var input = {
	    method : 'get',
	    returnedContentType : 'xml',
	    path : path
	};
	
	
	return WL.Server.invokeHttp(input);
}

function getStoriesFiltered(interest) {
	path = getPath(interest);
	
	var input = {
	    method : 'get',
	    returnedContentType : 'xml',
	    path : path,
	    transformation : {
		    type : 'xslFile',
		    xslFile : 'filtered.xsl'
	    }
	};
	
	return WL.Server.invokeHttp(input);
}



function getPath(interest) {
	if (interest == undefined || interest == '') {
		interest = '';
	}else {
		interest = '_' + interest;
	}
	return 'rss/edition' + interest + '.rss';
}

function getData(){
	
	WL.Logger.debug("inside getData() function of getConnectionsInfo adapter");
	
	var input = {
		    method : 'get',
		    returnedContentType : 'xml',
		    path: '/activities/service/atom2/activities'
		};
	
	WL.Logger.debug("returning data from activity stream and exiting function getData()");
	WL.Logger.debug(input.path);
	return WL.Server.invokeHttp(input);
}



function getCommunityMembers(){

    WL.Logger.debug("inside getCommunityMembers() function of getConnectionsInfo adapter");  

    var input = {
               method : 'get',
               returnedContentType : 'xml',
               path: '/communities/service/atom/community/members?communityUuid=aece07e3-8cc0-44ec-98dd-d52dbbdcd64a'
           };
    
    WL.Logger.debug("returning data from function getCommunityMembers()");
    
    return WL.Server.invokeHttp(input);
}

function updateActivity(activityData, activityLocation){

	var input = {
			method: 'put',
			returnedContentType : 'xml',
			path: activityLocation,
			body: {
				content : activityData,
				contentType : 'application/atom+xml'
			}
		};
		
	return WL.Server.invokeHttp(input);
}


function createToDoItem(toDoItemData, toDoItemURL){

	var input = {
			method : 'post',
			returnedContentType : 'xml',
			path : toDoItemURL,
			body : {
				content : toDoItemData,
				contentType : 'application/atom+xml'
			}
	};
	
	return WL.Server.invokeHttp(input);
}