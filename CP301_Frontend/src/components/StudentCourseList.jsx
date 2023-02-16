import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import CourseItem from "./CourseItem";
import { useState, useContext } from "react";
import { userContext } from "../context/userContext";

const StudentCourseList = ({ CoursesOBJ, setForeignHook }) => {
  const { user } = useContext(userContext);
  const [key, setKey] = useState("all");

  const courses = Object.values(CoursesOBJ).map((key) => (
    <CourseItem
      key={key._id}
      courseData={{
        title: key.subjectname,
        code: key.subjectcode,
        coursestatus: key.status,
        instructor: key.instructor,
        user: user.user,
      }}
      forInstructor={false}
      setForeignHook={setForeignHook}
    />
  ));

  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="all" title="All Courses">
          {courses}
        </Tab>
        <Tab eventKey="enrolled" title="Enrolled">
          {Object.values(CoursesOBJ).map((course, index) => {
            if (course.status !== null) {
              return (
                <CourseItem
                  key={course._id}
                  courseData={{
                    title: course.subjectname,
                    code: course.subjectcode,
                    coursestatus: course.status,
                    instructor: course.instructor,
                  }}
                  forInstructor={false}
                  setForeignHook={setForeignHook}
                />
              );
            } else return <div key={index}></div>;
          })}
        </Tab>
      </Tabs>
    </div>
  );
};

export default StudentCourseList;
