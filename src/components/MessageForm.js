import React, { useContext, useState, useRef, useEffect } from 'react'
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {AppContext} from "../context/appContext"
import {useCheckBanStatusMutation} from "../services/appApi";
import "./MessageForm.css"


function MessageForm() {
  const [message, setMessage] = useState("")
  const user = useSelector((state) => state.user)
  const [checkBanStatus] = useCheckBanStatusMutation();
  const {socket, currentRoom, setMessages, messages, privateMemberMsg, members} = useContext(AppContext);
  const messageEndRef = useRef(null);



  console.log("privateMemberMsg", privateMemberMsg)
  console.log("userId from Message Form", user)


  useEffect(() => {
  
    scrollToBottom();
  }, [messages])

  // DETECT BAN
  const matchedBannedUserId = members?.filter((member) => {
    return member._id == user._id  
  });
  // convert array of obj into single obj
  const filteredBannedUser = Object.assign({}, ...matchedBannedUserId)

 
console.log("USER DELETED?", filteredBannedUser )
console.log("BAN STATUS CHANGED?", filteredBannedUser.isBanned != user.isBanned )

  // EXPERIMENTAL to destroy user's client every 5 minutes if members state changed
  useEffect(() => {
    if(user.isBanned != filteredBannedUser.isBanned) {
      const fetchBanStatus = async() => {
      await checkBanStatus({_id: user._id})
      }
      fetchBanStatus()
    }
  }, [])

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
}

  function handleSubmit(e) {
    e.preventDefault();
  }

  async function handleBanStatus() {
    await checkBanStatus({_id: user._id})
    window.location.reload()

  }

  function scrollToBottom(){
    messageEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

const todayDate = getFormattedDate();

socket.off('room-messages').on('room-messages', (roomMessages) => {
  console.log('room messages', roomMessages)
  setMessages(roomMessages);
})

function handleSubmit(e) {
  e.preventDefault();
  if(!message) return;
  const today = new Date();
  const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
  const time =  today.getHours() + ":" + minutes
  const roomId = currentRoom
  socket.emit('message-room', roomId, message, user, time, todayDate);
  setMessage("")
}

  return (
    <>

    <div className='messages-output'> 
    {user && user.isBanned && <div className='alert alert-danger'>Your account is banned. Please contact an admin immediately, and click the button upon admin's approval. <Button variant="danger" style={{marginLeft: "5px"}} onClick={handleBanStatus}>Check Status</Button></div>}
    {user && !user.isBanned && !privateMemberMsg?._id && <div className='alert alert-info'>You are in the {currentRoom} room.</div>}
    {user && privateMemberMsg?._id && (
      <>
      <div className='alert alert-info converstation-info'>
          Your converstation with {privateMemberMsg.name} <img src={privateMemberMsg.picture} className="converstation-profile-pic"/>
      </div>
      </>
    )}
    {!user && <div className='alert alert-danger'>Please login</div>}

    {user && messages.map(({_id: date, messagesByDate}, idx) => (
      <div key={idx}>
        <p className='alert alert-info text-center message-date-indicator'>
          {date}
        </p>
        {messagesByDate?.map(({content, time, from: sender}, msgIdx) => (
          <div className={sender?.email == user?.email ? "incoming-message" : "message"} key={msgIdx}>
            <div className='message-inner'>
              <div className='d-flex align-items-center mb-3'>
                <img src={sender.picture} style={{width: 35, height:35, objectFit: 'cover', borderRadius: '50%', marginRight: 10}}/>
                <p className='message-sender'>{sender._id == user?._id ? "You" : sender.name}</p>
              </div>
              <p className='message-content'>{content}</p>
              <p className='message-timestamp-left'>{time}</p>
            </div>
          </div>
        ))}
      </div>
    ))}
    <div ref={messageEndRef}></div>
    </div>
  
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control type="text" placeholder="Your message" disabled={!user || currentRoom == ""} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button variant="primary" type="submit" disabled={!user || currentRoom == ""} style={{width:'100%', backgroundColor:"blue"}}>

          <i className="fas fa-paper-plane"/>
            </Button>
          </Col>
        </Row>
      </Form>
    </>

  )
}

export default MessageForm