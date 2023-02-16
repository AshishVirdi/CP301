import { Modal, Button } from "react-bootstrap";
import React from "react";
import { useEffect, useContext, useState } from "react";
import { userContext } from "../context/userContext";
import courseHelper from "../services/courseHelper";
import ModalTable from "./ModalTable";

const EnrollmentsModal = (props) => {
  const { user } = useContext(userContext);
  const [records, setRecords] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recordsData = await courseHelper.getSubjectRecords({
          token: user.user.token,
          subjectcode: props.code,
        });

        const fetchedRecords = { ...recordsData };
        
        setRecords({ ...fetchedRecords });
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [props.code, user]);

  return (
    <Modal show={props.show} size={"xl"} onHide={props.close} scrollable = {true}>
      <Modal.Header closeButton>
        <Modal.Title>COURSE ENROLLMENT LIST - {props.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalTable RecordsOBJ={records} />
        <Button variant="secondary" onClick={props.close}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default EnrollmentsModal;