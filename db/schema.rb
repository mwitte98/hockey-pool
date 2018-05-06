# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2017_05_29_053333) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "entries_players", id: false, force: :cascade do |t|
    t.integer "entry_id"
    t.integer "player_id"
    t.index ["entry_id"], name: "index_entries_players_on_entry_id"
    t.index ["player_id"], name: "index_entries_players_on_player_id"
  end

  create_table "players", force: :cascade do |t|
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
    t.integer "points"
    t.integer "otg"
    t.index ["team_id"], name: "index_players_on_team_id"
  end

  create_table "teams", force: :cascade do |t|
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
