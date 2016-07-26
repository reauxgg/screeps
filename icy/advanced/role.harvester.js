function get_random(max_ran)
{
    var ranNum= Math.floor(Math.random()*max_ran);
    return ranNum;
}

RoomPosition.prototype.NearestSource = function(opts) {
    return this.findClosestByRange(FIND_SOURCES, opts);
}

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
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
            else {
                console.log("Switching to builder");
                creep.memory.roleOriginal = "harvester";
                creep.memory.role = "builder";
            }
        }
	}
};

module.exports = roleHarvester;