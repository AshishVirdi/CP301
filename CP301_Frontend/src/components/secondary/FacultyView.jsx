import { useContext, useState, useEffect } from "react";
import { userContext } from "../../context/userContext";

import CourseAdd from "../CourseAdd";
import courseHelper from "../../services/courseHelper";
import FacultyCourseList from "../FacultyCourseList";

const FacultyView = () => {
  const { user } = useContext(userContext);

  const [searchField, setSearchField] = useState("");
  const [courses, setCourses] = useState({});
  const [advisees, setAdvisees] = useState({});
  const [filter, setFilter] = useState({});
  const [updateCourses, setUpdateCourses] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const CoursesData = await courseHelper.getRecords({
          token: user.user.token,
        });
        const courses = { ...CoursesData };
        const newObj = {};
        for (const [key, value] of Object.entries(courses)) {
          if (value.instructor === user.user.email) {
            newObj[key] = value;
          }
        }
        setCourses({ ...newObj });
        setFilter(courses);
      } catch (error) {
        console.log("error", error);
      }
    };

    const fetchAdviseeData = async () => {
      try {
        const AdviseeData = await courseHelper.getAdvisees({
          token: user.user.token,
        });
        console.log(AdviseeData.records);
        const advisees = { ...AdviseeData.records };
        setAdvisees({ ...advisees });
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchCourseData();
    fetchAdviseeData();
  }, [user, updateCourses]);

  const onSearchChange = (e) => {
    setSearchField(e.target.value);
  };

  const onSearchSubmit = async (e) => {
    e.preventDefault();

    const searchRegex = new RegExp(`.*${searchField}.*`);

    if (searchField.trim().length === 0) {
      setFilter(courses);
      return;
    }

    const newObj = {};
    for (const [key, value] of Object.entries(courses)) {
      if (searchRegex.test(value.subjectcode)) {
        newObj[key] = value;
      }
    }
    setFilter({ ...newObj });
  };

  return (
    <div className="row mt-3 flex-row-reverse justify-content-between">
      <div className="col-md-4 mx-1">
        <CourseAdd setForeignState={setUpdateCourses} />
      </div>
      <div className="col-md-7 mx-1">
        <div className="d-flex bg-white py-3 align-items-center">
          <label htmlFor="searchbox" className="me-3">
            Search Course
          </label>
          <input
            type="text"
            name="searchbox"
            className="form-control"
            placeholder="e.g. Machine learning"
            onChange={onSearchChange}
          />
          <button className="btn btn-primary ms-4" onClick={onSearchSubmit}>
            Search
          </button>
        </div>
        <FacultyCourseList CoursesOBJ={filter} AdviseesOBJ = {advisees} setForeignHook={setUpdateCourses}/>
      </div>
    </div>
  );
};

export default FacultyView;
