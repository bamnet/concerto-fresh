import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const shadowRoot = this.element.shadowRoot;
    const scaler = shadowRoot.querySelector('.scaler');
    const style = window.getComputedStyle(scaler);
    const scale = Number(style.getPropertyValue('--scale-factor'));
    const newHeight = scaler.offsetHeight*(scale + .05);
    this.element.style.height = `${newHeight}px`;

    console.debug(`Resizing rich text preview from ${scaler.offsetHeight}px to ${newHeight}px`);
  }
}
