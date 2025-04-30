class OrderItem < ApplicationRecord
  include CentsAttribute
  cents_accessor :amount
  
  belongs_to :order
  belongs_to :asset
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :order, presence: true
  validates :asset, presence: true
end
