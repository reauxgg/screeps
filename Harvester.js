var HarvCB = require('CreepBase');
var HarvRL = require('RoomLevels');
var HarvBody = {
    Level1 : [  WORK,
                CARRY,
                MOVE],
    Level2 : [  WORK,WORK,
                CARRY,CARRY,
                MOVE,MOVE],
    Level3 : [  WORK,WORK,WORK,
                CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE],
    Level4 : [  WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE],
    Level5 : [  WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE],
    Level6 : [  WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE],
};


var Harvester = {
    GetBody : function(level) {
        if (level <= HarvRL.Level1)
        {
            return HarvBody.Level1;
        }
        if (level <= HarvRL.Level2)
        {
            return HarvBody.Level2;
        }
        if (level <= HarvRL.Level3)
        {
            return HarvBody.Level3;
        }
        if (level <= HarvRL.Level4)
        {
            return HarvBody.Level4;
        }
        if (level <= HarvRL.Level5)
        {
            return HarvBody.Level5;
        }
        if (level <= HarvRL.Level6)
        {
            return HarvBody.Level6;
        }
    },

    Run : function(Creep)
    {
        if (Creep.carry.energy == Creep.carryCapacity)
        {
            if (Creep.memory.gather)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.gather = false;
        }
        else if (Creep.carry.energy < 50)
        {
            if (!Creep.memory.gather)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.gather = true;
        }

        if (Creep.memory.gather)
        {
            var Target = null;
            if (!Creep.memory.Target)
            {
                Target = Creep.pos.findClosestByPath(HarvCB.GetHarvestTargets(Creep));
                Creep.memory.Target = Target.id;
            }
            else
            {
                Target = Game.getObjectById(Creep.memory.Target);
            }

            switch(Creep.harvest(Target))
            {
                case ERR_INVALID_TARGET:
                    Creep.pickup(Target);
                case ERR_NOT_IN_RANGE:
                default:
                    Creep.moveTo(Target);
            }

        }
        else
        {
            var Target = null;
            if (!Creep.memory.Target)
            {
                var Targets = HarvCB.GetStorageTargets(Creep);
                var Priority = Targets.filter(function(obj) {
                        return ((obj.structureType == STRUCTURE_SPAWN) ||
                                (obj.structureType == STRUCTURE_EXTENSION)) &&
                                (obj.energy < obj.energyCapacity);
                    });
                if (Priority.length == 0)
                {
                    var Priority = Targets.filter(function(obj) {
                            return (obj.structureType == STRUCTURE_TOWER) &&
                                    (obj.energy < obj.energyCapacity);
                    });
                    if (Priority.length == 0)
                    {
                        var Priorty = [Creep.room.storage];
                    }
                }
                Target = Creep.pos.findClosestByPath(Priority);
                if (Target)
                {
                    Creep.memory.Target = Target.id;
                }

            }
            else
            {
                Target = Game.getObjectById(Creep.memory.Target);
            }

            if (Creep.transfer(Target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                Creep.moveTo(Target);
            }
        }
    }
};

module.exports = Harvester;
