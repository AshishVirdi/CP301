import { useState, useContext, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../constants";
import { userContext } from "../context/userContext";
import authHelper from "../services/authHelper";

const Login = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(userContext);

  const emailRef = useRef();
  
  const [otpField, setOtpField] = useState(true);
  const [otp, setOtp] = useState("");
  const [resend, setResend] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    role: "student",
    noSubmit: false,
  });

  useEffect(() => {
    if (user.loggedin) {
      navigate("/");
    }
  }, [user, navigate]);

  const { email, noSubmit } = formState;

  const validEmail = new RegExp("^[a-zA-Z0-9._:$!%-]+@iitrpr.ac.in$");
  // for checking that only IIT R O P A R emails are allowed.


  const handleOTPRequest = async (e) => {
    e.preventDefault();
    setResend(false);
    if (!validEmail.test(email)) {
      dispatch({
        type: LOGIN.ERROR,
        payload: "Invalid email. Please enter iitrpr email",
      });
      emailRef.current.focus();
      return;
    }
    dispatch({ type: LOGIN.RESET });
    
    const data = { email, role: formState.role };
    try {
      setTimeout(() => {
        setResend(true);
      }, 15000);
      await authHelper.sendOtp(data);
      setOtpField(false);
      setFormState({ ...formState, noSubmit: true });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({ type: LOGIN.ERROR, payload: message });
    }
  };




  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email: formState.email, OTP: otp, role: formState.role };

    try {
      const response = await authHelper.login(data);
      dispatch({ type: LOGIN.SUCCESS, payload: response });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({ type: LOGIN.ERROR, payload: message });
    }
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
    <div className="row m-1 vh-100 align-items-center justify-content-center">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 border rounded">
          <div className="mt-3 text-center h1">Login</div>
          {user.error && (
            <div className="alert alert-danger mt-2">ERROR: {user.message}</div>
          )}
          <div className="container">
            <form
              className="needs-validation"
              onSubmit={handleOTPRequest}
              noValidate
            >
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                className="form-control mb-3"
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                placeholder="e-mail (email_id@iitrpr.ac.in)"
                value={email}
                onChange={formChange}
                required
                disabled={noSubmit}
              />

              <div className="d-flex justify-content-between px-5">
                <div className="form-check" onChange={formChange}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="student"
                    value="student"
                    defaultChecked
                    disabled={noSubmit}
                  />
                  <label className="form-check-label" htmlFor="student">
                    Student
                  </label>
                </div>
                <div className="form-check" onChange={formChange}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    value="faculty"
                    id="faculty"
                    disabled={noSubmit}
                  />
                  <label className="form-check-label" htmlFor="faculty">
                    Faculty
                  </label>
                </div>
              </div>

              <button
                className="my-4 btn btn-primary w-100"
                type="submit"
                disabled={noSubmit}
              >
                Submit
              </button>
            </form>
            {!otpField && (
              <>
                <hr></hr>
                <form onSubmit={handleLogin}>
                  <label htmlFor="otp" className="form-label">
                    OTP
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    id="otp"
                    required={true}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="d-flex align-items-center mt-3">
                    {!resend && (
                      <Oval
                        width={20}
                        height={20}
                        color={"#0275d8"}
                        secondaryColor={"#0275d8"}
                        visible={true}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-link px-1"
                      disabled={!resend}
                      onClick={handleOTPRequest}
                    >
                      Resend?
                    </button>
                  </div>
                  <button
                    className="my-4 btn btn-primary w-100"
                    type="submit"
                    placeholder="Enter OTP"
                  >
                    Login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




export default Login;
