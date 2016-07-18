// Initialize Firebase
var config = {
    apiKey: "AIzaSyC9sjMfURcz095wLBY1Y45m4vvUHoyeY3s",
    authDomain: "chatapp-ba088.firebaseapp.com",
    databaseURL: "https://chatapp-ba088.firebaseio.com",
    storageBucket: "chatapp-ba088.appspot.com",
};
var fireBaseRef = firebase.initializeApp(config);
var provider = new firebase.auth.GoogleAuthProvider();

var name, email, photoUrl, uid;

var splashPage = document.getElementById('page-splash');
var userName = document.getElementById('user-name');

function writeNewPost(uid, username, message) {
    // A post entry.
    var postData = {
        author: username,
        uid: uid,
        message: message
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
}

function getMessagesFromDB() {
    var myUserId = firebase.auth().currentUser.uid;
    
    var recentMessagesRef = firebase.database().ref('posts').limitToLast(100);
    var userMessagesRef = firebase.database().ref('user-posts/' + myUserId);

    var fetchPosts = function(postsRef) {
        postsRef.on('child_added', function(snapshot) {
            var author = snapshot.val().author;
            var message = snapshot.val().message;
            var commentsContainer = $('#comments-container');
            
            if (author === name) {
                $('<div/>', {class: 'comment-container my-messages'})
                    .html(message + '<br><span class="label label-default my-name"><em>' 
                        + author + '</em></span>').appendTo(commentsContainer);

                commentsContainer.scrollTop(commentsContainer.prop('scrollHeight'));
            } else {
                $('<div/>', {class: 'comment-container other-messages'})
                    .html('<span class="label label-default">' 
                        + author + '</span>' + message).appendTo(commentsContainer);

                commentsContainer.scrollTop(commentsContainer.prop('scrollHeight'));
            }
        });
  };

  fetchPosts(recentMessagesRef);
}

// Create new comment.
$("#submit-btn").click(function(){
    var messageInput = document.getElementById('comments');
    
    if (messageInput.value) {
        var postText = messageInput.value;
        messageInput.value = '';
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            var username = snapshot.val().username;
            
            writeNewPost(
                firebase.auth().currentUser.uid,
                firebase.auth().currentUser.displayName,
                postText);
        });
    }
    
    return false;
});

$("#sign-in").click(function(){
    firebase.auth().signInWithPopup(provider);
    
    return false;
});

$("#sign-out").click(function(){
    firebase.auth().signOut();
    
    return false;
});

window.addEventListener('load', function() {
    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            splashPage.style.display = 'none';
            
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            uid = user.uid;
            
            getMessagesFromDB();
            
        } else {
            splashPage.style.display = '';
        }
    });
    
    userName.innerHTML = name;
    
});