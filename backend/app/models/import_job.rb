class ImportJob < ApplicationRecord
  belongs_to :creator, class_name: "User"
  has_many :import_records
  has_one_attached :file
  # validates :status, presence: true, inclusion: { in: %w[pending processing completed failed] }
  validates :file, presence: true, attached: true, content_type: "application/json"

  enum :status, {
    pending: 'pending',
    processing: 'processing', 
    completed: 'completed',
    failed: 'failed'
  }, default: :pending
end
