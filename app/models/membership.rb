class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :group

  # Ensures a user can only be in a group once
  validates :user_id, uniqueness: { scope: :group_id }

  # Prevent removal from system groups
  before_destroy :cannot_remove_from_system_group

  # Define the enum for roles
  # :member will be stored as 0 in the DB, :admin as 1
  enum :role, { member: 0, admin: 1 }

  private

  def cannot_remove_from_system_group
    if group&.name == "All Registered Users"
      errors.add(:base, 'Cannot remove users from the "All Registered Users" group')
      throw(:abort)
    end
  end
end
