import { Controller } from "@hotwired/stimulus"
import JSZip from "jszip"

// Connects to data-controller="template-importer"
export default class extends Controller {
  static targets = ["fileInput", "importButton"]

  async importZip(event) {
    const file = event.target.files[0]
    if (!file) return

    // Check file size (warn if > 50MB)
    if (file.size > 50 * 1024 * 1024) {
      if (!confirm('This ZIP file is very large (>50MB). Continue?')) {
        event.target.value = '' // Reset file input
        return
      }
    }

    // Show loading state
    this.setLoading(true)

    try {
      // Load ZIP
      const zip = await JSZip.loadAsync(file)

      // Extract and parse XML
      const xmlFile = await this.findXmlFile(zip)
      const xmlContent = await xmlFile.async("string")
      const templateData = this.parseXml(xmlContent)

      // Extract image
      const imageFile = await this.findImageFile(zip)
      const imageBlob = await imageFile.async("blob")

      // Dispatch event to template-editor controller
      this.dispatch("imported", {
        detail: {
          template: templateData,
          imageBlob: imageBlob
        }
      })

      this.showSuccess(templateData.name)

    } catch (error) {
      console.error('Import error:', error)
      alert(`Import failed: ${error.message}`)
    } finally {
      this.setLoading(false)
      event.target.value = '' // Reset file input
    }
  }

  findXmlFile(zip) {
    // Look for descriptor.xml or *.xml
    const xmlFiles = Object.keys(zip.files)
      .filter(name =>
        name.toLowerCase().endsWith('.xml') &&
        !name.startsWith('__MACOSX') &&
        !name.startsWith('.') &&
        !zip.files[name].dir
      )

    if (xmlFiles.length === 0) {
      throw new Error('No XML file found in ZIP')
    }
    if (xmlFiles.length > 1) {
      throw new Error('Multiple XML files found. Please use a ZIP with a single descriptor.xml')
    }

    return zip.file(xmlFiles[0])
  }

  findImageFile(zip) {
    // Look for common image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    const imageFiles = Object.keys(zip.files)
      .filter(name => {
        const lower = name.toLowerCase()
        return imageExtensions.some(ext => lower.endsWith(ext)) &&
          !name.startsWith('__MACOSX') &&
          !name.startsWith('.') &&
          !zip.files[name].dir
      })

    if (imageFiles.length === 0) {
      throw new Error('No image file found in ZIP')
    }
    if (imageFiles.length > 1) {
      // Use first one
      console.warn('Multiple images found, using first:', imageFiles[0])
    }

    return zip.file(imageFiles[0])
  }

  parseXml(xmlString) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlString, "text/xml")

    // Check for parse errors
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Invalid XML format')
    }

    const templateEl = doc.querySelector('template')
    if (!templateEl) {
      throw new Error('No <template> element found in XML')
    }

    // Extract template metadata
    const name = templateEl.getAttribute('name') || 'Imported Template'
    const author = templateEl.getAttribute('author') || ''

    // Extract positions
    const positionEls = doc.querySelectorAll('position')
    const positions = Array.from(positionEls).map((pos, index) => ({
      id: `pos_${index + 1}`,
      field_name: pos.getAttribute('name') || 'Unnamed',
      left: parseFloat(pos.getAttribute('left') || 0),
      top: parseFloat(pos.getAttribute('top') || 0),
      right: parseFloat(pos.getAttribute('right') || 1),
      bottom: parseFloat(pos.getAttribute('bottom') || 1),
      style: pos.getAttribute('style') || '',
      _destroy: false
    }))

    return { name, author, positions }
  }

  setLoading(isLoading) {
    if (!this.hasImportButtonTarget) return

    if (isLoading) {
      this.importButtonTarget.textContent = 'Importing...'
      this.importButtonTarget.classList.add('opacity-50', 'cursor-wait')
      this.importButtonTarget.style.pointerEvents = 'none'
    } else {
      this.importButtonTarget.textContent = 'Choose ZIP File'
      this.importButtonTarget.classList.remove('opacity-50', 'cursor-wait')
      this.importButtonTarget.style.pointerEvents = ''
    }
  }

  showSuccess(templateName) {
    // Find the form element to insert success message
    const form = this.element.closest('form')
    if (!form) return

    // Create success message
    const message = document.createElement('div')
    message.className = 'mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800'
    message.textContent = `Successfully imported "${templateName}". Review positions and click Save when ready.`

    // Insert at top of form
    form.insertBefore(message, form.firstChild)

    // Auto-remove after 5 seconds
    setTimeout(() => message.remove(), 5000)
  }
}
