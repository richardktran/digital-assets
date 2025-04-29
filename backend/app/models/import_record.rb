class ImportRecord < ApplicationRecord
  belongs_to :import_job
  validates :status, presence: true, inclusion: { in: %w[pending imported failed] }
end
