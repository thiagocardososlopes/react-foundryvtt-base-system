import { ATTRIBUTE_CONFIG } from './constants';

interface DialogResult {
    attributeKey: string;
    modifier: string;
    cancelled: boolean;
}

export const createRollDialog = async (actor: any, initialKey: string): Promise<DialogResult> => {
    return new Promise((resolve) => {
        
        const optionsHtml = Object.entries(ATTRIBUTE_CONFIG).map(([key, {label}]) => {
            const isSelected = key === initialKey ? 'selected' : '';
            return `<option value="${key}" ${isSelected}>${label}</option>`;
        }).join('');

        const content = `
            <form class="roll-dialog-form">
                <div class="form-group">
                    <label>Atributo:</label>
                    <select name="attributeKey">${optionsHtml}</select>
                </div>
                <div class="form-group">
                    <label>Modificador Situacional:</label>
                    <input type="text" name="modifier" value="" placeholder="+2 -1d4" autocomplete="off"/>
                </div>
            </form>
        `;

        // @ts-ignore
        new Dialog({
            title: `Configurar Rolagem: ${actor.name}`,
            content: content,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-dice-d20"></i>',
                    label: "ROLAR",
                    callback: (html: JQuery) => {
                        const attributeKey = html.find('[name="attributeKey"]').val() as string;
                        
                        const rawModifier = html.find('[name="modifier"]').val() as string;

                        const modifier = rawModifier
                            .trim()
                            .split(/\s+/)
                            .filter(part => part)
                            .join(" + ");

                        resolve({ attributeKey, modifier: modifier || "0", cancelled: false });
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancelar",
                    callback: () => resolve({ attributeKey: "", modifier: "0", cancelled: true })
                }
            },
            default: "roll",
            close: () => resolve({ attributeKey: "", modifier: "0", cancelled: true })
        }, {
            classes: ["dialog", "rpg-roll-dialog"],
            width: 400
        }).render(true);
    });
};