var CreepBase = require('CreepBase');
var Harvester = require('Harvester');
var Upgrader =  require('Upgrader');
var Builder = require('Builder');

var hCap = 4;
var bCap = 1;
var rCap = 1;
var uCap = 4;

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
        var TotalEnergy = MyRoom.energyAvailable;
        var MaxEnergy = MyRoom.energyCapacityAvailable;
        var RoomCreeps = MyRoom.find(FIND_MY_CREEPS);
        var Population = RoomCreeps.length;
        var HarvPop = 0;
        var UpPop = 0;
        var BuildPop = 0;
        var Unknown = 0;

        for (let Creep of RoomCreeps)
        {
            switch(Creep.memory.Role)
            {
                case CreepBase.Harvest:
                    Harvester.Run(Creep);
                    HarvPop++;
                    break;
                case CreepBase.Upgrade:
                    Upgrader.Run(Creep);
                    UpPop++;
                    break;
                case CreepBase.Build:
                    Builder.Run(Creep);
                    BuildPop++;
                    break;
                default:
                    Unknown += 1;
            }
        }

        var NewName = '';
        if (HarvPop < hCap)
        {
            NewName = Harvester.Spawn(Name, "H" + CreepCount);
            console.log("Built new Harvester, " + NewName);
        }
        else if (UpPop < uCap)
        {
            NewName = Upgrader.Spawn(Name, "U" + CreepCount);
            console.log("Built new Upgrader, " + NewName);
        }
        else if (BuildPop < bCap)
        {
            NewName = Builder.Spawn(Name, "B" + CreepCount);
            console.log("Built new Builder, " + NewName);
        }
        if (NewName == -3)
        {
            CreepCount++;
        }


        //These need to be adjusted at the start of a room to WORK,CARRY,MOVE
        console.log('-------------------------');
        console.log(' Harvesters: ' + HarvPop + " of " + hCap);
        console.log(' Upgraderss: ' + UpPop + " of " + uCap);
        console.log(' Energy: ' + TotalEnergy + " of " + MaxEnergy);

    }


}
