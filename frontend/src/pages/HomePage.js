import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated but doesn't have a name, redirect to profile setup
    if (isAuthenticated && user && !user.name) {
      navigate("/profile-setup");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="container my-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3">
        <h1 className="text-body-emphasis">Welcome to Auth System!</h1>
        <p className="col-lg-8 mx-auto fs-5 text-muted">
          This is an incredible auth system with production level features!
        </p>

        {!isAuthenticated && (
          <>
            <p>
              Click Sign In to login to your account or Sign Up to create a new
              account.
            </p>

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
        )}

        {isAuthenticated && user && user.name && (
          <div className="mt-4">
            <h3>Welcome back, {user.name}!</h3>
            <p>Your profile is complete.</p>
            <div className="mt-3">
              <Link
                className="btn btn-outline-primary"
                to="/profile"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
