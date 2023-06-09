import { Outlet, useLocation } from "react-router-dom";

export const Auth = () => {
  const location = useLocation();

  const isRegisterPage = location.pathname === "/auth/register";
  return (
    <div>
      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-full h-full">
          <img
            className="object-cover h-full"
            src={isRegisterPage ? "../shop.jpg" : "../shop-login.jpg"}
          />
        </div>
        <div className="flex w-full items-center justify-center h-max">
          <div className="w-[350px]">
            <Outlet
              context={{
                current: isRegisterPage ? "regiser" : "login",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
