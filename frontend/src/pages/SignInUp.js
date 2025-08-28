import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SignInUp = () => {
  
const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>

        <div className="d-inline-flex gap-2 mb-5">
          <Link
            className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill"
            to="/login"
          >
            Sign In
          </Link>
          <Link
            className="btn btn-outline-secondary btn-lg px-4 rounded-pill"
            to="/signup"
          >
            Sign Up
          </Link>
        </div>
    
    </>
  );
};
export default SignInUp;