import { LitElement, html } from 'lit';
import { customElement, property, state, query, queryAll } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import style from './ai-wrangler.css.js';

interface ImageInfo {
  src: string;
  alt: string;
}

function isUri(str: string): boolean {
  return !!str.match(/^(?:data|(?:https?)):/);
}

class PickEvent extends Event {
  constructor(public src: string|null = null, public alt: string|null = null) {
    super('pick');
  }
}

@customElement('ai-wrangler')
export class AiWrangler extends LitElement {
  static readonly styles = [style];

  @state() progress = 0;

  @state() loading = false;

  @state() fake = true;

  @state() images: ImageInfo[] = [];

  @state() alts = [];

  @query('#size') sizeSelect!: HTMLSelectElement;
  @query('output :checked') selectedItem?: HTMLInputElement;
  @queryAll('output [type=checkbox]') checkboxes!: NodeListOf<HTMLInputElement>;

  @property() prompt = '';

  @property() endpoint = 'https://f6a652edd853a2b5.gradio.app/sdapi/v1/txt2img';

  render() {
    return html`
      <form id="ai-wrangler" part="form" autofill @submit="${this.#onSubmit}" @reset="${this.#onReset}">
        <fieldset part="generate fieldset" ?disabled="${this.loading}">
          <legend part="generate legend">Generate</legend>

          <div class="group">
            <label for="prompt" part="label prompt" class="required">Describe your topic</label>
            <input  id="prompt" part="input prompt" required
                   placeholder="E.g. Smart home technology over wifi"
                   @keyup="${this.#onKeyup}">
          </div>

          <div class="group">
            <label for="size" part="size label">Select max number of assets</label>
            <div id="select">
              <select id="size" part="size select" required
                      placeholder="E.g. Smart home technology over wifi"
                      @keyup="${this.#onKeyup}">${Array.from({length: 4}, (_, i) => html`
                <option part="size option" ?selected="${i === 3}">${i + 1}</option>`)}
              </select>
            </div>
            <button id="generate" part="generate submit">Generate assets</button>
          </div>
        </fieldset>

        <fieldset part="output fieldset" ?disabled="${this.loading}">
          <legend part="output legend" ?hidden=${!this.images.length}>Select Image</legend>
          <output part="output output" ?hidden="${!this.images.length}" @change="${this.#onChangeImg}">
            <ol part="output ol">${this.images.map(({ src, alt }) => html`
              <li part="output li">
                <label ?disabled="${this.loading}">
                  <img part="output img" alt="${alt}" .src="${src}"/>
                  <input type="checkbox" part="output checkbox" .value="${src}" data-alt="${alt}"/>
                </label>
              </li>
            `)}</ol>
          </output>

          <section ?hidden="${this.loading || !this.images.length}">
            <button type="reset"           part="output button">Reset</button>
            <button type="submit" id="add" part="add button">Add</button>
          </section>

          <section id="loader" ?hidden="${!this.loading}">
            <progress id="progress" part="progress progress" max="100" value="${ifDefined(this.progress)}"></progress>
            <label part="progress label" for="progress">Analyzing data...</label>
          </section>
        </fieldset>

      </form>

      <label for="fake">Fake it</label>
      <input id="fake" type="checkbox"
             form="ai-wrangler"
             ?checked="${this.fake}"
             @change="${() => this.fake = !this.fake}">

    `;
  }

  #onKeyup(event: KeyboardEvent) {
    this.prompt = (event.target as HTMLInputElement).value;
  }

  #onReset(event: Event) {
    event.preventDefault(); // otherwise output gets cleared
    this.#reset();
  }

  #reset() {
    this.images = [];
  }

  #onChangeImg(event: Event) {
    for (const checkbox of this.checkboxes) {
      if (checkbox !== event.target) {
        checkbox.checked = false;
      }
    }
  }

  async #onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (event.submitter?.id === 'add') {
      return this.#add();
    } else {
      await this.#fetch();
    }
  }

  #add() {
    const src = this.selectedItem?.value;
    const alt = this.selectedItem?.dataset.alt;
    const srcInput: HTMLInputElement|null = this.querySelector('input[data-attribute=src]') ?? this.querySelector('input');
    const altInput: HTMLInputElement|null = this.querySelector('input[data-attribute=alt]') ?? this.querySelector('input');
    if (srcInput) { srcInput.value = src ?? ''; }
    if (altInput) { altInput.value = alt ?? ''; }
    console.log({src, alt});
    if (this.dispatchEvent(new PickEvent(src, alt))) {
      this.#reset();
    };
  }

  async #fetch() {
    try {
      this.loading = true;
      let response: Response;
      const prompt = this.prompt.trim() + ', vector art by Abbey Lossing, James Gilleard, Petros Afshar, Dave McKean, Sachin Teng, digital art, 4k, 8k, sharp focus, smooth, illustration, concept art, stylized 2D design, Organic Painting, Matte Painting, rounded corners, turquoise, orange, red, vaporware, glow'
      const method = 'POST';
      const batch_size = parseInt(this.sizeSelect.selectedOptions[0]?.value ?? '1');
      const body = JSON.stringify({ batch_size, prompt });
      const headers = new Headers();
            headers.set('Content-Type', 'application/json');
      if (this.fake) {
        const d = 20
        const MIN = 2500;
        const MAX = 10000;
        const delay = Math.max(MIN, Math.random() * MAX);
        const int = setInterval(() => this.progress += (100 / (delay / d)), d);
        await new Promise(r => setTimeout(r, delay));
        clearInterval(int);
        const count = this.images.length / 4;
        const path = `./response-${count}.json`;
        response = await fetch(new URL(path, import.meta.url).href);
      } else {
        response = await fetch(this.endpoint, { method, body, headers });
      }
      const json = await response.json();
      console.log(json);
      const { images: _images, info: _info } = json;
      const { infotexts } = typeof _info === 'object' ? _info : JSON.parse(_info);
      const images = _images.map((data: string, i: number) => ({
        src: isUri(data) ? data : `data:image/jpeg;base64,${data}`,
        alt: infotexts[i],
      }));
      this.images = [...this.images, ...images];
    } catch(e) {
      console.error(e)
    } finally {
      this.progress = 0;
      this.loading = false;
    }
  }
}

