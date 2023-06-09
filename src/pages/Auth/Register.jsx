import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/TextField";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import axios from "axios";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useCookies } from "../../hooks/useCookies";
import Cookies from "js-cookie";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    const cookies = useCookies();

    if (cookies) navigate("/");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFailed((prev) => false);
    try {
      axios
        .post("https://be-nutech.vercel.app/api/v1/register", formData)
        .then(function (response) {
          Cookies.set("___session", response.data.token, {
            expires: 1,
            secure: true,
          });
          navigate("/");
        })
        .catch(function (error) {
          setIsFailed((prev) => true);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1 className="text-xl font-bold mb-3">Sign Up</h1>
      {isFailed && (
        <>
          <Alert variant="destructive" className="mb-3">
            <AlertDescription>Email atau password salah</AlertDescription>
          </Alert>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          className="mb-3"
          placeholder="Name"
          required
          type="Name"
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <Input
          className="mb-3"
          placeholder="Email"
          required
          type="Email"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <Input
          className="mb-3"
          placeholder="Password"
          required
          type="password"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <div className="text-end mb-3">
          <a className="hover:underline" href="#">
            Forgot password?
          </a>
        </div>

        <Button variant="default" className="w-full rounded-full mb-[30px]">
          Sign Up
        </Button>
      </form>

      <div className="text-center">
        Already have an account?{" "}
        <span className="font-bold">
          <Link to="/auth/login">Sign In</Link>
        </span>
      </div>
    </>
  );
};
