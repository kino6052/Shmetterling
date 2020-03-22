/*!
 * Shmetterling v0.0.1 
 * Copyright 2015 
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
*/

/*
*	Global Variables
*/
let playList = [];
var globalPlayer;
var newContent = false;
/*
*	Main entry point
*/
function main(){
	/*
	// Convenience Function main
	testCase('removeElementByName', removeElementByName(['01', '02', '03'], '01'), "['01', '02', '03'], '01'", ['02', '03']);
	testCase('removeElementByName', removeElementByName(['01', '02', '03'], '02'), "['01', '02', '03'], '02'", ['01', '03']);
	
	// Playlist Object
	var playlistInstance = new playlist();
	testCase('playlist.addSong', playlistInstance.addSong('test'), 'test', ['test']);
	testCase('playlist.addSong', playlistInstance.addSong('anotherTest'), 'anotherTest', ['test', 'anotherTest']);
	testCase('playlist.removeSong', playlistInstance.removeSong('anotherTest'), 'anotherTest', ['test']);
	testCase('playlist.addSong', playlistInstance.addSong('anotherTest'), 'anotherTest', ['test', 'anotherTest']);
	testCase('playlist.addSong', playlistInstance.addSong('anotherTest'), 'anotherTest', ['test', 'anotherTest', 'anotherTest']);
	
	//Shuffle Playlist
	reverseTestCase('playlist.shuffle()', playlistInstance.shuffle(), "['test', 'anotherTest', 'anotherTest']", ['test', 'anotherTest', 'anotherTest']);
	
	// Create Playlist
	$(document).bind('songIdListUpdated', function(){console.log('TEST PASSED (songIdListUpdated): [' + playlistInstance.songIdList + "]");});
	playlistInstance.addSongsByArtist(playlistInstance, 'chvrches');
	
	// Artists to Playlist
	var artistArray = ['chvrches', 'the cure'];
	playlistInstance.artistsToSongId(playlistInstance, artistArray);
	
	// arrayToString
	arrayToString(artists);
	*/
	
	// Artists Object
	var favoriteArtist = '';
	var artistsInstance = {};
	var playlistInstance = new playlist();
	var playerInstance = new player();
	playerInstance.init();
	var artistCounter = 0; // counts events to be eqaul to the number of artists 


	// Events	
	$(document).bind('similarArtistsUrlUpdated', function(){
		console.log('TEST PASSED (similarArtistsUrlUpdated): [' + artistsInstance.similarArtistsUrl + "]");
		artistsInstance.checklist(artistsInstance);
	});
	
	$(document).bind('artistListUpdated', function(){
		console.log('TEST PASSED (artistListUpdated): [' + artistsInstance.artistsList + "]");
		$("#submit").on("click", function(){
			artistsInstance.processChecklist(artistsInstance);
			playlistInstance.init(playlistInstance, artistsInstance.artistsList);
		});
		$("#cancel").on("click", function(){
			$("#innerContent").text("");
		});
	});
	
	$(document).bind('songIdListUpdated', function(){
		artistCounter++;
		if (artistCounter == artistsInstance.artistsList.length){
			for (i=0; i<100; i++){
				playlistInstance.shuffle();
			}
			
			if (!globalPlayer){
				playerInstance.init(playerInstance, playlistInstance);
			}
			console.log(playlistInstance.songIdList);
			artistCounter = 0;
		}
		playerInstance.getNext();
		
	});
	
	$("#searchfield").on('keydown', function(evt) {
        if (evt.keyCode == 13) {
            favoriteArtist = $("#searchfield").val();
            artistsInstance = new artists(favoriteArtist)
            artistsInstance.findSimilarArtists(artistsInstance, favoriteArtist);
        }
	});
	
	$(document).on('keydown', function(evt){
	   if (evt.keyCode == 219){
	       playerInstance.getPrev();
	   }
	   if (evt.keyCode == 221){
	       playerInstance.getNext();
	   } 
	});
	
	$("#prev").click(function(){
		playerInstance.getPrev();
	});
	
	$("#next").click(function(){
		playerInstance.getNext();
	});
	

}


/* 
*	Object responsibe for interaction with player
*/
var player = function(){
	return {
		playlist: {},
		index: 0, 
		init: function(instance) {
			// Loads first video and creates listeners that check whether video ended
			createPlayer() //this.playlist.songIdList[this.index]);
			
			$(document).bind('videoEnded', function(eventData){
				console.log('TEST PASSED (videoEnded):');
				instance.getNext();
			});
		},
		getNext: function(){
			this.index = (this.index + 1) % playList.length;
			fetch(`/link?id=${playList[this.index]}`).then(res => res.text()).then(link => {
				console.warn(link);
    		globalPlayer.loadVideoByUrl(link);
			})
		},
		getPrev: function(){
			const l = playList.length;
			this.index = (this.index - 1 == -1)?l-1:this.index-1;
			fetch(`/link?id=${playList[this.index]}`).then(res => res.text()).then(link => {
				console.warn(link);
    		globalPlayer.loadVideoByUrl(link);
			})
		}
	};
}

