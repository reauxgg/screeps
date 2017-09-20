var Room=Game.spawns.Spawn1.room;

var wallRepLimit = 240000;


var roleRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.repairing = true;
        }

        if (creep.carry.energy === 0)
        {
            creep.memory.repairing = false;
        }

        if (creep.memory.repairing)
        {
            // Towers are much more efficient at repairing, so
            // if any exist, try to keep them fed.
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter : obj => {
                    return (obj.structureType == STRUCTURE_TOWER) &&
                            (obj.energy < obj.energyCapacity);
                }
            });

            if (towers.length > 0)
            {
                var lowest = towers[0];
                for (var tow in towers)
                {
                    if (tow.energy < lowest.energy)
                    {
                        lowest = tow;
                    }
                }

                if (creep.transfer(lowest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(lowest);
                }
            }
            else
            {
                // Keep roads up first
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter : obj => {
                        return (obj.structureType == STRUCTURE_ROAD) &&
                                (obj.hits < (obj.hitsMax / 1.3));
                    }
                });
                if (target)
                {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    // Go bank some power
                    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter : obj => {
                            return ((obj.structureType == STRUCTURE_STORAGE) || (obj.structureType == STRUCTURE_SPAWN)  &&
                            (obj.energy < obj.energyCapacity));
                        }
                    });
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                    
                }
            }

        }
        else
        {
            var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
	        if (dropped)
	        {
	            if (creep.pickup(dropped) == ERR_NOT_IN_RANGE)
	            {
	                creep.moveTo(dropped);
	            }
	        }
	        else
	        {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.storage);
                }
                else {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (source)
                    {
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(source);
                        }
                    }
                }
	        }
        }
    }
};


module.exports = roleRepairer;
