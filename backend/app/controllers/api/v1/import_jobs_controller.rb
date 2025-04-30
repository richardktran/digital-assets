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
      return render json: { error: "File is required" }, status: :unprocessable_entity
    end

    unless params[:file]&.content_type == "application/json"
      return render json: { error: "Must upload a JSON file" }, status: :unprocessable_entity
    end

    # find import job with status pending
    import_job = ImportJob.where(creator: current_user, status: :pending).first
    if import_job
      return render json: { error: "A job is already being processed. Please wait for it to finish." }, status: :unprocessable_entity
    end

    import_job = ImportJob.new(creator: current_user, status: :pending)
    import_job.file.attach(params[:file])
    if import_job.save
      ImportAssetsJob.perform_later(import_job.id)
      render json: { import_job_id: import_job.id, status: :pending }, status: :accepted
    else
      render json: { error: import_job.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  # rescue StandardError => e
  #   render json: { error: "Import failed: #{e.message}" }, status: :unprocessable_entity
  end

  private

  def render_import_job(import_job)
    if import_job.completed?
      render json: {
        data: import_job.as_json(include: { import_records: {} })
      }
    else
      render json: {
        data: import_job.as_json
      }
    end
  end

  def set_import_job
    @import_job = ImportJob.find(params[:id])
  end

  def ensure_creator_role
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user&.creator?
  end
end
