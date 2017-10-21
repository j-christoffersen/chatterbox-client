// YOUR CODE HERE:

$(document).ready(function () {
  var friends = [];
  var getMessages = function(roomname) {
    var url;
    if (roomname) {
      url = `http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt&where={"roomname":"${roomname}"}`;
    } else {
      url = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt';
    }
    $('#chats').empty();
    $('#chats').append($('<img/>').attr('src', 'images/spiffygif_46x46.gif'));
    $.get(url)
    .done(function(data) {
      $('#chats').empty();
      data.results.forEach(function(message) {
        // $('#chats').append($(`<p>${message.text}</p>`));
        $('#chats').append(messageDiv(message));
      });
    });
    
    setTimeout(function() {
      getMessages(roomname);
    }, 10000);
  };
  
  var messageDiv = function(message) {
    var $div = $('<div class="chat"/>');
    $div.append($('<p class="username"/>').text(message.username)); 
    if (friends.includes(message.username)) {
      $div.addClass('friend');
    }
    $div.append($('<p/>').text(message.text));
    // $div.value = {
    //   username: message.username,
    //   messageText: message.text,
    // };
    // $div.on('click', function() {
    //   console.log('clicking chat message ', $(this).value.username);
    // });
    return $div;
  };
  
  getMessages();
  
  $('#chats').on('click', '.chat', function() {
    friends.push($(this).children('.username').text());
  });

  
  $('.room-selector').change(function() {
    var roomname = $('.room-selector').val();
    console.log(typeof roomname);
    getMessages(roomname);
  });

  // $('#chat').append();
  $('#send_form').submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();

    /* get the action attribute from the <form action=""> element */
    var $form = $( this );
    var url = $form.attr( 'action' );
    
    var message = {
      username: $('#username').val(),
      text: $('#message').val(),
      roomname: 'basement',
    };
    
    console.log('message:');
    console.log(message);
    
    /* Send the data using post with element id name and name2*/
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('success follows');
        console.log(data);
        console.log('chatterbox: Message sent');
        getMessages();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });

    /* Alerts the results */
   
  });
});


