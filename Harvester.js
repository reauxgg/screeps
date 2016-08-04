var HarvCB = require('CreepBase');
var HarvRL = require('RoomLevels');
var HarvBody = {
    Level1 : [  WORK,
                CARRY,
                MOVE];
    Level2 : [  WORK,WORK,
                CARRY,CARRY,
                MOVE,MOVE];
    Level3 : [  WORK,WORK,WORK,
                CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE];
    Level4 : [  WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE];
    Level5 : [  WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE];
    Level6 : [  WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE];
};


var Harvester = {
    GetBody : function(level) {
        if (level < HarvRL.EnergyLevels.Level1)
        {
            return HarvBody.Level1;
        }
        if (level < HarvRL.EnergyLevels.Level2)
        {
            return HarvBody.Level2;
        }
        if (level < HarvRL.EnergyLevels.Level3)
        {
            return HarvBody.Level3;
        }
        if (level < HarvRL.EnergyLevels.Level4)
        {
            return HarvBody.Level4;
        }
        if (level < HarvRL.EnergyLevels.Level5)
        {
            return HarvBody.Level5;
        }
        if (level < HarvRL.EnergyLevels.Level6)
        {
            return HarvBody.Level6;
        }
    }

    Run : function(Creep)
    {
        if (Creep.carry.energy == Creep.carryCapacity)
        {
            Creep.memory.gather = false;
        }
        else if (Creep.carry.energy < 50)
        {
            Creep.memory.gather = true;
        }

        if (Creep.memory.gather)
        {
            var target = Creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            if (target)
            {
                if (Creep.pickup(target) == ERR_NOT_IN_RANGE)
                {
                    Creep.moveTo(target);
                }
            }
            else {
                target = Creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (target)
                {
                    if (Creep.harvest(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        Creep.moveTo(target);
                    }
                }
            }
        }
        else
        {
            var target = Creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter : obj => {
                        return  ((obj.structureType == STRUCTURE_SPAWN) ||
                                (obj.structureType == STRUCTURE_EXTENSION)) &&
                                (obj.energy < obj.energyCapacity);
                    }
                });
            if (!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter : obj => {
                            return (obj.structureType == STRUCTURE_TOWER) &&
                                    (obj.energy < obj.energyCapacity);
                        }
                    });
                if (!target)
                {
                    target = Creep.room.storage;
                }
            }
            if (Creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                Creep.moveTo(target);
            }
        }
    }

};

module.exports = Harvester;
