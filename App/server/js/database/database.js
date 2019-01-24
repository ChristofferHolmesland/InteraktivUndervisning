const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFunctions = require("./databaseFunctions");
const databasePath = path.resolve(__dirname, `../../database/${process.env.NODE_ENV}.db`);

module.exports.getDB = function setupDatabase() {
    return new Promise(function(resolve, reject) {
        //set up connection with the database
        let db = new sqlite3.Database(databasePath, (err) => { if (err) reject(err) });
        //Creating database tables
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS \"Feide\" (\n" +
                "    feideId TEXT PRIMARY KEY,\n" +
                "    feideAccessToken TEXT NOT NULL,\n" +
                "    feideName TEXT NOT NULL\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"User\"(\n" +
                "    userId TEXT PRIMARY KEY,\n" +
                "    feideId TEXT,\n" +
                "    FOREIGN KEY  (feideId) REFERENCES Feide (feideId) ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"Course\" (\n" +
                "    courseSemester TEXT,\n" +
                "    courseCode TEXT,\n" +
                "    courseName TEXT NOT NULL,\n" +
                "    PRIMARY KEY(courseSemester,courseCode)\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"UserRight\"(\n" +
                "    feideId TEXT,\n" +
                "    courseSemester TEXT,\n" +
                "    courseCode TEXT,\n" +
                "    level INTEGER NOT NULL,\n" +
                "    PRIMARY KEY(feideId,courseSemester,courseCode),\n" +
                "    FOREIGN KEY (feideId) REFERENCES Feide (feideID) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (courseSemester) REFERENCES Course (courseSemester) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (courseCode) REFERENCES Course (courseCode) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"Quiz\" (\n" +
                "    quizId INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "    quizName TEXT NOT NULL,\n" +
                "    status INTEGER NOT NULL,\n" +
                "    participants INTEGER NOT NULL,\n" +
                "    courseSemester TEXT NOT NULL,\n" +
                "    courseCode TEXT NOT NULL,\n" +
                "    FOREIGN KEY (courseSemester) REFERENCES Course (courseSemester) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (courseCode) REFERENCES Course (courseCode) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"User_has_Quiz\"(\n" +
                "    userId TEXT,\n" +
                "    quizId INTEGER,\n" +
                "    PRIMARY KEY(userId,quizId),\n" +
                "    FOREIGN KEY(userId) REFERENCES User (userId) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY(quizId) REFERENCES Quiz (quizId) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Type(\n" +
                "    questionType INTEGER PRIMARY KEY,\n" +
                "    typeName TEXT NOT NULL\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Question(\n" +
                "    questionId INTEGER PRIMARY KEY AUTOINCREMENT, \n" +
                "    questionText TEXT NOT NULL,\n" +
                "    questionDescription TEXT,\n" +
                "    questionObject BLOB,\n" +
                "    questionSolution BLOB NOT NULL,\n" +
                "    questionType INTEGER NOT NULL,\n" +
                "    courseCode TEXT NOT NULL,\n" +
                "    FOREIGN KEY (questionType) REFERENCES Type(questionType) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                "    FOREIGN KEY (courseCode) REFERENCES Course(courseCode) ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Quiz_has_Question(\n" +
                "    quizId INTEGER,\n" +
                "    questionId INTEGER,\n" +
                "    PRIMARY KEY(quizId,questionId)\n" +
                "    FOREIGN KEY (quizId) REFERENCES Quiz(quizId) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                "    FOREIGN KEY (questionId) REFERENCES Question(questionId) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Answer(\n" +
                "    answerId INTEGER PRIMARY KEY AutoIncrement,\n" +
                "    answerObject BLOB NOT NULL,\n" +
                "    result INTEGER NOT NULL,\n" +
                "    questionId INTEGER NOT NULL,\n" +
                "    userId TEXT,\n" +
                "    FOREIGN KEY (questionId) REFERENCES Question(questionId) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (userId) REFERENCES User(userId)\n" +
                ");", (err) => { if (err) reject(err) });

            dbFunctions.insert.anonymousUser(db, 1)
                .then(() => resolve(db))
                .catch((err) => { reject(err); });
        });
    });
};
