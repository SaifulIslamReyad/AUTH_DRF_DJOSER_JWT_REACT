import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";
import httpService from "../utils/httpService";

const slice = createSlice({
  name: "auth",
  initialState: {
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
    isAuthenticated: false,
    user: {},
    loading: false,
    error: null,
  },
  reducers: {
    authStarted: (auth, action) => {
      auth.loading = true;
      auth.error = null;
    },

    authSuccess: (auth, action) => {
      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);

      auth.isAuthenticated = true;
      auth.access = action.payload.access;
      auth.refresh = action.payload.refresh;
      auth.loading = false;
      auth.error = null;
    },

    userSignedUp: (auth, action) => {
      auth.isAuthenticated = false;
      auth.loading = false;
    },

    userLoaded: (auth, action) => {
      auth.user = action.payload;
      auth.loading = false;
      auth.error = null;
    },

    userLoadingFailed: (auth, action) => {
      auth.user = {};
      auth.loading = false;
      auth.error = action.payload;
    },

    authFailed: (auth, action) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      auth.isAuthenticated = false;
      auth.access = null;
      auth.refresh = null;
      auth.error = action.payload;
      auth.loading = false;
    },

    authenticationVerified: (auth, action) => {
      auth.isAuthenticated = true;
      auth.error = null;
    },

    authenticationFailed: (auth, action) => {
      auth.isAuthenticated = false;
      auth.error = action.payload;
    },

    loggedOut: (auth, action) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      auth.isAuthenticated = false;
      auth.access = null;
      auth.refresh = null;
      auth.user = {};
      auth.error = null;
    },

    tokenRefreshed: (auth, action) => {
      localStorage.setItem("access", action.payload.access);
      auth.access = action.payload.access;
      auth.error = null;
    },
  },
});
// You export these to use in thunks/middleware
const {
  authStarted,
  authSuccess,
  userSignedUp,
  userLoaded,
  userLoadingFailed,
  authFailed,
  authenticationVerified,
  authenticationFailed,
  loggedOut,
  tokenRefreshed,
} = slice.actions;
export default slice.reducer;

export const checkAuthenticated = () => async (dispatch) => {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access || !refresh) {
    dispatch(authenticationFailed("No tokens found"));
    return;
  }

  try {
    // Try to load user with current token
    await dispatch(loadUser());
    dispatch(authenticationVerified());
  } catch (error) {
    // If access token is invalid, try to refresh
    try {
      const response = await httpService.post("/auth/jwt/refresh/", {
        refresh: refresh,
      });
      
      const { access: newAccess } = response.data;
      localStorage.setItem("access", newAccess);
      
      // Try to load user again with new token
      await dispatch(loadUser());
      dispatch(authenticationVerified());
    } catch (refreshError) {
      // Both tokens are invalid, clear them
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      dispatch(authenticationFailed("Invalid tokens"));
    }
  }
};

export const loadUser = () => async (dispatch) => {
  const access = localStorage.getItem("access");

  if (!access) {
    dispatch(userLoadingFailed("No access token"));
    return;
  }

  try {
    const response = await httpService.get("/auth/users/me/");
    dispatch(userLoaded(response.data));
  } catch (error) {
    if (error.response?.status === 401) {
      // Token is invalid, this will be handled by the interceptor
      dispatch(userLoadingFailed("Unauthorized"));
    } else {
      dispatch(userLoadingFailed(error.message || "Failed to load user"));
    }
  }
};

export const googleAuthenticate = (state, code) => async (dispatch) => {
// Handles the callback from Google after a user logs in with their Google account.
// Exchanges the code and state parameters for JWT tokens (access + refresh).
// If successful → saves tokens, loads user info, and marks them as authenticated.
// If failed → clears state and dispatches an error
  if (state && code && !localStorage.getItem("access")) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const details = { code, state };

    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    try {
      const response = await httpService.post(
        `/auth/o/google-oauth2/?${formBody}`,
        null,
        { headers }
      );

      dispatch(authSuccess(response.data));
      dispatch(loadUser());
    } catch (error) {
      dispatch(authFailed(error.message || "Google authentication failed"));
    }
  }
};

export const facebookAuthenticate = (state, code) => async (dispatch) => {
  if (state && code && !localStorage.getItem("access")) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const details = { code, state };

    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    try {
      const response = await httpService.post(
        `/auth/o/facebook/?${formBody}`,
        null,
        { headers }
      );

      dispatch(authSuccess(response.data));
      dispatch(loadUser());
    } catch (error) {
      dispatch(authFailed(error.message || "Facebook authentication failed"));
    }
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await httpService.post("/auth/jwt/create/", {
      email,
      password,
    });

    dispatch(authSuccess(response.data));
    dispatch(loadUser());
  } catch (error) {
    let errorMessage = "Login failed";
    
    if (error.response?.data) {
      if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      } else if (error.response.data.email) {
        errorMessage = error.response.data.email[0];
      } else if (error.response.data.password) {
        errorMessage = error.response.data.password[0];
      }
    }
    
    dispatch(authFailed(errorMessage));
  }
};

