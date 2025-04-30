class Asset < ApplicationRecord
  include CentsAttribute
  cents_accessor :price
  
  belongs_to :creator, class_name: "User"
  has_one :asset_files, class_name: "AssetFile", foreign_key: "asset_id", dependent: :destroy
  has_many :order_items, dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  def accessible_by?(user)
    return true if user.admin? || user.id == creator_id

    order_items.joins(:order).exists?(orders: { user_id: user.id, status: "completed" })
  end

  def as_json(options = {})
    if options[:current_user]
      if accessible_by?(options[:current_user])
        super(options.merge(include: [:asset_files]))
      else
        super(options)
      end
    else
      super(options)
    end
  end
end
