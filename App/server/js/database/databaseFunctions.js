dbFunctions = {
    get: require("./databaseGetFunctions").get,
    insert: require("./databaseInsertFunctions").insert,
    update: require("./databaseUpdateFunctions").update
}

module.exports.dbFunctions = dbFunctions;
