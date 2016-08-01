var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) 
        {
            creep.memory.upgrading = false;
        }    
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else 
        {
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (source) => {return source.energy > 0;}});
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] > 300)} });
            if (container)
            {
                
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(container);
                }    
            }
            else 
            {
                
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(source);
                }
            }
        }
	}
};

module.exports = roleUpgrader;