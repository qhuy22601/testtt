import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import {
  Box,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Logo } from "../../components/logo";
import { Scrollbar } from "../../components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import logo from "../../../hmrs.png"
export const SideNav = (props) => {
  const { open, onClose } = props;
  const location = useLocation();
  const pathname = location.pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [userRole, setUserRole] = useState(localStorage.getItem("Role"));

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderRadius: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            mt: 2,
            p: "12px",
          }}
        >
          <div style={{ justifyContent: "center" }}>
            {/* <Typography color="inherit" variant="subtitle1">
                HMRS
              </Typography> */}
            <img
              src={logo}
              style={{
                width: "100px",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></img>
          </div>
          {/* <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronUpDownIcon />
            </SvgIcon> */}
        </Box>
      </Box>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {items.map((item) => {
            const active = item.path ? pathname === item.path : false;
            if (
              item.title === "Dữ liệu" &&
              userRole === "USER"
            ) {
              return null;
            }
            if (
              item.title === "Nghỉ phép" &&
              userRole === "USER"
            ) {
              return null;
            }
            if (
              item.title === "Thông báo" &&
              userRole === "USER"
            ) {
              return null;
            }
            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
              />
            );
          })}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: "neutral.700" }} />
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
