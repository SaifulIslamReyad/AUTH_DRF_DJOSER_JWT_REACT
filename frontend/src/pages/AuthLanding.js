// src/components/AuthLanding.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AuthLanding = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated but doesn't have a name, redirect to profile setup
    if (isAuthenticated && user && !user.name) {
      navigate("/profile-setup");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <div className="mt-4">
        <h3>Welcome{user.name}!</h3>
        <p>Your profile is complete.</p>
        <div className="mt-3">
          <Link className="btn btn-outline-primary" to="/profile">
            View Profile
          </Link>
        </div>
      </div>
    </>
  );
};

export default AuthLanding;
