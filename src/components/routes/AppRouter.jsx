import { Route, Routes } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { menuRoutes } from "./menuRoutes";
import { ProtectedAdmin } from "./ProtectedAdmin";
import { ProtectedUsers } from "./ProtectedUsers";
import { AdminDashboard } from "../pages/dashboard-auth/admin/AdminDashboard";
import { UserOrders } from "../pages/dashboard-auth/user/UserOrders";
import { LoginContainer } from "../pages/dashboard-auth/authentication/login/LoginContainer";
import { SignUpContainer } from "../pages/dashboard-auth/authentication/signup/SignUpContainer";
import { ForgotPassword } from "../pages/dashboard-auth/authentication/forgotPass/ForgotPassword";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {menuRoutes.map(({ id, path, Element }) => (
          <Route key={id} path={path} element={<Element />} />
        ))}
      </Route>

      <Route element={<ProtectedAdmin />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedUsers />}>
        <Route path="user-orders" element={<UserOrders />} />
      </Route>

      <Route path="/login" element={<LoginContainer />} />

      <Route path="/signup" element={<SignUpContainer />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="*"
        element={
          <h1>
            There was an error loading this page. Please go back to previous
            page. Sorry for the inconvenience
          </h1>
        }
      />
    </Routes>
  );
};
