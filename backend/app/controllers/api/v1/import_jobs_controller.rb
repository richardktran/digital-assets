class Api::V1::ImportJobsController < ApplicationController
  include Authenticatable
  before_action :ensure_creator_role, only: [ :show ]
  before_action :set_import_job, only: [ :show ]

  def show
    render_import_job(@import_job)
  end

  def latest
    import_job = ImportJob.where(creator: current_user).order(created_at: :desc).first
    render_import_job(import_job)
  end

  def import
    unless params[:file]
      response_error("File is required")
    end

    unless params[:file]&.content_type == "application/json"
      response_error("Must upload a JSON file")
    end

    # find import job with status pending
    import_job = ImportJob.where(creator: current_user, status: :pending).first
    if import_job
      response_error("A job is already being processed. Please wait for it to finish.")
    end

    import_job = ImportJob.new(creator: current_user, status: :pending)
    import_job.file.attach(params[:file])
    if import_job.save
      ImportAssetsJob.perform_later(import_job.id)
      response_success({ import_job_id: import_job.id, status: :pending }, status: :accepted)
    else
      response_error(import_job.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  rescue StandardError => e
    response_error("Import failed: #{e.message}", status: :unprocessable_entity)
  end

  private

  def render_import_job(import_job)
    if import_job.completed?
      response_success(import_job.as_json(include: { import_records: {} }))
    else
      response_success(import_job.as_json)
    end
  end

  def set_import_job
    @import_job = ImportJob.find(params[:id])
  end

  def ensure_creator_role
    response_error("Unauthorized", status: :unauthorized) unless current_user&.creator?
  end
end
