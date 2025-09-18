import style from './styles/styles.scss?inline';
import type { CatResponse, Locale } from '../types';
import { Attribute, Component, Watch } from '@mfe-kit/core';
import { namespace } from './config';
import { events } from './events';
import { l10n } from '../l10n';
import { Prerender } from './prerender';
import { ActionIds } from './constants';
import { getCats, ElementsService } from './services';
import { renderSSR } from './ssr';
import { Spinner } from './snippets/spinner';
import { CatImage } from './snippets/cat-image';

@Component
export class MfeKitTemplate extends HTMLElement {
  @Attribute() locale: Locale = 'en_GB';
  @Attribute() colorTheme!: string;
  @Attribute() colorMode!: string;

  private isReady?: boolean;
  private isSSR?: boolean;
  private apiAbortController?: AbortController;
  private data: Array<CatResponse>;
  private isLoading: boolean;
  private eventListeners: { [key: string]: Function };

  constructor() {
    super();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    } else {
      this.isSSR = true;
    }
    this.data = [];
    this.isLoading = false;
    this.eventListeners = {};
    events.setHost(this);
    l10n.useLocale(this.locale);
    ElementsService.init(this.shadowRoot!);
    this.isReady = false;
  }

  //#region Init
  async connectedCallback(): Promise<void> {
    if (!this.isSSR) {
      await this.init();
      this.render();
    } else {
      this.hydrateSSR();
    }
    this.initEventListeners();
    this.setAttribute('version', import.meta.env.VITE_APP_VERSION);
    this.isReady = true;
    events.publish().ready('MFE ready!');
  }

  disconnectedCallback(): void {
    this.shadowRoot!.removeEventListener('click', (e: Event) =>
      this.eventListeners.click(e),
    );
    this.shadowRoot!.removeEventListener('keypress', (e: Event) =>
      this.eventListeners.keypress(e),
    );
  }

  hydrateSSR(): void {
    const ssrScript = this.querySelector('script[data-ssr]');
    if (ssrScript) {
      this.data = JSON.parse(ssrScript.textContent || '[]');
      ssrScript.remove();
    }
  }

  async init(): Promise<void> {
    this.renderSkeleton();
    await this.loadData();
  }

  async loadData(): Promise<void> {
    if (this.apiAbortController) {
      this.apiAbortController.abort();
    }
    this.apiAbortController = new AbortController();
    try {
      this.data = await getCats(this.apiAbortController);
      events.publish().loaded(this.data);
    } catch {
      this.renderFallback();
    }
  }

  initEventListeners(): void {
    this.eventListeners.click = (e: Event) => this.clickEventHandler(e);
    this.eventListeners.keypress = (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.clickEventHandler(e);
      }
    };

    this.shadowRoot!.addEventListener('click', (e: Event) =>
      this.eventListeners.click(e),
    );
    this.shadowRoot!.addEventListener('keypress', (e: Event) =>
      this.eventListeners.keypress(e),
    );
  }

  //#endregion

  //#region Render
  renderFallback() {
    this.shadowRoot!.innerHTML = `
        <div class="${namespace}">
          <style>
            ${style}
          </style>
          <div class="fallback-error-message">
            <h2>${l10n.t('general.error')}</h2>
          </div>
        </div>
      `;
  }

  renderSkeleton() {
    this.shadowRoot!.innerHTML = Prerender();
  }

  renderOnReady(): void {
    if (this.isReady) {
      this.render();
    }
  }

  render(): void {
    this.shadowRoot!.innerHTML = this.template();
  }

  template() {
    return `
        <div class="${namespace}">
            <style>
              ${style}
            </style>
            <h3 class="${namespace}-title">${l10n.t('general.title')}</h3>
            <div class="${namespace}-container">
                ${Spinner(this.isLoading)}
                ${CatImage(this.data[0]?.url, this.isLoading)}
                <button data-action="${ActionIds.AnotherOneBtn}" class="${namespace}-btn">${l10n.t('general.btnText')}</button>
            </div>
        </div>
    `;
  }

  //#endregion

  //#region Event handlers
  clickEventHandler(event: Event): void {
    const { action } = (event.target as HTMLElement).dataset;
    if (!action) {
      return;
    }
    switch (action) {
      case ActionIds.AnotherOneBtn:
        this.getAnotherCat();
        break;
    }
  }

  getAnotherCat(): void {
    this.isLoading = true;
    this.renderOnReady();
    this.loadData().then(() => {
      this.isLoading = false;
      this.renderOnReady();
    });
  }

  //#endregion

  //#region Watcher
  @Watch('locale')
  updateLocale(oldValue: string, newValue: string) {
    console.info('updateLocale', oldValue, newValue);
    l10n.useLocale(this.locale);
    this.renderOnReady();
  }

  @Watch('colorMode')
  updateColorMode() {
    this.renderOnReady();
  }

  @Watch('colorTheme')
  updateColorTheme() {
    this.renderOnReady();
  }

  //#endregion
}

if (!customElements.get(namespace)) {
  customElements.define('mfe-kit-template', MfeKitTemplate);
}

export const prerender = () => Prerender();
export const ssr = renderSSR(MfeKitTemplate, namespace);
