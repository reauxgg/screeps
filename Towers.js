var Towers = {
    Run : function(Tower, Room)
    {
        var tows = Game.rooms[Room].find(FIND_STRUCTURES, {
            
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        for (let tow of tows) {
            var target = tow.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tow.attack(target);
                Game.notify("Tower has spotted enemies!")
            }
            else {
        // Turn on tow healing?
                var closestDamagedStructure = tow.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => ((structure.structureType == STRUCTURE_WALL ||
                                            structure.structureType == STRUCTURE_RAMPART) &&
                                            structure.hits < 125000) ||
                                            ((structure.structureType == STRUCTURE_ROAD) &&
                                            structure.hits < (structure.hitsMax / 1.3))
                });
                if(closestDamagedStructure && tow.energy > 300) {
                    tow.repair(closestDamagedStructure);
                }
        // Turn off healing
            }
        }
    }
}

module.exports = Towers;
