# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_13_023459) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "contestant_name"
    t.string "email"
  end

  create_table "entries_players", id: false, force: :cascade do |t|
    t.integer "entry_id"
    t.integer "player_id"
    t.index ["entry_id"], name: "index_entries_players_on_entry_id"
    t.index ["player_id"], name: "index_entries_players_on_player_id"
  end

  create_table "players", id: :serial, force: :cascade do |t|
    t.integer "team_id"
    t.string "first_name"
    t.string "last_name"
    t.string "position"
    t.integer "goals"
    t.integer "assists"
    t.integer "gwg"
    t.integer "shg"
    t.integer "wins"
    t.integer "shutouts"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "otl"
    t.integer "otg"
    t.integer "finals_goals", default: 0
    t.integer "finals_assists", default: 0
    t.integer "finals_gwg", default: 0
    t.integer "finals_shg", default: 0
    t.integer "finals_otg", default: 0
    t.integer "finals_wins", default: 0
    t.integer "finals_otl", default: 0
    t.integer "finals_shutouts", default: 0
    t.index ["team_id"], name: "index_players_on_team_id"
  end

  create_table "settings", force: :cascade do |t|
    t.boolean "is_playoffs_started"
    t.integer "min_centers"
    t.integer "max_centers"
    t.integer "min_wingers"
    t.integer "max_wingers"
    t.integer "min_defensemen"
    t.integer "max_defensemen"
    t.integer "min_goalies"
    t.integer "max_goalies"
    t.integer "points_goals"
    t.integer "points_assists"
    t.integer "points_gwg"
    t.integer "points_shg"
    t.integer "points_otg"
    t.integer "points_wins"
    t.integer "points_otl"
    t.integer "points_shutouts"
    t.integer "points_finals_goals"
    t.integer "points_finals_assists"
    t.integer "points_finals_gwg"
    t.integer "points_finals_shg"
    t.integer "points_finals_otg"
    t.integer "points_finals_wins"
    t.integer "points_finals_otl"
    t.integer "points_finals_shutouts"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "teams", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "abbr"
    t.boolean "is_eliminated", default: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

end
