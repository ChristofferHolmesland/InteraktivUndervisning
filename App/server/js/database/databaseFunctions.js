const get = require("./databaseGetFunctions").get;
const insert = require("./databaseInsertFunctions").insert;
const update = require("./databaseUpdateFunctions").update;
const del = require("./databaseDeleteFunctions").del;

module.exports.get = get;
module.exports.insert = insert;
module.exports.update = update;
module.exports.del = del;
