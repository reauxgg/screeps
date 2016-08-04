// Adjust population caps here
var hCap = 2;
var bCap = 1;
var rCap = 1;
var uCap = 2;
var cCap = 3;
var dCap = 1;

//var body = [WORK,CARRY,MOVE];
//var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
var maxBody = [MOVE*12,WORK*12,CARRY*10];//[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
var body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
var claimBody = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
var healer = [HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];
var fighter = [RANGED_ATTACK, RANGED_ATTACK, MOVE,MOVE,MOVE,MOVE];
var defender = [ATTACK, ATTACK, ATTACK, ATTACK,ATTACK, MOVE,MOVE,MOVE]
//The real stuff starts here.
module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var Room=Game.spawns.Spawn1.room;
    var energystores = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION ||
                                                                structure.structureType == STRUCTURE_SPAWN);

    var TotalEnergy = Game.spawns.Spawn1.room.energyAvailable;
    var MaxEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    //for (var i in energystores)
    //{
      //  TotalEnergy += energystores[i].energy;
    //}


    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');
    var roleRepairer = require('role.repairer');
    var roleClaimer = require('role.claimer');

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var population = harvesters.length + repairers.length + builders.length + upgraders.length + claimers.length + defenders.length;

//These need to be adjusted at the start of a room to WORK,CARRY,MOVE
    console.log('-------------------------')
    console.log('Pop:' + population + ' - H:' + harvesters.length + '/' + hCap + ' - R:' + repairers.length + '/' + rCap + ' - B:' + builders.length + '/' + bCap + ' - U:' + upgraders.length + '/' + uCap + ' ......... Enrgy:' + TotalEnergy + '/' + MaxEnergy);
    console.log('Claimers: ' + claimers);

//Checking to see if new spawns are needed
    if (harvesters.length < hCap) {
        var newName = Game.spawns['Spawn1'].createCreep(maxBody, 'H' + Memory.cNum, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
        Memory.cNum++;
    }
    else if (upgraders.length < uCap) {
        var newName = Game.spawns['Spawn1'].createCreep(body, 'U' + Memory.cNum, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
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
    else if (claimers.length < cCap) {
        var newName = Game.spawns['Spawn1'].createCreep(claimBody, 'C' + Memory.cNum, {role: 'claimer'});
        console.log('Spawning new claimer: ' + newName);
        Memory.cNum++;
    }
    
    if (defenders.length < dCap)
    {
        var newName = Game.spawns['Spawn2'].createCreep(defender, 'D' + Memory.cNum, {role: 'defender'});
        console.log('Spawning new defender: ' + newName);
        Memory.cNum++;
    }



//Telling each creep what to do
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'claimer')
        {
            roleClaimer.run(creep);
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
                filter: (structure) => ((structure.structureType == STRUCTURE_WALL ||
                                        structure.structureType == STRUCTURE_RAMPART) &&
                                        structure.hits < 125000) ||
                                        ((structure.structureType == STRUCTURE_ROAD) &&
                                        structure.hits < (structure.hitsMax / 1.3))
            });
            if(closestDamagedStructure && tower.energy > 300) {
                tower.repair(closestDamagedStructure);
            }
// Turn off healing
        }
    }
    
    for (let def of defenders)
    {
        var hostile = def.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostile)
        {
            def.attack(hostile);
            def.moveTo(hostile);
        }
    }

}
