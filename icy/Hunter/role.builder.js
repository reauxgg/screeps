var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        var source = creep.pos.findClosestByPath(FIND_SOURCES);
	        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, (structure) => (structure.structureType = STRUCTURE_CONTAINER && structure.energy > 50));
	        if (container.length > 0)
	        {
	            if (creep.withdraw(container, RESOURCE_ENERGY, 1) == ERR_NOT_IN_RANGE)
	            {
	                creep.moveTo(container);
	            }
	            else
	            {
	                if (creep.carryCapacity > container.energy)
                    {
                        creep.withdraw(container, RESOURCE_ENERGY, container.energy);
                    }
                    else 
                    {
                        creep.withdraw(container, RESOURCE_ENERGY, creep.carryCapacity);
                    }
	            }
	        }
	        else {
	            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }    
	        }
            
	    }
	}
};

module.exports = roleBuilder;