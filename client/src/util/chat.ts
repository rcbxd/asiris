import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000/");

function messageListener(cb: any) {
  socket.on("message_sent", (message: Message) => {
    cb(message);
  });
}

function connectRoom(id: number): void {
  socket.emit("connect-room", id);
}

interface Message {
  body: string;
  from: number;
  chatID: number;
  contactID: number;
}

function send(msg: Message) {
  fetch(`http://localhost:5000/api/chat/${msg.chatID}/send/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: msg.from,
      text: msg.body
    })
  })
    .then(res => res.json())
    .then(json => {
      console.log(json.chatMessage);
      socket.emit("msg", json.chatMessage);
    })
    .catch(err => {
      console.log(err);
    });
}

export { messageListener, send, connectRoom };
