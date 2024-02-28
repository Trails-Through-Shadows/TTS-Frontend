# TTS-Frontend

This repository contains the code for the TTS Frontend. <br>
??? TODO: @Myrče, @Barče

## Setup
- Clone the repository
  - `git clone https://github.com/Trails-Through-Shadows/TTS-Frontend.git`
- Install the required packages
  - `npm install`
- Build all necessary files
  - `npm run build`
- Create .env file
  - `cp .env.example .env`
  - Update .env file with database credentials and other necessary information

## Running the server
- Run the server *locally*
  - `npm run dev`
- Run the server *publicly*
  - `npm run dev -- --host`

## Accessing the dashboard
- Open a web browser and go to `http://localhost:8000/` to access the frontend website
- Use the superuser credentials to login and access the site

## Documentation
- [Frontend Documentation](https://docs.tts-game.fun/frontend)

## TODO:
- place ${api} into the functions (not params)
- update login to use actual user data
- bind adventures to user
- bind a campaign to adventure
- get characters from a correct adventure
- make a page for the adventure (list of characters, location choices, etc)
- make a page for the location (story, if market, else encounter, loot, etc)
- make a page for market (buy/sell items)
- finish a page for encounter (fight, flee, etc)
- make a page for character (stats, inventory, etc)
- MAKE EVERYTHING USE DATA FROM THE API
- MAKE EVERYTHING LOOK GOOD



- login (send license, password, get response) => adventure list
- adventure list (get list of ONLY adventures) => adventure (+ characters) / new adventure
- adventure => adventure location list
- adventure location list => location/encounter/market
