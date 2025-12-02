# WYSIWYG Template Editor - Technical Design Document

**Issue:** #522 (Checkpoint 1)
**Date:** 2025-12-01
**Status:** Design Review

---

## Overview

Replace the existing scaffold-based template form with a visual drag-and-drop editor that allows users to:
- Upload a background image (typically 1920x1080px)
- Draw and position rectangular content areas
- Assign fields and styling to each position
- Preview the template layout visually

This addresses the poor UX of the current form where users must manually enter decimal coordinates.

---

## Architecture

### Component Structure

```
Template Form (Rails View)
├── Image Upload Section
│   └── File input + preview
├── Canvas Editor (Stimulus Controller)
│   ├── Background Image Display
│   ├── Position Rectangles (draggable/resizable)
│   └── Selection/Interaction Layer
└── Position Inspector Panel
    ├── Position List
    └── Position Detail Form
        ├── Field Selector (dropdown)
        ├── Style Input (textarea)
        └── Coordinate Display (read-only)
```

### Technology Stack

- **Stimulus Controller**: `template_editor_controller.js` for canvas interaction
- **Vanilla JS**: Drag/resize using native browser APIs
- **Rails Form Helpers**: Nested attributes for positions
- **Hidden Fields**: Store coordinates calculated from visual positioning

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│ Template Editor                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Name: [_________________]    Author: [_____________]   │
│                                                          │
│  Background Image: [Choose File]  [Upload button]       │
│                                                          │
├──────────────────────────────┬──────────────────────────┤
│                              │  Positions               │
│                              │  ┌────────────────────┐  │
│                              │  │ □ Main             │  │
│    [Canvas Area              │  │   0.025, 0.026     │  │
│     1920x1080                │  │   → 0.592, 0.796   │  │
│     with background          │  │                    │  │
│     image and draggable      │  │ □ Ticker           │  │
│     position rectangles]     │  │   0.221, 0.885     │  │
│                              │  │   → 0.975, 0.985   │  │
│                              │  │                    │  │
│                              │  │ [+ Add Position]   │  │
│                              │  └────────────────────┘  │
│                              │                          │
│                              │  Selected: Main          │
│                              │  ┌────────────────────┐  │
│                              │  │ Field: [Main  ▼]   │  │
│                              │  │                    │  │
│                              │  │ Style:             │  │
│                              │  │ ┌────────────────┐ │  │
│                              │  │ │border: 2px ... │ │  │
│                              │  │ └────────────────┘ │  │
│                              │  │                    │  │
│                              │  │ Coordinates:       │  │
│                              │  │ L: 0.025  T: 0.026 │  │
│                              │  │ R: 0.592  B: 0.796 │  │
│                              │  │                    │  │
│                              │  │ [Remove Position]  │  │
│                              │  └────────────────────┘  │
└──────────────────────────────┴──────────────────────────┘

 [Save Template]  [Cancel]
```

---

## Data Flow

### Creating a New Template

1. **User uploads image**
   - Image displayed on canvas at scale-to-fit size
   - Canvas maintains aspect ratio, max 800px width

2. **User adds position**
   - Click "Add Position" button
   - New draggable rectangle appears at center (200x150px default)
   - Position added to list in right panel

3. **User configures position**
   - Drag rectangle to desired location
   - Resize using corner/edge handles
   - Select from position list to edit details
   - Choose field from dropdown (Main, Ticker, etc.)
   - Enter CSS styling in textarea

4. **Coordinates calculated automatically**
   - Pixel coordinates converted to decimals (0.0 - 1.0)
   - Formula: `decimal = pixelPos / imageSize`
   - Stored in hidden form fields
   - Updated in real-time as user drags/resizes

5. **Form submission**
   - Rails form submits with nested position attributes
   - Image attached via Active Storage
   - Positions saved with calculated coordinates

### Editing Existing Template

1. Load template data into editor
2. Display background image on canvas
3. Render position rectangles from stored coordinates
4. Allow editing same as new template
5. Submit updates via PATCH request

---

## Technical Implementation

### Canvas Coordinate System

**Storage Format (Database):**
```ruby
# Normalized coordinates (0.0 to 1.0)
position.left   = 0.025  # 48px / 1920px
position.top    = 0.026  # 28px / 1080px
position.right  = 0.592  # 1136px / 1920px
position.bottom = 0.796  # 860px / 1080px
```

**Display Format (Canvas):**
```javascript
// Scale to canvas size (e.g., 800x450 displayed)
const scaleX = canvasWidth / imageWidth;
const scaleY = canvasHeight / imageHeight;

