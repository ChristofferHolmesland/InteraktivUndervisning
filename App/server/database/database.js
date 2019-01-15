const path = require('path');
const sqlite3 = require('sqlite3').verbose();

//var currentpath = path.resolve(__dirname, "../dbtest/testdb");
//console.log(currentpath);
module.exports.getDB = function setupDatabase() {

	//set up connection with the database
	let db = new sqlite3.Database("databasetest.db", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Connected to the database")
        }
    });

    //Creating database tables
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS \"Feide\" (\n" +
            "    feideId TEXT PRIMARY KEY,\n" +
            "    feideAccessToken TEXT NOT NULL,\n" +
            "    feideName TEXT NOT NULL\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in Feide table" + err.message);
            }
            else {
                console.log("Feide table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS \"User\"(\n" +
            "    userId TEXT PRIMARY KEY,\n" +
            "    feideId TEXT NOT NULL,\n" +
            "    FOREIGN KEY  (feideId) REFERENCES Feide (feideId)\n" +
            "    ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in User table" + err.message);
            }
            else {
                console.log("User table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS \"Course\" (\n" +
            "    courseSemester TEXT,\n" +
            "    courseCode TEXT,\n" +
            "    courseName TEXT NOT NULL,\n" +
            "    PRIMARY KEY(courseSemester,courseCode)\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in Course table" + err.message);
            }
            else {
                console.log("Course table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS \"UserRight\"(\n" +
            "    feideId TEXT,\n" +
            "    courseSemester TEXT,\n" +
            "    courseCode TEXT,\n" +
            "    level INTEGER NOT NULL,\n" +
            "    PRIMARY KEY(feideId,courseSemester,courseCode),\n" +
            "    FOREIGN KEY (feideId) REFERENCES Feide (feideID) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "    FOREIGN KEY (courseSemester) REFERENCES Course (courseSemester) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "    FOREIGN KEY (courseCode) REFERENCES Course (courseCode) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in UserRight table");
            }
            else {
                console.log("UserRight table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS \"Quiz\" (\n" +
            "    quizId INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
            "    quizName TEXT NOT NULL,\n" +
            "    courseSemester TEXT NOT NULL,\n" +
            "    courseCode TEXT NOT NULL,\n" +
            "    FOREIGN KEY (courseSemester) REFERENCES Course (courseSemester) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "    FOREIGN KEY (courseCode) REFERENCES Course (courseCode) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in Quiz table");
            }
            else {
                console.log("Quiz table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS \"User_has_Quiz\"(\n" +
            "    userId TEXT,\n" +
            "    quizId INTEGER,\n" +
            "    PRIMARY KEY(userId,quizId),\n" +
            "    FOREIGN KEY(userId) REFERENCES User (userId) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
            "    FOREIGN KEY(quizId) REFERENCES Quiz (quizId) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in User_has_Quiz table");
            }
            else {
                console.log("User_has_Quiz table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS Type(\n" +
            "    questionType INTEGER PRIMARY KEY,\n" +
            "    typeName TEXT NOT NULL\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in Type table");
            }
            else {
                console.log("Type table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS Question(\n" +
            "    questionId INTEGER PRIMARY KEY AUTOINCREMENT, -- auto increment?\n" +
            "    questionText TEXT NOT NULL,\n" +
            "    questionObject BLOB,\n" +
            "    questionSolution BLOB NOT NULL,\n" +
            "    questionType INTEGER NOT NULL,\n" +
            "    FOREIGN KEY (questionType) REFERENCES Type(questionType)\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in Question table");
            }
            else {
                console.log("Question table is operational");
            }
        });

        db.run("CREATE TABLE IF NOT EXISTS Answer(\n" +
            "    answerId INTEGER PRIMARY KEY, --AutoIncrement?\n" +
            "    answerObject BLOB NOT NULL,\n" +
            "    questionId INTEGER NOT NULL,\n" +
            "    userId TEXT,\n" +
            "    FOREIGN KEY (questionId) REFERENCES Question(questionId),\n" +
            "    FOREIGN KEY (userId) REFERENCES User(userId)\n" +
            ");", function (err) {
            if (err) {
                console.log("error occurred in Answer");
            }
            else {
                console.log("Answer table is operational");
            }
        });
    });
    return db;
};
