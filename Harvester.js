var HarvCB = require('CreepBase');
var HarvRL = require('RoomLevels');
var HarvBody = {
    Level1 : [  WORK,WORK,
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


var Harvester =
{
    GetBody : function(level)
    {
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

        return HarvBody.Level1;
    },

    Spawn : function(Room, Name)
    {
        var Spawns = Game.rooms[Room].find(FIND_STRUCTURES, {
            filter : (obj) => {
                return obj.structureType == STRUCTURE_SPAWN;
            }
        });
        if (Spawns.length > 0)
        {
            var Body = this.GetBody(Game.rooms[Room].energyCapacityAvailable);
            for (let Spawn of Spawns)
            {
                if (Spawn.canCreateCreep(Body, Name) == 0)
                {
                    return Spawn.createCreep(Body, Name, { Role : HarvCB.Harvest, Target : null, Task : HarvCB.Harvest});
                }
                else
                {
                    return Spawn.canCreateCreep(Body, Name);
                }

            }
        }
    },

    AssignTask : function(Creep)
    {
        if (Creep.carry.energy == Creep.carryCapacity)
        {
            if (Creep.memory.Task == HarvCB.Harvest)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = HarvCB.Store;
        }
        else if (Creep.carry.energy < 50)
        {
            if (Creep.memory.Task == HarvCB.Store)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = HarvCB.Harvest;
        }
    },
    RunHarvest : function (Creep)
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
        };

        switch(Creep.harvest(Target))
        {
            case ERR_INVALID_TARGET:
                Creep.pickup(Target);
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(Target);
            default:
                Creep.memory.Target = null;
        }
    },

    RunStore : function(Creep)
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
        else
        {
            Creep.memory.Target = null;
        }
    },

    Run : function(Creep)
    {
        this.AssignTask(Creep);
        switch (Creep.memory.Task)
        {
            case HarvCB.Harvest:
                this.RunHarvest(Creep);
                break;
            case HarvCB.Store:
                this.RunStore(Creep);
                break;
            default:
                HarvCB.RunIdle(Creep);
                break;
        }
    }
};

module.exports = Harvester;
