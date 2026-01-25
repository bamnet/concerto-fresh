# frozen_string_literal: true

module DestroyButtonHelper
  def destroy_button(resource: nil, url: nil, label: "Delete", confirm: "Are you sure?",
                     title: nil, button_class: "btn-danger", form_class: "inline-block",
                     icon_only: false, &block)

    target = url || resource
    raise ArgumentError, "Provide either resource: or url:" if target.nil?

    form_options = {
      data: { turbo_confirm: confirm },
      class: form_class
    }

    if block_given?
      return button_to(target,
                       method: :delete,
                       class: button_class,
                       form: form_options,
                       title: title) do
        capture(&block)
      end
    end

    text = icon_only ? "" : label

    button_to(text,
              target,
              method: :delete,
              class: button_class,
              form: form_options,
              title: (title || label))
  end
end
