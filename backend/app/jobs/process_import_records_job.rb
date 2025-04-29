class ProcessImportRecordsJob < ApplicationJob
  queue_as :default

  def perform(import_job_id, record_ids)
    import_job = ImportJob.find(import_job_id)
    ImportRecord.where(id: record_ids).find_each(batch_size: 1000) do |record|
      begin
        Asset.transaction do
          asset = Asset.create!(
            title: record.title,
            description: record.description,
            price: record.price,
            creator: import_job.creator
          )
          AssetFile.create!(
            asset: asset,
            file_url: record.file_url
          )
        end
        record.update!(status: "imported")
      rescue ActiveRecord::RecordInvalid => e
        record.update!(status: "failed", error_message: e.message)
      end
    end
  end
end
