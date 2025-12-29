import { ATTRIBUTE_CONFIG } from './constants';
import { createRollDialog } from './createRollDialog';

interface RollOptions {
    actor: any;
    initialKey: string;
}

export const rollDice = async ({ actor, initialKey }: RollOptions) => {
    
    const result = await createRollDialog(actor, initialKey);
    
    if (result.cancelled) return;
    
    const { attributeKey, modifier } = result;
    const attributeLabel = ATTRIBUTE_CONFIG[attributeKey];
    const attributeValue = actor.system.attributes[attributeKey]?.value || 0;
    const formula = `1d20 + ${attributeValue} + ${modifier}`;

    try {
        const roll = new Roll(formula);
        await roll.evaluate();

        roll.toMessage({
            speaker: { actor: actor },
            // @ts-ignore
            flavor: `
                <div class="roll-flavor">
                    <h3>Teste de ${attributeLabel}</h3>
                    <div style="font-size: 0.9em; color: #777; margin-top: 5px;">
                        Atributo (${attributeValue})
                        ${modifier !== "0" ? ` + Modificador (${modifier})` : ''}
                    </div>
                </div>
            `,
            rollMode: "roll"
        });

    } catch (err) {
        console.error("Erro ao rolar dados:", err);
        ui.notifications.error("Erro ao processar a rolagem.");
    }
};