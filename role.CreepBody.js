var CreepBody = {
    Lvl0 : [],
    Lvl1 : [],
    Lvl2 : [],
    Lvl3 : [],
    Lvl4 : [],
    Lvl5 : [],
    Bodies : [Lvl0,Lvl1,Lvl2,Lvl3,Lvl4,Lvl5],
    GetBody : function (Level)
    {
      if (Level < 6)
      {
        return Bodies[Level];
      }
      else {
        return Bodies[5];
      }
    }
};

module.exports = CreepBody;
