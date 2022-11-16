import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const handleAsJson = (x: Response) => x.json();

interface Results {
  /** URIs */
  images: string[];
  parameters: Record<string, unknown>;
  info: string;
}

@customElement('ai-overlord')
export class AiOverlord extends LitElement {
  // override createRenderRoot() { return this; }

  @property({ type: Boolean, reflect: true }) loading = false;

  @property({ attribute: false }) results?: Results;

  @property() prompt: string;

  @property() endpoint = 'https://f6a652edd853a2b5.gradio.app/sdapi/v1/txt2img';

  render() {
    return html`
      <form autofill @submit="${this.#onSubmit}">
        <fieldset ?disabled="${this.loading}">
          <label for="prompt">Prompt</label>
          <input id="prompt" @change="${event=>this.prompt=event.target.value}">
          <button>Generate</button>
        </fieldset>
        <output>${this.loading ? 'Loading...' : !this.results ? 'Click Generate' : this.results.images.map((x, i) => html`
          <img alt="result number ${i+1}" src="data:image/jpeg;base64,${x}"> `)}
        </output>
      </form>
    `;
  }

  async #onSubmit(event) {
    event.preventDefault();
    const { prompt } = this;
    const method = 'POST';
    const body = JSON.stringify({ batch_size: 1, prompt });
    const headers = new Headers();
    headers.set('Content-Type', 'application/json')
    console.log(this, body);
    this.loading = true;
    try {
      if (window.fake) {
        await new Promise(r => setTimeout(10000, r));
        this.results = {
          images: [],
          parameters: {},
          info: ''
        }
      } else {
        const response = await fetch(this.endpoint, { method, body, headers });
        this.results = await response.json();
      }
      console.log(this.results);
    } catch(e) {
      console.error(e)
    } finally {
      this.loading = false;
    }
  }
}

