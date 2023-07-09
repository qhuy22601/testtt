import { useState, useEffect, useCallback } from "react";
import Header from "../Header";
import { Link, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "../theme";
import styled from "styled-components";
import { SideNav } from "../layouts/dashboard/side-nav";
import CardQuiz from "../components/card-quiz";
const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled.div`
  display: flex;
  flex: 1 1 auto;
  max-width: 100%;
  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints}px) {
      padding-left: ${SIDE_NAV_WIDTH}px;
    }
  `}
`;

const LayoutContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
`;

function Quiz(){


     const handleLoginRedirect = () => {
       window.location.href = "/login";
     };

     const location = useLocation();
     const [openNav, setOpenNav] = useState(false);

     const handlePathnameChange = useCallback(() => {
       if (openNav) {
         setOpenNav(false);
       }
     }, [openNav]);

     useEffect(() => {
       handlePathnameChange();
     }, [location.pathname, handlePathnameChange]);

    return (
      <ThemeProvider theme={createTheme()}>
        <>
          {/* <TopNav onNavOpen={() => setOpenNav(true)} onLoginRedirect={handleLoginRedirect} /> */}
          <Header onLoginRedirect={handleLoginRedirect}></Header>
          <SideNav onClose={() => setOpenNav(false)} open={openNav} />
          <LayoutRoot>
            <LayoutContainer>
              <div
                style={{
                  width: "80%",
                  marginRight: 0,
                  marginLeft: "auto",
                }}
              >
                <CardQuiz></CardQuiz>
              </div>
            </LayoutContainer>
          </LayoutRoot>
        </>
      </ThemeProvider>
    );


}


export default Quiz;