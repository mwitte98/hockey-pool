class AuthController < ApplicationController
  before_action :not_signed_in?, only: :login
  before_action :signed_in?, only: :logout

  def login
    user = find_user
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { logged_in: true, user: user }
    else
      message = 'Invalid Email/Password Combination'
      render json: { errors: [message] }, status: :unauthorized # 401
    end
  end

  def logout
    reset_session
    render json: { logged_in: false }
  end

  def signed_in
    user_id = session[:user_id]
    if user_id
      user = User.find(user_id)
      render json: { logged_in: true, user: user }
    else
      reset_session
      render json: { logged_in: false }, status: :unauthorized # 401
    end
  end

  private

  def find_user
    User.find_by_email(params[:email].downcase)
  end
end
