import styled from "styled-components/macro";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import LoginSharpIcon from "@mui/icons-material/LoginSharp";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import PersonIcon from "@mui/icons-material/Person";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useNavigate } from "react-router-dom";

export const NavMobileButtons = ({ handleNavLinkClick }) => {

  //////////        ////////////        ////////////        ///////////
  //                       Auth & Admin                      //
  
  const { user, handleLogout } = useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolAdmin2 = import.meta.env.VITE_ROL_ADMIN2;
  const rolAdmin3 = import.meta.env.VITE_ROL_ADMIN3;
  const rolAdmin4 = import.meta.env.VITE_ROL_ADMIN4;

  const navigate = useNavigate();

  return (
    <>
      {!user || !user.rol ? (
        <LoginLink
          to="/login"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            handleNavLinkClick();
            window.location.href = "/login";
          }}
        >
          <h4>Login / Sign up</h4>
          <LoginSharpIcon sx={{ fontSize: "26px" }} />
        </LoginLink>
      ) : user.rol === rolAdmin ||
        user.rol === rolAdmin2 ||
        user.rol === rolAdmin3 ||
        user.rol === rolAdmin4 ? (
        <>
          <DashboardLink
            to="/dashboard"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick();
              window.location.href = "/dashboard";
            }}
          >
            <h4>Admin</h4>
            <DashboardSharpIcon sx={{ fontSize: "27px" }} />
          </DashboardLink>
          <LogoutBtn>
            <p>Logout</p>
            <LogoutSharpIcon
              sx={{ fontSize: "25px" }}
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick();
                setTimeout(() => {
                  navigate("/");
                  handleLogout();
                }, 500);
              }}
            />
          </LogoutBtn>
        </>
      ) : (
        <>
          <ProfileLink
            to="/user-orders"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick();
              window.location.href = "/user-orders";
            }}
          >
            <h4>Account</h4>
            <PersonIcon sx={{ fontSize: "30px" }} />
          </ProfileLink>
          <LogoutBtn>
            <p>Logout</p>
            <LogoutSharpIcon
              sx={{ fontSize: "25px" }}
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick();
                setTimeout(() => {
                  navigate("/");
                  handleLogout();
                }, 500);
              }}
            />
          </LogoutBtn>
        </>
      )}
    </>
  );
};
const DashboardLink = styled.button`
  text-align: center;
  text-decoration: none;
  color: black;
  cursor: pointer;
  font-size: 0.6rem;
  background-color: transparent;
  border: none;
`;
const ProfileLink = styled.button`
  text-align: center;
  text-decoration: none;
  color: black;
  cursor: pointer;
  font-size: 0.6rem;
  background-color: transparent;
  border: none;
  margin-top: 2px;
`;
const LoginLink = styled.button`
  text-align: center;
  text-decoration: none;
  align-items: center;
  padding-right: 10px;
  color: black;
  font-size: 0.6rem;
  cursor: pointer;
  background-color: transparent;
  border: none;
`;
const LogoutBtn = styled.button`
  text-align: center;
  text-decoration: none;
  color: black;
  cursor: pointer;
  font-size: 0.6rem;
  background-color: transparent;
  border: none;
  display: ${(isDashboard) => isDashboard && "block"};
`;
