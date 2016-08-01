var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /*
        if (!(creep.room.find(FIND_CONSTRUCTION_SITES)))
        {
            if (!creep.memory.roleOriginal)
            {
                creep.memory.roleOriginal = 'builder';
            }
            creep.memory.role = 'upgrader';
            creep.memory.role = creep.memory.roleOriginal;
        }
        */
        
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] >= creep.energyCapacity)} });
	        if (container)
	        {
	            if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
	            {
	                creep.moveTo(container);
	            }
	        }
	        else {
	            var source = creep.pos.findClosestByPath(FIND_SOURCES);
	            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }    
	        }
            
	    }
	}
};

module.exports = roleBuilder;