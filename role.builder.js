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

	    if(creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {
                if (creep.room.storage)
                {
                    if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.storage);
                    }
                }
            }
	    }
	    else {
	        var container = creep.room.storage;
	        var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
	        if (sites.length > 0)
	        {
                    if (container && (container.store[RESOURCE_ENERGY] > 0))
                   {
        	            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        	            {
        	                creep.moveTo(container);
        	            }
                   }
	        }
	        else {
	            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
	            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
	        }

	    }
	}
};

module.exports = roleBuilder;
