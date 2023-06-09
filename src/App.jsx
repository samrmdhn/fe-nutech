import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { DashboardLogin } from "./pages/Dashboard/DashboardLogin";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { Auth } from "./pages/Auth/Auth";
import { DashboardProducts } from "./pages/Dashboard/DashboardProducts";
import { DashboardLayout } from "./pages/Dashboard/DashboardLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<DashboardProducts />} />
        </Route>
        <Route path="/dashboard/login" element={<DashboardLogin />} />
      </Routes>
    </>
  );
}

export default App;
