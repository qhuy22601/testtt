import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentImage,setCurrentImage] = useState(undefined);
  useEffect(() => {
    const data =  JSON.parse(
      localStorage.getItem("chat-app-current-user")
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.image);
    setCurrentImage(data.image);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentImage && currentImage && (
        <Container>
          
          <div className="brand">
            {/* <img src={Logo} alt="logo" /> */}
            <h3>Chat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                
                <div
                
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  
                  <div className="avatar">
                    <img
                      src={contact.image}
                      style={{
                        width: 60,
                        height:60,
                        borderRadius: 60 / 2
                      }}
                      alt="imag"
                    />
                  </div>
                  <h2>{contact.username}</h2>
                  <div className="username">
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                // src={`data:image/svg+xml;base64,${currentUserImage}`}
                src = {currentImage}
                style={{
                  width: 60,
                  height:60,
                  borderRadius: 60 / 2
                }}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        },
        
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  h2{
    color:white;
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        // height: 60px;
        // width: 60px;
        // border-radius: (60px)/2;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
