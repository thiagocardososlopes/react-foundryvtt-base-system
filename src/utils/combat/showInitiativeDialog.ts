/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRollDialog } from '../createRollDialog';

export const showInitiativeDialog = async (actor: any) => {
    
    const result = await createRollDialog(actor, 'dex'); 
    
    if (result.cancelled) return null;

    const { attributeKey, modifier } = result;
    const attributeValue = actor.system.attributes[attributeKey]?.value || 0;
    
    const formula = `1d20 + ${attributeValue} + ${modifier}`;

    return await actor.rollInitiative({
        createCombatants: true,
        rerollInitiative: true,
        initiativeOptions: {
            formula: formula,
            dialogDone: true
        }
    });
};