class EntriesController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update, :destroy]

  def index
    respond_with Entry.all
  end
  
  def create
    entry = Entry.create(entry_params)
    respond_with add_players_to_entry(entry)
  end
  
  def show
    respond_with Entry.find(params[:id])
  end
  
  def update
    entry = Entry.find(params[:id])
    entry.update_attributes(entry_params)
    entry.players.clear
    respond_with add_players_to_entry(entry)
  end
  
  def destroy
    entry = Entry.find(params[:id])
    entry.players.clear
    respond_with entry.delete
  end
  
  private
    def entry_params
      params.require(:entry).permit(:name)
    end
    
    def add_players_to_entry(entry)
      entry.players << Player.find(params[:player1])
      entry.players << Player.find(params[:player2])
      entry.players << Player.find(params[:player3])
      entry.players << Player.find(params[:player4])
      entry.players << Player.find(params[:player5])
      entry.players << Player.find(params[:player6])
      entry.players << Player.find(params[:player7])
      entry.players << Player.find(params[:player8])
      entry.players << Player.find(params[:player9])
      entry.players << Player.find(params[:player10])
      entry.players << Player.find(params[:player11])
      entry.players << Player.find(params[:player12])
      entry.players << Player.find(params[:player13])
      entry.players << Player.find(params[:player14])
      entry.players << Player.find(params[:player15])
      entry.players << Player.find(params[:player16])
      return entry
    end
end
