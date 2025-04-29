class Asset < ApplicationRecord
  belongs_to :creator, class_name: "User"
  has_one :asset_files, class_name: "AssetFile", foreign_key: "asset_id", dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  def get_asset_file(user)
    return asset_files if user.admin? || user.id == creator_id
    # TODO: Check order later
    nil
  end
end
