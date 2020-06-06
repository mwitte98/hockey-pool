class StaticController < ApplicationController
  def base
    send_data File.open("#{Rails.root}/client/dist/index.html"), type: 'text/html; charset=utf-8', disposition: 'inline'
  end
end
