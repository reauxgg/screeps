function get_random(max_ran)
{
    var ranNum= Math.floor(Math.random()*max_ran);
    return ranNum;
}

RoomPosition.prototype.NearestSource = function(opts) {
    return this.findClosestByRange(FIND_SOURCES, opts);
}

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.memory.spent = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
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

module.exports = roleUpgrader;