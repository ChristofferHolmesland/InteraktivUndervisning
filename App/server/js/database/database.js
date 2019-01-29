const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const insert = require("./databaseFunctions").insert;
const get = require("./databaseFunctions").get;
const databasePath = path.resolve(__dirname, `../../database/${process.env.NODE_ENV}.db`);

const fs = require("fs");

module.exports.getDB = function setupDatabase() {
    return new Promise(function(resolve, reject) {
        //set up connection with the database
        let db = new sqlite3.Database(databasePath, (err) => { if (err) reject(err) });
        //Creating database tables
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS \"Feide\" (\n" +
                "    id TEXT PRIMARY KEY,\n" +
                "    accessToken TEXT NOT NULL,\n" +
                "    name TEXT NOT NULL\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"User\"(\n" +
                "    id TEXT PRIMARY KEY,\n" +
                "    feideId TEXT,\n" +
                "    FOREIGN KEY  (feideId) REFERENCES Feide (feideId) ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"Course\" (\n" +
                "    semester TEXT,\n" +
                "    code TEXT,\n" +
                "    name TEXT NOT NULL,\n" +
                "    PRIMARY KEY(semester,code)\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"UserRight\"(\n" +
                "    feideId TEXT,\n" +
                "    courseSemester TEXT,\n" +
                "    courseCode TEXT,\n" +
                "    level INTEGER NOT NULL,\n" +
                "    PRIMARY KEY(feideId,courseSemester,courseCode),\n" +
                "    FOREIGN KEY (feideId) REFERENCES Feide (id) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (courseSemester) REFERENCES Course (semester) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (courseCode) REFERENCES Course (code) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"Quiz\" (\n" +
                "    id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "    name TEXT NOT NULL,\n" +
                "    status INTEGER NOT NULL,\n" +
                "    participants INTEGER NOT NULL,\n" +
                "    courseSemester TEXT NOT NULL,\n" +
                "    courseCode TEXT NOT NULL,\n" +
                "    FOREIGN KEY (courseSemester) REFERENCES Course (semester) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (courseCode) REFERENCES Course (code) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS \"User_has_Quiz\"(\n" +
                "    userId TEXT,\n" +
                "    quizId INTEGER,\n" +
                "    PRIMARY KEY(userId,quizId),\n" +
                "    FOREIGN KEY(userId) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY(quizId) REFERENCES Quiz (id) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Type(\n" +
                "    type INTEGER PRIMARY KEY,\n" +
                "    name TEXT NOT NULL\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Question(\n" +
                "    id INTEGER PRIMARY KEY AUTOINCREMENT, \n" +
                "    text TEXT NOT NULL,\n" +
                "    description TEXT,\n" +
                "    object BLOB,\n" +
                "    solution BLOB NOT NULL,\n" +
                "    questionType INTEGER NOT NULL,\n" +
                "    courseCode TEXT NOT NULL,\n" +
                "    FOREIGN KEY (questionType) REFERENCES Type(type) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                "    FOREIGN KEY (courseCode) REFERENCES Course(code) ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Quiz_has_Question(\n" +
                "    id INTEGER PRIMARY KEY AUTOINCREMENT, \n" +
                "    quizId INTEGER,\n" +
                "    questionId INTEGER,\n" +
                "    FOREIGN KEY (quizId) REFERENCES Quiz(id) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                "    FOREIGN KEY (questionId) REFERENCES Question(id) ON DELETE CASCADE ON UPDATE CASCADE\n" +
                ");", (err) => { if (err) reject(err) });

            db.run("CREATE TABLE IF NOT EXISTS Answer(\n" +
                "    id INTEGER PRIMARY KEY AutoIncrement,\n" +
                "    object BLOB NOT NULL,\n" +
                "    result INTEGER NOT NULL,\n" +
                "    questionId INTEGER NOT NULL,\n" +
                "    userId TEXT,\n" +
                "    FOREIGN KEY (questionId) REFERENCES Question(id) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
                "    FOREIGN KEY (userId) REFERENCES User(id)\n" +
                ");", (err) => { if (err) reject(err) });

            get.userById(db, 1).then((row) => {
                if (row === undefined) {
                    insert.anonymousUser(db, 1)
                    .then(() => resolve(db))
                    .catch((err) => reject(err));
                } else {
                    resolve(db);
                }
            }).catch((err) => {
                reject(err);
            })
        });
    });
};

module.exports.deleteDB = function deleteDatabase(){
    fs.unlinkSync(databasePath);
}