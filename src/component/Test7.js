// import React, { useState, useRef } from "react";
// import { ai } from "./utils/APIRoutes";

// const CheckInForm = () => {
//   const [imageData, setImageData] = useState(null);
//   const videoRef = useRef(null);

//   const handleStartCamera = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       })
//       .catch((error) => {
//         console.error("Error accessing camera:", error);
//       });
//   };

//   const handleCaptureImage = () => {
//     const video = videoRef.current;
//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL("image/jpeg");
//     setImageData(dataUrl);
//   };

//   const handleCheckIn = () => {
//     if (imageData) {
//       const formData = new FormData();
//       formData.append("image", dataURItoBlob(imageData));

//       fetch(`${process.env.REACT_APP_AI}/api/check_in/`, {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => {
//           if (response.ok) {
//             console.log("Check-in successful");
//           } else {
//             console.log("Check-in failed");
//           }
//         })
//         .catch((error) => {
//           console.error("Error during check-in:", error);
//         });
//     }
//   };

//   const dataURItoBlob = (dataURI) => {
//     const byteString = atob(dataURI.split(",")[1]);
//     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   };

//   return (
//     <div>
//       <div>
//         <button onClick={handleStartCamera}>Start Camera</button>
//       </div>
//       <div>
//         <video ref={videoRef} autoPlay />
//       </div>
//       <div>
//         <button onClick={handleCaptureImage}>Capture Image</button>
//       </div>
//       <div>{imageData && <img src={imageData} alt="Captured Image" />}</div>
//       <div>
//         <button onClick={handleCheckIn}>Check In</button>
//       </div>
//     </div>
//   );
// };

// export default CheckInForm;


