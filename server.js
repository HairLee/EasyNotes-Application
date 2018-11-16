const express = require('express');
const bodyParser = require('body-parser');
const Message = require('./app/models/chat.message.js');
// create express app
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Hello, I Am Hair Lee - Real Server"});
});

require('./app/routes/note.routes.js')(app);

// listen for requests
// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });

// app.get("/sendsocket",(socket) => {
//   socket.emit('socket_info', "Server Send information");
// });
var socketIds = [];
http.listen(6789, function(){
  console.log('listening on ~*:6789');
});

io.on('connection', function(socket){
  socketIds.push(socket.id)
  console.log('a user connected '+socket.id);
  socket.emit('connection', "socket information");

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  // CRphJBh7qTpBEQdrAAAA - Socket Id
  socket.on('chat message', function(msg){

    var myObject = {
    type:"0",
    userId: msg["userId"],
    message: msg["message"]
    }

    console.log('message: ' + JSON.stringify(myObject));
    console.log('socketIds: ' + socketIds);

    socket.broadcast.emit('get message', JSON.stringify(myObject));
    // socket.emit('get message', msg["content"]);

    storeSocketIdAndMessage("12345",socket.id,msg["message"])

  });

});

function storeSocketIdAndMessage(userId,socketid,message) {
  // Save Socket Id and Message
  const note = new Message({
      userId: userId || "1",
      socketId: socketid,
      message: message
  });

  // Save Note in the database
  note.save()
  .then(data => {
        // console.log(data)
  }).catch(err => {

  });
}
