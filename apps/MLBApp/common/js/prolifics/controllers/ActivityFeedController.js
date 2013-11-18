/**
 * 
 */
define("prolifics/controllers/ActivityFeedController",[ "dojo", "dojo/_base/lang", "dojo/_base/array"],

	function(dojo,lang,array){
			
		dojo.declare("prolifics.controllers.ActivityFeedController", [], {
			// Instance variable
			activityFeeds: null,
			
			// Constructor function.
			constructor : function(){
				this.activityFeeds = {};
			},
			
			loadActivityFeeds : function(){
				var invocationData = {
						adapter : "getConnectionsInfo",
						procedure: "getData"
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess : lang.hitch(this, this.handleRetrievalSuccess),
					onFailure : lang.hitch(this, this.handleRetrievalFailure),
					timeout : 30000
				});
			},
			
			handleRetrievalSuccess : function(data){
				
				if(!data || !data.invocationResult || !data.invocationResult.feed || data.invocationResult.feed.entry.length == 0){
					WL.Logger.debug("Activity Feeds not found");
				}
				
				this.activityFeeds = data.invocationResult.feed.entry;
				console.dir(this.activityFeeds);
				WL.Logger.debug("activityFeeds.length = " + this.activityFeeds.length);
				
				var count = 1;
				for(var i=0; i<this.activityFeeds.length; i++){
					if(this.activityFeeds[i].hasOwnProperty('assignedto')){
						WL.Logger.debug(count++ + "  title = " + this.activityFeeds[i].title.CDATA);
						WL.Logger.debug("owner = " + this.activityFeeds[i].author.name);
						WL.Logger.debug("request date = " + this.activityFeeds[i].published);
						WL.Logger.debug("assigned to = " + this.activityFeeds[i].assignedto.name);
					}
				}
			},
			
			handleRetrievalFailure : function(data) {
				WL.Logger.debug("Error");
			}
	});
});