var roleHarvester = {

    /** @param {Creep} creep **/

    run: function(creep) {

        //Check for full energy
	    if(creep.carry.energy == creep.carryCapacity) {
	        creep.memory.return = true;
	    }
	    if(creep.carry.energy < 50) {
	        creep.memory.return = false;
	    }
        var target = null;
	    //Get full energy, if needed
	    if(!creep.memory.return) {

	            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }


        }

        //If full energy, return energy to structures

        else {
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
                }
            }

            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

	}
};

module.exports = roleHarvester;
