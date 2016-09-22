var RepCB = require('CreepBase');
var RepRL = require('RoomLevels');
var RepBody = {
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

var wallRepLimit = 240000;

var roleRepairer = {
        GetBody : function(level)
    {
        if (level <= RepRL.Level1)
        {
            return RepBody.Level1;
        }
        if (level <= RepRL.Level2)
        {
            return RepBody.Level2;
        }
        if (level <= RepRL.Level3)
        {
            return RepBody.Level3;
        }
        if (level <= RepRL.Level4)
        {
            return RepBody.Level4;
        }
        if (level <= RepRL.Level5)
        {
            return RepBody.Level5;
        }
        if (level <= RepRL.Level6)
        {
            return RepBody.Level6;
        }
        if (level <= RepRL.Level7)
        {
            return RepBody.Level7;
        }

        return RepBody.Level1;
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
                    return Spawn.createCreep(Body, Name, { Role : RepCB.Repair, Target : null, Task : RepCB.Harvest});
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

            Target = Creep.pos.findClosestByPath(RepCB.GetHarvestTargets(Creep));
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

    RunRepair: function(Creep, Damaged)
    {
        var closestDamagedStructure = Creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => ((structure.structureType == STRUCTURE_WALL ||
                                    structure.structureType == STRUCTURE_RAMPART) &&
                                    structure.hits < wallRepLimit) ||
                                    ((structure.structureType == STRUCTURE_ROAD) &&
                                    structure.hits < (structure.hitsMax / 1.3))
        });
        if(closestDamagedStructure)
        {
            Creep.repair(closestDamagedStructure);
            Creep.moveTo(closestDamagedStructure);
        }
    },
    Run: function(Creep) {
        if (Creep.carry.energy == 0)
        {
            if (Creep.memory.Task == RepCB.Repair)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = RepCB.Harvest;
        }
        if (Creep.carry.energy == Creep.carryCapacity)
        {
            if (Creep.memory.Task == RepCB.Harvest)
            {
                Creep.memory.Target = null;
            }
            Creep.memory.Task = RepCB.Repair;
        }

        switch (Creep.memory.Task)
        {
            case RepCB.Repair:
                this.RunRepair(Creep, GetRepairTargets(Creep))
                break;
            case RepCB.Harvest:
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


module.exports = roleRepairer;
