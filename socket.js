const _ = require('lodash');

class wsHelper {
    constructor(wss) {
        this.wss = wss;
        const firstGroup = this.initGroup();
        this.groups = [firstGroup];
    }

    initGroup(groupId) {
        return {
            groupId: groupId || 1000,
            characters: []
        };
    }

    joinGroup(socket, message) {
        let groupId = _.get(message, 'groupId', false);
        let group = {};
        if (message.groupId) {
            group = _.find(this.groups, function (g) {
                return g.groupId === parseInt(groupId)
            });

            if (!group) {
                this.sendError(socket, 'invalid groupId');
                return;
            }
        }
        else {
            //start new group
            let prev = _.last(this.groups);
            if (prev) {
                group = this.initGroup(prev.groupId + 1)
                this.groups.push(group);
            }
            else {
                this.sendError(socket, "whoops: the server can't find or make any groups");
                return;
            }
        }
        let resp = {
            mutation: "SOCKET_addGroupId",
            group: group
        };
        socket.group = group;
        socket.send(JSON.stringify(resp));
    }

    sendToGroup(group, data) {
        if (!group) {
            console.log("can't send update to clients");
            return;
        }
        if (!data) {
            console.log("no updates to send");
            return;
        }
        this.wss.clients.forEach(function each(socket) {
            if (socket.group === group) {
                socket.send(JSON.stringify(data));
            }
        });
    }

    getCharacter(message) {
        let character = _.get(message, 'character', false);
        if (character) {
            return character;
        } else {
            console.log('ERROR: no valid character');
            return null;
        }
    }

    addCharacter(socket, message) {
        let group = socket.group;
        let char = this.getCharacter(message);
        if (char) {
            group.characters.push(char);
            this.sendToGroup(group, { mutation: "SOCKET_loadCharacterList", characters: group.characters });
        }
        else {
            this.sendError(socket, "no character to add");
        }

    };
    removeCharacter(socket, message) {
        let group = socket.group;
        let char = this.getCharacter(message);
        if (char) {
            let updated = _.filter(group.characters, function (c) { return c.name !== char.name });

            if (updated) {
                socket.group.characters = updated;
                this.sendToGroup(group, { mutation: "SOCKET_loadCharacterList", characters: group.characters });
            }

            else {
                this.sendError(socket, "can't find character to remove it");
            }
        }
        else {
            this.sendError(socket, "no character to remove");
        }
    };
    takeTurn(socket, message) {
        let group = socket.group;
        let char = this.getCharacter(message);
        if (char) {
            let updated = _.map(group.characters, function (c) {
                if (c.name === char.name) {
                    c.round = "next";
                }
                return c;
            });
            if (updated) {
                this.sendToGroup(group, { mutation: "SOCKET_loadCharacterList", characters: group.characters });
            }
            else {
                this.sendError(socket, "can't update character");
            }
        }
        else {
            this.sendError(socket, "no character to update");
        }
    };
    resetRound(socket){
        let group = socket.group;
        _.forEach(group.characters, function (char) {
            char.round = 'current';
        });
        this.sendToGroup(group, { mutation: "SOCKET_loadCharacterList", characters: group.characters });
    }
    triggerReset(socket){
        let group = socket.group;
        this.sendToGroup(group, { mutation: "SOCKET_loading", loading: true});
        this.resetRound(socket);
    };
    sendError(socket, err) {
        socket.send(JSON.stringify({ mutation: "SOCKET_ONERROR", err:err}));
    };
}

module.exports = wsHelper;