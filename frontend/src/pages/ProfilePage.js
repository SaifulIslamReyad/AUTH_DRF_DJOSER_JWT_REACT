import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, loadUser } from "../store/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { name } = formData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Load user data if not already loaded
    if (!user.id) {
      dispatch(loadUser());
    }

    // Set form data with current user data
    if (user.name) {
      setFormData({ name: user.name });
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: user.name || "" });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setUpdateLoading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(updateProfile({ name: name.trim() }));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      // Reload user data to get the latest information
      dispatch(loadUser());
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Profile</h2>
                {!isEditing && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={user.email || ""}
                    disabled
                  />
                  <small className="text-muted">
                    Email cannot be changed
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleOnChange}
                      className="form-control"
                      id="name"
                      required
                      placeholder="Enter your full name"
                      disabled={updateLoading}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={user.name || "Not set"}
                      disabled
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateLoading || !name.trim()}
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>

              <div className="mt-4">
                <h5>Account Information</h5>
                <p className="text-muted mb-1">
                  <strong>User ID:</strong> {user.id || "N/A"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Account Status:</strong>{" "}
                  <span className="badge bg-success">Active</span>
                </p>
                <p className="text-muted mb-0">
                  <strong>Member Since:</strong>{" "}
                  {user.date_joined
                    ? new Date(user.date_joined).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