/* 
*	Object responsibe for playlist creation and interaction
*/
var playlist = function(){
	return {
		testVar: 0,
		songIdList: [],
		addSong: function(songname){
			this.songIdList.push(String(songname));
			return this.songIdList;
		},
		addSongsByArtist: function(instance, artist){ // passing instance by reference
			// creating event for updating test var
			// fetch(`/artist?artist=${artist}`).then(res = res.json()).then(playlist => {
			// 	console.warn(playlist);
			// 	playList = playlist.map(({ id }) => id);
			// })
			// $.ajax({  
      //          type: "GET",  
      //          url: "https://www.googleapis.com/youtube/v3/search",   
      //          dataType: "json",
			//    data: {
			// 	   part: 'snippet',
			// 	   q: 'intitle:"' + String(artist) + '","music video", video', 
			// 	   orderby: 'viewCount', 
			// 	   hd: "true",
			// 	   licence: "youtube",
			// 	   key: 'AIzaSyDYhXuJLy-9JbQrnGL3Wm8IeqB7_2a3rUM',
			// 	   maxResults: 15,
			// 	   alt: 'json'
			// 	   },
      //          success: 
      //              function(data){
      //                  console.log(data);
			// 		   $.each(data.items, function(object){
			// 			   if (data.items[object].id.kind == "youtube#video"){
			// 				   var songId = data.items[object].id.videoId;
			// 				    instance.addSong(songId);
			// 				}
			// 		   });   
                       
			// 		   instance.testVar = instance.songIdList;
			// 		   var songIdListUpdated = $.Event('songIdListUpdated')
			// 		   $(document).trigger(songIdListUpdated);
					   
      //               },  
      //           failure: function () {
      //               songList = null; // Or however you want to flag failure
      //           }
      //       });
		},
		shuffle: function(){
			 for (var i = this.songIdList.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = this.songIdList[i];
				this.songIdList[i] = this.songIdList[j];
				this.songIdList[j] = temp;
			}
			return this.songIdList;
		},
		removeSong: function(songname){
			removeElementByName(this.songIdList, songname);
			return this.songIdList;
		},
		artistsToSongId: function(instance, artists){
			$.each(artists, function(index, artist){
				var artistName = String(artist); // make sure artist is a string
				instance.addSongsByArtist(instance, artist);
			});
		},
		checkEmbeddable: function(instance){ // filter the songIdList for only embeddable videos
			var songIds = arrayToString(instance.songIdList);
			$.ajax({  
			   type: "GET",  
			   url: "https://www.googleapis.com/youtube/v3/videos",   
			   dataType: "json",
			   data: {
				   part: 'status',
				   id:  arrayToString(instance.songIdList),
				   key: 'AIzaSyDYhXuJLy-9JbQrnGL3Wm8IeqB7_2a3rUM',
				   alt: 'json'
				   },
			   success: 
				   function(data){
					   for (item=0; item<7; item++){ // we are only choosing first 7 most popular videos on youtube 
						   $.each(data.items, function(object){
							   if (data.items[object].id.kind == "youtube#video"){
								   var songId = data.items[object].id.videoId;
								   if ($.inArray(songId, instance.songIdList) === -1){
									   instance.addSong(songId);
								   }
								}
						   });
						   
					   }
					   instance.testVar = instance.songIdList;
					   var songIdListUpdated = $.Event('songIdListUpdated')
					   $(document).trigger(songIdListUpdated);
					   
					},  
				failure: function () {
					songList = null; // Or however you want to flag failure
				}
			});
		},
		init: function(instance, artistList){
			this.songIdList = [];
			$.each(artistList, function(index, value){
				instance.addSongsByArtist(instance, value);
			});
		}
	};
}

