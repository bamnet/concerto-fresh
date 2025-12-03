# Template Import Design (Checkpoint 2)

## Overview

Add client-side ZIP import functionality to the WYSIWYG template editor. Users can upload a Concerto 1/2 template ZIP archive, which will be parsed in the browser and pre-populate the editor canvas. This provides much better UX than the previous server-side approach, allowing users to visually verify and adjust imported templates before saving.

## User Flow

1. User navigates to Templates → New Template
2. User sees existing form with "Import from ZIP" button/link
3. User clicks "Import from ZIP"
4. File picker opens, user selects `.zip` file
5. Browser parses ZIP:
   - Extracts template XML
   - Extracts background image
   - Parses position data from XML
6. Editor pre-populates:
   - Template name and author fields filled
   - Background image displayed on canvas
   - Positions rendered as draggable rectangles
   - Field mappings shown (with warnings if fields don't exist)
7. User can:
   - Drag/resize positions to adjust
   - Change field assignments
   - Edit styles
   - Upload different image if needed
8. User clicks "Save Template" (normal form submission)
9. Template saved via existing Rails nested attributes flow

## Technical Architecture

### Technology Stack

- **JSZip** - Stable, well-maintained ZIP handling library
  - 3.10.1 (latest stable as of 2024)
  - No external dependencies
  - Works in all modern browsers
  - ~50KB minified

- **DOMParser** - Native browser XML parsing (no library needed)

### File Structure

```
app/javascript/
  controllers/
    template_editor_controller.js      # Existing, add import methods
    template_importer_controller.js    # NEW: Handles ZIP import

vendor/javascript/
  jszip.js                              # NEW: JSZip library (via importmap)

app/views/templates/
  _form.html.erb                        # Add import button
  new.html.erb                          # Existing
```

### Expected ZIP Structure

Concerto 1/2 template ZIPs contain:
```
template-name.zip
├── descriptor.xml          # Template metadata and positions
└── background.jpg/png      # Background image (various names)
```

Example `descriptor.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<template name="One Box" author="Concerto">
  <position name="Graphics" left="0.02" top="0.1" right="0.98" bottom="0.9" style="..." />
  <position name="Ticker" left="0" top="0.9" right="1" bottom="1" style="..." />
</template>
```

## Implementation Plan

### Phase 1: Add JSZip Dependency

**Install via importmap:**
```bash
bin/importmap pin jszip
```

This adds to `config/importmap.rb`:
```ruby
pin "jszip", to: "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"
```

### Phase 2: Create Template Importer Controller

**New file:** `app/javascript/controllers/template_importer_controller.js`

```javascript
import { Controller } from "@hotwired/stimulus"
import JSZip from "jszip"

export default class extends Controller {
  static targets = ["fileInput"]

  async importZip(event) {
    const file = event.target.files[0]
    if (!file) return

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

      // Populate editor (via custom event to template-editor controller)
      this.dispatch("imported", {
        detail: {
          template: templateData,
          imageBlob: imageBlob
        }
      })

    } catch (error) {
      alert(`Import failed: ${error.message}`)
    }
  }

  findXmlFile(zip) {
    // Look for descriptor.xml or *.xml
    const xmlFiles = Object.keys(zip.files)
      .filter(name => name.endsWith('.xml') && !name.startsWith('__MACOSX'))

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
        return imageExtensions.some(ext => lower.endsWith(ext))
          && !name.startsWith('__MACOSX')
      })

    if (imageFiles.length === 0) {
      throw new Error('No image file found in ZIP')
    }
    if (imageFiles.length > 1) {
      // Use first one, or could prompt user
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
}
```

### Phase 3: Update Template Editor Controller

**Modify:** `app/javascript/controllers/template_editor_controller.js`

Add method to handle imported data:

```javascript
// Add to template_editor_controller.js

// Listen for import events
handleImport(event) {
  const { template, imageBlob } = event.detail

  // Populate form fields
  const nameField = this.element.querySelector('input[name="template[name]"]')
  const authorField = this.element.querySelector('input[name="template[author]"]')

  if (nameField) nameField.value = template.name
  if (authorField) authorField.value = template.author

  // Load image
  this.loadImageFromBlob(imageBlob)

  // Map field names to IDs and populate positions
  this.importPositions(template.positions)
}

loadImageFromBlob(blob) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      this.imageWidth = img.width
      this.imageHeight = img.height
      this.imageTarget.src = e.target.result
      this.imageTarget.style.display = 'block'

      if (this.hasPlaceholderTarget) {
        this.placeholderTarget.style.display = 'none'
      }

      if (this.hasAddPositionButtonTarget) {
        this.addPositionButtonTarget.disabled = false
      }

      // Re-render positions with correct dimensions
      this.clearCanvas()
      this.positions.forEach(pos => this.renderPosition(pos))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(blob)

  // Also set the file input (tricky - need to create File object)
  this.setImageFile(blob)
}

setImageFile(blob) {
  // Create File object from Blob for form submission
  const file = new File([blob], "imported-background.jpg", { type: blob.type })

  // Use DataTransfer to set file input value
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)
  this.imageInputTarget.files = dataTransfer.files
}

importPositions(importedPositions) {
  // Clear existing positions
  this.positions = []
  this.nextId = 1
  this.clearCanvas()

  // Map field names to field IDs
  importedPositions.forEach((pos, index) => {
    const fieldId = this.findFieldIdByName(pos.field_name)

    const position = {
      id: `pos_${this.nextId++}`,
      field_id: fieldId,
      field_name: this.getFieldNameById(fieldId) || pos.field_name,
      left: pos.left,
      top: pos.top,
      right: pos.right,
      bottom: pos.bottom,
      style: pos.style,
      _destroy: false,
      _imported_name: pos.field_name, // Store original for warning
      _field_found: !!fieldId
    }

    this.positions.push(position)
    this.renderPosition(position)
  })

  this.updatePositionsList()
  this.showImportWarnings()
}

findFieldIdByName(name) {
  if (!this.hasFieldSelectTarget) return null

  // Try exact match first
  for (let option of this.fieldSelectTarget.options) {
    if (option.text.toLowerCase() === name.toLowerCase()) {
      return option.value
    }
  }

  // Try partial match
  for (let option of this.fieldSelectTarget.options) {
    if (option.text.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(option.text.toLowerCase())) {
      return option.value
    }
  }

  // No match found
  return null
}

getFieldNameById(fieldId) {
  if (!this.hasFieldSelectTarget || !fieldId) return null

  for (let option of this.fieldSelectTarget.options) {
    if (option.value === fieldId) {
      return option.text
    }
  }

  return null
}

showImportWarnings() {
  const unmappedPositions = this.positions.filter(p => !p._field_found)

  if (unmappedPositions.length > 0) {
    const names = unmappedPositions.map(p => `"${p._imported_name}"`).join(', ')
    alert(
      `Warning: Could not map the following fields: ${names}\n\n` +
      `These positions were imported but you'll need to manually assign fields. ` +
      `Click each position and select the correct field from the dropdown.`
    )
  }
}
```

### Phase 4: Update View

**Modify:** `app/views/templates/_form.html.erb`

Add import button above the existing form:

```erb
<!-- Add after opening form_with tag, before error display -->

