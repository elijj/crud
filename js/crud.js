var appKey = '8NGkoUvgY2CcLcgRhxrujRq7t7KeJ7s9BdVu2dEu';
var jsKey = 'UBD5kTCwOt6hOFLSTVnvB2SMZUA6dEauDXZkhXCu';
Parse.initialize(appKey, jsKey);
var Review = Parse.Object.extend('Review');

//sign in
// Assign a "submit" event to your log-in form.
 $('#log-in').submit(function() {
   var userName = $('#username').val();
   var pass = $("#password").val();
   Parse.User.logIn(userName, pass).then(
    function(user) {
        // Do stuff after successful login.
        console.log('success!')
      },
     function(error) {
        // The login failed. Check error to see why.
        console.log('error!')
      }
    );
   return false;
   
 });




// Assign a "click" event to the #log-out button
 $("#log-out").click(function() {
   Parse.User.logOut().then(function() {
       console.log('current user ', Parse.User.current())
     
   })
});
//


$('#reviewForm').submit(function() { 
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



//~~~~~~~~~~~~~~~~~~

$('.glyphicon glyphicon-thumbs-up').on('click',function(){

	console.log('click', this.id + 'was clicked');
})

//$('.glyphicon glyphicon-thumbs-down').click(


	var vote = function(dom){

	console.log('click', dom.innerHTML + 'was clicked');
}

//upvote - downvote
//object.increment(attr)
//object.save()
//delete
//.text() when addItem

//sign in and sign out

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
	var upVote = $('<button>');
	var downVote = $('<button>');
	upVote.attr('class','glyphicon glyphicon-thumbs-up');
	upVote.click(function(){
		alert('You did it mofo');
	})


	$(div).append(created + ' ' +title + ' ' + body + ' '+ stars);
	$(div).append(upVote);//+"<button class ='glyphicon glyphicon-thumbs-down'></button>");
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


console.log('please',$('body').html());
getData();
