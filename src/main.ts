/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles/main.scss';
import { ActorSheetV13 } from './sheets/ActorSheetV13';
import { registerCombatInitiative } from './utils/combat/registerCombatInitiative';

Hooks.once('init', () => {
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("meu-sistema", ActorSheetV13 as any, { makeDefault: true });

    CONFIG.Combat.initiative = {
        formula: "1d20 + @system.attributes.dex.value",
        decimals: 2
    };

    registerCombatInitiative();
});

Hooks.once('ready', () => {
    console.log('SYSTEM REACT V13 | Ready!');
});