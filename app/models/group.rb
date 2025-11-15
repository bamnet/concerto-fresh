class Group < ApplicationRecord
  REGISTERED_USERS_GROUP_NAME = "All Registered Users"
  SYSTEM_ADMIN_GROUP_NAME = "System Administrators"

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  # Models that groups own or manage.
  has_many :screens, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  # Prevent deletion of system groups
  before_destroy :cannot_destroy_system_group

  # Prevent renaming of system groups
  before_validation :cannot_rename_system_group

  # Finds all users in this group who are admins.
  def admins
    users.merge(Membership.admin)
  end

  # Finds all users in this group who are regular members.
  def members
    users.merge(Membership.member)
  end

  # Check if a user is a member of the group.
  def member?(user)
    return false unless user
    users.exists?(user.id)
  end

  # Check if a user is an admin of the group.
  def admin?(user)
    return false unless user
    admins.exists?(user.id)
  end

  # Class method to easily find the special groups
  def self.all_users_group
    find_by(name: REGISTERED_USERS_GROUP_NAME)
  end

  def self.system_admins_group
    find_by(name: SYSTEM_ADMIN_GROUP_NAME)
  end

  # Check if this is a system group
  def system_group?
    name.in?([ REGISTERED_USERS_GROUP_NAME, SYSTEM_ADMIN_GROUP_NAME ])
  end

  # Check if this is the system administrators group
  def system_admin_group?
    name == SYSTEM_ADMIN_GROUP_NAME
  end

  private

  def cannot_destroy_system_group
    if system_group?
      errors.add(:base, "Cannot delete system groups")
      throw(:abort)
    end
  end

  def cannot_rename_system_group
    # Check if name is being changed and if the original name was a system group
    if name_changed? && name_was.present?
      old_name = name_was
      if old_name.in?([ REGISTERED_USERS_GROUP_NAME, SYSTEM_ADMIN_GROUP_NAME ])
        errors.add(:name, "cannot be changed for system groups")
        # Restore the original name
        self.name = old_name
      end
    end
  end
end
