class AuthController < ApplicationController
  before_action :not_signed_in?, only: :login
  before_action :signed_in?, only: :logout

  def login
    user = find_user
    if user&.authenticate(params[:password])
      cookies[:user_id] = { value: user.id, expires: 1.year.from_now }
      render json: user
    else
      message = 'Invalid Email/Password Combination'
      render json: { errors: [message] }, status: :unauthorized # 401
    end
  end

  def logout
    cookies.delete :user_id
    render json: {}, status: :no_content # 204
  end

  def signed_in
    user_id = cookies[:user_id]
    user = User.find(user_id) if user_id
    if user
      render json: user
    else
      cookies.delete :user_id
      render json: {}, status: :unauthorized # 401
    end
  end

  private

  def find_user
    User.find_by(email: params[:email].downcase)
  end
end
