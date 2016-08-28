// Adjust population caps here
var hCap = 2;
var bCap = 2;
var rCap = 1;
var uCap = 2;
var cCap = 3;
var dCap = 0;

//var body = [WORK,CARRY,MOVE];
//var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
var maxBody = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
               WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
	       CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
var body = maxBody;//[WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
//var claimBody = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
var claimBody = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
var healer = [HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];
var fighter = [RANGED_ATTACK, RANGED_ATTACK, MOVE,MOVE,MOVE,MOVE];
var defender = [ATTACK, ATTACK, MOVE,MOVE];
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
    console.log('-------------------------');
    console.log('Pop:' + population + ' H:' + harvesters.length + '/' + hCap + ' R:' + repairers.length + '/' + rCap + ' B:' + builders.length + '/' + bCap + ' U:' + upgraders.length + '/' + uCap +  ' C:' + claimers.length +'/'+cCap + '... Enrgy:' + TotalEnergy + '/' + MaxEnergy);
    console.log('Claimers: ' + claimers);

    var newName = '';
//Checking to see if new spawns are needed
    if (harvesters.length < hCap) {
        newName = Game.spawns.Spawn1.createCreep(maxBody, 'H' + Memory.cNum, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
        Memory.cNum++;
    }
    else if (upgraders.length < uCap) {
        newName = Game.spawns.Spawn1.createCreep(body, 'U' + Memory.cNum, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
        Memory.cNum++;
    }
    else if (builders.length < bCap) {
        newName = Game.spawns.Spawn1.createCreep(body, 'B' + Memory.cNum, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
        Memory.cNum++;
    }
    else if (repairers.length < rCap) {
        newName = Game.spawns.Spawn1.createCreep(body, 'R' + Memory.cNum, {role: 'repairer'});
        console.log('Spawning new repairer: ' + newName);
        Memory.cNum++;
    }
    else if (claimers.length < cCap) {
        newName = Game.spawns.Spawn2.createCreep(claimBody, 'C' + Memory.cNum, {role: 'claimer'});
        console.log('Spawning new claimer: ' + newName);
        Memory.cNum++;
    }

    if (defenders.length < dCap)
    {
        newName = Game.spawns.Spawn2.createCreep(defender, 'D' + Memory.cNum, {role: 'defender'});
        console.log('Spawning new defender: ' + newName);
        Memory.cNum++;
    }


//Telling each creep what to do
    for (var creepname in Game.creeps) {
        var creep = Game.creeps[creepname];
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

    var towers1 = Room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    var towers2 = Game.rooms.W22S49.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    var towers = towers1.concat(towers2);
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
            if (target.owner.username != 'Invader')
            {
                Game.notify("Tower has spotted enemies from" + target.owner.username);
            }
        }
        else {
// Turn on tower healing?
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => ((structure.structureType == STRUCTURE_WALL ||
                                        structure.structureType == STRUCTURE_RAMPART) &&
                                        structure.hits < 250000) ||
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

    for (let def of defenders)
    {
        var hostile = def.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostile)
        {
            def.attack(hostile);
            def.moveTo(hostile);
        }
    }

};
