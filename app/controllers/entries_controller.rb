class EntriesController < ApplicationController
  before_action :signed_in?, only: %i[create update destroy]

  def index
    entries = Entry.includes(players: [:team]).all.as_json
    entries.each do |entry|
      entry['players'].sort_by! do |player|
        team = player['team']
        [team['is_eliminated'] ? 1 : 0, team['id']]
      end
    end
    render json: entries
  end

  def create
    entry = Entry.create(entry_params)
    entry.player_ids = params[:player_ids]
    render json: entry
  end

  def show
    render json: Entry.find(params[:id])
  end

  def update
    entry = Entry.find(params[:id])
    entry.update_attributes(entry_params)
    entry.player_ids = params[:player_ids]
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
    params.require(:entry).permit(:name)
  end
end
