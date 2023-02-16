import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import courseHelper from "../services/courseHelper";

const CourseEnrol = ({ setForeignState }) => {
  const {user} = useContext(userContext);
  const [formState, setFormState] = useState({
    coursecode: "",
    coursename: "",
  });

  const [enrollStatus, setEnrollStatus] = useState("idle");

  const { coursecode } = formState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnrollStatus({ status: "pending", message:"" });
    try {
      await courseHelper.enroll({ subjectcode:coursecode, email: user.user.email, token:user.user.token });
      setEnrollStatus({ status: "success", message: `Enrolled in ${coursecode}` });
      setForeignState(prevState => !prevState);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setEnrollStatus({ status: "error", message });
    }
    setTimeout(() => {
      setEnrollStatus({ status: "pending", message: "" });
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
      <div className="h2">Enroll Course</div>
      {enrollStatus.status === "error" && (
        <div className="alert alert-danger mt-2">ERROR: {enrollStatus.message}</div>
      )}
      {enrollStatus.status === "success" && (
        <div className="alert alert-success mt-2">SUCCESS: {enrollStatus.message}</div>
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
        <button className="btn btn-primary my-3" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default CourseEnrol;
