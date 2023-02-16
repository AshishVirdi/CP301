import React from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { userContext } from "../context/userContext";
import { useContext, useState } from "react";
import courseHelper from "../services/courseHelper";

const ModalTable = ({ RecordsOBJ}) => {
  const { user } = useContext(userContext);
  const [changed, setChanged] = useState(false);

  const handleApproval = async (index, email, code, choice) => {
    try {
      await courseHelper.approveInstructor({
        subjectcode: code,
        studentemail: email,
        choice: choice,
        token: user.user.token,
      });

      if (choice === "approve") {
        RecordsOBJ[index].status = "Pending Advisor Approval";
      } else {
        RecordsOBJ[index].status = "Rejected by Instructor";
      }

      setChanged(!changed);
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

  const records = Object.values(RecordsOBJ).map((key, index) => (
    <tr key={key._id}>
      <td>{index}</td>
      <td className="fw-bold">{key.email}</td>
      <td className="text-center">
        {key.status.includes("Pending Instructor") ? (
          <Badge pill bg="warning" text="dark">
            {key.status}
          </Badge>
        ) : key.status.includes("Rejected") ? (
          <Badge pill bg="danger">
            Rejected
          </Badge>
        ) : (
          <Badge pill bg="success">
            Approved
          </Badge>
        )}
      </td>
      <td className="text-center">
        <>
          <Button
            variant="success"
            size="sm"
            onClick={() =>
              handleApproval(index, key.email, key.subjectcode, "approve")
            }
            disabled = {!key.status.includes("Pending Instructor")}
          >
            Accept
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              handleApproval(index, key.email, key.subjectcode, "reject")
            }
            disabled = {!key.status.includes("Pending Instructor")}
          >
            Reject
          </Button>
        </>
      </td>
    </tr>
  ));

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Email</th>
          <th className="text-center">Status</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>{records}</tbody>
    </Table>
  );
};

export default ModalTable;
