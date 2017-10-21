// YOUR CODE HERE:



var app = {
  

  currentRoom: '',
  
  init: function () {
    var friends = [];
    
    app.fetch();
    
    $('#chats').on('click', '.chat', function() {
      friends.push($(this).children('.username').text());
    });
    
    $('.create-room').on('click', function() {      
      app.currentRoom = prompt("Enter room name: ", "Room name");
      $('.current-room').text(app.currentRoom);
      console.log('in create room ', app.currentRoom);
      app.fetch(app.currentRoom);
    });
   
    $('#roomSelect').change(function() {
      var roomname = $('#roomSelect').val();
      $('.current-room').text(roomname);
      app.fetch(roomname);
    });

    // $('#chat').append();
    $('#send_form').submit(function(event) {
      
      /* stop form from submitting normally */
      event.preventDefault();

      /* get the action attribute from the <form action=""> element */
      var $form = $( this );
      var url = $form.attr( 'action' );
      
      var message = JSON.stringify({
        username: $('#username').val(),
        text: $('#message').val(),
        roomname: app.currentRoom,
      });
      
      app.send(message);
    });
  },
    
  send: function(message) {
    
    /* Send the data using post with element id name and name2*/
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('success follows');
        console.log(data);
        console.log('chatterbox: Message sent');
        app.fetch(app.currentRoom);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });

    /* Alerts the results */
   
  },  
  
  fetch: function(roomname) {
    console.log(roomname);     
    app.currentRoom = roomname; 
    var url;
    if (roomname) {
      url = `http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt&where={"roomname":"${roomname}"}`;
    } else {
      url = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt';
    }
    console.log(url);
    app.clearMessages();
    $('#chats').append($('<img/>').attr('src', 'images/spiffygif_46x46.gif').addClass('spinner'));
    $.get(url)
    .done(function(data) {
      app.clearMessages();
      data.results.forEach(app.renderMessage);
      if (!roomname) {
        $('#roomSelect').empty();
        $('#roomSelect').append($('<option/>').attr('value', '').text('All'));
        _.uniq(data.results.map(message => message.roomname)).forEach(roomname => {
          $('#roomSelect').append($('<option/>').attr('value', roomname).text(roomname));
        });
      }
    });
    
    clearTimeout(app.t);
    
    app.t = setTimeout(function() {
      app.fetch(roomname);
    }, 10000);
  },
  
  clearMessages: function () {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    // console.log(message);
    var messageDiv = function(message) {
      var $div = $('<div class="chat"/>');
      $div.append($('<p class="username"/>').text(message.username)); 
      
      // $div.append(`<p>${message.text}</p>`); //Fun version
      $div.append($('<p/>').text(message.text));
     
      return $div;
    };
    
    $('#chats').append(messageDiv(message));
  },
  
  renderRoom: function(roomname) {
    $('#roomSelect').append($('<option/>').attr('value', roomname).text(roomname));
  },  
};

$(document).ready(app.init);


