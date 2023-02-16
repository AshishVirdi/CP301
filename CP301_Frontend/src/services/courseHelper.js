import axios from "axios";

const url = "/record";

const enroll = async (courseDetails) => {
  const { subjectcode, token } = courseDetails;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    url + "/enroll",
    { subjectcode },
    config
  );
  return response.data;
};

const drop = async (courseDetails) => {
  const { subjectcode, token } = courseDetails;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    url + "/drop",
    { subjectcode },
    config
  );
  return response.data;
};

const insert = async (courseDetails) => {
  const { subjectname, subjectcode, instructor, token } = courseDetails;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    url + "/insert",
    { subjectname, subjectcode, instructor },
    config
  );
  return response.data;
};

const approveInstructor = async (courseDetails) => {
  const { subjectcode, studentemail, choice , token } = courseDetails;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    url + "/approveinstructor",
    { subjectcode, studentemail, choice },
    config
  );
  return response.data;
};


const approveAdvisor = async (courseDetails) => {
  const { subjectcode, studentemail, choice, token } = courseDetails;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    url + "/approvefa",
    { subjectcode, studentemail, choice},
    config
  );
  return response.data;
};



const getRecords = async ({ token }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(url + "/fetchsubjects", config);
  return response.data.subject_records;
};

const getSubjectRecords = async ({ token, subjectcode }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(
    url + `/fetchsubjectrecords/${subjectcode}`,
    config
  );
  return response.data.records;
};

const getCourses = async (user) => {
  const { token } = user;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const allCourses = await axios.get(url + "/fetch", config);
  const enrolledCourses = await axios.get(url + "/fetchenrolled", config);
  const response = allCourses.data.records;
  const additional = enrolledCourses.data.records;
  let courses = [];

  response.forEach((element) => {
    const enrolled = additional.find(
      (course) => course.subjectcode === element.subjectcode
    );
    if (enrolled) {
      courses.push({ ...element, status: enrolled.status });
    } else courses.push({ ...element, status: null });
  });
  
  return courses;
};

const getAdvisees = async (advisorData) => {
  const {token} = advisorData;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(url+"/advisorrecords", config);
  return response.data;
}

const courseHelper = {
  enroll,
  drop,
  insert,
  getRecords,
  getSubjectRecords,
  getCourses,
  getAdvisees,
  approveInstructor,
  approveAdvisor
};

export default courseHelper;