export const signup =
  (email, password, re_password) => async (dispatch) => {
    try {
      const response = await httpService.post("/auth/users/", {
        email,
        password,
        re_password,
      });

      dispatch(userSignedUp());
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Signup failed";
      
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        } else if (error.response.data.email) {
          errorMessage = error.response.data.email[0];
        } else if (error.response.data.password) {
          errorMessage = error.response.data.password[0];
        }
      }
      
      dispatch(authFailed(errorMessage));
      throw new Error(errorMessage);
    }
  };

export const verify = (uid, token) => async (dispatch) => {
  try {
    const response = await httpService.post("/auth/users/activation/", {
      uid,
      token,
    });
    dispatch({ type: "ACTIVATION_SUCCESS" });
    return { success: true };
  } catch (error) {
    dispatch({ type: "ACTIVATION_FAILED" });
    throw error;
  }
};

export const reset_password = (email) => async (dispatch) => {
  try {
    const response = await httpService.post("/auth/users/reset_password/", {
      email,
    });
    dispatch({ type: "RESET_PASSWORD_SUCCESS" });
    return { success: true };
  } catch (error) {
    dispatch({ type: "RESET_PASSWORD_FAILED" });
    throw error;
  }
};

export const reset_password_confirm =
  (uid, token, new_password, re_new_password) => async (dispatch) => {
    try {
      const response = await httpService.post(
        "/auth/users/reset_password_confirm/",
        {
          uid,
          token,
          new_password,
          re_new_password,
        }
      );
      dispatch({ type: "RESET_PASSWORD_CONFIRM_SUCCESS" });
      return { success: true };
    } catch (error) {
      dispatch({ type: "RESET_PASSWORD_CONFIRM_FAILED" });
      throw error;
    }
  };

export const logout = () => (dispatch) => {
  dispatch(loggedOut());
};

export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const response = await httpService.put("/accounts/profile/", profileData);
    dispatch(userLoaded(response.data));
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const refreshToken = () => async (dispatch) => {
  const refresh = localStorage.getItem("refresh");
  
  if (!refresh) {
    throw new Error("No refresh token");
  }

  try {
    const response = await httpService.post("/auth/jwt/refresh/", {
      refresh: refresh,
    });
    
    dispatch(tokenRefreshed(response.data));
    return response.data;
  } catch (error) {
    // Refresh token is invalid, logout user
    dispatch(loggedOut());
    throw error;
  }
};




// a) Initial state
// initialState: {
//   access: localStorage.getItem("access"),
//   refresh: localStorage.getItem("refresh"),
//   isAuthenticated: false,
//   user: {},
//   loading: false,
//   error: null,
// }
// Stores tokens, authentication status, user info, loading & error states.
// Pulls tokens from localStorage for persistence.
// b) Reducers
// Each reducer is a function that updates state:
// Reducer	Purpose
// authStarted	Sets loading = true, resets errors
// authSuccess	Stores tokens, sets isAuthenticated = true
// userSignedUp	After signup → not logged in yet, just loading = false
// userLoaded	Stores user profile info
// userLoadingFailed	Clears user info if loading fails
// authFailed	Clears tokens, sets error message
// authenticationVerified	Marks user as authenticated after token check
// authenticationFailed	Marks authentication failed
// loggedOut	Clears everything → logout
// tokenRefreshed	Updates access token when refresh succeeds
// ✅ These handle all authentication-related state changes.
// c) Async actions (Thunks)
// 1. checkAuthenticated()
// Checks if access + refresh tokens exist.
// Tries to load user.
// If access token invalid → tries to refresh token.
// Updates state depending on success or failure.
// 2. loadUser()
// Fetches /auth/users/me/ → sets user in state.
// Handles errors like missing or invalid token.
// 3. Social Auth: googleAuthenticate & facebookAuthenticate
// Send OAuth code + state to backend.
// On success → authSuccess + loadUser.
// 4. login(email, password)
// Standard login using JWT.
// On success → stores tokens + loads user.
// On failure → updates error state.
// 5. signup(email, password, re_password)
// Registers a new user at /auth/users/.
// On success → dispatches userSignedUp.
// On failure → extracts meaningful backend errors and dispatches authFailed.
// 6. Account verification & password reset
// verify(uid, token) → activates user account.
// reset_password(email) → sends reset email.
// reset_password_confirm(uid, token, new_password) → confirms new password.
// 7. logout()
// Clears tokens and user info.
// 8. updateProfile(profileData)
// Updates user profile via PUT /accounts/profile/.
// 9. refreshToken()
// Uses refresh token to get a new access token.
// Updates state or logs out if refresh fails.
// d) Flow of a typical signup + login
// User fills signup form → dispatches signup(email, password, re_password).
// Redux thunk sends POST request to backend.
// On success → userSignedUp() dispatched.
// Component detects accountCreated = true → navigates to /login.
// User logs in → dispatches login(email, password).
// Redux thunk sends POST to /auth/jwt/create/.
// On success → authSuccess() dispatched → tokens saved → loadUser() fetches profile.
// Component sees isAuthenticated = true → navigates to home page.
// ✅ Key concepts you should understand
// Redux Toolkit Slices
// Combines state + reducers + actions in one file.
// Thunks
// Functions that handle async logic (API calls) and dispatch multiple actions.
// Centralized auth state
// Tokens, user info, loading & errors are all in Redux.
// Social auth integration
// Works with Google/Facebook OAuth seamlessly.
// Token refresh & auto logout
// Your app automatically refreshes tokens or logs out the user if invalid.