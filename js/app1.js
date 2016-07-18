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

firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

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

// Create new comment.
$("#submit-btn").click(function(){
    var messageInput = document.getElementById('comments');
    alert(messageInput.value);
    if (messageInput.value) {
        var postText = messageInput.value;
        messageInput.value = '';
        // [START single_value_read]
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            var username = snapshot.val().username;
            // [START_EXCLUDE]
            writeNewPost(
                firebase.auth().currentUser.uid,
                firebase.auth().currentUser.displayName,
                postText);
            // [END_EXCLUDE]
        });
        // [END single_value_read]
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
            
        } else {
            splashPage.style.display = '';
        }
    });
    
    userName.innerHTML = "You are signed in as: " + name;
    
});