class ApplicationController < ActionController::API
  rescue_from Exception, with: :handle_global_exception

  def response_success(data, status: :ok)
    render json: {
      success: true,
      data: data
    }, status: status
  end

  def response_error(message, status: :unprocessable_entity)
    render json: {
      success: false,
      message: message
    }, status: status
  end

  private

  def handle_global_exception(exception)
    status = exception_status_mapping[exception.class] || :internal_server_error
    response_error(exception.message, status: status)
  end

  private

  def exception_status_mapping
    {
      ActiveRecord::RecordNotFound => :not_found,
      ActiveRecord::RecordInvalid => :unprocessable_entity, 
      ActionController::ParameterMissing => :bad_request,
      ActiveRecord::RecordNotDestroyed => :unprocessable_entity
    }
  end
end
