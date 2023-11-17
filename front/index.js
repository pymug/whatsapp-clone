/*
Status: tosend, sent, delivered, read
*/

function id(prefix = '', length = 7) {
  let result = prefix;
  for(let i = 0; i < length; i++) {
      const random = Math.random();
      result += String.fromCharCode(Math.floor(random * 26) + (random < .5 ? 65 : 97));
  }
  return result;
}

var mynum = "+23057654321";
var chats = [{
        "type": "group",
        "name": "aedfwf",
        "members": ["+23057654321", "+23051234567"],
        "messages": [
          {
            "from": "+23051234567",
            "type": "text",
            "message": "Hiwefwefwef",
            "status": "delivered",
            "id": "5",
            "timestamp": "952146643"
        }
        ],
        "chat_id": "c1"
    },
    {
        "chat_id":"c2",
        "type": "personal",
        "name": "+23051234567",
        "messages": [{
            "from": "+23051234567",
            "type": "text",
            "message": "Hi",
            "status": "delivered",
            "id": "2",
            "timestamp": "952146643"
        },
        {
            "from": mynum,
            "type": "text",
            "message": "Hi",
            "status": "tosend",
            "id": "3",
          "timestamp": "952146643"
        },
        {
          "from": "+23051234567",
          "type": "text",
          "message": "Hi wefwefw",
          "status": "delivered",
          "id": "5",
        "timestamp": "952146643"
        }]
    },
    {
      "chat_id":"c23",
      "type": "personal",
      "name": "+23051234567",
      "messages": [{
          "from": "+23051236667",
          "type": "text",
          "message": "Hi",
          "status": "delivered",
          "id": "12",
          "timestamp": "952146643"
      },
      {
          "from": mynum,
          "type": "text",
          "message": "Hi",
          "status": "tosend",
          "id": "3",
        "timestamp": "952146643"
      },
      {
        "from": "+23051234567",
        "type": "text",
        "message": "Hi wefwefw",
        "status": "delivered",
        "id": "5",
      "timestamp": "952146643"
      }]
  }
]

function mymessage(message){
  var currentDate = new Date();
  return {
    "from": mynum,
    "type": "text",
    "message": message,
    "status": "tosend",
      "id": id(),
    "timestamp": currentDate.getTime()
    }
}


function chat_bubble(msg) {
  var time = new Date(Number(msg.timestamp));
  var timestr = time.getDate()+"-"+(time.getMonth()+1)+"-"+time.getFullYear()+" "+ time.getHours() +":"+ time.getMinutes()+":" + time.getSeconds();
  var status_icon = null;
  console.log(msg.status);
  if (msg.status === "tosend"){
    status_icon = `/assets/clock.svg`;
  } else if (msg.status === "sent"){
    status_icon = `/assets/check.svg`;
  } else if (msg.status === "delivered"){
    status_icon = `/assets/double-check.svg`;
  } else if (msg.status === "read"){
    status_icon = `/assets/check-circle.svg`;
  }

  var alt = "";
  if (msg.from === mynum){
    alt = "alt";
  }

    return `
<div class="bubble">
    <div class="txt">
      <p class="name">${msg.from}</p>
      <p class="message">${msg.message}</p>
      <span class="timestamp">${timestr} <img width="15px" src="${status_icon}"></span>
    </div>
    <div class="bubble-arrow ${alt}"></div>
  </div>
  `;
}

function chat_bubble_right() {
    return `
    <!--  Speech Bubble alternative -->
  <div class="bubble alt">
    <div class="txt">
      <p class="name alt">+353 87 1234 567<span> ~ John</span></p>
      <p class="message">Nice... this will work great for my new project.</p>
      <span class="timestamp">10:22 pm</span>
    </div>
    <div class="bubble-arrow alt"></div>
  </div>
</div>
  `;
}

function chat_option(chat) {
  var num_notifications = 0;
    for (msg in chat["messages"]){
        var msg = chat["messages"][msg];
      if (msg.status === "delivered" && msg.from != mynum){
        num_notifications += 1;
      }
    }
    if (num_notifications === 0){
      num_notifications = "";
    }
    return `<div id="chat-${chat.chat_id}" class="chat_select">
    <div class="row">
          <div class=col>
            <img class="img-fluid" src="https://placehold.co/50x50">
          </div>
          <div class=col-10>
            <b>${chat.name} </b>
            <div class="preview" >... <span class="notif badge bg-primary">${num_notifications}</span></div>
          </div>
    </div>
    
  </div>`;
}

function load_chat_options() {
    for (chat in chats) {
      var chat = chats[chat];
        $(".select").append(chat_option(chat));
    }
}

function refresh_chat_window(target_id){
  $("#chat-"+target_id+" .notif").html("");
        $("speech-wrapper").html("");
      var target_msgs = null;
        for (chat in chats) {
            var chat = chats[chat];
            if (chat.chat_id === target_id){
              target_msgs = chat.messages;
              for (msg in chat.messages){
                if (chat.messages[msg]["from"] != mynum){
                  chat.messages[msg]["status"] = "read";
                }
                
              }
              break;
            } 
        }
      console.log(target_msgs);
      
      $(".speech-wrapper").html("");
      for (msg in target_msgs){
        var msg = target_msgs[msg];
        $(".speech-wrapper").append(
          chat_bubble(msg)
        );
      }
}

$(document).ready(function() {
  var current_chat  = null;
    load_chat_options();

    $('.chat_select').on('click', function() {
        var target_id = $(this).attr("id").split("-")[1];
        current_chat = target_id;
        refresh_chat_window(target_id);

      // $(".select").html("");
      // load_chat_options();
      
    });


    $('#send-button').on('click', function() {
      // add to current message with to send status
      for (chatvar in chats) {
        var chat = chats[chatvar];
        if (chat.chat_id === current_chat){
          var message = $("#message-input").val();
          chats[chatvar]['messages'].push(mymessage(message));
          refresh_chat_window(current_chat);
          $("#message-input").val("")
          break;
        } 
      }
    });
});