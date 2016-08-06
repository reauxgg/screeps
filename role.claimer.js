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
                    creep.memory.task = 'ClaimUpgrade';
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
                        creep.memory.task = 'ClaimStore';
                    }
                }
            }

        }
        if (creep.carry.energy == 0)
        {
            creep.memory.task = 'ClaimHarvest';
        }
        if (creep.memory.task == 'ClaimBuilder')
        {
            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            console.log(target);
            if (creep.build(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }

        }
        else if (creep.memory.task == 'ClaimHarvest')
        {

            target = creep.pos.findClosestByPath(FIND_SOURCES);
            console.log(target);
            if (target)
            {
                if (creep.harvest(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }

        }
        else if (creep.memory.task == 'ClaimUpgrade')
        {
            creep.upgradeController(creep.room.controller);
            creep.moveTo(creep.room.controller);
        }
    }



};