/* 
*	Object responsibe for displaying artist select menu
*/
var artists = function(favoriteArtistInput){
	return {
		self: this,
		artistsList: [],
		favoriteArtist: favoriteArtistInput,
		formId: 'artistForm', // div in which checklist will be displayed
		buttonId: 'submit',
		similarArtistsUrl: '',
		findSimilarArtists: function(instance, favoriteArtist){
			// void; displays content of the artistsList and adds even listener to the button
			var similarArtistsUrlUpdated = $.Event('similarArtistsUrlUpdated');
			fetch(`/artist?artist=${favoriteArtist}`).then(res => res.json()).then(playlist => {
				console.warn(playlist);
				playList = playlist.map(({ id }) => id);
				console.warn(playList);
			})
			// $.ajax({  
			//    type: "GET",  
			//    url: "https://ws.spotify.com/search/1/artist.json",
			//    data: {q: String(favoriteArtist)},
			//    dataType: "json",  
			//    success: 
			// 	   function(data){
					   
			// 		   var hrefLink = data.artists[0].href;
			// 		   artistID = hrefLink.substring(15,hrefLink.length);
			// 		   artistName = data.artists[0].name;
			// 		   query = "https://api.spotify.com/v1/artists/" + artistID + "/related-artists";
			// 		   instance.similarArtistsUrl = query;
			// 		   $(document).trigger(similarArtistsUrlUpdated);
			// 		},  
			// 	failure: function () {
			// 		query = null; // Or however you want to flag failure
			// 		instance.similarArtistsUrl = query;
			// 		$(document).trigger(similarArtistsUrlUpdated);
			// 	}
			// });
		},
		checklist: function(instance){
			this.artistsList = [];
			var artistListUpdated = $.Event('artistListUpdated');
			$.ajax({  
			   type: "GET",  
			   url: instance.similarArtistsUrl,
			   data:{},
			   dataType: "json",  
			   success: 
				   function(data){
					   $("#innerContent").html("");
					   $.each(data.artists, function(index, value){
						   instance.artistsList.push(value.name);
					   });
					   $("#innerContent").append(produceFormHtml(instance.artistsList, instance.formId, instance.buttonId));
					   $(document).trigger(artistListUpdated);
					},  
				failure: function () {
					$(document).trigger(artistListUpdated);
				}
			});
		},
		removeArtist: function(){
			//TODO: implement
		},
		processChecklist: function(instance){
			var checkboxElements = $("input:checked");
			instance.artistsList = [instance.favoriteArtist];
			$.each(checkboxElements, function(index, bandObject){
				console.log(bandObject.id);
				instance.artistsList.push(bandObject.id);
			});
			console.log('TEST PASSSED (processChecklist): ' + instance.artistsList);
			$("#innerContent").html("");
			return instance.artistsList;
		},
		addArtist: function(artist){
			this.artistsList.push(artist);
		}
	};
}

/* 
*	Object responsibe for the search box
*/
var searchbox = function(id){
	return {
		content: 'YourFavoriteBand', // text entered in the search box
		id: id,
		setId: function(id){
			this.id = id;
		},
		getId: function(){
			return this.id;
		},
		setContent: function(){
			this.content =  $(this.id).val();
		},
		getContent: function(){
			return this.content;
		}
	}
};

/*
*	Convenience functions
*/
function testCase(funcName, func, input, output){
	if(String(func)===String(output)){
		console.log("TEST PASSED: " + funcName + ", input: " + input + ", output: " + output);
	}
	else {
		alert("TEST FAILED: " + funcName + " failed on input " + input);
	}
}

function reverseTestCase(funcName, func, input, output){
	if(String(func)!==String(output)){
		console.log("TEST PASSED: " + funcName + ", input: " + input + ", output: " + output);
	}
	else {
		alert("TEST FAILED: " + funcName + " failed on input " + input);
	}
}

function removeElementByName(array, name){
	var index = array.indexOf(name);
	if (index > -1){
		array.splice(index, 1);
	}
	return array
}

function arrayToString(array){
	var result = "";
	$.each(array, function(index, value){
		result += value + ","
	});
	result = result.slice(0, result.length-1);
	return result;
}

function produceFormHtml(artists, formId, buttonId){
	var checkboxes;
	$.each(artists, function(index, value){
		checkboxes += checkboxHtml(value);
	});
	return "<div class='row' id='" + formId + "'><div class='col-sm-12' id='artistForm'><div class='panel panel-default'><div class='panel-heading'><h1>Choose Additional Artists to be Included to the Station</h1></div><div class='panel-body'><div>" + checkboxes + "</div></div><!--panel-body--><button class='btn btn-default' id='" + buttonId + "'>Create Station</button><button class='btn btn-default' id='cancel'>Cancel</button></div><!--pane-default--></div><!--artistForm--></div><!--row-->";
}

function checkboxHtml(value){ return "<div class='col-xs-8'><input type='checkbox' aria-label='...' class='bandName' id='" + value + "'><span class='label label-default'>" + value + "</span></input></div><!-- /col-s-8-->";
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function createPlayer() {
	console.warn('create player')
	console.warn(YT, YT.Player);
	globalPlayer = new YT.Player('player', {
	  height: '390',
	  width: '640',
	  events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
	  }
	});
	
}

/*
*	Custom Events
*/
var playlistCreated = new Event('playlistCreated');


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	console.warn('player ready')
	event.target.cueVideoById({
    videoId: 'mcUza_wWCfA'
  });
	$(document).trigger($.Event('playerInstantiated'));
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {
		console.warn('player changed')
	if (newContent){
		$(document).trigger($.Event('playerInstantiated'));
		newContent = false;
	}
	
	if (event.data == YT.PlayerState.ENDED) {
	  $(document).trigger($.Event('videoEnded'));
	}
}

$(document).ready(function(){
	setTimeout(main, 1000);
	// main();
});
