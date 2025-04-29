class User < ApplicationRecord
  has_secure_password
  belongs_to :role

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :role, presence: true

  def admin?
    role.name == 'admin'
  end
end
