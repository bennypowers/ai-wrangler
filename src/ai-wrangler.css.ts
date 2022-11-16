import { css } from "lit";
export default css`

[hidden] { display: none !important; }

fieldset {
  background-color: var(--ai-fieldset-background, #f3f4f9);
  border: 1px solid var(--ai-fieldset-border, #cacaca);
}

[part="output fieldset"] {
  min-height: 200px;
}

.group {
  display: flex;
  position: relative;
  flex-flow: row wrap;
  align-items: center;
}

legend {
  text-transform: uppercase;
  font-weight: bold;
}

#prompt {
  width: 100%;
  border: 1px solid var(--ai-gray, #707070);
  box-shadow: inset 1px 1px 0 0 var(--ai-fieldset-border, #cacaca);
  padding: .6em 1em;
}

#prompt, fieldset {
  border-radius: 2px;
  margin-block: .6em;
}

#size {
  margin-inline-end: 1em;
}

label {
  display: block;
}

label.required::after {
  display: inline;
  padding-inline: .5em;
  content: '*';
  color: var(--ai-grey, #707070);
}

button:first-of-type {
  margin-inline-start: auto;
}

button {
  background-color: var(--ai-blue, #173dc4);
  color: white;
  padding: .6em 1em;
  border: 1px solid var(--ai-gray, #707070);
}

label[disabled],
button:disabled {
  opacity: .3;
}

button[type=reset] {
  color: var(--ai-blue, #173dc4);
  background-color: var(--ai-fieldset-background, #f3f4f9);
  border-color: var(--ai-fieldset-background, #f3f4f9);
}

#select {
  width: calc(55px + 47px + 1px);
  height: 47px;
  margin-inline-start: 21px;
  background-color: var(--ai-progress-border, #d5d5d8);
  position: relative;
}

select {
  appearance: none;
  border: none;
  background: transparent;
  padding-inline-start: 20px;
  width: 100%;
  height: 100%;
}

#select::before {
  content: 'v';
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  z-index: 1;
  background-color: var(--ai-progress-border, #d5d5d8);
  width: 47px;
  height: 47px;
  border-left: 1px solid white;
  position: absolute;
  inset-inline-end: 0px;
  inset-block: 0;
  pointer-events: none;
}

#loader {
  display: grid;
  grid-template: 1fr / 1fr;
  width: 33%;
  margin-inline: auto;
  height: 24px;
  border: 1px solid var(--ai-progress-border, #D5D5D6);
  border-radius: 8px;
  background-color: var(--ai-progress-background, #E5E5E8);
  overflow: hidden;
}

#loader > * {
  grid-column: 1/1;
  grid-row: 1/1;
}

progress {
  border: none;
  height: 100%;
  width: 100%;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

progress[value]::-moz-progress-bar {
  background-color: var(--ai-blue, #173dc4);
}

progress + label {
  color: white;
  padding-inline-start: 25px;
}

ol {
  display: grid;
  list-style-type: none;
  padding: 0;
  gap: 1em;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
}

ol:empty {
  display: none;
}

li {
  padding: 0;
  position: relative;
}

img {
  width: 100%;
}

li input {
  position: absolute;
  inset-block-start: 2px;
  inset-inline-end: 2px;
}

`;