const displayLeft = position.left * imageWidth * scaleX;
const displayTop = position.top * imageHeight * scaleY;
const displayWidth = (position.right - position.left) * imageWidth * scaleX;
const displayHeight = (position.bottom - position.top) * imageHeight * scaleY;
```

### Stimulus Controller Structure

```javascript
// app/javascript/controllers/template_editor_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "canvas",           // Main canvas container
    "image",            // Background image
    "positionsList",    // Position list in sidebar
    "inspector",        // Position detail form
    "positionsInput"    // Hidden field with JSON
  ]

  static values = {
    positions: Array,   // Current positions data
    selectedId: String  // Currently selected position
  }

  connect() {
    this.positions = []
    this.nextId = 1
    this.setupCanvas()
  }

  // Canvas setup
  setupCanvas() {
    // Initialize canvas dimensions
    // Set up mouse event listeners
  }

  // Image upload handler
  imageChanged(event) {
    // Load and display background image
    // Reset canvas dimensions to match image
  }

  // Position management
  addPosition() {
    // Create new position at center
    // Add to positions array
    // Render rectangle on canvas
  }

  removePosition() {
    // Remove from positions array
    // Remove visual element
  }

  selectPosition(id) {
    // Highlight selected position
    // Load details into inspector panel
  }

  // Drag and resize handlers
  startDrag(event) {
    // Begin drag operation
  }

  drag(event) {
    // Update position during drag
    // Constrain to canvas bounds
  }

  endDrag(event) {
    // Finalize position
    // Update hidden form fields
  }

  startResize(event, handle) {
    // Begin resize from corner/edge
  }

  resize(event) {
    // Update size during resize
    // Constrain to canvas bounds
  }

  endResize(event) {
    // Finalize size
    // Update hidden form fields
  }

  // Coordinate conversion
  pixelToDecimal(pixelPos, imageSize) {
    return pixelPos / imageSize
  }

  decimalToPixel(decimal, imageSize, scale) {
    return decimal * imageSize * scale
  }

  // Form submission helper
  updateHiddenFields() {
    // Convert positions to form format
    // Update nested attribute fields
  }
}
```

### Position Data Structure

```javascript
{
  id: "pos_1",                    // Temporary client-side ID
  field_id: 1,                    // Selected field from dropdown
  field_name: "Main",             // Field name for display
  left: 0.025,                    // Normalized coordinates
  top: 0.026,
  right: 0.592,
  bottom: 0.796,
  style: "border: 2px solid...",  // CSS styling
  _destroy: false                 // Rails nested attributes flag
}
```

### HTML Structure

```erb
<%# app/views/templates/_form.html.erb %>
<%= form_with(model: template, data: {
  controller: "template-editor",
  template_editor_positions_value: @template.positions.to_json
}) do |form| %>

  <!-- Basic Info -->
  <div class="mb-6">
    <%= form.label :name, class: "block font-medium mb-2" %>
    <%= form.text_field :name, class: "w-full border rounded px-3 py-2" %>
  </div>

  <div class="mb-6">
    <%= form.label :author, class: "block font-medium mb-2" %>
    <%= form.text_field :author, class: "w-full border rounded px-3 py-2" %>
  </div>

  <!-- Image Upload -->
  <div class="mb-6">
    <%= form.label :image, "Background Image", class: "block font-medium mb-2" %>
    <%= form.file_field :image,
      accept: "image/*",
      data: { action: "change->template-editor#imageChanged" },
      class: "block" %>
  </div>

  <!-- Canvas + Inspector Layout -->
  <div class="grid grid-cols-3 gap-6">
    <!-- Canvas Area (2/3 width) -->
    <div class="col-span-2">
      <div
        data-template-editor-target="canvas"
        class="relative border-2 border-gray-300 rounded bg-gray-50 overflow-hidden"
        style="max-width: 100%; aspect-ratio: 16/9;">

        <img
          data-template-editor-target="image"
          class="absolute inset-0 w-full h-full object-contain"
          style="display: none;">

        <!-- Position rectangles rendered here by JS -->
      </div>
    </div>

    <!-- Inspector Panel (1/3 width) -->
    <div class="col-span-1">
      <h3 class="text-lg font-semibold mb-4">Positions</h3>

      <!-- Position List -->
      <div data-template-editor-target="positionsList" class="mb-4">
        <!-- Rendered by JS -->
      </div>

      <button
        type="button"
        data-action="click->template-editor#addPosition"
        class="btn btn-secondary w-full mb-6">
        + Add Position
      </button>

      <!-- Position Inspector (shown when selected) -->
      <div
        data-template-editor-target="inspector"
        class="border rounded p-4"
        style="display: none;">

        <h4 class="font-semibold mb-3">Position Details</h4>

        <div class="mb-4">
          <label class="block font-medium mb-1">Field</label>
          <select
            data-template-editor-target="fieldSelect"
            data-action="change->template-editor#updateField"
            class="w-full border rounded px-2 py-1">
            <% Field.all.each do |field| %>
              <option value="<%= field.id %>"><%= field.name %></option>
            <% end %>
          </select>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Style (CSS)</label>
          <textarea
            data-template-editor-target="styleInput"
            data-action="input->template-editor#updateStyle"
            rows="4"
            class="w-full border rounded px-2 py-1 font-mono text-sm"></textarea>
        </div>

        <div class="mb-4 text-sm text-gray-600">
          <div class="font-medium mb-1">Coordinates:</div>
          <div class="grid grid-cols-2 gap-2">
            <div>L: <span data-template-editor-target="coordLeft">0.000</span></div>
            <div>T: <span data-template-editor-target="coordTop">0.000</span></div>
            <div>R: <span data-template-editor-target="coordRight">0.000</span></div>
            <div>B: <span data-template-editor-target="coordBottom">0.000</span></div>
          </div>
        </div>

        <button
          type="button"
          data-action="click->template-editor#removePosition"
          class="btn btn-danger w-full">
          Remove Position
        </button>
      </div>
    </div>
  </div>

  <!-- Hidden Fields for Rails Form Submission -->
  <%= form.fields_for :positions do |pf| %>
    <div class="hidden" data-position-id="<%= pf.object.id || "new_#{pf.index}" %>">
      <%= pf.hidden_field :id %>
      <%= pf.hidden_field :field_id %>
      <%= pf.hidden_field :left %>
      <%= pf.hidden_field :top %>
      <%= pf.hidden_field :right %>
      <%= pf.hidden_field :bottom %>
      <%= pf.hidden_field :style %>
      <%= pf.hidden_field :_destroy %>
    </div>
  <% end %>

  <!-- Form Actions -->
  <div class="mt-6 flex gap-3">
    <%= form.submit "Save Template", class: "btn" %>
    <%= link_to "Cancel", templates_path, class: "btn btn-secondary" %>
  </div>
