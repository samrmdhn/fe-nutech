import { Label } from "../../components/Label";
import Input from "../../components/TextField";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Alert, AlertDescription } from "../../components/Alert";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useJWT } from "../../hooks/useJWT";

export const DashboardLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isFailed, setIsFailed] = useState(false);
  const [failedText, setFailedText] = useState("");
  const { credentials } = useJWT();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFailed((prev) => false);
    try {
      axios
        .post("https://be-nutech.vercel.app/api/v1/login", formData)
        .then(({ data }) => {
          //       console.log(data);

          const decode = jwt_decode(data?.token);

          if (decode?.role !== "admin") {
            //         console.log(decode.role);
            setIsFailed((prev) => true);
            setFailedText((prev) => "You're not admin");
          } else {
            Cookies.set("___session", data.token, {
              expires: 1,
              secure: true,
            });
            navigate("/dashboard");
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsFailed((prev) => true);
          setFailedText((prev) => "Email or password not match");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (credentials?.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard/login");
    }
  }, []);

  return (
    <div className="h-screen bg-slate-900 flex justify-center items-center">
      <div className="w-[400px] rounded bg-slate-100 p-5 drop-shadow-md">
        <h1 className="text-xl font-bold text-center mb-[40px]">Sign In</h1>
        {isFailed && (
          <>
            <Alert variant="destructive" className="mb-3">
              <AlertDescription>{failedText}</AlertDescription>
            </Alert>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <Label>
            Email
            <Input
              className="mt-1 mb-3"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </Label>

          <Label>
            Password
            <Input
              type="password"
              className="mt-1 mb-3"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </Label>

          <div className="flex justify-center">
            <Button>Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