import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Col, Row, Table, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { CameraOutlined } from "@ant-design/icons";
import { ai } from "./utils/APIRoutes";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "./theme";
import styled from "styled-components";
import Header from "./Header";
import { SideNav } from "../component/layouts/dashboard/side-nav";
import { backend } from "./utils/APIRoutes";
import axios from "axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled.div`
  display: flex;
  flex: 1 1 auto;
  margin-left: 300px;

  max-width: 80%;
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
const CheckInForm = () => {
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showNameConfirmation, setShowNameConfirmation] = useState(false);
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
  const handleStartCamera = () => {
    if (!isCameraOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setIsCameraOpen(true); // Đánh dấu rằng camera đã mở
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    } else {
      // Tắt camera
      const tracks = videoRef.current.srcObject?.getTracks();
      if (tracks) {
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraOpen(false); // Đánh dấu rằng camera đã tắt
      }
    }
  };

  const handleCaptureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setImageData(dataUrl);
  };

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [showToast, setShowToast] = useState(false);
  const [showWarningToast, setWarningShowToast] = useState(false);
  async function fetchProfileData(user_id) {
    const res = await axios.get(
      `${process.env.REACT_APP_BACK_END}/api/auth/user/` + user_id
    );
    setFirstName(res.data.firstName);
    setLastName(res.data.lastName);
    console.log(res)
    console.log("tennnnnnnn: " + firstName + lastName);
  }


 
  const handleCheckIn =async () => {
    if (!showNameConfirmation && imageData) {
      const formData = new FormData();
      formData.append("image", dataURItoBlob(imageData));

      const res = await axios.post(
        `${process.env.REACT_APP_AI}/api/check_in/`,
        formData
      );

      console.log(res);
      if (res.status === 200 && !res.data.success === false) {
        await fetchProfileData(res.data.user_id);
        setShowToast(true);
        setShowNameConfirmation(true);
        await fetchData();
      } else {
        toastWarning("Check in thất bại vui lòng chụp lại ảnh");
      }
    }
  };
  useEffect(() => {
    if (firstName && lastName && showToast) {
      toastSuccess("Check in thành công: " + firstName + " " + lastName);
      setShowToast(false); // Reset the showToast state to prevent showing the toast multiple times
    }
  }, [firstName, lastName, showToast]);

  const [attendanceData, setAttendanceData] = useState([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [id, setId] = useState(localStorage.getItem("Id"));


 
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_END}/api/attendance/getByUserId/` + id
        );
        setAttendanceData(response.data);
        if (response.data && response.data.length > 0) {
          setIsCheckingIn(response.data[0].isCheckin);
          console.log("dsadas: " + response.data[0].isCheckin);
        } else {
          setIsCheckingIn(false);
        }
      } catch (error) {
        console.log(error.message);

      }
    };
  useEffect(() => {
    fetchData();
  },[]);


  
  const handleCheckOut = async () => {
  if (!showNameConfirmation && imageData) {
    const formData = new FormData();
    formData.append("image", dataURItoBlob(imageData));

    const res = await axios.post(
      `${process.env.REACT_APP_AI}/api/check_out/`,
      formData
    );

    console.log(res);
    if (res.status === 200 && !res.data.success === false) {
      await fetchProfileData(res.data.user_id);
      // setWarningShowToast(true)
        setShowToast(true);
      setShowNameConfirmation(true);
      await fetchData();
    } else {
      toastWarning("Check out thất bại vui lòng chụp lại ảnh");
    }
  }
};

  useEffect(() => {
    if (firstName && lastName && showWarningToast) {
      toastSuccess("Check in thành công: " + firstName + " " + lastName);
      setShowToast(false); // Reset the showToast state to prevent showing the toast multiple times
    }
  }, [firstName, lastName, showWarningToast]);

  const handleConfirmName = () => {
    // setFirstName(confirmedFirstName);
    // setLastName(confirmedLastName);
    setShowNameConfirmation(false);
    toastSuccess(
      "Check in thành công: " + firstName + " " + lastName
    );
  };

  const handleCancelNameConfirmation = () => {
    setShowNameConfirmation(false);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

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


  const columns = [
    {
      title: "Check-In Time",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (text) =>
        moment(text, "YYYY-MM-DD HH:mm:ss")
          .add(7, "hours")
          .format("DD-MM-YY HH:mm"),
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (text) =>
        text
          ? moment(text, "YYYY-MM-DD HH:mm:ss")
              .add(7, "hours")
              .format("DD-MM-YY HH:mm")
          : null,
    },
  ];

  return (
    <>
      <ThemeProvider theme={createTheme()}>
        
        <>
          {/* <TopNav onNavOpen={() => setOpenNav(true)} onLoginRedirect={handleLoginRedirect} /> */}
          <Header onLoginRedirect={handleLoginRedirect}></Header>
          <SideNav onClose={() => setOpenNav(false)} open={openNav} />
          <LayoutRoot>
            <ToastContainer></ToastContainer>
            <LayoutContainer>
              <div>
                <Row justify="center" gutter={[16, 16]}>
                  <Col>
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      onClick={handleStartCamera}
                    >
                      {isCameraOpen ? "Tắt camera" : "Mở camera"}
                    </Button>
                  </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                  <Col>
                    <video ref={videoRef} autoPlay />
                  </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                  <Col>
                    <Button onClick={handleCaptureImage}>Chụp hình</Button>
                  </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                  <Col>
                    {imageData && <img src={imageData} alt="Captured" />}
                  </Col>
                </Row>
                <Row justify="center" gutter={[16, 16]}>
                  <Col>
                    {!isCheckingIn && (
                      <Button
                        type="primary"
                        onClick={handleCheckIn}
                        disabled={!imageData}
                      >
                        Check In
                      </Button>
                    )}
                    {isCheckingIn && (
                      <Button
                        type="primary"
                        onClick={handleCheckOut}
                        disabled={!imageData}
                      >
                        Check out
                      </Button>
                    )}
                  </Col>
                </Row>
                {attendanceData.length > 0 && (
                  <Table dataSource={attendanceData} columns={columns} />
                )}
              </div>
            </LayoutContainer>
          </LayoutRoot>
        </>
      </ThemeProvider>
    </>
  );
};

export default CheckInForm;
