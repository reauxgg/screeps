# Screeps scripts

Screeps design:

While (tick)
    Clear previous targets
    For Each Spawn
        For Each Creep
            Tick Init
                Check role
                Check Role's target
                Request new target(s) if not already present
                    GetHarvestTargets
                    GetBuildTargets
                    GetRepairTargets
                    GetUpgradeTargets
                    GetIdleTargets
                    GetDefenseTargets
                    GetHealTargets
                    GetClaimTargets
                    GetAttackTargets
            Build Target Lists as required
            Update Creep Target
            Run Creep
        For Each Tower
            Check target
            Build Target list if needed
            Assign new target
