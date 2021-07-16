import React from "react";
import { useHistory } from "react-router-dom";

export default function withAuth(WrapperComponent) {
  function Authenticate(props) {
    const history = useHistory();
    const isAuthenticated = localStorage.getItem("isUserLogged");

    const handleRedirect = React.useCallback(() => {
      if (isAuthenticated !== "true" && !localStorage.getItem("nseAuthToken")) {
        history.push("/account");
      }
    }, [history, isAuthenticated]);

    React.useEffect(() => {
      handleRedirect();
    }, [handleRedirect]);

    return isAuthenticated === "true" ? <WrapperComponent {...props} /> : "";
  }

  return Authenticate;
}
