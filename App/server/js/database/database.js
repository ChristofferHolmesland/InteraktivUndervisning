const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbFunctions = require("./databaseFunctions").dbFunctions;
const databasePath = path.resolve(__dirname, `../../database/${process.env.NODE_ENV}.db`);

const fs = require("fs");

module.exports.getDB = function setupDatabase() {
	return new Promise(async function(resolve, reject) {
		//set up connection with the database
		let db = new sqlite3.Database(databasePath, (err) => { if (err) reject(err) });
		//Creating database tables
		await db.serialize(async function () {
			db.run(
				`CREATE TABLE IF NOT EXISTS Feide(
					id TEXT PRIMARY KEY,
					accessToken TEXT NOT NULL,
					name TEXT NOT NULL,
					sessionId TEXT NOT NULL,
					admin INTEGER NOT NULL
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS User(
					id TEXT PRIMARY KEY,
					feideId TEXT,
					FOREIGN KEY(feideId) REFERENCES Feide(id) ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Season(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					season TEXT NOT NULL
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Year(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					year INTEGER NOT NULL
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS CourseSemester(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					seasonId INTEGER NOT NULL,
					yearId INTEGER NOT NULL,
					FOREIGN KEY(seasonId) REFERENCES Season(id),
					FOREIGN KEY(yearId) REFERENCES Year(id)
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS CourseCode(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					code TEXT NOT NULL
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Course(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					codeId INTEGER NOT NULL,
					semesterId INTEGER NOT NULL,
					FOREIGN KEY(codeId) REFERENCES CourseCode(id)
					FOREIGN KEY(semesterId) REFERENCES Semester(id)
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS UserRight(
					feideId TEXT NOT NULL,
					courseId INTEGER NOT NULL,
					level INTEGER NOT NULL,
					PRIMARY KEY(feideId, courseId),
					FOREIGN KEY(feideId) REFERENCES Feide(id) ON DELETE CASCADE ON UPDATE CASCADE,
					FOREIGN KEY(courseId) REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Session(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					status INTEGER NOT NULL,
					participants INTEGER NOT NULL,
					courseId INTEGER NOT NULL,
					FOREIGN KEY(courseId) REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS UserHasSession(
					userId TEXT,
					sessionId INTEGER,
					PRIMARY KEY(userId, sessionId),
					FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
					FOREIGN KEY(sessionId) REFERENCES Session(id) ON DELETE CASCADE ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Type(
					type INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Question(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					text TEXT NOT NULL,
					description TEXT,
					object BLOB,
					time INT,
					solution BLOB NOT NULL,
					questionType INTEGER NOT NULL,
					courseId TEXT NOT NULL,
					FOREIGN KEY (questionType) REFERENCES Type(id) ON DELETE CASCADE ON UPDATE CASCADE
					FOREIGN KEY (courseId) REFERENCES Course(id) ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS SessionHasQuestion(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					sessionId INTEGER NOT NULL,
					questionId INTEGER NOT NULL,
					FOREIGN KEY(sessionId) REFERENCES Session(id) ON DELETE CASCADE ON UPDATE CASCADE,
					FOREIGN KEY(questionId) REFERENCES Question(id) ON DELETE CASCADE ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Answer(
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					object BLOB NOT NULL,
					result INTEGER NOT NULL,
					sessionHasQuestionId INTEGER NOT NULL,
					userId TEXT NOT NULL,
					FOREIGN KEY (sessionHasQuestionId) REFERENCES SessionHasQuestion(id) ON UPDATE CASCADE,
					FOREIGN KEY (userId) REFERENCES User(id) ON UPDATE CASCADE
				);`, (err) => { if (err) reject(err) }
			);

			await dbFunctions.get.userById(db, 1).then((row) => {
				if (row === undefined) {
					dbFunctions.insert.anonymousUser(db, 1)
						.catch((err) => reject(err));
				}
			}).catch((err) => {
				reject(err);
			})
			
			await dbFunctions.get.questionTypes(db).then(async (rows) => {
				let questionTypes = [
					"Text", 
					"Multiple choice", 
					"Shellsort", 
					"MergeSort", 
					"QuickSort",
					"BinaryTree",
					"BinarySearchTree",
					"AVLTree",
					"Dijkstra",
					"Python"
				];

				for(let i = 0; i < questionTypes.length; i++) {
					if (rows.findIndex(row => row.name === questionTypes[i]) === -1)
						await dbFunctions.insert.questionType(db, questionTypes[i])
							.catch((err) => reject(err));
				}
			}).catch((err) => {
				reject(err);
			});

			await dbFunctions.get.seasons(db).then(async (rows) => {
				let seasons = ["spring", "autumn"];
				for (let i = 0; i < seasons.length; i++) {
					if (rows.findIndex(row => row.season === seasons[i]) === -1) {
						await dbFunctions.insert.season(db, seasons[i]).catch((err) => {
							reject(err);
						});
					}
				}
			}).catch(err => {
				reject(err);
			});

			await dbFunctions.get.years(db).then(async (rows) => {
				let currentYear = new Date().getFullYear();
				for (let i = currentYear; i <= currentYear + 3; i++) {
					if (rows.findIndex(row => Number(row.year) === i) === -1) {
						await dbFunctions.insert.year(db, i).catch((err) => {
							reject(err);
						});
					}
				}
			}).catch(err => {
				reject(err);
			});

			if (process.env.NODE_ENV !== "production") {
				await dbFunctions.get.userById(db,"test").then(async (rows) => {
				   if (rows === undefined || rows.length < 1) {
					   dbFunctions.insert.feide(db, "test", "test", "testAdmin", "test", 4).then(() => {
						   dbFunctions.insert.feideUser(db, "test", "test").catch((err) => {
							   	console.error(err);
								reject(err);
						   });
					   }).catch((err) => {
							console.error(err);
							reject(err);
					   });
				   }
				});
			}

			resolve(db);
		});
	});
};

module.exports.deleteDB = function deleteDatabase(){
	if (fs.existsSync(databasePath)) fs.unlinkSync(databasePath);
}