<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="font-semibold text-blue-900">Import Template</h3>
      <p class="text-sm text-blue-700">Upload a Concerto 1/2 template ZIP file to pre-populate this form</p>
    </div>
    <div data-controller="template-importer"
         data-action="template-importer:imported->template-editor#handleImport">
      <input
        type="file"
        accept=".zip"
        data-template-importer-target="fileInput"
        data-action="change->template-importer#importZip"
        class="hidden"
        id="zip-upload">
      <label
        for="zip-upload"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
        Choose ZIP File
      </label>
    </div>
  </div>
</div>
```

## Field Mapping Strategy

### Approach: Fuzzy Matching with Manual Override

1. **Exact Match** (case-insensitive)
   - "Graphics" in XML → "Graphics" field ✓

2. **Partial Match** (case-insensitive, bidirectional)
   - "Main Content" in XML → "Content" field ✓
   - "Ticker" in XML → "News Ticker" field ✓

3. **No Match**
   - Position imported but field_id = null
   - User must manually select field from dropdown
   - Warning shown after import

### Alternative Names Support

If a field has `alt_names` (from previous checkpoint 1 discussions), check those too:

```javascript
findFieldIdByName(name) {
  // ... existing code ...

  // Also check alt_names if available
  // This would require passing alt_names data to frontend
  // Could add data attribute to options: data-alt-names="ticker,news"
}
```

## Error Handling

### Validation Errors

| Error | User-Facing Message | Recovery |
|-------|---------------------|----------|
| No XML file | "No XML file found in ZIP. Please upload a valid Concerto template." | Choose different file |
| Multiple XML files | "Multiple XML files found. Please use a ZIP with a single descriptor.xml" | Choose different file |
| Invalid XML | "Invalid XML format. File may be corrupted." | Choose different file |
| No image file | "No image file found in ZIP. You can upload one manually after import." | Continue without image |
| Multiple images | "Multiple images found, using first one. You can change it after import." | Continue with first image |
| No positions | "No positions found in template. You can add them manually." | Continue, add positions |
| Field mapping failures | "Warning: Could not map fields: [list]. Please assign them manually." | Continue, fix mappings |

### ZIP Bomb Protection

Since this is client-side, browser memory limits provide natural protection. However, add basic checks:

```javascript
async importZip(event) {
  const file = event.target.files[0]

  // Check file size (warn if > 50MB)
  if (file.size > 50 * 1024 * 1024) {
    if (!confirm('This ZIP file is very large (>50MB). Continue?')) {
      return
    }
  }

  // ... rest of import
}
```

## UI/UX Considerations

### Loading States

Show progress during import:

```javascript
async importZip(event) {
  const file = event.target.files[0]
  if (!file) return

  // Show loading indicator
  this.element.querySelector('label[for="zip-upload"]').textContent = 'Importing...'
  this.element.querySelector('label[for="zip-upload"]').classList.add('opacity-50', 'cursor-wait')

  try {
    // ... import logic ...
  } finally {
    // Reset button
    this.element.querySelector('label[for="zip-upload"]').textContent = 'Choose ZIP File'
    this.element.querySelector('label[for="zip-upload"]').classList.remove('opacity-50', 'cursor-wait')
  }
}
```

### Import Confirmation

After successful import:

```javascript
// Show success message
const message = document.createElement('div')
message.className = 'mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800'
message.textContent = `Successfully imported "${template.name}". Review positions and click Save when ready.`
this.element.insertBefore(message, this.element.firstChild)

