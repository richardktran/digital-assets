class Role < ApplicationRecord
  validates :name, presence: true, uniqueness: true, inclusion: { in: %w[creator admin] }
  has_many :users
end
