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
            var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            if (dropped)
            {
                if(creep.pickup(dropped) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(dropped);
                }
            }
            else
            {
                var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter : (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] > 300)
                        }
                    });
                if (container)
                {
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(container);
                    }
                }
                else
                {
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

module.exports = roleUpgrader;
