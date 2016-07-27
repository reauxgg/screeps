var roleHarvester = {

    /** @param {Creep} creep **/

    run: function(creep) {

    /*
        if (creep.memory.roleOriginal)
        { 
            if (creep.room.find(FIND_CONSTRUCTION_SITES))
            {
                creep.memory.role = roleOriginal;
            }
        }
        */
        //Check for full energy
	    if(creep.carry.energy == creep.carryCapacity) {
	        creep.memory.return = true;
	    }
	    if(creep.carry.energy < 50) {
	        creep.memory.return = false;
	    }

	    //Get full energy, if needed
	    if(creep.memory.return == false) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }

        //If full energy, return energy to structures
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || (structure.structureType == STRUCTURE_TOWER && structure.energy < 300)) &&
                    structure.energy < structure.energyCapacity;
                    }
                });
            if (!target)
            {
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
                    }
                });
            }
            else if (target == null) {
                  var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
                if (target)
                {
                    if (creep.transfer(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            }
            else {
                /*if (!creep.memory.roleOriginal)
                {
                    creep.memory.roleOriginal = 'harvester';
                }
                creep.memory.role = 'builder';
                */
            }
            
// Move to closest energy container
// console.log('Giving enrgy to: ' + target)
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        
	}
};

module.exports = roleHarvester;