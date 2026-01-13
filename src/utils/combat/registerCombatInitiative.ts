/* eslint-disable @typescript-eslint/no-explicit-any */
import { showInitiativeDialog } from './showInitiativeDialog';

export const registerCombatInitiative = () => {
  const originalCombatRoll = Combat.prototype.rollInitiative; 
  Combat.prototype.rollInitiative = async function(ids: string[] | string, options: any = {}) {  
    const combatantIds = typeof ids === "string" ? [ids] : ids; 

    if (options.formula || combatantIds.length > 1) {
        return await originalCombatRoll.call(this, combatantIds, options);
    }

    const combatant = this.combatants.get(combatantIds[0]);

    if (!combatant || !combatant.actor) {
        return originalCombatRoll.call(this, combatantIds, options);
    }
    
    return await showInitiativeDialog(combatant.actor);
  };
};