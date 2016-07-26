var Room=Game.spawns.Spawn1.room;

var roleRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var spwn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            creep.moveTo(spwn);
            if((Room.energyAvailable) > [700]) {
                spwn.transferEnergy(creep);
            }
            else {
                //console.log('THERE IS NOT ENOUGH ENERGY!!!!!')
                //this is jacked
                spwn.transferEnergy(creep);
            }
        }
        else {
            var repRoad = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(object){
                    if(object.structureType == STRUCTURE_ROAD & object.hits < object.hitsMax / 3){
                        return true;
                    }
                    else {
                        return false;
                    }
                } 
            });
            //debug to check if repRoad exists
            //console.log(repRoad)
            creep.moveTo(repRoad);
            creep.repair(repRoad);

            if(repRoad){
                //console.log('I am repairing roads now')
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < 75000 & object.structureType != STRUCTURE_SPAWN
	            });
                //targets.sort().hits;
                //_.sortBy(targets,'hits')
                console.log(targets[0].hits)
                if(targets.length) {
                    //console.log('I am repairing walls now');
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
        }
    }
};


module.exports = roleRepairer;