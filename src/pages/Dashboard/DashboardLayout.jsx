import { Link, Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useCookies } from "../../hooks/useCookies";
import { useJWT } from "../../hooks/useJWT";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const cookies = useCookies();
  const { credentials } = useJWT();

  const handleLogout = () => {
    Cookies.remove("___session");
    navigate("/dashboard/login");
  };

  useEffect(() => {
    if (!credentials) {
      navigate("/dashboard/login");
    }

    if (credentials?.role !== "admin") {
      navigate("/dashboard/login");
    }

    if (!cookies) navigate("/dashboard/login");
  }, []);

  return (
    <div className="flex flex-row min-h-screen">
      <div className="basis-1/6 bg-slate-800 p-5">
        <h1 className="text-center text-white text-xl font-bold mb-[40px] mt-3">
          TEST CRUD
        </h1>

        <div className="text-white mb-5">
          <Link to="/dashboard">Home</Link>
        </div>

        <div className="text-white">
          <Link to="/dashboard/products">Products</Link>
        </div>
      </div>

      <div className="basis-5/6 flex flex-col">
        <div className="w-full bg-white border h-[50px] flex items-center justify-end">
          <div>
            <Button className="mr-5" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="bg-slate-100 p-5 flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
