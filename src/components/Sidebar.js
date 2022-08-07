import React, { useContext, useEffect, useState, useRef} from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import ProfileInfo from './ProfileInfo'

import "./Sidebar.css";
import "flag-icon-css/css/flag-icons.css";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRooms, setShowRooms] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  let profileRef = useRef()

  console.log(profileIndex)

  console.log("currentRoom", currentRoom);
  console.log("members", members);
  console.log("userId", user._id);
  console.log("rooms", rooms);

 

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please login!");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    // dispatch for notifications
    dispatch(resetNotifications(room));
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom != room) dispatch(addNotifications(room));
  });



  useEffect(() => {
    if (user && !user.isBanned) {
      setCurrentRoom("English");
      getRooms();
      socket.emit("join-room", "English");
    }
    socket.emit("new-user");
  
  }, []);

  useEffect(() => {
    
   let handler =  (e) => {
    if(!profileRef?.current.contains(e.target)) {
      setShowProfileInfo(false)
    }
   }
   document.addEventListener("mousedown", handler);
   return () => {
    document.removeEventListener("mousedown", handler)
   }
  

  }, []);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
    
  });


  function getRooms() {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else return id2 + "-" + id1;
  }

  function handlePrivateMemberMsg(member, idx) {
    setPrivateMemberMsg(member);
    setProfileIndex(idx)
    setShowProfileInfo(true)
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  function setFlagIcon(code) {
    if (code == "help"){
      return "fas fa-bullhorn pt-1"
    } else {
      return `flag-icon flag-icon-${code}`
    } 
  }

  function toggleShowRooms() {
    setShowMembers(false)
    setShowRooms(!showRooms)
  }
  
  function toggleShowMembers() {
    setShowRooms(false)
    setShowMembers(!showMembers)
  }



    const filteredAdmins = members?.filter(
      (member) => member.isAdmin
    );
      
  console.log("FILTERED ADMINS", filteredAdmins)
  console.log("MEMBERS", members)

  if (!user) {
    return <></>;
  }
  return (
    <>
      <div className="rooms-title-dropdown">
        <h4>{user?.isBanned ? "Administrators" : "Rooms"}</h4>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={toggleShowRooms}
          ></button>
        </div>
      </div>

      <div className="rooms-scrollable">
        {showRooms && user.isBanned && (
          <ListGroup>
          {filteredAdmins.map((filteredAdmin, idx) => {
            return (
              <ListGroup.Item
                key={idx}
                style={{ cursor: "pointer" }}
                active={privateMemberMsg?._id == filteredAdmin?._id}
                onClick={() => handlePrivateMemberMsg(filteredAdmin)}
    
              >
                <Row>
                  <Col
                    xs={1}
                    className="member-status"
                    style={{ right: "5px" }}
                  >
                    <img src={filteredAdmin.picture} className="member-status-img" />
                    {filteredAdmin.status == "online" ? (
                      <i className="fas fa-circle sidebar-online-status"></i>
                    ) : (
                      <i className="fas fa-circle sidebar-offline-status"></i>
                    )}
                  </Col>
                  <Col xs={9}>
                    {filteredAdmin.name}
                    {filteredAdmin._id === user?._id && " (You)"}
                    {filteredAdmin.status == "offline" && " (Offline)"}
                  </Col>
                  <Col xs={2} style={{ left: "349px", position: "absolute" }}>
                    <span className="badge rounded-pill bg-primary">
                      {user.newMessages[orderIds(filteredAdmin._id, user._id)]}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
            )})}
            </ListGroup>
            )}


        {showRooms && !user.isBanned && (
          <ListGroup>
            {rooms.map((room, idx) => {
              return (
                <ListGroup.Item
                  key={idx}
                  onClick={() => joinRoom(room.name)}
                  active={room.name == currentRoom}
                  style={{ cursor: "pointer" }}
                >
                  <Row>
                    <Col
                      xs={1} 
                      className={`${setFlagIcon(room.flag_code)}`}
                      style={{ left: "5px" }}
                    ></Col>
                    <Col xs={9}>{room.name}</Col>
                    <Col xs={2}>
                      {" "}
                      {currentRoom !== room.name && (
                        <span
                          className="badge rounded-pill bg-primary"
                          style={{ marginLeft: "20px" }}
                        >
                          {user.newMessages[room.name]}
                        </span>
                      )}{" "}
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </div>

        {user && !user.isBanned && 
        <>
      <div className="members-title-dropdown">
        <h4>People</h4>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            // onClick={() => toggleShowMembers(!showMembers) && toggleShowRooms(!showRooms)}
            onClick={toggleShowMembers}
          ></button>
        </div>
      </div>
        </>
      }

      {showMembers && !user.isBanned && 
      <div className="members-container">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search username..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>

          <div className="members-scrollable">
          {members.filter((member) => {
              if (searchTerm == "") {
                return member;
              } else if (
                member.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return member;
              }
            })
            .map((member, idx) => (
              <ListGroup.Item
                key={member.id}
                style={{ cursor: "pointer" }}
                active={privateMemberMsg?._id == member?._id}
                onClick={() => handlePrivateMemberMsg(member, idx)}
                disabled={member._id === user._id}
              >
                <Row>
                  <Col
                    xs={1}
                    className="member-status"
                    style={{ right: "5px" }}
                  >
                    <img src={member.picture} className="member-status-img" />
                    {member.status == "online" ? (
                      <i className="fas fa-circle sidebar-online-status"></i>
                    ) : (
                      <i className="fas fa-circle sidebar-offline-status"></i>
                    )}
                  </Col>
                  <Col xs={9}>
                    {member.name}
                    {member._id === user?._id && " (You)"}
                    {member.status == "offline" && " (Offline)"}
                    {member.isBanned == true && " (Banned)"}
                  </Col>
                  <Col xs={2} style={{ left: "349px", position: "absolute" }}>
                    <span className="badge rounded-pill bg-primary">
                      {user.newMessages[orderIds(member._id, user._id)]}
                    </span>
                  </Col>
                </Row>

              </ListGroup.Item>
            ))}

        </div>
        
        {showProfileInfo && ( <ProfileInfo profileRef={profileRef} showProfileInfo={showProfileInfo} setShowProfileInfo={setShowProfileInfo} profileIndex={profileIndex}/>)}
        </div>

}
    </>
  );
}

export default Sidebar;
