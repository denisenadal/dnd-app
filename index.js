const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const webSocket = require('ws');
const _ = require('lodash');
const wsHelper = require('./socket.js');

const app = express();

//MIDDLEWARE & CONFIGURATION
app.set('port', (process.env.PORT || 8181));
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));
// TODO verify dist location

//ROUTES
app.get('/test', (req, res) => {
    res.json({
        message: 'hewwo world'
    });
});

//init the main server
const server = app.listen(app.get('port'), () => {
    console.log('listening on : ', app.get('port'));
}); 

//WebSocket Server
const wss = new webSocket.Server({ server: server });
const wsh = new wsHelper(wss);

const interval = setInterval(function ping() {
    wss.clients.forEach(function(socket){
        //kill dead clients
        if(!socket.isAlive){
            return socket.terminate();
        }
        //set isAlive false- an active client will pong us back and we can set it to true when we get the response.
        socket.isAlive = false;
        socket.ping();
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});


wss.on('connection', function (socket) {
    //============== socket props
    socket.group = {};
    socket.clientId = _.random(1000, 9999);
    socket.isAlive = true;
    console.log('connected to '+socket.clientId);

    //receiving messages from clients
    socket.on('message', function (message) {
        message = JSON.parse(message);

        switch (message.type) {
            case "joinGroup":
                wsh.joinGroup(socket, message);
                break;
            case "addChar":
                wsh.addCharacter(socket, message);
                break;
            case "removeChar":
                wsh.removeCharacter(socket, message);
                break;
            case "takeTurn":
                wsh.takeTurn(socket, message);
                break;
            case "resetRound":
                wsh.resetRound(socket);
                break;
            case "triggerReset":
                wsh.triggerReset(socket);
                break;
            default:
                console.log("unknown message type:");
                console.dir(message);
        }
    });

    socket.on('pong',function(){
        socket.isAlive = true;
    });

    //when client disconnects
    socket.on('close', function () {
        //console.log("client disconnected: " + socket.clientId);
    });

});
