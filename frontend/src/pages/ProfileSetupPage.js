import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/auth";

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name } = formData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("");
    }
    // If user already has a name, redirect to home
    if (user && user.name) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(updateProfile({ name: name.trim() }));
      navigate("/");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Complete Your Profile</h2>
              <p className="text-center text-muted mb-4">
                Please provide your name to complete your profile setup.
              </p>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleOnChange}
                    className="form-control"
                    id="name"
                    required
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !name.trim()}
                    style={{ borderRadius: "50px" }}
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
