import { useState } from "react";
import courseHelper from "../services/courseHelper";
import EnrollmentsModal from "./Modal";

const AdviseeItem = function ({ courseData, setForeignHook }) {
  const { title, code, instructor, user } = courseData;

  const onActionClick = async (choice) => {
    try {
      await courseHelper.approveAdvisor({
        subjectcode: code,
        studentemail: title,
        choice,
        token: user.token,
      });
      setForeignHook((prev) => !prev);
    } catch (error) {
      console.log(error);
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
        <div>
          <button
            className="btn rounded-5 btn-success h-25 me-3"
            onClick={() => onActionClick("approve")}
          >
            Approve
          </button>
          <button
            className="btn rounded-5 btn-danger h-25"
            onClick={() => onActionClick("reject")}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

AdviseeItem.defaultProps = {
  title: "Capstone",
  code: "CP301",
  coursestatus: "ok",
  forInstructor: false,
};

export default AdviseeItem;
