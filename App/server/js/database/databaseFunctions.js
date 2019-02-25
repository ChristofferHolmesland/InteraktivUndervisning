dbFunctions = {
    get: require("./databaseGetFunctions").get,
    insert: require("./databaseInsertFunctions").insert,
    update: require("./databaseUpdateFunctions").update,
    del: require("./databaseDeleteFunctions").del
}

module.exports.dbFunctions = dbFunctions;