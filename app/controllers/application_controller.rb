class ApplicationController < ActionController::API
  include ActionController::Cookies

  protected

  def signed_in?
    user_id = cookies[:user_id]
    return if user_id && User.find(user_id)

    cookies.delete :user_id
    render json: { errors: ['Unauthorized'], error_message: 'Unauthorized' }, status: :unauthorized # 401
  end

  def not_signed_in?
    user_id = cookies[:user_id]
    user = User.find(user_id) if user_id
    if user
      render json: user
    else
      cookies.delete :user_id
    end
  end
end
