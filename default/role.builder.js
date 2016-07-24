function get_random(max_ran)
{
    var ranNum= Math.floor(Math.random()*max_ran);
    return ranNum;
}

RoomPosition.prototype.NearestSource = function(opts) {
    return this.findClosestByRange(FIND_SOURCES, opts);
}

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            if (creep.memory.role != creep.memory.roleOriginal)
            {
                console.log("Switching back to " + creep.memory.roleOriginal);
                creep.memory.role = creep.memory.roleOriginal;
            }
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	         var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION);
                    }
            });
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);    
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
                else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                    structure.energy < structure.energyCapacity;
                            }
                    });
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
            }
	        
            
	    }
	    else {
	        var sources =  creep.room.find(FIND_SOURCES);
            var len = sources.length;
            if (!creep.memory.hasOwnProperty("mysource")) {
                if (len != 0)
                {
                    creep.memory.mysource = get_random(len);
                    //var mysource = sources[get_random(len)].id;
                    //creep.memory.mysource = mysource;
                }
            }
            var mysource = creep.memory.mysource;
            if(creep.harvest(sources[mysource]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[mysource]);
            }
	    }
	}
};

module.exports = roleBuilder;