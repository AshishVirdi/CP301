import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import courseHelper from "../services/courseHelper";

const CourseEnrol = ({ setForeignState }) => {
  const { user } = useContext(userContext);
  const [formState, setFormState] = useState({
    coursecode: "",
    coursename: "",
  });

  const [addStatus, setAddStatus] = useState("idle");

  const { coursecode, coursename } = formState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddStatus({ status: "pending", message: "" });
    try {
      await courseHelper.insert({
        subjectname: coursename,
        subjectcode: coursecode,
        token: user.user.token,
        instructor: user.user.email,
      });
      setAddStatus({
        status: "success",
        message: `Added course: ${coursecode}`,
      });
      setForeignState((prevState) => !prevState);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setAddStatus({ status: "error", message });
    }
    setTimeout(() => {
      setAddStatus({ status: "pending", message: "" });
    }, 2000);
  };

  const formChange = (e) => {
    setFormState((prevState) => {
      const newState = {
        ...prevState,
        [e.target.name]: e.target.value,
      };
      return newState;
    });
  };
  return (
    <>
      <div className="h2">Add Course</div>
      {addStatus.status === "error" && (
        <div className="alert alert-danger mt-2">
          ERROR: {addStatus.message}
        </div>
      )}
      {addStatus.status === "success" && (
        <div className="alert alert-success mt-2">
          SUCCESS: {addStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="coursecode" className="form-label">
          Course Code
        </label>
        <input
          type="text"
          id="coursecode"
          name="coursecode"
          className="form-control"
          value={coursecode}
          onChange={formChange}
        />
        <label htmlFor="coursename" className="form-label">
          Course Name
        </label>
        <input
          type="text"
          id="coursename"
          name="coursename"
          className="form-control"
          value={coursename}
          onChange={formChange}
        />
        <button className="btn btn-primary my-3" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default CourseEnrol;
