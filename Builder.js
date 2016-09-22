var BuildCB = require('CreepBase');
var BuildRL = require('RoomLevels');
var BuildBody = {
    Level1 : [  WORK,WORK,
                CARRY,
                MOVE],
    Level2 : [  WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,],
    Level3 : [  WORK,WORK,WORK,
                CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE],
    Level4 : [  WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE],
    Level5 : [  WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE],
    Level6 : [  WORK,WORK,WORK,WORK,WORK,
                WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE],
    Level7 : [  WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE],
};

var roleBuilder = {
    GetBody : function(level)
    {
        if (level <= BuildRL.Level1)
        {
            return BuildBody.Level1;
        }
        if (level <= BuildRL.Level2)
        {
            return BuildBody.Level2;
        }
        if (level <= BuildRL.Level3)
        {
            return BuildBody.Level3;
        }
        if (level <= BuildRL.Level4)
        {
            return BuildBody.Level4;
        }
        if (level <= BuildRL.Level5)
        {
            return BuildBody.Level5;
        }
        if (level <= BuildRL.Level6)
        {
            return BuildBody.Level6;
        }
        if (level <= BuildRL.Level7)
        {
            return BuildBody.Level7;
        }

        return BuildBody.Level1;
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
                    return Spawn.createCreep(Body, Name, { Role : BuildCB.Build, Target : null, Task : BuildCB.Harvest});
                }
                else
                {
                    return Spawn.canCreateCreep(Body, Name);
                }

            }
        }
    },

    RunHarvest : function (Creep)
    {
        var Target = null;
        if (!Creep.memory.Target)
        {
            if (Creep.room.storage)
            {
                Creep.memory.Target = Creep.room.storage.id;
            }
            else
            {
                Target = Creep.pos.findClosestByPath(BuildCB.GetHarvestTargets(Creep));
                Creep.memory.Target = Target.id;
            }

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
                Creep.moveTo(Target);
            default:
                Creep.memory.Target = null;
        }
    },

    Run: function(Creep) {
        if (Creep.carry.energy == 0)
        {
            if (Creep.memory.Task == BuildCB.Build)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = BuildCB.Harvest;
        }
        if (Creep.carry.energy == Creep.carryCapacity)
        {
            if (Creep.memory.Task == BuildCB.Harvest)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = BuildCB.Build;
        }

        switch (Creep.memory.Task)
        {
            case BuildCB.Build:
                var Site = Creep.pos.findClosestByPath(BuildCB.GetBuildTargets(Creep));
                if (Site)
                {
                    if (Creep.build(Site) == ERR_NOT_IN_RANGE)
                    {
                        Creep.moveTo(Site);
                    }
                }
                break;
            case BuildCB.Harvest:
                if (Creep.room.storage)
                {
                    if (Creep.withdraw(Creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        Creep.moveTo(Creep.room.storage);
                    }
                }
                else
                {
                    this.RunHarvest(Creep);
                }
        }
    }
};

module.exports = roleBuilder;
