//var fireBaseRef = new Firebase("https://chatapp-ba088.firebaseio.com");
// Initialize Firebase
  var fireBaseRef = {
    apiKey: "AIzaSyC9sjMfURcz095wLBY1Y45m4vvUHoyeY3s",
    authDomain: "chatapp-ba088.firebaseapp.com",
    databaseURL: "https://chatapp-ba088.firebaseio.com",
    storageBucket: "chatapp-ba088.appspot.com",
  };

  firebase.initializeApp(fireBaseRef);

$("#post-button").click(function(){
    alert();
    var comment = $("#message");
    var commentValue = $.trim(comment.val());
    
    if (commentValue.length === 0) {
        alert('Messages can not be blank!');
    } else {
        fireBaseRef.push({comment: commentValue}, function(error) {
            if (error !== null) {
                alert('Unable to post your message!. Try again later.');
            }
        });
 
        comment.val("");
    }
    return false;
});

fireBaseRef.on('child_added', function(snapshot) {
    var uniqName = snapshot.name();
    var comment = snapshot.val().comment;
    var commentsContainer = $('#comments-container');

    $('<div/>', {class: 'comment-container'})
        .html('<span class="label label-default">Comment ' 
            + uniqName + '</span>' + comment).appendTo(commentsContainer);

    commentsContainer.scrollTop(commentsContainer.prop('scrollHeight'));
});