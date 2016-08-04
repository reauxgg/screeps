var CreepBase = require('CreepBase');
var Harvester = require('Harvester');


var hCap = 4;
var bCap = 1;
var rCap = 1;
var uCap = 3;
var Bodies = [];


var body = [WORK,CARRY,MOVE];
//var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
//var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
var healer = [HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];
var fighter = [RANGED_ATTACK, RANGED_ATTACK, MOVE,MOVE,MOVE,MOVE];

//The real stuff starts here.
module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (var Name in Game.rooms)
    {
        var MyRoom = Game.rooms[Name];
        var TotalEnergy = Room.energyAvailable;
        var MaxEnergy = Room.energyCapacityAvailable;
        var Population = 0;
        var RoomCreeps = MyRoom.find(FIND_MY_CREEPS);



        //These need to be adjusted at the start of a room to WORK,CARRY,MOVE
        console.log('-------------------------')


    }


}
