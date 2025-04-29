class Asset < ApplicationRecord
  belongs_to :creator, class_name: "User"
  has_one :asset_files,  dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