// Auto-remove after 5 seconds
setTimeout(() => message.remove(), 5000)
```

### Visual Feedback for Unmapped Fields

Mark positions with unmapped fields:

```javascript
renderPosition(position) {
  // ... existing code ...

  // Add warning indicator if field not found
  if (position._imported_name && !position._field_found) {
    rect.classList.add('unmapped-field')

    const warning = document.createElement('div')
    warning.className = 'absolute -top-3 -right-3 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'
    warning.textContent = '!'
    warning.title = `Could not map field "${position._imported_name}"`
    rect.appendChild(warning)
  }
}
```

Add CSS:
```css
.position-rectangle.unmapped-field {
  border-color: #FFC107;
  background: rgba(255, 193, 7, 0.1);
}
```

## Testing Strategy

### Manual Testing Checklist

- [ ] Import valid Concerto 1 template
- [ ] Import valid Concerto 2 template
- [ ] Import ZIP with multiple XML files (should error)
- [ ] Import ZIP with no XML file (should error)
- [ ] Import ZIP with no image (should warn, continue)
- [ ] Import ZIP with multiple images (should warn, use first)
- [ ] Import with all fields matching (no warnings)
- [ ] Import with some fields not matching (show warnings)
- [ ] Import with no fields matching (show warnings)
- [ ] Import, adjust positions, save successfully
- [ ] Import, change field assignments, save successfully
- [ ] Import very large file (>50MB, should confirm)

### Automated Testing

Add system tests:

```ruby
# test/system/templates_test.rb

test "should import template from ZIP" do
  sign_in users(:system_admin)
  visit new_template_url

  # Upload ZIP file
  attach_file "zip-upload", Rails.root.join("test/fixtures/files/test_template.zip")

  # Wait for import to complete
  assert_text "Successfully imported"

  # Verify form populated
  assert_field "Name", with: "Test Template"
  assert_field "Author", with: "Test Author"

  # Verify positions rendered
  assert_selector '.position-rectangle', count: 2

  # Save template
  click_on "Save Template"
  assert_text "Template was successfully created"
end
```

### Test Fixtures

Create test ZIP files:

```
test/fixtures/files/
  valid_template.zip          # Valid Concerto 2 template
  legacy_template.zip         # Valid Concerto 1 template
  no_xml.zip                  # ZIP without XML (should error)
  multiple_xml.zip            # ZIP with multiple XML files (should error)
  no_image.zip                # ZIP with XML but no image (should warn)
  invalid_xml.zip             # ZIP with malformed XML (should error)
