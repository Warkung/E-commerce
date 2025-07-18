import { use, useEffect, useState } from "react";
import useEcomStore from "../store/ecomStore";
import { currentUser, currentAdmin } from "../api/auth";
import LoadingToRedirect from "./LoadingToRedirect";

function ProtectRouteAdmin({ element }) {
  const [auth, setAuth] = useState(false);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (user && token)
      // send to back
      currentAdmin(token)
        .then((res) => setAuth(true))
        .catch((err) => setAuth(false));
  }, []);

  return auth ? element : <LoadingToRedirect />;
}
export default ProtectRouteAdmin;
