import { useState } from "react";
import courseHelper from "../services/courseHelper";
import EnrollmentsModal from "./Modal";

const CourseItem = function({ courseData, forInstructor, setForeignHook }){
  const { title, code, coursestatus, instructor, user } = courseData;
  let showButton = true;

  let color = "badge rounded-pill text-bg-warning";
  if (coursestatus === "Enrolled") {
    color = "badge rounded-pill text-bg-success";
  } else if (coursestatus === "Pending Advisor Approval") {
    color = "badge rounded-pill text-bg-info";
  } else if (["Dropped", "Rejected by Instructor", "Rejected by Faculty Advisor"].includes(coursestatus)) {
    color = "badge rounded-pill text-bg-danger";
    showButton = false;
  }

  const [showModal, setShowModal] = useState(false);
  
  const enrollClick = async () => {
    try {
      await courseHelper.enroll({ subjectcode:code, email: user.email, token:user.token });
      setForeignHook(prev=>!prev);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
    }
  };

  const dropClick = async () => {
    try {
      await courseHelper.drop({ subjectcode:code, token:user.token });
      setForeignHook(prev=>!prev);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
    }
  };

  return (
    <div>
      <div className="border rounded-3 w-100 px-3 mt-3 d-flex align-items-center justify-content-between">
        <div>
          <div className="h4 mt-2">{title}</div>
          <p className="badge text-bg-primary rounded-pill m-0">{instructor}</p>
          <p className="fw-bold fs-6">{code}</p>
        </div>
        {forInstructor ? (
          <>
            <button
              className="btn rounded-5 btn-primary h-25"
              onClick={() => setShowModal(true)}
            >
              
              Approve
            </button>
            <EnrollmentsModal
              show={showModal}
              close={() => setShowModal(false)}
              code={code}
            />
          </>
        ) : (
          <div className="d-flex flex-column align-items-end">
            {coursestatus && (
              <p className="fs-6 m-1">
                Status: {" "}
                <span className={color}>
                  {coursestatus}
                </span>
              </p>
            )}
            <div>
              {coursestatus ? (
                showButton && <button className="btn btn-danger btn-sm rounded-pill me-1" onClick={()=>dropClick()}>
                  Drop
                </button>
              ) : (
                <button className="btn btn-success btn-sm rounded-pill me-1" onClick={()=>enrollClick()}>
                  Enroll
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CourseItem.defaultProps = {
  title: "Capstone",
  code: "CP301",
  coursestatus: "ok",
  forInstructor: false,
};

export default CourseItem;
