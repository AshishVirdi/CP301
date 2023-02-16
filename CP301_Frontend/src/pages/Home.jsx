import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../constants";
import { userContext } from "../context/userContext";

const Home = () => {
  const { user, dispatch } = useContext(userContext);
  const navigate = useNavigate();

  return (
    <div>
      <div className="container">
        <div className="d-flex vh-100 flex-column justify-content-center align-items-center">
          <div className="row w-100 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div>
                {user.user && (
                  <>
                    <div>User Actions:</div>
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={() => navigate("/courses")}
                    >
                      Courses
                    </button>
                  </>
                )}
              </div>
              <div>
                {user.user ? (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => {
                      dispatch({ type: LOGOUT });
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
