class Order < ApplicationRecord
  include CentsAttribute
  cents_accessor :total_amount

  belongs_to :user, class_name: "User"
  has_many :order_items, dependent: :destroy

  validates :idempotency_key, presence: true, uniqueness: true
  validates :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }

  enum :status, {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed'
  }, default: :pending
end
