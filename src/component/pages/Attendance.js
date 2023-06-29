// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "antd";
// import { Table } from "antd";
// import moment from "moment";


// const AttendancePage = () => {
//   const [checkedIn, setCheckedIn] = useState(false);
//   const [checkedOut, setCheckedOut] = useState(false);
//   const [cameraOn, setCameraOn] = useState(false);
//   const [id, setId] = useState(localStorage.getItem("Id"))
//   const [attendanceData, setAttendanceData] = useState([]);

//   const columns = [
//     // {
//     //   title: "User Id",
//     //   dataIndex: "userId",
//     //   key: "userId",
//     //   // render: (text) => moment(text).format("DD-MM-YY HH:mm"),
//     // },
//     {
//       title: "Check-In Time",
//       dataIndex: "checkIn",
//       key: "checkIn",
//       render: (text) =>
//         moment(text, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YY HH:mm"),
//     },
//     {
//       title: "Check-Out Time",
//       dataIndex: "checkOut",
//       key: "checkOut",
//       render: (text) =>
//         text
//           ? moment(text, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YY HH:mm")
//           : null,
//     },
//   ];


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://171.238.155.142:8080/api/attendance/getByUserId/" + id); 
//         setAttendanceData(response.data);
//       } catch (error) {
//         console.log(error.message);
//         // Handle API error if needed
//       }
//     };

//     fetchData();
//   }, []);

  

//   const handleCheckIn = async () => {
//     try {
//       await axios.post("http://localhost:8000http://171.238.155.142:8080/api/view_c/");
//       setCameraOn(true);
//       setCheckedIn(true);
//     } catch (error) {
//       console.log(error.message);
//       // Handle API error if needed
//     }
//   };

//   const handleCheckOut = async () => {
//     try {
//       await axios.post("http://171.238.155.142:8080/api/a");
//       setCheckedOut(true);
//     } catch (error) {
//       console.log(error.message);
//       // Handle API error if needed
//     }
//   };

//   useEffect(() => {
//     if (cameraOn) {
//       const videoElement = document.getElementById("video");

//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           videoElement.srcObject = stream;
//         })
//         .catch((error) => {
//           console.log("Error accessing camera:", error.message);
//         });
//     }

//     return () => {
//       const videoElement = document.getElementById("video");
//       if (videoElement) {
//         const stream = videoElement.srcObject;
//         if (stream) {
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       }
//     };
//   }, [cameraOn]);

//   return (
//     <div>
//       {!checkedIn && !checkedOut && (
//         <Button type="primary" onClick={handleCheckIn}>
//           Check-In
//         </Button>
//       )}
//       {checkedIn && !checkedOut && (
//         <>
//           <video id="video" style={{ display: "none" }}></video>
//           <Button type="primary" onClick={handleCheckOut}>
//             Check-Out
//           </Button>
//         </>
//       )}
//       {attendanceData.length > 0 && (
//         <Table dataSource={attendanceData} columns={columns} />
//       )}
//     </div>
//   );
// };

// export default AttendancePage;


import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Stack, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "../theme";
import Header from "../Header";
import styled from "styled-components";
import { SideNav } from "../layouts/dashboard/side-nav";
import axios from "axios";
import { Button, Table, message } from "antd";
import moment from "moment";
import { backend } from "../utils/APIRoutes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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


const AttendancePage = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [id, setId] = useState(localStorage.getItem("Id"));
  const [cameraOn, setCameraOn] = useState(false);
  const [attendanceId, setAttendanceId] = useState()


  const handleLoginRedirect = () => {
    window.location.href = "#/login";
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


  useEffect(() => {
    if (cameraOn) {
      const videoElement = document.getElementById("video");

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;
        })
        .catch((error) => {
          console.log("Error accessing camera:", error.message);
        });
    }

    return () => {
      const videoElement = document.getElementById("video");
      if (videoElement) {
        const stream = videoElement.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, [cameraOn]);
  // const handleCheckIn = async () => {
  //   try {
  //     await axios.post("http://171.238.155.142:8000/api/view_c/");
  //     setCheckedIn(true);
  //     setIsCheckingIn(true);
  //   } catch (error) {
  //     console.log(error.message);
  //     // Handle API error if needed
  //   }
  // };

  const handleCheckIn = async() => {
    try{
      const res = await axios.post(
        `${process.env.REACT_APP_BACK_END}/api/attendance/checkin/` + id
      );
      if (res.status ===200){
        toastSuccess("Checkin Successfully")
        setCheckedIn(true);
       setIsCheckingIn(true);
      }else{
        toastWarning("Checkin Failed");
      }
    }catch(error){
      toastWarning("SomeThingWrong: "+error)
    }
  }

  // const handleCheckOut = async () => {
  //   try {
  //     await axios.post("http://171.238.155.142:8000/api/view_d/");     
  //     setCheckedIn(false);
  //     setIsCheckingIn(false);
  //   } catch (error) {
  //     console.log(error.message);
  //     // Handle API error if needed
  //   }
  // };
  function toastSuccess(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  function toastWarning(message) {
    toast.warning(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACK_END}/api/attendance/testCheckOut/` + id
      );
      if (res.status === 200) {
        // message.success("Checkout Successfully");
        toastSuccess("Checkout Successfully");
        setCheckedIn(false);
        setIsCheckingIn(false);
      } else {
        // message.error("Checkout Failed");
        toastWarning("Checkout Failed");
      }
    } catch (error) {
      toastWarning("SomeThingWrong: " + error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END}/api/attendance/getByUserId/` + id);
        setAttendanceData(response.data);
        if (response.data && response.data.length > 0) {
          setIsCheckingIn(response.data[0].isCheckin);
          console.log("dsadas: " + response.data[0].isCheckin);

        } else {
          setIsCheckingIn(false);
        }
      } catch (error) {
        console.log(error.message);
        // Handle API error if needed
      }
    };
    // console.log(isCheckingIn)
    // console.log(checkedIn)
    fetchData();
  }, [isCheckingIn,id]);

  const columns = [
    // {
    //   title: "User Id",
    //   dataIndex: "userId",
    //   key: "userId",
    //   // render: (text) => moment(text).format("DD-MM-YY HH:mm"),
    // },
    {
      title: "Check-In Time",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (text) =>
        moment(text, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YY HH:mm"),
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (text) =>
        text
          ? moment(text, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YY HH:mm")
          : null,
    },
  ];

  return (
    <ThemeProvider theme={createTheme()}>
      <>
        <Header onLoginRedirect={handleLoginRedirect}></Header>
        <SideNav onClose={() => setOpenNav(false)} open={openNav} />
        <LayoutRoot>
          <ToastContainer />
          <LayoutContainer>
            <div style={{ marginLeft: "auto", marginRight: 0, width: "80%" }}>
              {!isCheckingIn && (
                <Button
                  style={{ marginTop: "60px" }}
                  type="primary"
                  onClick={handleCheckIn}
                >
                  Check-In
                </Button>
              )}
              {isCheckingIn && (
                <>
                  <video id="video" style={{ display: "none" }}></video>
                  <Button type="primary" onClick={handleCheckOut}>
                    Check-Out
                  </Button>
                </>
              )}
              {attendanceData.length > 0 && (
                <Table dataSource={attendanceData} columns={columns} />
              )}
            </div>
          </LayoutContainer>
        </LayoutRoot>
      </>
    </ThemeProvider>
  );
};

export default AttendancePage;
