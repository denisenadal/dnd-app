const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const webSocket = require('ws');
const _ = require('lodash');

const app = express();

//MIDDLEWARE & CONFIGURATION
app.use(express.static('public'));
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());

//STARTING SERVERS
var server = app.listen(app.get('port'), () => {
    console.log('listening on : ',app.get('port'));
});
const webSocketServer = new webSocket.Server({ server: server });

var initGroup = function(groupId){
    return {
        groupId: groupId || 1000,
        characters: []
    };
};
var firstGroup = initGroup();
var groups = [firstGroup];

//ROUTES
app.get('/test', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});
app.get('/groups', function (req, res) {
    res.status(200).send(groups);
});
app.get('/groups:groupid', function (req, res) {
    //todo setup to return 
    res.status(200).send(groups);
});

//SOCKET connections
webSocketServer.on('connection', function (socket) {
    //CONFIGURING SOCKET
    socket["wsGroup"] = {};
    socket["wsUser"] = _.random(1000, 9999);

    //RUNS WHEN CLIENT CONNECTS
    //console.log("client connected" + socket.wsUser);
    socket.send(JSON.stringify({
        "type": "status",
        "data": "client connected -- "+ socket.wsUser
    }));



    //helper function to send events to all other users in a round
    socket["wsSendToGroup"] = function (data) {
       // console.log("sending to  group: " + socket.wsGroup.groupId + "====");
        webSocketServer.clients.forEach(function (otherSocket) {
            if (otherSocket.wsGroup == socket.wsGroup) {
                otherSocket.send(JSON.stringify(data));
            }
        });
    };
    //ping to verify connection
    socket["wsSendPing"] = function () {
        //console.log("pinging user: "+ socket.wsUser);
        var message = {
            "type": "ping",
            "data": "still here"
        }
        socket.send(JSON.stringify(message));
    };

    setInterval(socket.wsSendPing, 45000);

    //=====SOCKET EVENT HANDLING ====//

    //send
    socket.on('message', function (message) {
        message = JSON.parse(message);
        switch (message.type) {
            case "ping":
               // console.log("ping received from "+ socket.wsUser);
                break;
            case "joinRequest":
                //console.log('join received');
                var groupId = _.get(message, 'groupId', false); 
                var group ={};
                if(groupId){
                    group = _.find(groups, function (g) { return g.groupId === parseInt(groupId) });
                }
                else {
                    var prev  = _.last(groups);
                    group = initGroup( prev.groupId+1 )
                    groups.push( group);
                }

                socket.send(JSON.stringify({
                    "type": "joinedGroup",
                    "data": group || "wtf?"
                }));
                socket.wsGroup = group;
                break;
            case 'updateChars':
                //console.log('update char');
                socket.wsGroup.characters = _.get(message, 'characters', []);
                socket.wsSendToGroup({
                    "type": "updatedChars",
                    "data": socket.wsGroup
                });
                break;
            default:
                console.log("unknown message type:");
                console.dir(message);
        }
    });

    socket.on('close', function () {
        //runs when connection closes
       // console.log("client disconnected");
    });
});
