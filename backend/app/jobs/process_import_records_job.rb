class ProcessImportRecordsJob < ApplicationJob
  queue_as :default

  def perform(import_job_id, record_ids, last_id)
    import_job = ImportJob.find(import_job_id)
    ImportRecord.where(id: record_ids).each do |record|
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
        record.update!(status: "failed", error: e.message)
      end
    end

    if record_ids.include?(last_id)
      import_job.update!(status: "completed")
    end
  end
end