```

## Migration Path

### From Checkpoint 1 (Server-Side Import)

The previous server-side import implementation (issue #521) should be removed:

**Remove:**
- `app/models/template.rb` - `import_archive` and `import_xml` methods
- `app/controllers/templates_controller.rb` - `new_import` and `create_import` actions
- `app/views/templates/new_import.html.erb`
- `config/routes.rb` - import routes
- Tests for server-side import

**Keep:**
- `rubyzip` gem can be removed from Gemfile (no longer needed)

**Rationale:**
Client-side import provides better UX and doesn't require backend changes. Having both implementations would be confusing and create maintenance burden.

## Security Considerations

### Client-Side Security

1. **File Size Limits**: Warn on files >50MB
2. **XML Parsing**: Use DOMParser which is safe from XXE attacks
3. **Image Handling**: Blob URLs are safe, cleaned up automatically
4. **No Code Execution**: XML data only populates form fields, no eval()
5. **CSRF Protection**: Existing Rails form CSRF tokens still apply

### Server-Side Validation

The existing Template model validations still apply:
- Template name required
- Positions must have valid field_id
- Images validated by ActiveStorage
- Authorization via Pundit

## Performance Considerations

### Bundle Size

- JSZip: ~50KB minified
- DOMParser: Native, 0KB
- Total addition: ~50KB

### Memory Usage

- ZIP decompression happens in browser memory
- Large templates (5-10MB) should work fine
- Browser limits (typically 500MB-2GB) provide natural protection

### Optimization Opportunities

1. **Lazy Loading**: Only load JSZip on template new/edit pages
2. **Web Workers**: Could move ZIP parsing to worker thread (overkill for this use case)
3. **Streaming**: JSZip supports streaming for very large files (not needed here)

## Open Questions

1. **Should we remove server-side import entirely?**
   - Recommendation: Yes, client-side is strictly better

2. **Should we support drag-and-drop for ZIP files?**
   - Recommendation: Not for MVP, could add later

3. **Should we show a preview of the template before importing?**
   - Recommendation: Not needed, import pre-populates editor which is the preview

4. **How should we handle very old Concerto 1 templates with different XML structure?**
   - Recommendation: Best-effort parsing, show warnings, let user fix manually

5. **Should unmapped fields get a default/placeholder field?**
   - Recommendation: No, leave null and require user to select

## Success Criteria

Checkpoint 2 is successful when:

- [ ] User can upload Concerto 1/2 template ZIP
- [ ] XML is parsed and form pre-populated
- [ ] Background image is loaded and displayed
- [ ] Positions are rendered on canvas with correct coordinates
- [ ] Field names are matched to field IDs (exact or fuzzy)
- [ ] Unmapped fields show clear warnings
- [ ] User can adjust imported positions via drag/drop
- [ ] User can save imported template successfully
- [ ] All tests passing (including new import tests)
- [ ] No regressions to checkpoint 1 functionality
- [ ] Documentation updated (PR description sufficient)

## Timeline Estimate

- **Phase 1** (JSZip setup): 15 minutes
- **Phase 2** (Importer controller): 1-2 hours
- **Phase 3** (Editor integration): 1-2 hours
- **Phase 4** (View updates): 30 minutes
- **Testing & Debugging**: 1-2 hours
- **Test fixtures creation**: 30 minutes

**Total: 4-6 hours**

## Alternatives Considered

### Alternative 1: Keep Server-Side Import

**Pros:**
- No client-side bundle size increase
- XML parsing on server (more control)

**Cons:**
- Poor UX (errors require re-upload)
- No visual preview before save
- Can't adjust positions before saving

### Alternative 2: Hybrid Approach

Upload ZIP to server, return JSON to populate client-side editor.

**Pros:**
- Server validates ZIP before processing
- No client-side ZIP library needed

**Cons:**
- More complex (client + server changes)
- Slower (network round-trip)
- Still requires rubyzip on server

### Alternative 3: Manual Template Creation Only

Don't support import at all.

**Pros:**
- Simplest implementation
- No edge cases with legacy formats

**Cons:**
- Users must manually recreate templates
- Migration from Concerto 1/2 is painful

**Recommendation:** Stick with client-side import (original plan). Best UX, leverages WYSIWYG editor.
