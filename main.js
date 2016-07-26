// Adjust population caps here
var hCap = 3;
var bCap = 2;
var rCap = 2;
var uCap = 4;
var body = [WORK, WORK,WORK,WORK,CARRY,CARRY, CARRY, CARRY, MOVE, MOVE,MOVE,MOVE];

//The real stuff starts here.
module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var energystores = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION ||
                                                                structure.structureType == STRUCTURE_SPAWN ||
                                                                structure.structureType == STRUCTURE_TOWER ||
                                                                structure.structureType == STRUCTURE_CONTAINER);

    TotalEnergy = 0;
    for (var i in energystores)
    {
        TotalEnergy += energystores[i].energy;
    }

    var Room=Game.spawns.Spawn1.room;
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');
    var roleRepairer = require('role.repairer');

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var population = harvesters.length + repairers.length + builders.length + upgraders.length;

//These need to be adjusted at the start of a room to WORK,CARRY,MOVE
    console.log('-------------------------')
    console.log('Pop:' + population + ' - H:' + harvesters.length + '/' + hCap + ' - R:' + repairers.length + '/' + rCap + ' - B:' + builders.length + '/' + bCap + ' - U:' + upgraders.length + '/' + uCap + ' ......... Enrgy:' + TotalEnergy);

//Checking to see if new spawns are needed
    if (harvesters.length < hCap) {
        var newName = Game.spawns['Spawn1'].createCreep(body, 'H' + Memory.cNum, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
        Memory.cNum++;
    }
    else if (builders.length < bCap) {
        var newName = Game.spawns['Spawn1'].createCreep(body, 'B' + Memory.cNum, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
        Memory.cNum++;
    }
    else if (repairers.length < rCap) {
        var newName = Game.spawns['Spawn1'].createCreep(body, 'R' + Memory.cNum, {role: 'repairer'});
        console.log('Spawning new repairer: ' + newName);
        Memory.cNum++;
    }
    else if (upgraders.length < uCap) {
        var newName = Game.spawns['Spawn1'].createCreep(body, 'U' + Memory.cNum, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
        Memory.cNum++;
    }

//Telling each creep what to do
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }

//Tower defense

    var towers = Room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
            Game.notify("Tower has spotted enemies!")
        }
        else {
// Turn on tower healing?
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_WALL && structure.hits < 125000 && structure.hits != structure.hitsMax
            });
            if(closestDamagedStructure && tower.energy > 700) {
                tower.repair(closestDamagedStructure);
            }
// Turn off healing
        }
    }

}
