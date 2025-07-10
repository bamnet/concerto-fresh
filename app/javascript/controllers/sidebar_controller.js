import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar", "overlay", "logoText", "sectionTitle", "linkText", "collapseButton", "collapseIcon", "collapseText"]
  static classes = ["expanded", "collapsed"]

  connect() {
    this.isCollapsed = false
    this.isMobileOpen = false
  }

  toggle() {
    if (this.isMobileOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.isMobileOpen = true
    this.sidebarTarget.classList.remove("-translate-x-full")
    this.sidebarTarget.classList.add("translate-x-0")
    this.overlayTarget.style.display = "block"
    
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = "hidden"
  }

  close() {
    this.isMobileOpen = false
    this.sidebarTarget.classList.add("-translate-x-full")
    this.sidebarTarget.classList.remove("translate-x-0")
    this.overlayTarget.style.display = "none"
    
    // Restore body scroll
    document.body.style.overflow = ""
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed
    
    if (this.isCollapsed) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  collapse() {
    // Update sidebar width
    this.sidebarTarget.classList.remove("w-72")
    this.sidebarTarget.classList.add("w-18")
    
    // Hide text elements
    this.logoTextTargets.forEach(target => {
      target.style.display = "none"
    })
    
    this.sectionTitleTargets.forEach(target => {
      target.style.display = "none"
    })
    
    this.linkTextTargets.forEach(target => {
      target.style.display = "none"
    })
    
    // Update collapse button
    if (this.hasCollapseTextTarget) {
      this.collapseTextTarget.textContent = "Expand"
    }
    
    if (this.hasCollapseIconTarget) {
      this.collapseIconTarget.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
      `
    }
    
    // Add tooltip functionality for collapsed state
    this.addTooltips()
  }

  expand() {
    // Update sidebar width
    this.sidebarTarget.classList.remove("w-18")
    this.sidebarTarget.classList.add("w-72")
    
    // Show text elements
    this.logoTextTargets.forEach(target => {
      target.style.display = ""
    })
    
    this.sectionTitleTargets.forEach(target => {
      target.style.display = ""
    })
    
    this.linkTextTargets.forEach(target => {
      target.style.display = ""
    })
    
    // Update collapse button
    if (this.hasCollapseTextTarget) {
      this.collapseTextTarget.textContent = "Collapse"
    }
    
    if (this.hasCollapseIconTarget) {
      this.collapseIconTarget.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
      `
    }
    
    // Remove tooltips
    this.removeTooltips()
  }

  addTooltips() {
    // Add tooltip functionality for collapsed sidebar
    this.linkTextTargets.forEach(target => {
      const link = target.closest('a')
      if (link) {
        link.setAttribute('title', target.textContent)
      }
    })
  }

  removeTooltips() {
    // Remove tooltip functionality
    this.linkTextTargets.forEach(target => {
      const link = target.closest('a')
      if (link) {
        link.removeAttribute('title')
      }
    })
  }

  // Handle window resize
  handleResize() {
    if (window.innerWidth >= 1024) { // lg breakpoint
      this.close() // Close mobile menu on desktop
    }
  }

  // Add event listener for window resize
  initialize() {
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  disconnect() {
    window.removeEventListener('resize', this.handleResize)
    document.body.style.overflow = "" // Ensure body scroll is restored
  }
}