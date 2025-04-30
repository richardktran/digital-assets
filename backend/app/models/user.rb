class User < ApplicationRecord
  has_secure_password
  belongs_to :role
  has_many :orders, foreign_key: :user_id
  has_many :order_items, through: :orders

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :role, presence: true

  def as_json(options = {})
    super(options.merge(only: [ :id, :email, :first_name, :last_name ]))
  end

  def admin?
    role.name == "admin"
  end

  def creator?
    role.name == "creator"
  end
end
