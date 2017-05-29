class UsersController < ApplicationController
  before_action :not_signed_in?, only: :create

  def create
    user = User.new(user_params)
    if user.save
      session[:user_id] = user.id
      render json: { logged_in: true, user: user }
    elsif user.errors['email']&.include?('has already been taken')
      render json: { errors: user.errors.full_messages }, status: :conflict # 409
    else
      render json: { errors: user.errors.full_messages }, status: :bad_request # 400
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
