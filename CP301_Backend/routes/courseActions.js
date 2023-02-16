const express = require("express");
const {
  enrollSubject,
  approveInstructor,
  fetchSubjects,
  fetchAll,
  fetchSubjectRecords,
  insertSubject,
  approveFA,
  fetchEnrolled,
  fetchAdvisorStudentRecords,
  dropEnrollment,
} = require("../controllers/subjects");
const isInstructor = require("../middleware/isInstructor");
const isFA = require("../middleware/isFA");
const isFaculty = require("../middleware/isFaculty");
const router = express.Router();

// All post requests are already authorized.

// takes : { subjectname, subjectcode, instructor(email) }
// returns: OK + { message } if successful
router.route("/insert").post(isFaculty, insertSubject);

// takes : { subjectcode }
// returns: OK + { message } if successful
router.route("/enroll").post(enrollSubject);

// takes : { subjectcode, studentemail, choice }
// choice : "approve" to approve. Anything else to reject
// returns: OK + { message } if successful
router
  .route("/approveinstructor")
  .post([isFaculty, isInstructor], approveInstructor);

// takes : { subjectcode, studentemail, choice }
// choice : "approve" to approve. Anything else to reject
// returns: OK + { message } if successful
router.route("/approvefa").post([isFaculty, isFA], approveFA);

// takes : no body
// return : OK + { message } if successful
router.route("/fetchsubjects").get(isFaculty, fetchSubjects);

// takes : no body
// return : OK + { message } if successful
router.route("/fetchenrolled").get(fetchEnrolled);

// takes : no body
// return : OK + { message } if successful fetches all courses
router.route("/fetch").get(fetchAll);

// takes : no body
// return : OK + { message, records } if successful
router.route('/advisorrecords').get([isFaculty], fetchAdvisorStudentRecords)

// takes : no body, we have to provide it with subjectcode, faculty_email, is_Faculty
// return : OK + { message } if successful
router.route("/fetchsubjectrecords/:id").get(isFaculty, fetchSubjectRecords);

// takes : { subjectcode }
// return : OK + { message } if successful
router.route("/drop").post(dropEnrollment);

module.exports = router;
