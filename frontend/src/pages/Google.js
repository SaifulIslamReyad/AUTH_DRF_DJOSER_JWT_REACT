import queryString from "query-string";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { googleAuthenticate } from "../store/auth";


import AuthLanding from "./AuthLanding";

const Google = () => {
  const dispatch = useDispatch();
  let location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
 
  useEffect(() => {
    const values = queryString.parse(location.search);
    const state = values.state ? values.state : null;
    const code = values.code ? values.code : null;

    if (state && code) {
      if (isAuthenticated)
        window.history.replaceState(null, null, window.location.pathname);
      else dispatch(googleAuthenticate(state, code));
    }
  }, [dispatch, isAuthenticated, location.search]);

  return (
    <>
     {isAuthenticated && user && <AuthLanding />}
    </>
  );
};

export default Google;
