var UpCB = require('CreepBase');
var UpRL = require('RoomLevels');
var UpBody = {
    Level1 : [  WORK,WORK,
                CARRY,
                MOVE],
    Level2 : [  WORK,WORK,
                CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE],
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
    Level7 : [  WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                WORK, WORK, WORK, WORK, WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE],
};

var roleUpgrader = {
    GetBody : function(level)
    {
        if (level <= UpRL.Level1)
        {
            return UpBody.Level1;
        }
        if (level <= UpRL.Level2)
        {
            return UpBody.Level2;
        }
        if (level <= UpRL.Level3)
        {
            return UpBody.Level3;
        }
        if (level <= UpRL.Level4)
        {
            return UpBody.Level4;
        }
        if (level <= UpRL.Level5)
        {
            return UpBody.Level5;
        }
        if (level <= UpRL.Level6)
        {
            return UpBody.Level6;
        }
        if (level <= UpRL.Level7)
        {
            return UpBody.Level7;
        }

        return UpBody.Level1;
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
                    return Spawn.createCreep(Body, Name, { Role : UpCB.Upgrade, Target : null, Task : UpCB.Harvest});
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
        if (Creep.memory.Target == null)
        {

            Target = Creep.pos.findClosestByPath(UpCB.GetHarvestTargets(Creep));
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


    Run: function(Creep) {
        if (Creep.carry.energy == 0)
        {
            if (Creep.memory.Task == UpCB.Upgrade)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = UpCB.Harvest;
        }
        if (Creep.carry.energy == Creep.carryCapacity)
        {
            if (Creep.memory.Task == UpCB.Harvest)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = UpCB.Upgrade;
        }

        switch (Creep.memory.Task)
        {
            case UpCB.Upgrade:
                if (Creep.upgradeController(Creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    Creep.moveTo(Creep.room.controller);
                }
                break;
            case UpCB.Harvest:
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

module.exports = roleUpgrader;
