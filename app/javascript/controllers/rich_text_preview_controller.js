import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["expandButton", "content"]
  static values = { fullHeight: Number, isExpanded: Boolean }

  connect() {
    const shadowRoot = this.contentTarget.shadowRoot;
    const scaler = shadowRoot.querySelector('.scaler');
    const style = window.getComputedStyle(scaler);
    const scale = Number(style.getPropertyValue('--scale-factor'));
    const newHeight = scaler.offsetHeight*(scale + .05);
    
    this.fullHeightValue = newHeight;
    this.isExpandedValue = false;
    
    // Check if content is taller than 200px
    if (newHeight > 200) {
      this.showExpandButton();
    } else {
      this.hideExpandButton();
    }

    console.debug(`Resizing rich text preview from ${scaler.offsetHeight}px to ${newHeight > 200 ? '200px (collapsed)' : newHeight + 'px'}`);
  }

  toggle(event) {
    event.preventDefault();
    if (this.isExpandedValue) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  expand() {
    const shadowRoot = this.contentTarget.shadowRoot;
    shadowRoot.host.style.maxHeight = 'none';
    shadowRoot.host.style.height = `${this.fullHeightValue}px`;
    this.isExpandedValue = true;
    this.updateExpandButton();
  }

  collapse() {
    const shadowRoot = this.contentTarget.shadowRoot;
    shadowRoot.host.style.maxHeight = '200px';
    shadowRoot.host.style.height = 'none';
    this.isExpandedValue = false;
    this.updateExpandButton();
  }

  showExpandButton() {
    if (this.hasExpandButtonTarget) {
      this.expandButtonTarget.style.display = 'block';
      this.updateExpandButton();
    }
  }

  hideExpandButton() {
    if (this.hasExpandButtonTarget) {
      this.expandButtonTarget.style.display = 'none';
    }
  }

  updateExpandButton() {
    if (this.hasExpandButtonTarget) {
      this.expandButtonTarget.textContent = this.isExpandedValue ? 'Show Less' : 'Show More';
    }
  }
}
