import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import CourseItem from "./CourseItem";
import { useState } from "react";
import AdviseeItem from "./AdviseeItem";
import { useContext } from "react";
import { userContext } from "../context/userContext";

const FacultyCourseList = ({ CoursesOBJ, AdviseesOBJ, setForeignHook }) => {
  const [key, setKey] = useState('all');
  const { user } = useContext(userContext);

  const courses = Object.values(CoursesOBJ).map((key) => (
    <CourseItem
      key={key._id}
      courseData={{
        title: key.subjectname,
        code: key.subjectcode,
        coursestatus: key.status,
        instructor: key.instructor,
        user: user.user
      }}
      forInstructor = {true}
      setForeignHook = {setForeignHook}
      />
      ));
      
      const advisees = Object.values(AdviseesOBJ).map((key) => (
    <AdviseeItem
      key={key._id}
      courseData={{
        title: key.email,
        code: key.subjectcode,
        user: user.user
      }}
      forInstructor = {true}
      setForeignHook = {setForeignHook}
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
      <Tab eventKey="enrolled" title="As FA">
        {advisees}
      </Tab>
    </Tabs>
    </div>
  );
};

export default FacultyCourseList;
