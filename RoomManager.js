
// Don't forget to update the version and figure out how to update existing
// objects if this changes.
var ROOM_MEM_VERSION = 1;
var ROOM_MEM_PROPS = ['Version', 'HarvestCap', 'UpgradeCap', 'BuildCap', 'RepairCap', 'MinerCap', 'Level', 'Mineral'];

/*
Initalize a room memory object, to store population caps and other data for easy access
*/
function InitRoomMem(hCap, uCap, bCap, rCap, mCap, Level, Mineral)
{

    this.Version = ROOM_MEM_VERSION;
    this.HarvestCap = hCap;
    this.UpgradeCap = uCap;
    this.BuildCap = bCap;
    this.RepairCap = rCap;
    this.MinerCap = mCap;
    this.Level = Level;
    this.Mineral = Mineral;
}

/*
Try to update the a newer version of the Memory object structure
*/
function UpdateRoomMem(RoomName)
{
    if (Memory[RoomMem].Version != ROOM_MEM_VERSION)
    {
        for (var i in ROOM_MEM_PROPS)
        {
            if (!Memory[RoomMem].hasOwnProperty(ROOM_MEM_PROPS[i]))
            {
                Memory[RoomMem][ROOM_MEM_PROPS[i]] = null;
            }
        }
    }
}

/*
Filter function to return creeps in a specific room.
*/
function InMyRoom(RoomName)
{
    // The madness that is returning a function
    return function (Creep)
        {
            return Creep.room.name == RoomName;
        };
}

var RoomMgr = {
    InitMem : function (RoomName)
    {
        if (Memory.hasOwnProperty(RoomName))
        {
            UpdateRoomMem(RoomName);
        }
        else
        {
            var mineral = null;
            var minerals = Game.rooms[RoomName].find(FIND_MINERALS);
            if (minerals.length > 0)
            {
                mineral = minerals[0].mineralType;
            }
            Memory[RoomName] = new InitRoomMem(1,1,1,1,1,Game.rooms[RoomName].controller.level, mineral);
        }
    },

    GetRoomCreeps : function (RoomName)
    {

        return Game.creeps.filter(InMyRoom(RoomName));
    },

    GetRoomTowers : function (RoomName)
    {
        return Game.rooms[RoomName].room.find(FIND_STRUCTURES, {
            filter : (obj) => {
                return obj.structureType == STRUCTURE_TOWER;
            }
        });
    }
};

module.exports = RoomMgr;
