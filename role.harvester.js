var roleHarvester = {

    /** @param {Creep} creep **/

    run: function(creep) {

        //Check for full energy
        var total = _.sum(creep.carry);
	    if(total == creep.carryCapacity)
	    {
	        creep.memory.return = true;
	    }
	    if(total < 50) {
	        creep.memory.return = false;
	    }
        var target = null;
	    //Get full energy, if needed
	    if(creep.memory.return == false)
	    {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            if (source)
            {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else
            {
                var spawnpower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter : (obj) => {
                        return ((obj.StructureType == STRUCTURE_SPAWN) ||
                                (obj.StructureType == STRUCTURE_EXTENSION)) &&
                                (obj.energy < obj.energyCapacity);
                    }
                });
                if (spawnpower)
                {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY))
                    {
                        creep.moveTo(creep.room.storage);
                    }
                }
                else
                {
                    if (creep.energy > 0)
                    {
                        creep.memory.return = true;
                    }
                    else
                    {
                        var sources = creep.room.find(FIND_SOURCES);
                        lowest = sources[0];
                        for (let source of sources)
                        {
                            if (source.ticksToRegeneration < lowest.ticksToRegeneration)
                            {
                                lowest = source;
                            }
                        }
                        creep.moveTo(lowest);

                    }
                }
            }
        }

        //If full energy, return energy to structures

        else
        {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            (structure.structureType == STRUCTURE_TOWER && structure.energy < 300)) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
            if (!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_TOWER) &&
                                            structure.energy < 500;
                            }
                        });
                if (!target)
                {
                    target = creep.room.storage;
                    
                    if (!target)
                    {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_SPAWN);
                            }
                        });
                    }
                }
            }
            

            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

        }

	}
};

module.exports = roleHarvester;
