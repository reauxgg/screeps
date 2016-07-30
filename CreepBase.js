var CreepInit = {
    Init : function(Creep, Role) {
        var Mem = Creep.memory;
        Mem.Sources = Creep.room.find(FIND_SOURCES);
        Mem.Buildings = Creep.room.find(FIND_STRUCTURES);
        Mem.Target = null;
        Mem.Gather = true;
        Mem.Job = null;
        Mem.Level = 0;
        Mem.Role = Role;
    },

};

module.exports = CreepInit;
