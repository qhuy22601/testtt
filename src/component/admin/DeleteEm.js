import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { SideNav } from "../layouts/dashboard/side-nav";
import { TopNav } from "../layouts/dashboard/top-nav";
import axios from "axios";
import { Form, Input, Modal, Space, Table, Image } from "antd";
import {
  DeleteOutlined,
  ApiOutlined
} from "@ant-design/icons";

import NewEmModal from "../NewEmModal";
import styles from "../styles/Employee.module.css";
import Header from "../Header";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "../theme";
import moment from "moment";
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
function DeleteEm() {
  const userRole = localStorage.getItem("Role");
  const columns = [
    // {
    // title: 'Id',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      size: "small",
      render: (image, record) => (
        // <Link to={`/profile/${record.id}`}>
        <Image
          alt={image}
          src={image}
          style={{
            width: 50,
            height: 50,
            border: "1px solid #d9d9d9",
            borderRadius: "10%",
          }}
        />
        // </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <Link to={`/profile/${record.id}`}>
          <a>{text}</a>
        </Link>
      ),
    },
    {
      title: "Họ",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (text) => moment(text, "YYYY-MM-DD").format("DD-MM-YYYY"),
    },
    {
      title: "Cấp độ",
      dataIndex: "payGrade",
      key: "level",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => {
         if (userRole === "ADMIN") {
          return (
            <Space size="middle">
              <ApiOutlined
                style={{ color: "red" }}
                className={styles.red_icon}
                onClick={() => recover(record.id)}
              />
            </Space>
          );
        }
        return null;
      }
    },
  ];

  const [employee, setEmployee] = useState([]);


  async function getAllEm() {
    const result = await axios({
      method: "get",
      url: `${process.env.REACT_APP_BACK_END}/api/auth/getdel`,
      headers: {
        Authorization: localStorage.getItem("Token"),
      },
    });
      setEmployee(result.data);
  }

  useEffect(() => {
    getAllEm();
  }, []);

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

  async function recover(id){
    await axios.put(`${process.env.REACT_APP_BACK_END}/api/auth/del/`+ id);
    await getAllEm();
  }

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
            <>
              <Table
                columns={columns}
                dataSource={employee}
                rowKey={(record) => record.id}
                style={{
                    width:"80%",
                    marginRight:0,
                    marginLeft:"auto"
                }}
                bordered
              />
            </>
          </LayoutContainer>
        </LayoutRoot>
      </>
    </ThemeProvider>
  );
}

export default DeleteEm;
