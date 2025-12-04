# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "stimulus-rails-nested-form" # @4.1.0
pin "@stimulus-components/dropdown", to: "@stimulus-components--dropdown.js" # @3.0.0
pin "stimulus-use" # @0.52.2
pin "@tailwindcss/forms", to: "@tailwindcss--forms.js" # @0.5.7
pin "mini-svg-data-uri" # @1.4.4
pin "picocolors" # @1.0.1
pin "tailwindcss/colors", to: "tailwindcss--colors.js" # @3.4.4
pin "tailwindcss/defaultTheme", to: "tailwindcss--defaultTheme.js" # @3.4.4
pin "tailwindcss/plugin", to: "tailwindcss--plugin.js" # @3.4.4
pin "jszip" # @3.10.1
pin "#lib/internal/streams/stream.js", to: "#lib--internal--streams--stream.js.js" # @2.3.8
pin "buffer" # @2.1.0
pin "core-util-is" # @1.0.3
pin "events" # @2.1.0
pin "immediate" # @3.0.6
pin "inherits" # @2.0.4
pin "isarray" # @1.0.0
pin "lie" # @3.3.0
pin "pako" # @1.0.11
pin "process" # @2.1.0
pin "process-nextick-args" # @2.0.1
pin "readable-stream" # @2.3.8
pin "safe-buffer" # @5.1.2
pin "setimmediate" # @1.0.5
pin "string_decoder" # @1.1.1
pin "util" # @2.1.0
pin "util-deprecate" # @1.0.2
