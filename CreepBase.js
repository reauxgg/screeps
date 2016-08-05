var IdleColor = COLOR_GREY;

var CreepBase = {
    Harvest : 'HARVEST',
    Build : 'BUILD',
    Repair : 'REPAIR',
    Upgrade : 'UPGRADE',
    Idle : 'IDLE',
    Defense : 'DEFENSE',
    Heal : 'HEAL',
    Claim : 'CLAIM',
    Attack : 'ATTACK',
    Store : 'STORE',

    GetHarvestTargets : function(creep)
    {
        var Dropped = creep.room.find(FIND_DROPPED_ENERGY);
        if (Dropped.length > 0)
        {
            return Dropped;
        }
        var Active = creep.room.find(FIND_SOURCES_ACTIVE);
        if (Active.length > 0)
        {
            return Active;
        }
        else {
            // Try to figure out who'll go active next
            var NextRegen = creep.room.find(FIND_SOURCES);
            var LowestRegen = NextRegen[0];
            for (obj in NextRegen)
            {
                if (obj.ticksToRegeneration < LowestRegen.ticksToRegeneration)
                {
                    LowestRegen = obj;
                }
            }
            return LowestRegen;
        }
    },

    GetBuildTargets : function (creep) {
        return creep.room.find(FIND_CONSTRUCTION_SITES);
    },

    GetRepairTargets : function (creep) {
        return creep.room.find(FIND_STRUCTURES, {
                filter : (obj) => {
                    return obj.hits < obj.hitsMax;
                }
            });
    },

    GetUpgradeTargets : function (creep) {
        return creep.room.controller;
    },
    GetIdleTargets : function (creep) {
        return creep.room.find(FIND_FLAGS, {
                filter : (flag) => {
                    return flag.color == IdleColor;
                }
        });
    },
    GetDefenseTargets : function (creep) {
        return creep.room.find(FIND_HOSTILE_CREEPS);
    },
    GetHealTargets : function (creep) {
        return creep.room.find(FIND_CREEPS, {
                filter : (obj) => {
                    return obj.hits < obj.hitsMax;
                }
            });
    },
    GetClaimTargets : function (creep) {
        if (creep.room.controller.reservation != creep.owner.username)
        {
            return creep.room.controller;
        }
        else
        {
            return null;
        }
    },
    GetAttackTargets : function (creep) {
        // Get defenders and towers first
        var Defenders = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter : (obj) => {
                return obj.getActiveBodyParts(ATTACK) || obj.getActiveBodyParts(RANGED_ATTACK);
            }
        });
        var Towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter : (obj) => {
                return obj.structureType == STRUCTURE_TOWER;
            }
        })
        return Towers.concat(Defenders);
    },
    GetStorageTargets : function(creep)
    {
        return creep.room.find(FIND_STRUCTURES, {
            filter : (obj) => {
                return  (obj.structureType == STRUCTURE_SPAWN) ||
                        (obj.structureType == STRUCTURE_EXTENSION) ||
                        (obj.structureType == STRUCTURE_TOWER) ||
                        (obj.structureType == STRUCTURE_CONTAINER) ||
                        (obj.structureType == STRUCTURE_STORAGE);
            }
        });
    },
    RunIdle : function(creep)
    {
        var Target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter : (obj) => { return obj.structureType == STRUCTURE_SPAWN;}
        });
        if (!Target)
        {
            Target = creep.room.controller;
        }
        creep.moveTo(Target);
    }
};

module.exports = CreepBase;
