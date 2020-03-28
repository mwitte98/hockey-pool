class ApplicationController < ActionController::API
  protected

  def signed_in?
    return if session[:user_id]

    render json: { errors: ['Unauthorized'], error_message: 'Unauthorized' },
           status: :unauthorized # 401
  end

  def not_signed_in?
    return unless session[:user_id]

    render json: User.find(session[:user_id])
  end
end
