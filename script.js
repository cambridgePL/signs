



$(function(){

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
	    ['valente', 'Valente' ]
	];
	var branchName;
	branches.forEach(function(branch){
	    console.log("Branchs is " , branch);
	    if (url.indexOf(branch[0]) > -1){
		branchName = branch[1];
		console.log("branchName is: " + branchName);
	    }
	});
	console.log("Returning branchName : " + branchName);
	return branchName;
    };
    
    var mungeTitle = function(title){
	var branchName = getBranchName();
	if (branchName){
	    title = title.replace(branchName,"");
	}
	title = title.replace("()","");
	return title;
    };
    
    // reload page every 10 minutes.
    setTimeout("location.reload(true);",60000*10);
    setTimeout(updateDT, 500);
    updateWeather();
    
    var e = undefined;
    var events = [];
    // grab data from (hidden) springshare html table
    $('.s-lc-ea-tb tr').each(function (i, row) {
	var $row = $(row);
	var $tds = $row.find('td');
	var key = $tds.eq(0).text().replace(':','').toLowerCase();
	var value = $tds.eq(1).text();
	if ( key === 'title' ){
	    value = mungeTitle(value);
	    e = {};
	    e.id = 'cpl-event-' + events.length;
	    events.push(e);
	}
	e[key]=value;
    });
    $.each(events, function (i, e) {
	// clean up events
	if ( e.location ) {
	    e.location = mungeLocation(e.location);
	}
	e.date = mungeDate(e.date);
    });
    console.log(events);
    // use data to generate more attractive html and display it.
    var column = 0;
    $.each(events, function (i, e) {
	if ( i >= 3 ) {
	    column = 1;
	}
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
