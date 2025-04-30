class ApplicationController < ActionController::API
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
end
