var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var WorkerBody1 = [WORK, CARRY, MOVE];
var WorkerBody2 = [WORK,WORK,WORK,CARRY,MOVE,MOVE];

var CreepPref = ['harvester', 'builder', 'upgrader'];
var CreepMin = ['harvester' : 1,
                'builder'   : 1,
                'upgrader'  : 1];
var CreepMax = ['harvester' : 3,
                'builder'   : 2,
                'upgrader'  : 4];

var CreepCount ['harvester' : 0,
                'builder'   : 0,
                'upgrader'  : 0];

var MaxCreeps = 0;

for (key in CreepMax.keys())
{
  MaxCreeps += CreepMax[key];
}

module.exports.loop = function ()
{
  for (key in CreepCount.keys())
  {
    CreepCount = 0;
  }
    for(var name in Memory.creeps)
    {
        if(!Game.creeps[name])
        {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
        else
        {
          CreepCount[Memory.creeps[name].role] += 1
        }
    }

    TotalCreeps = Game.creeps.length;

    console.log('TotalCreeps: ' + TotalCreeps);
//These need to be adjusted at the start of a room to WORK,CARRY,MOVE
    if (TotalCreeps < MaxCreeps)
    {
        if(harvesters.length < MaxHarv) {
            var newName = Game.spawns['Spawn1'].createCreep(Worker, undefined, {role: 'harvester', roleOriginal: 'harvester'});
            console.log('Spawning new harvester: ' + newName);
        }
        else {
            if(upgraders.length < MaxUpgrade) {
                var newName = Game.spawns['Spawn1'].createCreep(Worker, undefined, {role: 'upgrader', roleOriginal: 'upgrader'});
                console.log('Spawning new upgrader: ' + newName);
            }
            else {
                if(builders.length < MaxBuild) {
                    var newName = Game.spawns['Spawn1'].createCreep(Worker, undefined, {role: 'builder', roleOriginal: 'builder'});
                    console.log('Spawning new builder: ' + newName);

                }
            }
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.spent = true) {
            // Suicide is turned off
            //creep.suicide()
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
