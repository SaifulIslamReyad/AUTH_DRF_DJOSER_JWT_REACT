import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import configureStore from "./store/configureStore";

import Layout from "./hoc/Layout";

import ActivateAccountPage from "./pages/ActivateAccountPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Facebook from "./pages/Facebook";
import Google from "./pages/Google";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignUpPage from "./pages/SignUpPage";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const store = configureStore();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/facebook" element={<Facebook />} />
              <Route path="/google" element={<Google />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/email-verification"
                element={<EmailVerificationPage />}
              />
              <Route path="/profile-setup" element={<ProfileSetupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/activate/:uid/:token"
                element={<ActivateAccountPage />}
              />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/password/reset/confirm/:uid/:token"
                element={<ResetPasswordConfirmPage />}
              />
            </Routes>
          </Layout>
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
