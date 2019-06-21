const dbFunctions = require("../database/databaseFunctions").dbFunctions;

module.exports.admin = function(socket, db, user, users) {

	socket.on("createCourseRequest", async function(newCourse) {
		if (user.userRights < 4) return;

		// Checks name
		if (newCourse.name === "" || newCourse.name === undefined) {
			socket.emit("createCourseError", "nameMissing");
			return;
		}

		// Checks course code
		let courseCodes = await dbFunctions.get.courseCodes(db).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		});
		let courseCodeIndex = courseCodes.findIndex(courseCode => courseCode.id === newCourse.code);
		if (courseCodeIndex === -1) {
			socket.emit("createCourseError", "courseCodeDoesnTExist");
			return;
		}

		// Checks semester
		let semesters = await dbFunctions.get.semesters(db).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		});
		let semesterIndex = semesters.findIndex(semester => semester.id === newCourse.semester);
		if (semesterIndex === -1) {
			socket.emit("createCourseError", "semesterDoesnTExist");
			return;
		}

		// Checks if course already exists
		let courses = await dbFunctions.get.allCoursesWithIds(db).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		});
		let courseIndex = courses.findIndex(course => (
			(course.courseCodeId === newCourse.code) &&
			(course.courseSemesterId === newCourse.semester)
		));
		if (courseIndex > -1) {
			socket.emit("createCourseError", "courseExists");
			return;
		}

		// Inserts course and makes user admin
		await dbFunctions.insert.course(db, newCourse).then(async (courseId) => {
			await dbFunctions.insert.courseAdmin(db, {
				feideId: user.feide.idNumber,
				courseId: courseId
			}).then(() => {
				socket.emit("createCourseResponse");
			}).catch((err) => {
				console.error(err);
				socket.emit("createCourseError", "dbError");
				return;
			})
		}).catch((err) => {
			console.error(err);
			socket.emit("createCourseError", "dbError");
			return;
		})
	});

	socket.on("setUserRightsLevel", function(data) {
		if (user.userRights < 4) return;

		let length = data.feideId.length;
		if 
		(
			(length !== 6 && length !== 7 ) ||
			!Number.isInteger(Number(data.feideId))
		) return;

		if (data.feideId == user.feide.idNumber && data.level === -1) return;
		dbFunctions.get.userRightsByFeideId(db, {
			feideId: data.feideId,
			courseId: data.courseId
		}).then((dbUser) => {
			if (dbUser !== undefined) {
				users.forEach((val, key, m) => {
					if (val.feide.idNumber == data.feideId) {
						val.userRights = data.level == -1 ? 2 : data.level;
					}
				});
			}
			
			if (dbUser == undefined) {
				dbFunctions.insert.userRightsLevelByFeideId(db, {
					feideId: data.feideId,
					courseId: data.courseId,
					level: data.level
				}).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level !== -1) {
				dbFunctions.update.userRightsLevelByFeideId(db, {
					feideId: data.feideId,
					courseId: data.courseId,
					level: data.level
				}).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			} else if (data.level == -1) {
				if (data.feideId == user.feide.idNumber) return;
				dbFunctions.del.userRights(db, {
					feideId: data.feideId,
					courseId: data.courseId
				}).then(() => {
					socket.emit("setUserRightsLevelDone");
				});
			}
		});
	});

	socket.on("semestersRequest", async function() {
		if (user.userRights < 4) return;

		await dbFunctions.get.semesters(db).then(rows => {
			socket.emit("semestersResponse", rows);
		}).catch(err => {
			if (err) socket.emit("semestersError");
		});
	});

	socket.on("seasonsRequest", async function() {
		if (user.userRights < 4) return;

		await dbFunctions.get.seasons(db).then(rows => {
			socket.emit("seasonsResponse", rows);
		}).catch(err => {
			if (err) socket.emit("seasonsError");
		});
	});

	socket.on("yearsRequest", async function() {
		if (user.userRights < 4) return;
		
		await dbFunctions.get.years(db).then(rows => {
			socket.emit("yearsResponse", rows);
		}).catch(err => {
			if (err) socket.emit("yearsError");
		});
	});

	socket.on("courseCodesRequest", async function() {
		if (user.userRights < 4) return;
		
		await dbFunctions.get.courseCodes(db).then(rows => {
			socket.emit("courseCodesResponse", rows);
		}).catch(err => {
			if (err) socket.emit("courseCodesError");
		})
	});

	socket.on("addNewCourseCodeRequest", async function(newCourseCode) {
		if (user.userRights < 4) return;
		
		let pattern = new RegExp("^[A-Z]{3}[0-9]{3}$");
		if (newCourseCode === "" || newCourseCode === undefined) {
			socket.emit("addNewCourseCodeError", "courseCodeMissing");
			return;
		}
		if (!pattern.test(newCourseCode)) {
			socket.emit("addNewCourseCodeError", "courseCodeWrongPattern");
			return
		}
		
		await dbFunctions.get.courseCodes(db).then(async rows => {
			if (rows.findIndex(row => row.code === newCourseCode) === -1) {
				await dbFunctions.insert.courseCode(db, newCourseCode).then(() => {
					socket.emit("addNewCourseCodeResponse");
				}).catch(() => {
					socket.emit("addNewCourseCodeError", "insertCourseCodeError");
				});
			} else {
				socket.emit("addNewCourseCodeError", "courseCodeExists");
			}
		}).catch(err => {
			if (err) socket.emit("addNewCourseCodeError", "dbError");
		})
	});

	socket.on("addNewSemesterRequest", async function(newSemester) {
		if (user.userRights < 4) return;
		
		if (
			!Number(newSemester.season) ||
			!Number(newSemester.year)
		) {
			socket.emit("addNewSemesterError");
			return;
		}

		await dbFunctions.get.semesters(db).then(async (semesters) => {
			let seasons = await dbFunctions.get.seasons(db).catch((err) => {
				console.error(err);
				socket.emit("addNewSemesterError", "dbError");
				return;
			});
			if (seasons.findIndex(season => season.id === newSemester.season) === -1) {
				socket.emit("addNewSemesterError", "seasonDoesTExist");
				return;
			}
			let season = seasons[seasons.findIndex(season => season.id === newSemester.season)].season;

			let years = await dbFunctions.get.years(db).catch((err) => {
				console.error(err);
				socket.emit("addNewSemesterError", "dbError");
				return;
			});
			if (years.findIndex(year => year.id === newSemester.year) === -1) {
				socket.emit("addNewSemesterError", "yearDoesTExist");
				return;
			}
			let year = years[years.findIndex(year => year.id === newSemester.year)].year;
			
			if (semesters.findIndex(semester => 
				(
					season === semester.season &&
					year === semester.year
				)
			) > -1) {
				socket.emit("addNewSemesterError", "semesterExists");
				return;
			}

			await dbFunctions.insert.courseSemester(db, newSemester).then(() => {
				socket.emit("addNewSemesterResponse");
				return;
			}).catch((err) => {
				console.error(err);
				socket.emit("addNewSemesterError", "addNewSemesterInsert");
			});
			return;
		}).catch((err) => {
			console.error(err);
			socket.emit("addNewSemesterError", "dbError");
			return;
		});
	});

	socket.on("applicationsByCourseIdRequest", function(courseId) {
		if (
			courseId === undefined ||
			courseId === null ||
			typeof courseId === "string" ||
			courseId.length === 0
		) return;

		dbFunctions.get.userRightInCourseById(db, {
			courseId: courseId,
			feideId: user.feide.idNumber
		}).then((userRight) => {
			if (userRight.length === 0) return;
			dbFunctions.get.getApplicationListByCourseId(db, courseId).then((applications) => {
				socket.emit("applicationsByCourseIdResponse", applications);
			}).catch((err) => {
				console.error(err);
			})
		}).catch((err) => {
			console.error(err);
		});
	});
	
	socket.on("removeApplicant", function(applicationId, courseId) {
		if (
			courseId === undefined ||
			courseId === null ||
			typeof courseId !== "number" ||
			courseId.length === 0 ||
			applicationId === undefined ||
			applicationId === null ||
			typeof applicationId !== "number" ||
			applicationId === 0
		) return;

		dbFunctions.get.userRightInCourseById(db, {
			courseId: courseId,
			feideId: user.feide.idNumber
		}).then((userRight) => {
			if (userRight.length === 0) return;
			dbFunctions.del.applicationById(db, applicationId).then(() => {
				socket.emit("applicantChangeResponse");
			}).catch((err) => {
				console.error(err);
			})
		}).catch((err) => {
			console.error(err);
		});
	});
	
	socket.on("approveApplicant", function(applicationId, courseId) {
		if (
			courseId === undefined ||
			courseId === null ||
			typeof courseId !== "number" ||
			courseId.length === 0 ||
			applicationId === undefined ||
			applicationId === null ||
			typeof applicationId !== "number" ||
			applicationId === 0
		) return;

		dbFunctions.get.userRightInCourseById(db, {
			courseId: courseId,
			feideId: user.feide.idNumber
		}).then((userRight) => {
			if (userRight.length === 0) return;
			dbFunctions.get.applicationById(db, applicationId).then((application) => {
				if (application === undefined) return;

				dbFunctions.transaction.approveApplicants(db, {
					feideId: application.feideId,
					courseId: application.courseId,
					level: application.userRight,
					applicationId: applicationId
				}).then(() => {
					socket.emit("applicantChangeResponse");
				}).catch((err) => {
					console.log(err)
				});
			}).catch((err) => {
				console.error(err);
			})
		}).catch((err) => {
			console.error(err);
		});
	});

}