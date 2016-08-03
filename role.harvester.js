var CreepBase = require(CreepBase);
var EnergyLevels = CreepBase.EnergyLevels;
var TaskHarvest = "HARVEST";
var TaskStore = "STORE";
var Bodies = [];
Bodies[EnergyLevels.Level1] = [WORK,
                               CARRY,
                               MOVE];
Bodies[EnergyLevels.Level2] = [WORK,WORK,
                               CARRY,CARRY,
                               MOVE,MOVE];
Bodies[EnergyLevels.Level3] = [WORK,WORK,WORK,
                               CARRY,CARRY,CARRY,
                               MOVE,MOVE,MOVE];
Bodies[EnergyLevels.Level4] = [WORK,WORK,WORK,
                               CARRY,CARRY,CARRY,CARRY,CARRY,
                               MOVE,MOVE,MOVE,MOVE];
Bodies[EnergyLevels.Level5] = [WORK,WORK,WORK,WORK,
                               CARRY,CARRY,CARRY,CARRY,CARRY,
                               MOVE,MOVE,MOVE,MOVE,MOVE];
Bodies[EnergyLevels.Level6] = [WORK,WORK,WORK,WORK,
                               CARRY,CARRY,CARRY,CARRY,CARRY,
                               MOVE,MOVE,MOVE,MOVE,MOVE];
var roleHarvester = {
    GetBody : function (EnergyLevel)
    {
        for (key in keys(Bodies))
        {
            if (EnergyLevel <= key)
            {
                return Bodies[key];
            }
        }
    },
    AssignRole : function (creep)
    {
        creep.memory.role = CreepBase.Harvest;
    },
    AssignTarget : function (creep, objs)
    {
        creep.memory.target = creep.room.pos.findClosestByPath(objs);
    },
    CheckTarget : function (creep)
    {
        var target = creep.memory.Target;
        switch (creep.memory.Task)
        {
            case TaskHarvest:
                return target.energy > 0;
                break;
            case TaskStore:
                try
                {
                    return (target.storeCapacity > target.store[RESOURCE_ENERGY]);
                }
                catch (err)
                {
                    return (target.energyCapacity > target.energy);
                }
                break;
            default:
                return false;
        }
    }

    Run: function(creep)
    {
        //Check for full energy
	    if(creep.carry.energy == creep.carryCapacity)
        {
	        creep.memory.Task = TaskStore;
	    }
	    if(creep.carry.energy < 50)
        {
	        creep.memory.Task = TaskHarvest;
	    }

        if (creep.memory.target)
        {
            switch (creep.memory.Task)
            {
                case TaskStore:
                    if (creep.transfer(creep.memory.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.memory.target);
                    }
                    else
                    {
                        // If that fails, try to get a new target next tick...
                        creep.memory.target = null;
                    }
                    break;
                case TaskHarvest:
                //default to try to harvest
                default:
                    if (creep.harvest(creep.memory.target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.memory.target);
                    }
                    else
                    {
                        creep.memory.target = null;
                    }
            }
        }

	    //Get full energy, if needed
	    if(creep.memory.return == false) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }

        //If full energy, return energy to structures
        else
        {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                                    filter: (structure) => {
                                                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                                                structure.structureType == STRUCTURE_SPAWN ||
                                                                (structure.structureType == STRUCTURE_TOWER &&
                                                                    structure.energy < 300)) &&
                                                                structure.energy < structure.energyCapacity;
                                                            }
                                                        });
            if (!target)
            {
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
                                                                return structure.structureType == STRUCTURE_TOWER &&
                                                                        structure.energy < structure.energyCapacity;
                                                                    }
                                                                });
            }
            else if (target == null)
            {
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
                                                            return (structure.structureType == STRUCTURE_STORAGE)
                                                                && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                                                            }
                                                        });
                if (target)
                {
                    if (creep.transfer(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            }
            else
            {
                /*if (!creep.memory.roleOriginal)
                {
                    creep.memory.roleOriginal = 'harvester';
                }
                creep.memory.role = 'builder';
                */
            }

// Move to closest energy container
// console.log('Giving enrgy to: ' + target)
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

	}
};

module.exports = roleHarvester;
