var appKey = '8NGkoUvgY2CcLcgRhxrujRq7t7KeJ7s9BdVu2dEu';
var jsKey = 'UBD5kTCwOt6hOFLSTVnvB2SMZUA6dEauDXZkhXCu';
Parse.initialize(appKey, jsKey);
var Review = Parse.Object.extend('Review');

//gameScore.increment("score");
//gameScore.save();


$('form').submit(function() { 
	var reviewObject = new Review();
	reviewObject.set('body', $('#body').val() );
	reviewObject.set('title', $('#title').val() );
	reviewObject.set('stars',parseInt($('#star').raty('score')));
	// After setting each property, save your new instance back to your database
	reviewObject.save(null, {
		success: getData
	});
	return false;
});

$('button').on('click',function(){

	console.log('click', this.attr('class') + 'was clicked')
})

var getData = function() {
	var query = new Parse.Query(Review);
	query.notEqualTo('stars', NaN);
	query.find({
		success: buildList
	});
}

var buildList = function(data) {
	// Empty out your unordered list
	$('#reviewSection').empty();
	// Loop through your data, and pass each element to the addItem function
	var stars = 0;
	var rows = 0;
	data.forEach(function(row) {
		addItem(row);
		stars += row.get('stars');
		rows++;
		//cummlative amount of stars
		//cummulative amount of reviews
	});

	$('#avgStar').raty({
		readOnly : true,
		score: stars/rows
	});
}

//needs template library adjustment
var addItem = function(item) {
	// Get parameters (website, band, song) from the data item passed to the function
	var title = item.get('title');
	var body = item.get('body');
	var stars = item.get('stars');
	var created = new Date(Date.parse(item.get('createdAt')));
	//adjusts 'created' to m-d-y format
	var span = $('<span>');
	created = created.getMonth() + '/' + created.getDay() + '/' + created.getFullYear(); 
	span.raty({
	  readOnly : true,
	  score: stars
	});
		// Append li that includes text from the data item
	var div = $('<div>');
	div.append(span);
	//$(li).addClass('list-group-item');
	$(div).append(created + ' ' +title + ' ' + body + ' '+ stars + "<button class ='glyphicon glyphicon-thumbs-up'></button><button class ='glyphicon glyphicon-thumbs-down'></button>");
	$('#reviewSection').append(div);
	// Time pending, create a button that removes the data item on click
}

$('#star').raty();
/*
var getAvg = 3;

$('#avgStar').raty({
  readOnly : true,
  score: getAvg
}); */



getData();
