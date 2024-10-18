import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import PersonIcon from "@mui/icons-material/Person";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { CartWidget } from "../../../common/cartWidget/CartWidget";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { CartContext } from "../../../context/CartContext";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useGlobalLocation from "../../../hooks/useGlobalLocation";
import { BsPerson } from "react-icons/bs";

export const NavDesktopButtons = ({ handleNavLinkClick }) => {
  //////////        ////////////        ////////////        ///////////
  //                       Auth & Admin                      //
  const { user, handleLogout } = useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolAdmin2 = import.meta.env.VITE_ROL_ADMIN2;
  const rolAdmin3 = import.meta.env.VITE_ROL_ADMIN3;
  const rolAdmin4 = import.meta.env.VITE_ROL_ADMIN4;
  //////////        ////////////        ////////////        ///////////
  //                      Cart Context                      //
  const { getTotalItems } = useContext(CartContext);
  const totalItems = getTotalItems();
  //////////////////////////////////////////////////////////////////////
  //                       useHooks                        //
  const { isDashboard } = useGlobalLocation();

  const navigate = useNavigate();

  return (
    <>
      <DashboardCartContainer>
        <CartWidget sx={{ padding: "10px" }} totalItems={totalItems} />
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
            <HoveredText>Login / Sign up</HoveredText>
            <BsPerson
              style={{ fontSize: "1.7rem", position: "absolute", top: "29px" }}
            />
          </LoginLink>
        ) : user.rol === rolAdmin ||
          user.rol === rolAdmin2 ||
          user.rol === rolAdmin3 ||
          user.rol === rolAdmin4 ? (
          <>
            <DashboardLink
              isdashboard={isDashboard.toString()}
              to="/dashboard"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick();
                window.location.href = "/dashboard";
              }}
            >
              <HoveredText>Admin</HoveredText>
              <DashboardSharpIcon sx={{ fontSize: "25px" }} />
            </DashboardLink>
            <LogoutBtn>
              <HoveredText>Logout</HoveredText>
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
              <HoveredText>Account</HoveredText>
              <PersonIcon sx={{ fontSize: "28px" }} />
            </ProfileLink>
            <LogoutBtn isDashboard={isDashboard}>
              <HoveredText>Logout</HoveredText>
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
      </DashboardCartContainer>
    </>
  );
};
const DashboardCartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 6px;
  gap: 0.9rem;
`;

const HoveredText = styled.p`
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s ease-in-out;
  font-size: 0.72rem;
  position: absolute;
  bottom: -13px;
  background-color: rgb(68 68 68);
  box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 4px;
  border-radius: 6px;
  padding: 6px 14px;
  color: white;
  text-align: center;
`;

const DashboardLink = styled(Link)`
  cursor: pointer;
  font-size: 0.6rem;
  margin-bottom: 1px;
  text-align: center;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  display: ${({ isdashboard }) => (isdashboard === "true" ? "none" : "block")};
  &:hover ${HoveredText} {
    visibility: visible;
    opacity: 1;
  }
`;

const ProfileLink = styled(Link)`
  cursor: pointer;
  font-size: 0.6rem;
  text-align: center;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  &:hover ${HoveredText} {
    visibility: visible;
    opacity: 1;
  }
`;

const LoginLink = styled(Link)`
  font-size: 0.6rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  justify-content: flex-end;

  &:hover ${HoveredText} {
    visibility: visible;
    opacity: 1;
  }
`;

const LogoutBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 0.6rem;
  cursor: pointer;
  transition: top 0.18s ease-in-out;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${({ isDashboard }) => (isDashboard ? "0" : "10px")};

  &:hover ${HoveredText} {
    visibility: visible;
    opacity: 1;
  }
`;
