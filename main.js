/*
Memory.RoomName Object = {
    hCap : 2,
    uCap : 1,
    bCap : 1,
    rCap : 1,
    mCap : 1,
    cCap : 0,
    Level : 0,
    MaxEnergy : 300,
    Mineral : RESOURCE_HYDROGEN,
}

For each room...
    Calc creep population
    Check to spawn creeps
    Update any creep jobs?
    For each creep...
        Run their job
    For each tower...
        Run tower job
Creeps jobs
    Gather energy
    Gather mineral
    Upgrade room controller
    Repair structures
    Build structures
    Claim Room controllers
    Transfer Energy to storage
    Transfer Energy to Spawn/Extensions
    Transfer Energy to Links
    Transfer Energy to Towers
    Transfer minerals to storage
    Transfer minerals to lab

*/
var MyRooms = ['W22S49', 'W23S49'];

function MyRoom (void)
{
    this.memory.HarvCap = 1;
    this.memory.BuildCap = 1;
    this.memory.UpgradeCap = 1;
    this.memory.RepairCap = 1;
    this.memory.MinerCap = 1;
}
module.exports.loop = function ()
{
    for (var RoomName in MyRooms)
    {
        var Room = Game.rooms[RoomName];

    }

};
