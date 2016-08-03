var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.roleOriginal = 'healer';
        creep.memory.role = 'upgrader';
	}
};

module.exports = roleHealer;
