# The Urban Clicker Game

<img width="800" alt="image" src="https://github.com/pyeremenko/urbanclicker/assets/696437/cd7ea600-4769-44ad-9abd-cb9676daf7bd">

## Project structure

The most important files and folders in the project are:
* `classes`
  The source code responsible for isometric tile city drawing.
* `effects.js`
  All effects that players can buy are implemented here. The effect is a modifier that can increase or descrease game
  parameters. For example, a driver (that earns money) is the effect.
* `game.js`
  The main game logic is implemented here. One can consider it as a bridge between the UI and the game logic. It is
  also responsible for handling user input.
* `game-events`
  Events happening during the game are implemented here. For example, a player can get a bonus or a penalty.

## Run project locally

Opening `index.html` in a browser is not enough due to CORS policy. A simple HTTP server is required to run the project.
For example, [http-server](https://github.com/http-party/http-server):
1. Install http-server
2. Go to the project root directory
3. Run `http-server` command without any arguments