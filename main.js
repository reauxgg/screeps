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

function RoomInit(Harvs, Builds, Ups, Reps, Claims, Miners, Level, Minerals)
{
    this.hCap = Harvs;
    this.bCap = Builds;
    this.uCap = Ups;
    this.cCap = Claims;
    this.mCap = Miners;
    this.Level = Level;
    this.MineralType = Minerals;
}

var MyRooms = ['W22S49', 'W23S49'];

function CheckRoomMem(RoomName)
{
    if (!Memory.hasOwnProperty(RoomName))
    {
        var mineral = Game.rooms[RoomName].find(FIND_MINERALS);
        if (mineral.length > 0)
        {
            mineral = mineral[0].mineralType;
        }
        else
        {
            mineral = null;
        }
        Memory[RoomName] = new RoomInit(1,1,1,1,1,1,1,mineral);
    }
}

module.exports.loop = function ()
{
    // Check Room variables
    for (var RoomName in MyRooms)
    {
        CheckRoomMem(RoomName);

    }

};
