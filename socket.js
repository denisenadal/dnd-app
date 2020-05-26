
//class is invoked when client connects
const socketHelper = {
    messages : {
        connected : function(clientId){
            console.log('connecting client ' + clientId);
            return JSON.stringify({
                "type": "status",
                "data": "client connected -- " + clientId
            });
        },
        ping: function(clientId){
            console.log('pining client '+clientId);
            return JSON.stringify({
                "type": "ping",
                "data": "still here"
            })
        }
    },
     initGroup : function(groupId){
        this.group = {
            groupId: groupId || 1000,
            characters: []
        };
    },
    onMessageHandler : function(message,socket){
        let message = JSON.parse(message);

        switch (message.type){
            case "ping":
                // console.log("ping received from "+ socket.clientId);
                //TODO ping the client
                break;
            case "joinGroup":
                //console.log('join received');
                //TODO FILL THIS OUT
                break;
            case "addChar":
                //TODO FILL THIS OUT
                break;
            case "removeChar":
                //TODO FILL THIS OUT
                break;
            case "updateChar":
                //TODO FILL THIS OUT
                break;
            default:
                console.log("unknown message type:");
                console.dir(message);
        }
    }

};



module.exports = socketHelper;