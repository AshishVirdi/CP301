import axios from "axios";

const url = "/";

const sendOtp = async (details) => {
  const { email, role } = details;
  const response = await axios.post(url + "signup/", { email, role })
  return response.data;
};

const login = async (details) => {
  const { email, OTP, role } = details;
  const response = await axios.post(url + "signup/verify/", {
    email,
    OTP,
    role,
  });
  return response.data;
};

const authHelper = { sendOtp, login };

export default authHelper;
