class ImportRecord < ApplicationRecord
  include CentsAttribute
  cents_accessor :price

  belongs_to :import_job

  enum :status, {
    pending: 'pending',
    imported: 'imported',
    failed: 'failed'
  }, default: :pending
end
