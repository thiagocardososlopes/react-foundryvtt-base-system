import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ActorSheetRPGComponent } from './ActorSheetRPGComponent';

const { DocumentSheetV2 } = (foundry as any).applications.api;

export class ActorSheetV13 extends DocumentSheetV2 {
  root: Root | null = null;

  static DEFAULT_OPTIONS = {
    classes: ['meu-sistema-v13', 'actor-sheet'],
    tag: 'div',
    window: {
      title: 'Ficha React V13',
      icon: 'fas fa-user',
      resizable: true,
    },
    position: { width: 700, height: 800 },
    actions: {}
  };

  async _renderHTML(context: any, options: any) {
    const div = document.createElement("div");
    div.id = `react-root-${this.id}`;
    div.classList.add("react-target");
    div.style.height = "100%";
    div.style.flex = "1";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.overflow = "hidden";
    div.innerHTML = `<h3 style="color:white; text-align:center; margin-top:20px;">Carregando React...</h3>`;
    return div;
  }

  _replaceHTML(result: HTMLElement, content: HTMLElement, options: any) {
    const windowContent = this.element.querySelector('.window-content');

    if (windowContent) {
        windowContent.innerHTML = '';
        windowContent.appendChild(result);
    } else {
        content.innerHTML = '';
        content.appendChild(result);
        this._insertElement(content);
    }
  }

  async render(options: any = {}) {
    if (!this.element) return super.render(options);

    const target = this.element.querySelector(`#react-root-${this.id}`);

    if (this.root && target) {
        const context = await this._prepareContext(options);
        this.root.render(
            <React.StrictMode>
                <ActorSheetRPGComponent actor={this.document} context={context} />
            </React.StrictMode>
        );
        return this;
    }
    return super.render(options);
  }

  _onRender(context: any, options: any) {
    const targetId = `#react-root-${this.id}`;
    const target = this.element.querySelector(targetId);

    if (target) {
        if (!this.root) this.root = createRoot(target);
        
        this.root.render(
            <React.StrictMode>
                <ActorSheetRPGComponent actor={this.document} context={context} />
            </React.StrictMode>
        );
    }
  }

  async close(options = {}) {
    if (this.root) {
        this.root.unmount();
        this.root = null;
    }
    return super.close(options);
  }
}