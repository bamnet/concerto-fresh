class ChangeDefaultOrderingStrategyToWeighted < ActiveRecord::Migration[8.1]
  def change
    change_column_default :field_configs, :ordering_strategy, from: "random", to: "weighted"
  end
end
