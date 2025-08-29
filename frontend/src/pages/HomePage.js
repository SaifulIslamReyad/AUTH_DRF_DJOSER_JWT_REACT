import { useSelector } from "react-redux";

import AuthLanding from "./AuthLanding";
import SignInUp from "../components/SignInUp";

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      {!isAuthenticated && <SignInUp />}
      {isAuthenticated && user &&  <AuthLanding />}
     
    </>
  );
};

export default HomePage;
