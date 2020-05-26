const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const webSocket = require('ws');
const _ = require('lodash');
const wsHelper = require('./socket.js');

const app = express();

//MIDDLEWARE & CONFIGURATION
app.set('port', (process.env.PORT || 8080));
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
app.get('/groups', function (req, res) {
    res.status(200).send(groups);
});
app.get('/groups:groupid', function (req, res) {
    //todo setup to return 
    res.status(200).send(group);
});

//WebSocket Server
const wss = new webSocket.Server({ server: server });
let firstGroup = wsHelper.initGroup();
wss.groups = [firstGroup];

wss.on('connection', function (socket) {
    //============== socket props
    socket.group = {};
    socket.clientId = _.random(1000, 9999);

    //=============  socket methods
    socket.sendPing = function () {
        socket.send(wsHelper.messages.ping);
    }
    socket.sendToGroup = function (data) {
        wss.clients.forEach(function each(otherSocket) {
            if (otherSocket.group === socket.group) {
                otherSocket.send(JSON.stringify(data));
            }
        });
    };
    //receiving messages from clients
    socket.on('message', function (message) {
        wsHelper.onMessageHandler(message,socket);
    });
    //when client disconnects
    socket.on('close', function () {
        console.log("client disconnected: " + socket.clientId);
    });

    // ============= on connect events
    socket.send(wsHelper.messages.connected(socket.clientId));
    setInterval(socket.SendPing, 45000);


});



app.listen(port, () => {
    console.log('listening on : ', app.get('port'));
}); 