<% end %>
```

---

## Visual Styling

### Position Rectangles

```css
.position-rectangle {
  position: absolute;
  border: 2px solid #007BFF;
  background: rgba(0, 123, 255, 0.1);
  cursor: move;
  transition: border-color 0.2s;
}

.position-rectangle.selected {
  border-color: #0056B3;
  border-width: 3px;
  background: rgba(0, 123, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.position-rectangle:hover {
  border-color: #0056B3;
}

/* Resize handles */
.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border: 2px solid #007BFF;
  border-radius: 50%;
}

.resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }

/* Position label */
.position-label {
  position: absolute;
  top: -24px;
  left: 0;
  background: #007BFF;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
```

---

## Form Submission

### Before Submit

JavaScript prepares hidden fields:
```javascript
// Update all position hidden fields before submit
updateHiddenFields() {
  this.positions.forEach(position => {
    const container = this.element.querySelector(
      `[data-position-id="${position.id}"]`
    )

    container.querySelector('[name*="[field_id]"]').value = position.field_id
    container.querySelector('[name*="[left]"]').value = position.left
    container.querySelector('[name*="[top]"]').value = position.top
    container.querySelector('[name*="[right]"]').value = position.right
    container.querySelector('[name*="[bottom]"]').value = position.bottom
    container.querySelector('[name*="[style]"]').value = position.style
    container.querySelector('[name*="[_destroy]"]').value = position._destroy
  })
}
```

### Rails Controller

No changes needed! Controller already handles nested attributes:
```ruby
def template_params
  params.require(:template).permit(
    :name, :author, :image,
    positions_attributes: [:id, :top, :left, :bottom, :right, :style, :field_id, :_destroy]
  )
end
```

---

## Interaction Patterns

### Drag Position
1. Mouse down on rectangle → start drag
2. Mouse move → update rectangle position, constrain to canvas
3. Mouse up → finalize, update coordinates

### Resize Position
1. Mouse down on corner handle → start resize
2. Mouse move → update rectangle size, maintain opposite corner
3. Mouse up → finalize, update coordinates

### Select Position
1. Click on rectangle → select
2. Highlight with thicker border
3. Load details into inspector panel

### Keyboard Shortcuts (Future Enhancement)
- Delete key → remove selected position
- Arrow keys → nudge position 1px
- Shift + arrows → nudge 10px

---

## Testing Strategy

### JavaScript Tests (Vitest)
- Position coordinate calculations
- Drag/resize boundary constraints
- Form data serialization

### System Tests (Capybara)
- Upload image and create template
- Add positions via UI
- Verify saved coordinates match visual placement

### Unit Tests
- Template model validations
- Position model validations
- Nested attributes handling

---

## Migration Path

### Phase 1: Parallel Implementation
- New WYSIWYG form alongside old form
- Feature flag or separate route for testing

### Phase 2: Replace Default
- Replace `_form.html.erb` with WYSIWYG version
- Update edit flow to use WYSIWYG

### Phase 3: Cleanup
- Remove old form partials
- Remove legacy template controller JS

---

## Future Enhancements (Not in Checkpoint 1)

- **Checkpoint 2**: Client-side ZIP import (Issue #521)
- Snap-to-grid for alignment
- Position duplication
- Undo/redo stack
- Template preview mode
- Copy/paste positions between templates
- Position locking (prevent accidental moves)

---

## Questions for Review

1. **Layout**: Does the 2/3 canvas + 1/3 inspector layout work, or prefer full-width canvas with sidebar?
2. **Default Size**: Should new positions be 200x150px or calculate based on canvas size?
3. **Field Validation**: Should we prevent saving if positions overlap or have no field assigned?
4. **Mobile**: This design assumes desktop - acceptable for admin panel?
5. **Styling**: Match Concerto style guide colors exactly or iterate after working prototype?

---

## Implementation Checklist

- [ ] Create `template_editor_controller.js` Stimulus controller
- [ ] Replace `_form.html.erb` with WYSIWYG layout
- [ ] Implement drag/drop functionality
- [ ] Implement resize handles
- [ ] Wire up inspector panel
- [ ] Handle image upload/display
- [ ] Coordinate conversion logic
- [ ] Form submission integration
- [ ] Update edit view to load existing positions
- [ ] Add CSS styling matching design system
- [ ] Write JavaScript tests
- [ ] Write system tests
- [ ] Manual QA with seed template
