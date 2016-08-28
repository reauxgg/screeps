/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claimer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run : function (creep)
    {
        var target = null;
        if (Game.flags.Claimers.room.name != creep.room.name)
        {
            creep.moveTo(Game.flags.Claimers);
            if (Game.rooms[Game.flags.Claimers.room.name].controller.owner.username != creep.owner.username)
            {
                creep.say(creep.room.controller.owner.username);
                creep.claimController(creep.room.controller);
            }
         }
        else
        {

            if (creep.carry.energy == creep.carryCapacity)
            {


                if (creep.room.controller.ticksToDowngrade < 1000)
                {
                    console.log("Emergency upgrade!" + creep.room.controller.ticksToDowngrade);
                    creep.memory.task = 'ClaimUpgrade';
                }
                else
                {
                    var stor = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter : (obj) => {
                                    return ((obj.structureType == STRUCTURE_SPAWN) ||
                                            (obj.structureType == STRUCTURE_EXTENSION)) &&
                                            (obj.energy < obj.energyCapacity);
                                }});
                    if(stor)
                    {
                        creep.memory.task = 'ClaimStore';
                    }
                    else
                    {
                        stor = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter : (obj) => {
                                    return (obj.structureType == STRUCTURE_TOWER) &&
                                            (obj.energy < 300);
                                }});
                    if (stor)
                    {
                        creep.memory.task = 'ClaimTower';
                    }
                    else
                    {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter : (obj) => {
                            return (obj.structureType == STRUCTURE_ROAD) &&
                                    obj.hits < (obj.hitsMax/1.3);
                        }
                        });
                        if (target)
                        {
                            creep.memory.task = 'ClaimRepair';
                        }
                        else
                        {
                            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                            if (target)
                            {
                                creep.memory.task = 'ClaimBuilder';
                            }
                            else
                            {
                                var stor = creep.room.find(FIND_STRUCTURES, {
                                    filter : (obj) => {
                                        return ((obj.structureType == STRUCTURE_SPAWN) ||
                                                (obj.structureType == STRUCTURE_EXTENSION) ||
                                                (obj.structureType == STRUCTURE_STORAGE)) &&
                                                (obj.energy < obj.energyCapacity);
                                    }});
                                if (stor.length > 0)
                                {
                                    creep.memory.task = 'ClaimStore';
                                }
                                else
                                {
                                    stor = creep.room.find(FIND_STRUCTURES, {
                                    filter : (obj) => {
                                        return ((obj.structureType == STRUCTURE_TOWER) &&
                                                (obj.energy < obj.energyCapacity));
                                        }});
                                    if (stor.length > 0)
                                    {
                                        creep.memory.task = 'ClaimTower';
                                    }
                                    else
                                    {
                                        console.log('When all else fails, UPGRADE!');
                                        creep.memory.task = 'ClaimUpgrade';
                                    }

                                }
                            }
                        }
                    }
                    }

                }
                console.log(creep.name + " switching to " + creep.memory.task);
            }
            if (creep.memory.task == 'ClaimBuilder')
            {
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target)
                {
                    if (creep.build(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    console.log("Builder switching to Upgrade, no sites");

                    creep.memory.task = 'ClaimUpgrade';
                }
            }
            else if (creep.memory.task == 'ClaimHarvest')
            {
                target = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
                if (target)
                {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    target = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (target)
                    {
                        if (creep.harvest(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                }
            }
            else if (creep.memory.task == 'ClaimUpgrade')
            {
                console.log(creep.upgradeController(creep.room.controller));
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller);
                }
                else
                {

                }

            }
            else if (creep.memory.task == 'ClaimStore')
            {
                var stor = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter : (obj) => {
                        return ((obj.structureType == STRUCTURE_SPAWN) ||
                                (obj.structureType == STRUCTURE_EXTENSION) ||
                                 (obj.structureType == STRUCTURE_STORAGE)) &&
                                (obj.energy < obj.energyCapacity);
                    }
                });
                if (stor)
                {
                    if (creep.transfer(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(stor);
                    }
                }
                else
                {
                    console.log("Everything's full, going to upgrade");
                    creep.memory.task = 'ClaimUpgrade';
                    creep.moveTo(creep.room.controller);
                }

            }
            else if (creep.memory.task == 'ClaimTower')
            {
                var stor = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter : (obj) => {
                        return (obj.structureType == STRUCTURE_TOWER) &&
                                (obj.energy < obj.energyCapacity);
                    }
                });
                if (stor)
                {
                    if (creep.transfer(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(stor);
                    }
                }
                else
                {
                    console.log("Everything's full, going to upgrade");
                    creep.memory.task = 'ClaimUpgrade';
                    creep.moveTo(creep.room.controller);
                }

            }
            else if (creep.memory.task == 'ClaimRepair')
            {
                if (creep.repair(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                else
                {
                    creep.memory.task = 'ClaimStore';
                }
            }
        }
        if (creep.carry.energy === 0)
        {
            creep.memory.task = 'ClaimHarvest';
        }
    }



};
