class EntriesController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    entries = Entry.includes(:players).all.order(:id)
    teams = Team.all.order(:is_eliminated, :id)
    players = Player.all.as_json(only: %i[id team_id first_name last_name position goals points],
                                 setting: Setting.first)
    render json: { entries: entries, players: players, teams: teams }
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

  def update_player_stats
    UpdateJob.perform_async
    render json: ''
  end

  private

  def entry_params
    params.require(:entry).permit(:name, :contestant_name, :email, player_ids: [])
  end
end
