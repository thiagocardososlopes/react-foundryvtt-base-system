import './styles/main.scss';
import { ActorSheetV13 } from './sheets/ActorSheetV13';

// ESSE LOG DEVE APARECER
console.log(">>> MAIN TS CARREGADO <<<");

Hooks.once('init', () => {
  console.log('MEU SISTEMA REACT V13 | Inicializando...');

  Actors.unregisterSheet('core', ActorSheet);

  // Usando 'as any' para evitar erro de TS
  Actors.registerSheet('meu-sistema-v13', ActorSheetV13 as any, {
    types: ['character', 'npc'],
    makeDefault: true,
    label: "Ficha React V13"
  });
});

Hooks.once('ready', () => {
  console.log('MEU SISTEMA REACT V13 | Pronto!');
});