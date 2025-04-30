class Api::V1::ImportJobsController < ApplicationController
  include Authenticatable
  before_action :ensure_creator_role, only: [ :show ]
  before_action :set_import_job, only: [ :show ]


  def show
    if @import_job.status == "completed"
      render json: {
        data: @import_job.as_json(include: { import_records: {} })
      }
    else
      render json: {
        data: @import_job.as_json
      }
    end
  end

  private


  def set_import_job
    @import_job = ImportJob.find(params[:id])
  end

  def ensure_creator_role
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user&.creator?
  end
end
