var appKey = '8NGkoUvgY2CcLcgRhxrujRq7t7KeJ7s9BdVu2dEu';
var jsKey = 'UBD5kTCwOt6hOFLSTVnvB2SMZUA6dEauDXZkhXCu';
Parse.initialize(appKey, jsKey);

//gloabl variables
var Review = Parse.Object.extend('Review');
var User = Parse.Object.extend('User');
var globalUser = Parse.User.current();
var globalPw;
var loginHTML;


console.log(globalUser.get('username'));
// "submit" event to #log-in form.
 $('#log-in').submit(function() {
   event.preventDefault();
   globalUser = $('#username').val();
   globalPw = $("#password").val();
   parseLogin(globalUser,globalPw);  
 });

// a "click" event to the #log-out button
 $("#log-out").submit(function() {
   Parse.User.logOut().then(function() {
   })
});
//

//a submit event to the reviewForm
$('#reviewForm').submit(function() { 
	//event.preventDefault();
	var reviewObject = new Review();
	reviewObject.set('body', $('#body').val());
	reviewObject.set('title', $('#title').val() );
	reviewObject.set('stars',parseInt($('#star').raty('score')));
	reviewObject.set('author',globalUser.get('username'));
	reviewObject.set('helpful',0);
	reviewObject.set('unhelpful',0);

	// After setting each property, save your new instance back to your database
	reviewObject.save(null, {
		success: getData
	});
	return false;
});

//functions~~

//pre: the user name can not be already taken to 
//post: logs in and make current user of given user and pw or creates a new user and logins
// them with given input
var parseLogin = function(user,pw){
	event.preventDefault();
	Parse.User.logIn(user, pw).then(
    function(user) {
        // Do stuff after successful login.
        $('#content').css('visibility','visible');
        $('#currentUser').text(user.get('username'));
        loginHTML = $('#log-in').html();
        $('#log-in').html('');
        $('#log-out').css('visibility','visible');
        globalUser = user;
        getData();
      },
     // The login failed. They have not been signed up
     function(error) {  	
        //sign up
        var user = new Parse.User(); //create new user
        user.set('username',globalUser);
        user.set('password',globalPw);
        user.signUp(null,{ 
        	success: function(user) {
        		alert('success! '+ globalUser +' your account was made and you are now logged in!' );
			    parseLogin(globalUser,globalPw);
			  },
			  error: function(user, error) {
			    // Show the error message somewhere and let the user try again.
			    alert("Error: " + error.code + " " + error.message);
			  }
        })
     }
   );
};

//post:queries parse and returns all results that dont have a null count of stars
var getData = function() {
	var query = new Parse.Query(Review);
	query.notEqualTo('stars', NaN);
	query.find({
		success: buildList
	});
};

//post: calculates average number of stars and fills the corresponding 'raty' stars
var buildList = function(data) {
	// Empty out your unordered list
	$('#star').raty();
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
};

//pre: user must be logged in.
//post: appends each review with appropriate button functionality based on the user currently logged in.
var addItem = function(item) {
	// Get parameters from the data item passed to the function
	var title = item.get('title');
	var body = item.get('body');
	var stars = item.get('stars');
	var author = item.get('author');
	var created = new Date(Date.parse(item.get('createdAt')));
	//adjusts 'created' to m-d-y format
	created = (created.getMonth()+1) + '/' + created.getDate() + '/' + created.getFullYear(); 
	var spanStar = $('<span>');
	spanStar.raty({
	  readOnly : true,
	  score: stars
	});
	var upVoteButton = $('<button>');
	upVoteButton.attr('class','btn btn-success glyphicon glyphicon-thumbs-up');
	upVoteButton.click(function(){
		item.increment('helpful');
		item.addUnique("voted", globalUser.get('username'));
		item.save();
		getData();
	});
	var downVoteButton = $('<button>');
	downVoteButton.attr('class','btn btn-danger glyphicon glyphicon-thumbs-down');
	downVoteButton.click(function(){
		item.increment('unhelpful');
		item.addUnique("voted", globalUser.get('username'));
		item.save();
		getData();
	});
	var deleteButton = $('<button>');
	deleteButton.attr('class','btn btn-primary glyphicon glyphicon-remove');
	deleteButton.click(function(){
		item.destroy({
		  success: function(myObject) {
		    // The object was deleted from the Parse Cloud.
		    getData();
		  }
		});
	});
	var upvotes = item.get('helpful');
	var votes = upvotes + item.get('unhelpful');
	var div = $("<div>");
	div.css({
		'border-width' : '1px',
		'border-style': 'solid',
		'padding' : '5px',
		'margin' : '5px'
	});
	var source = '<h4>{{title}}</h4> <br> by {{author}} on {{created}} <br> <b>{{body}}</b> <br> {{upvotes}} out of {{votes}} found this review helpful <br>';
	var template = Handlebars.compile(source);
	var data = {
		stars : stars,
		title : title,
		author : author,
		created : created,
		body : body,
		upvotes : upvotes,
		votes : votes
	};
	var result = template(data);
	$(div).append(spanStar);
	$(div).append(result);
	if(item.get('author') != globalUser.get('username')){
		$(div).append(deleteButton);
	}
	if($.inArray(globalUser.get('username'),item.get('voted')) == -1){
		$(div).append(upVoteButton);
		$(div).append(downVoteButton);
	}
	$('#reviewSection').append(div);
};


//initial state
if (globalUser){ //if signed in get rid of login
	loginHTML = $('#log-in').html();
     $('#log-in').html('');
     $('#currentUser').text(globalUser.get('username'));
     getData();
}else{ //else hides the rest of the functionality of the page
	$('#content').css('visibility','hidden');
	$('#log-out').css('visibility','hidden');
}
//
