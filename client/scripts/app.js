// YOUR CODE HERE:


var app = {};

app.init = function(){
  $('button').click(function(){
    var chat = $('input').val();
    var message = {
      'username': currentUser.name,
      'text': chat
      // 'roomname': currentUser.roomname ||
    };
    var noSpacesChat = chat.replace(/\s+/g, '');
    if (noSpacesChat){
      app.send(message);
      $('input').val('');
    }
  });
};

var date = new Date();
app.startTime = date.toISOString();
app.lastposttime = app.startTime;
app.twentymin = 1000 * 60  * 20;

app.getUserName = function(){
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
};


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
      app.lastposttime = data.results[data.results.length-1].createdAt;
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
        },
      roomname: currentUser.roomname
    }),
    order: 'createdAt'},
    contentType: 'application/json',
    success: function (data) {
      try {
        var results = data.results;
        _.each(results, function (msg, i) {
          app.addMessage(msg);
          if(results[i].roomName) {
           app.addRoom(results[i].roomName);
          } else if (results[i].roomname){
            app.addRoom(results[i].roomname);
          }
        });

        app.lastposttime = data.results[data.results.length-1].createdAt;
      }
      catch(e){
      }
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
    },
    complete: function() {
      app.fetch();
    }
  });
};

app.clearMessages = function () {
  $('#chats').children().remove();
};

var count = 0;

app.addMessage = function (message) {
  var date = new Date(message.createdAt);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var amPm = 'AM';
  if (hours>=12){
    if (hours!==12){
      hours = hours-12;
    }
    amPm = 'PM';
  } else if(hours===0){
    hours = 12;
  }
  if(minutes<10){
    minutes = '0' + minutes;
  }
  var user = $('<div>' + message.username + '</div>').text();
  var msg = $('<div>' + message.text + '</div>').text();
  var formattedMessage =  '<p class="chat"><b>' + hours + ':' + minutes + amPm + ' </b><a href="#" class="username">' + user + '</a>: ' + msg + '</p>'
  if (user in currentUser.friends) {
    formattedMessage = '<b>' + formattedMessage + '</b>';
  }
  $('#chats').append(formattedMessage);
  $('.username:last').unbind("click").click(function(){
    console.log('hellooooo?' + count + user);
    count++;
    app.addFriend(user);
  });
};

app.addRoom = function (room) {
  if(!app.rooms[room]) {
    var node = $('<div>' + room + '<div>');
    app.rooms[room] = true;
    $('select').append('<option value=' + room + '>' + room +'</option>');
  }
};

app.addFriend = function(friendName) {
  if(!currentUser.friends[friendName]&& friendName !== currentUser.name){
    currentUser.friends[friendName] = true;
    $('#friends').append('<li>' + friendName + '</li>');
  }
};

app.filterRoom = function(){
  currentUser.roomname = $(':selected').text();
  if(currentUser.roomname === 'All Chats'){
    currentUser.roomname = undefined;
    app.lastposttime = app.startTime;
  }else {
    // app.switchRoomTime = app.lastposttime;
    var lastpost = new Date(app.lastposttime);
    lastpost = new Date(lastpost.getTime() - app.twentymin);
    app.lastposttime = lastpost.toISOString();
  }
  app.clearMessages();
};

app.rooms = {};

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': "4c'han"
};
var message2 = {
  'username': 'batman',
  'text': 'trololo',
  'roomname': '4chan'
};

$(document).ready(function(){
  app.init();
});

var currentUser = {};
currentUser.friends= {};
currentUser.name = app.getUserName()["username"];
if (currentUser.name.charAt(currentUser.name.length - 1) === '#'){
  currentUser.name = currentUser.name.slice(0, currentUser.name.length - 1);
}
app.fetch();
