class EntriesController < ApplicationController
  before_action :signed_in?, only: %i[update destroy]

  def index
    entries = Entry.includes(:players).all
    case params[:field_groups]
    when 'player_ids'
      render json: entries.as_json(only: :player_ids).map { |e| e['player_ids'] }
    when 'display'
      render json: entries.as_json(only: %i[name contestant_name player_ids])
    else
      render json: entries
    end
  end

  def create
    entry = Entry.create(entry_params)
    render json: entry
  end

  def show
    render json: Entry.find(params[:id])
  end

  def update
    entry = Entry.find(params[:id])
    entry.update(entry_params)
    render json: entry
  end

  def destroy
    entry = Entry.find(params[:id])
    entry.players.clear
    render json: entry.delete
  end

  private

  def entry_params
    params.permit(:name, :contestant_name, :email, telephone_number: {}, player_ids: [])
  end
end
