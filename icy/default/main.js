var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var MaxHarv = 2;
var MaxBuild = 2;
var MaxUpgrade = 3;

var MaxCreeps = MaxHarv + MaxBuild + MaxUpgrade;

var Worker = [WORK,WORK,WORK,CARRY,MOVE,MOVE]

var lastsource = 0;


module.exports.loop = function () {
    
    /*
    for (var id in Game.constructionSites)
    {
        var site = Game.constructionSites[id]
        //console.log('Site: ' + site);
        site.remove();
    }
*/

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
        
        
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);
    TotalCreeps = upgraders.length + builders.length + harvesters.length;
    
    
    
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