var CreepBase = require('CreepBase');
var Harvester = require('Harvester');
var Upgrader =  require('Upgrader');
var Builder = require('Builder');
var Towers = require('Towers');
var Repairer = require('RepairBot');

var HarvCap = 2;
var BuildCap = 1;
var RepCap = 1;
var UpCap = 1;

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
        var RepPop = 0;
        var Unknown = 0;

        // Run the creeps first, since they might deposit energy to spawn with
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
                case CreepBase.Repair:
                    Repairer.Run(Creep);
                    RepPop++;
                    break;
                default:
                    Unknown += 1;
            }
        }

        var NewName = '';
        if (HarvPop < HarvCap)
        {
            NewName = Harvester.Spawn(Name, "H" + CreepCount);
            console.log("Built new Harvester, " + NewName);
        }
        else if (UpPop < UpCap)
        {
            NewName = Upgrader.Spawn(Name, "U" + CreepCount);
            console.log("Built new Upgrader, " + NewName);
        }
        else if (BuildPop < BuildCap)
        {
            NewName = Builder.Spawn(Name, "B" + CreepCount);
            console.log("Built new Builder, " + NewName);
        }
        else if (RepPop < RepCap)
        {
            NewName = Game.spawns['Spawn1'].createCreep(Harvester.GetBody(MaxEnergy), 'R' + CreepCount, {role: 'repairer'});
            console.log('Spawning new repairer: ' + NewName);
        }
        if (NewName == -3)
        {
            CreepCount++;
        }

        var Tows = MyRoom.find(FIND_STRUCTURES, {
                filter : obj => {
                    return obj.structureType == STRUCTURE_TOWER;
                }
            });
        for (let Tow of Tows)
        {
            Towers.Run(Tow, Name);
        }
        //These need to be adjusted at the start of a room to WORK,CARRY,MOVE
        console.log('-------------------------');
        console.log(' H: ' + HarvPop + "/" + HarvCap + ' U: ' + UpPop + "/" + UpCap + ' B: ' + BuildPop + "/" + BuildCap + ' R: ' + RepPop + "/" + RepCap + ' E: ' + TotalEnergy + '/' + MaxEnergy);

    }
}
