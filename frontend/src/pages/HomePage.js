import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AuthLanding from "./AuthLanding";
import SignInUp from "./SignInUp";

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      {!isAuthenticated && <SignInUp />}
      {isAuthenticated && user &&  <AuthLanding />}
     
    </>
  );
};

export default HomePage;
