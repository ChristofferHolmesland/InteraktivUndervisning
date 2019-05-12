dbFunctions = {
	get: require("./getFunctions").get,
	insert: require("./insertFunctions").insert,
	update: require("./updateFunctions").update,
	del: require("./deleteFunctions").del,
	transaction: require("./transactionFunctions").transaction
}

module.exports.dbFunctions = dbFunctions;