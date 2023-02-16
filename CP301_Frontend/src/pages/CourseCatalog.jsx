import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import FacultyView from "../components/secondary/FacultyView";
import StudentView from "../components/secondary/StudentView";

const CourseCatalog = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  useEffect(() => {
    if (!user.loggedin) navigate("/home"); 
  }, [user, navigate]);

  return (
    <div className="container">
      <button
        className="btn btn-primary mt-5"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      {user.user.role === "faculty" ? <FacultyView /> : <StudentView />}
    </div>
  );
};

export default CourseCatalog;
