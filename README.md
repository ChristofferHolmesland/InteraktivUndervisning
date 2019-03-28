# Interaktiv Undervisning
Interaktiv Undervisning is a web application which lets lecturers ask students questions.

There are many question types to pick from
1. Text
2. Multiple-choice
3. Sorting algorithms
4. Datastuctures
5. Python references

The students answer the questions using the GraphDrawer tool. GraphDrawer makes it possible to visually modify datastructures (trees, graphs, ...), or perform algorithms (quicksort, mergesort, djikstra, ...).

The application tries to automatically correct answers. The lecturer will be shown percentages for how many people answered corret. Uncorrect answers can be viewed by the lecturer to show the class where the mistake happened.

Lecturers need to login using their FEIDE account. Students can use their FEIDE account if they want to see statistics from their previous sessions, or login anonymously if they don't want that information.

## Table of Contents
1. [Installing / Getting Started](#Installing-/-Getting-Started)
    * [Requirements](#Requirements)
    * [Installation](#Installation)
    * [Start Commands](#Start-Commands)
2. [Development](#Development)
    * [Dev Requirements](#Dev-Requirements)
    * [Dev Installation](#Dev-Installation)
    * [Dev Start Commands](#Dev-Start-Commands)
3. [Configuration](#Configuration)
4. [Tests](#Tests)
5. [Style guide](#Style-guide)
6. [Database](#Database)
7. [Licensing](#Licensing)

## Installing / Getting Started 
### Requirements 
- [NodeJS](https://nodejs.org/en/)
- [Dataporten](https://docs.feide.no/) API keys

### Installation
- ```git clone https://github.com/ChristofferHolmesland/InteraktivUndervisning.git```
- ```cd InteraktivUndervisning/App/client```
- ```npm install```
- ```npm run build```
- ```cd ../server```
- ```npm install```

### Start Commands
Before the server can be started, environment variables need to be placed in an environment file.
Copy ```server/env/default.env``` and fill in your keys. Set the NODE_ENV environment variable to match
the filename of the new file, before starting the server.
- ```node server/server.js```

## Developing
The application is split into two parts, client and server.

### Client
The client interface is built using [VueJS](https://vuejs.org/) with VueX and vue-router. The pages are styled using bootstrap-vue, and server communication is done using vue-socket.io.

### Server
The server is built using NodeJS, ExpressJS and SocketIO.

## Configuration

## Tests
Tests for algorithms and solutionChecker are written in [Mocha](https://mochajs.org/), and can be ran using:
- ```cd InteraktivUndervisning/App/server```
- ```npm run test```

E2E tests uses [Cypress](https://www.cypress.io/), and run by using the following command:
- ```cd InteraktivUndervising/App/server```
- ```npm run cypress:open```

The command will start the express server and should open the cypress editor, using the editor you can run the different available E2E tests residing in: InteraktivUndervising/App/server/tests/cypress/specs folder.

NOTE running the cypress tests requires a Google Chrome browser. 

## Style guide
This project uses [Prettier/ESLint](https://prettier.io/docs/en/eslint.html).

## Database
SQLite3, with the [sqlite3](https://www.npmjs.com/package/sqlite3) package.

## Licensing
