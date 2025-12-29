import './styles/main.scss';
import { ActorSheetV13 } from './sheets/ActorSheetV13';

Hooks.once('init', () => {

  Actors.unregisterSheet('core', ActorSheet);

  Actors.registerSheet('meu-sistema-v13', ActorSheetV13 as any, {
    types: ['character', 'npc'],
    makeDefault: true,
    label: "Ficha React V13"
  });
});

Hooks.once('ready', () => {
  console.log('MEU SISTEMA REACT V13 | Pronto!');
});