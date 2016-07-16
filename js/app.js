var fireBaseRef = new Firebase("https://chatapp-ba088.firebaseio.com/");

$("#post-button").bind("click", function() {
    var comment = $("#message");
    var comment_value = $.trim(comment.val());
    
    if (commentValue.length === 0) {
        alert('Messages can not be blank!');
    } else {
        _fireBaseRef.push({comment: commentValue}, function(error) {
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