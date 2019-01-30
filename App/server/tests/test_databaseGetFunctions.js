const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbFunctions = require("../js/database/databaseFunctions");
const databasePath = path.resolve(__dirname, `../database/${process.env.NODE_ENV}.db`);

let db = undefined;

async function setupDatabase() {
    fs.unlinkSync(databasePath);
    db = await require("../js/database/database").getDB();
};

async function insertDummyData() {
    const dummydata = require('../tools/insertDummyData');
    await dummydata.InsertData(db);
}

async function tests() {
    await setupDatabase();
    await insertDummyData();

    let user = await dbFunctions.get.userById(db, 2);
    console.log(user);
}

tests();