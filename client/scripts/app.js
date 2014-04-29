// YOUR CODE HERE:
var app = {};
var currentUser = {};
currentUser.friends= {};

app.init = function(){
};
var date = new Date();
app.startTime = date.toISOString();
app.lastposttime = app.startTime;

app.server = {
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: { where : JSON.stringify({
      createdAt:
        {'$gt':
        {'__type': 'Date',
        'iso': app.lastposttime.toString()
        }

      }
    }),
    order: 'createdAt'},
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      app.lastposttime = data.results[data.results.length-1].createdAt;
      console.log(app.lastposttime);
      console.log('chatterbox: Message fetched');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
    }
  };

app.send = function(message){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: { where : JSON.stringify({
      createdAt:
        {'$gt':
        {'__type': 'Date',
        'iso': (app.lastposttime).toString()
        }

      }
    }),
    order: 'createdAt'},
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      app.lastposttime = data.results[data.results.length-1].createdAt;
      console.log(app.lastposttime);
      console.log('chatterbox: Message fetched');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
    }
  });
};

app.clearMessages = function () {
  $('#chats').children().remove();
};

var count = 0;
app.addMessage = function (message) {
  var user = $('<div>' + message.username + '</div>').text();
  var msg = $('<div>' + message.text + '</div>').text();

  $('#chats').append('<p><a href="#" class="username">' + user + '</a>: ' + msg + '</p>');
  $('.username').unbind("click").click(function(){
    console.log('hellooooo?' + count + user);
    count++;
    app.addFriend(user);
  });
};

app.addRoom = function (room) {
  var node = $('<div>' + room + '<div>');
  $('#roomSelect').append('<p>' + node.text() + '</p>');

};

app.addFriend = function(friendName) {
  currentUser.friends[friendName] = true;
};

// var message = {
//   'username': '8thFloorFridge',
//   'text': 'I need to be cleaned',
//   'roomname': '8th Floor Kitchen'
// };

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};
var message2 = {
  'username': 'batman',
  'text': 'trololo',
  'roomname': '4chan'
};

$(document).ready(function(){
  app.init();
});

setInterval(app.fetch, 5000);
