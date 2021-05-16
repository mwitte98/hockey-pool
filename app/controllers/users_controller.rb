class UsersController < ApplicationController
  before_action :not_signed_in?, only: :create

  def create
    user = User.new(user_params)
    if user.save
      cookies[:user_id] = { value: user.id, expires: 1.year.from_now }
      render json: user
    else
      render json: { errors: user.errors.full_messages }, status: :bad_request # 400
    end
  end

  private

  def user_params
    params.permit(:email, :password)
  end
end
