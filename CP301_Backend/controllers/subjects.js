const { StatusCodes } = require("http-status-codes");
const {
  InternalServerError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");

const SubjectSchema = require("../models/subject");
const RecordSchema = require("../models/record");
const StudentSchema = require("../models/student");

const fetchEnrolled = async (req, res) => {
  const { email } = req.user;
  const records = await RecordSchema.find({ email });
  res
    .status(StatusCodes.OK)
    .send({ message: "Enrolled Students Returned", records });
};

const fetchAll = async (req, res) => {
  const records = await SubjectSchema.find();
  res.status(StatusCodes.OK).send({ message: "Subjects Returned", records });
};

const fetchSubjects = async (req, res) => {
  const subject_records = await SubjectSchema.find({
    instructor: req.user.email,
  });
  res
    .status(StatusCodes.OK)
    .send({ message: "Instructor Subjects Returned", subject_records });
};

const fetchSubjectRecords = async (req, res) => {
  const subjectcode = req.params.id;
  const records = await RecordSchema.find({ subjectcode });
  res
    .status(StatusCodes.OK)
    .send({ message: "Subject Records Returned", records });
};

const insertSubject = async (req, res) => {
  const { subjectname, subjectcode, instructor } = req.body;
  if (!subjectname || !subjectcode || !instructor) {
    throw new BadRequestError("Please enter all details");
  }

  const subjectExists = await SubjectSchema.exists({ subjectcode });

  if (subjectExists) {
    throw new ForbiddenError("Subject offering already exists");
  }

  const record = await SubjectSchema.create({
    subjectname,
    subjectcode,
    instructor,
  });
  if (!record) {
    throw new InternalServerError("Could not insert subject");
  }
  res.status(StatusCodes.OK).send({ message: "Subject inserted" });
};

const enrollSubject = async (req, res) => {
  const { email } = req.user;
  const { subjectcode } = req.body;
  if (!subjectcode || !email) {
    throw new BadRequestError("Please enter all details");
  }

  const subjectExists = await SubjectSchema.exists({ subjectcode });

  if (subjectExists == null) {
    throw new NotFoundError("The requested subject does not exist");
  }

  const enrollmentExists = await RecordSchema.exists({
    subjectcode: subjectcode,
    email: email,
  });

  if (enrollmentExists) {
    throw new ForbiddenError("Course already enrolled");
  }

  const record = await RecordSchema.create({
    subjectcode,
    email,
    status: "Pending Instructor Approval",
  });

  if (!record) {
    throw new InternalServerError("Could not insert record");
  }

  res.status(StatusCodes.OK).send({ message: "Record inserted" });
};

const approveInstructor = async (req, res) => {
  let { subjectcode, studentemail, choice } = req.body;
  if (!subjectcode || !studentemail) {
    throw new BadRequestError("Please enter all details");
  }
  let record = await RecordSchema.findOne({
    subjectcode,
    email: studentemail,
    status: "Pending Instructor Approval",
  });
  if (!record) {
    throw new BadRequestError("Could not find record");
  }
  choice =
    choice === "approve"
      ? "Pending Advisor Approval"
      : "Rejected by Instructor";
  record = await RecordSchema.findOneAndUpdate(
    { subjectcode, email: studentemail, status: "Pending Instructor Approval" },
    { status: choice },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).send({ message: "Record updated" });
};

const approveFA = async (req, res) => {
  let { subjectcode, studentemail, choice } = req.body;
  if (!subjectcode || !studentemail) {
    throw new BadRequestError("Please enter all details");
  }
  let record = await RecordSchema.findOne({
    subjectcode,
    email: studentemail,
    status: "Pending Advisor Approval",
  });
  if (!record) {
    throw new BadRequestError("Could not find record");
  }
  choice = choice === "approve" ? "Enrolled" : "Rejected by Faculty Advisor";
  record = await RecordSchema.findOneAndUpdate(
    { subjectcode, email: studentemail, status: "Pending Advisor Approval" },
    { status: choice },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).send({ message: "Record updated" });
};

const getStudentRecordsFromList = async (listOfStudents) => {
  const returnRecords = [];
  for (let i = 0; i < listOfStudents.length; i++) {
    const studentRecord = await RecordSchema.find({
      email: listOfStudents[i],
      status: "Pending Advisor Approval",
    });
    returnRecords.push(...studentRecord);
  }
  return returnRecords;
};

const fetchAdvisorStudentRecords = async (req, res) => {
  const { email } = req.user;
  const records = await StudentSchema.find({ facultyAdvisor: email });
  const studentEmails = records.map((record) => record.email);
  const returnRecords = await getStudentRecordsFromList(studentEmails);
  res.send({ message: "Pending Approval Records", records: returnRecords });
};

const dropEnrollment = async (req, res) => {
  const { email } = req.user;
  const { subjectcode } = req.body;
  const record = await RecordSchema.findOne({
    email,
    subjectcode,
  });
  if (!record) {
    throw new BadRequestError("No such enrollment");
  }
  if (
    record.status in ["Rejected by Faculty Advisor", "Rejected by Instructor"]
  ) {
    throw new BadRequestError("Cannot drop rejected course");
  }
  await RecordSchema.findOneAndUpdate(
    {
      email,
      subjectcode,
    },
    {
      status: "Dropped",
    }
  );
  res.status(StatusCodes.OK).send({ message: "Course Dropped" });
};

module.exports = {
  insertSubject,
  enrollSubject,
  fetchSubjects,
  fetchSubjectRecords,
  fetchEnrolled,
  fetchAll,
  approveInstructor,
  fetchAdvisorStudentRecords,
  approveFA,
  dropEnrollment,
};
