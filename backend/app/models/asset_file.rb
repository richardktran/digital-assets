class AssetFile < ApplicationRecord
  belongs_to :asset
  validates :file_url, presence: true, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }
end
