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
	reviewObject.set('stars',$('#star').raty('score'));
	// After setting each property, save your new instance back to your database
	reviewObject.save(null, {
		success: getData
	});
	return false;
});

var getData = function() {
	var query = new Parse.Query(Review);
	query.notEqualTo('title', '');
	query.find({
		success: buildList
	});
}

var buildList = function(data) {
	// Empty out your unordered list
	$('#reviewSection').empty();
	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(row) {
		addItem(row);
		//cummlative amount of stars
		//cummulative amount of reviews
	});

	//$('#avgStar').raty({ score: stars/reviews});
}

var addItem = function(item) {
	// Get parameters (website, band, song) from the data item passed to the function
	var title = item.get('title');
	var body = item.get('body');
	var stars = item.get('stars');

	// Append li that includes text from the data item
	var div = $('<div>');
	//$(li).addClass('list-group-item');
	$(div).append(title + ' ' + body + ' '+ stars);
	$('#reviewSection').append(div);
	// Time pending, create a button that removes the data item on click
}

$('#star').raty();

var getAvg = 3;

$('#avgStar').raty({
  readOnly : true,
  score: getAvg
});



getData();
