class ApplicationController < ActionController::API
  protected

  def signed_in?
    return if session[:user_id]

    render json: { errors: ['Unauthorized'], error_message: 'Unauthorized' }, status: :unauthorized # 401
  end

  def not_signed_in?
    user_id = session[:user_id]
    return unless user_id

    render json: User.find(user_id)
  end
end
