var CreepBase = require('CreepBase');
var Harvester = require('Harvester');


var hCap = 4;
var bCap = 1;
var rCap = 1;
var uCap = 3;

var body = [WORK,CARRY,MOVE];
//var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
//var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
var healer = [HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];
var fighter = [RANGED_ATTACK, RANGED_ATTACK, MOVE,MOVE,MOVE,MOVE];
var CreepCount = 0;
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
        var RoomCreeps = MyRoom.find(FIND_MY_CREEPS);
        var Population = RoomCreeps.length;
        var HarvPop = 0;
        var Unknown = 0;

        for (var Creep in RoomCreeps)
        {
            switch(Creep.memory.Role)
            {
                case CreepBase.Harvest:
                    HarvPop += 1;
                    break;
                default:
                    Unknown += 1;
            }
            Harvester.Run(Creep);
        }

        if (HarvPop < hCap)
        {
            var NewBody = Harvester.GetBody(MyRoom.energyCapacityAvailable);
            for (var Spawn in MyRoom.find(FIND_MY_SPAWNS))
            {
                if (!Spawn.spawning)
                {
                    var result = Spawn.createCreep(NewBody, "H" + CreepCount, {Role: CreepBase.Harvest});
                    if (_.isString(result))
                    {
                        console.log("Built new Harvester, " + result);
                        CreepCount++;
                        break;
                    }
                }
            }
        }


        //These need to be adjusted at the start of a room to WORK,CARRY,MOVE
        console.log('-------------------------');
        console.log(' Harvesters: ' + HarvPop + " of " + hCap);
        console.log(' Energy: ' + TotalEnergy + " of " + MaxEnergy);

    }


}
