class ImportAssetsJob < ApplicationJob
  queue_as :default

  def perform(import_job_id)
    import_job = ImportJob.find(import_job_id)
    import_job.update(status: "processing")

    begin
      file = import_job.file
      raise "No file attached" unless file.attached?

      data = JSON.parse(file.download)
      batch_size = 1000
      record_ids = []

      data.each_slice(batch_size) do |batch|
        record_ids.concat(process_batch(import_job, batch))
      end

      record_ids.each_slice(10_000) do |chunk|
        ProcessImportRecordsJob.perform_later(import_job.id, chunk)
      end
    rescue StandardError => e
      import_job.update!(status: "failed", error: e.message)
    end
  end

  private

  def process_batch(import_job, batch)
    ImportRecord.transaction do
      batch.map do |asset_data|
        begin
          record = ImportRecord.create!(
            import_job: import_job,
            title: asset_data['title'],
            description: asset_data['description'],
            file_url: asset_data['file_url'],
            price: asset_data['price']*100, # Convert to cents
            status: 'pending'
          )
          record.id
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error("Failed to create ImportRecord: #{e.message}, Data: #{asset_data}")
          nil # Skip invalid records
        end
      end.compact # Remove nil values from the array
    end
  rescue StandardError => e
    Rails.logger.error("Error processing batch: #{e.message}")
    raise # Re-raise the exception to ensure the job fails
  end
end
