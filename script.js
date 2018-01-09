$(function(){

    var insertFloor = function(location, rooms, floor) {
	$.each(rooms, function(i, room) { 
            location = location.replace(room,room+ ' (' + floor + ')');
	});
	return location;
    };
    
    var mungeLocation = function(loc) {
	loc = insertFloor(loc, ['Community Room', 'Lecture Hall'],
			  'Lower Level,  L2');
	loc = insertFloor(loc, ['Beech Room'], 'Ground Floor');
	loc = insertFloor(loc, ['Rindge Room'], '1st Floor');
	loc = insertFloor(loc, ['Curious George Room', 'Rey Room'], '3rd Floor)');
	return loc;
    };

    var mungeDate = function(dateString) {
	var date = new Date(Date.parse(dateString));
	var today = new Date();
	console.log("DateString: " + dateString + " = " , date);
	if (date.toDateString() === today.toDateString()) {
	    dateString = 'Today';
	}
	return dateString;
    };
    
    var e = undefined;
    var events = [];
    console.log($('.s-lc-ea-h3').text());
    // grab data from (hidden) springshare html table
    $('.s-lc-ea-tb tr').each(function (i, row) {
	console.log('Hello row ' + i);
	var $row = $(row);
	var $tds = $row.find('td');
	var key = $tds.eq(0).text().replace(':','').toLowerCase();
	var value = $tds.eq(1).text();
	console.log('Hello row ' + key + ":" + value);
	if ( key === 'title' ){
	    e = {};
	    e.id = 'cpl-event-' + events.length;
	    events.push(e);
	}
	e[key]=value;
    });
    $.each(events, function (i, e) {
	// clean up events
	e.location = mungeLocation(e.location);
	e.date = mungeDate(e.date);
    });
    console.log(events);
    // use data to generate more attractive html and display it.
    $.each(events, function (i, e) {
	$('<div/>', {
	    id: e.id,
	    class: 'cpl-event'
	}).appendTo('#cpl-events-div');
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
	$('<div>',{
	    id: e.location + '-location',
	    text: e.location,
	}).appendTo('#'+e.id);
    });
});
