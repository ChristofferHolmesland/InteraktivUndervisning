# Interaktiv Undervisning

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

### Installation
- ```git clone https://github.com/ChristofferHolmesland/InteraktivUndervisning.git```
- ```cd InteraktivUndervisning/App```
- ```npm install```

### Start Commands
```
# Copy /env/default.env to /env/<env_name>.env and fill in your keys
# Set environment variable NODE_ENV=<env_name>
# Powershell command: $env:NODE_ENV = "<env_name>"
node server/main.js
```

## Developing
### Dev Requirements
- [NodeJS](https://nodejs.org/en/)
- [nodemon]() If you want to autorefresh the server on changes.

### Dev Installation
Use the same installation guide from [here](#Installation)
And then run the following commands:
```
cd InteraktivUndervisning/App/client
npm install
```

### Dev Start Commands
- ```cd InteraktivUndervisning/App/client```
- Here you can change the client files.
- When you are finsihed editing the client file, use the command:
- ```npm run build```
- This will build the client project in production mode and output the client to the server/public folder
- or you can use these two commands:
- ```npm run buildDev``` This will use the dev environment so that you can use the vue ispect extension
- ```npm run buildDevWatch``` This will do the same as the one over, but it will also auto build on any changes in the client folder.

- When you want to run the server you will use this command from the server folder:
- ```node server.js```
- You can also use the last command on the client in combination with nodemon:
- ```nodemon server.js```

## Configuration

## Tests

## Style guide
ESLint with prettier plugin

## Database
SQLite 3, the schema can be found in the App/server/js/database/database.js file.

## Licensing
