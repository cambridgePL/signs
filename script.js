



$(function(){



    $('#api_upc_cid7052_15922_7090_iid3963').hide();
    $('#api_upc_cid7052_7090_iid3963').hide();

    
    var formatAMPM = function(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; 
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
    }
    
    var updateDT = function(){
	var now = new Date();
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ["January", "February", "March", "April", "May", "June",
		      "July", "August", "September", "October", "November", "December"
		     ];
	var timeString = formatAMPM(now);
	var dateString = weekdays[now.getDay()] + ', ' +
	    months[now.getMonth()] + ' ' + now.getDate()
	$('#cpl-time').html(timeString);
	$('#cpl-date').html(dateString);
	setTimeout(updateDT, 500);
    };

    var updateWeather = function(){
	$.simpleWeather({
	    woeid: '12758737', // woeid for cambridge ma
	    unit: 'f',
	    success: function(weather) {
		html = '&nbsp;| ' + weather.temp + '&deg;' + weather.units.temp;
		$("#cpl-weather").html(html);
		$("#cpl-weather-image").html('<i class="wi wi-yahoo-'+ weather.code + '"/></i>');
	    },
	    error: function(error) {
		console.log("Error getting weather data");
		console.log(error);
		$("#cpl-weather").html('<p>'+'</p>');
	    }
	});
    }

    
    var insertFloor = function(location, rooms, floor) {
	$.each(rooms, function(i, room) { 
            location = location.replace(room,room+ ' (' + floor + ')');
	});
	return location;
    };
    
    var mungeLocation = function(loc) {
	loc = insertFloor(loc, ['Community Room', 'Lecture Hall'],
			  'L2');
	loc = insertFloor(loc, ['The Hive'], 'L1');
	loc = insertFloor(loc, ['Beech Room', 'Rossi Room'], 'Ground Floor');
	loc = insertFloor(loc, ['Rindge Room', 'Learning Lab', 'Teen Room'], '1st Floor');
	loc = insertFloor(loc, ['Curious George Room', 'Rey Room'], '3rd Floor');
	loc = insertFloor(loc, ['Cambridge Room'], '2nd Floor');
	return loc;
    };

    var mungeDate = function(dateString) {
	var date = new Date(Date.parse(dateString));
	var today = new Date();
	//console.log("Does : " + date.toDateString() + ' ===  ' +  today.toDateString());
	if (date.toDateString() === today.toDateString()) {
	    dateString = 'Today';
	} else {
	    dateString = dateString.replace(/, \d{4}$/,'');
	}
	return dateString;
    };

    
    var getBranchName = function(title){
	var url = window.location.href;
	var branches = [
	    ['boudreau', 'Boudreau'],
	    ['collins', 'Collins'],
	    ['csq', 'Central Square'],
	    ['oneill', "O'Neill"],
	    ['oconnell', "O'Connell"],
	    ['valente', 'Valente' ],
	    ['Online', 'Online' ]
	];
	var branchName = "Online";
	branches.forEach(function(branch){
	    //console.log("Branchs is " , branch);
	    if (url.indexOf(branch[0]) > -1){
		branchName = branch[1];
	    }
	});
	console.log("Returning branchName : " + branchName);
	return branchName;
    };
    
    var mungeTitle = function(title){
	// get rid of parenthetical branch indicators in title.
	var branchName = getBranchName();
	if (branchName){
	    title = title.replace("("+branchName+")","");
	}
	title = title.replace(/\(virtual\)/i,"");
	title = title.replace(/\(main\)/i,"");
	title = title;
	return title;
    };
    
    // reload page every 10 minutes.
    setTimeout("location.reload(true);",60000*10);
    setTimeout(updateDT, 500);
    var columnCount = 2;
    if ($('#cpl-events-column-2').length>0){
	columnCount = 3;
    }
    
    var e = undefined;
    var events = [];
    console.log("REINOS: Hello!");
    // note: this is no longer a table! 2022-03-03
    // grab data from (hidden) springshare html element
    // and turn into datastructure we can use for our own html.
    $('.s-lc-ea-tb').each(function (i, eventDiv) {
	var $eventDiv  = $(eventDiv);
	console.log($eventDiv);
	e= {};
	$eventDiv.children().each(function (ii, kvDiv) {
	    $kvDiv = $(kvDiv);
	    var $keyDiv = $($kvDiv.find("div")[0]);
	    var $valDiv = $($kvDiv.find("div")[1]);
	    var key   = $keyDiv.text().replace(':','').toLowerCase();
	    var value = $valDiv.text();
	    if ( key === 'title' ){
		value = mungeTitle(value);
		e.id = 'cpl-event-' + events.length;
	    }
	    e[key]=value;
	});
	events.push(e);
    });
    
    $.each(events, function (i, e) {
	// clean up events
	var loc = e.location;
	console.log(e);
	//console.log("REINOS 0: loc: " + loc);
	if ( e.branches === 'Online'){
	    loc = 'Online';
	}
	//console.log("REINOS 1: loc: " + loc);
	if ( loc ) {
	    e.location = mungeLocation(loc);
	}
	e.date = mungeDate(e.date);
    });
    console.log(events);
    // use data to generate more attractive html and display it.
    var column = 0;
    $.each(events, function (i, e) {
	var eventsPerColumn = events.length/columnCount;
	if ( i >= eventsPerColumn ) {
	    column = 1;
	    if ( i >= eventsPerColumn*2) {
		column = 2;
	    }
	}
	console.log("Event: " + i + " Column: " + column + " columnCount: " + columnCount + " eventsPerColumn: " + eventsPerColumn);

	$('<div/>', {
	    id: e.id,
	    class: 'cpl-event'
	}).appendTo('#cpl-events-column-'+column);
	$('<div>',{
	    id: e.id + '-title',
	    class: 'cpl-event-title',
	    text: e.title,
	}).appendTo('#'+e.id);
	$('<div>',{
	    id: e.date + '-date',
	    text: e.date,
	    class: 'cpl-event-' + (e.date === 'Today' ? 'today' : 'date'),
	}).appendTo('#'+e.id);
	$('<div>',{
	    id: e.time + '-time',
	    text: e.time,
	}).appendTo('#'+e.id);
	if ( e.location ) {
	    $('<div>',{
		id: e.location + '-location',
		text: e.location,
		class: 'cpl-event-' + (e.location === 'Online' ? 'online' : 'onsite'),
	    }).appendTo('#'+e.id);
	}
    });
    var wh = $(window).height();
    var ww = $(window).width();
    var ph = wh-120;
    var pw = ph / 1.26;

    
    //$('#cpl-poster-div').css('height', ph);
    //$('#cpl-poster-div').css('width' , pw);
    //$('#cpl-events-div').css('height', ph);
    //alert("Window: " + wh + "," +  ww +  " poster:  " +  ph + "," + pw);
    
});
