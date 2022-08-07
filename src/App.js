import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navigation from "./components/Navigation";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Chat from "./pages/Chat"
import Admin from "./pages/Admin"
import Register from "./pages/Register"

import { useSelector } from 'react-redux'
import { useState } from 'react';
import {AppContext, socket} from './context/appContext'

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([])
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([])
  const [privateMemberMsg, setPrivateMemberMsg] = useState({})
  const [newMessages, setNewMessages] = useState({})
  const [userBanStatus, setUserBanStatus] = useState(null)

  const user = useSelector((state) => state.user)
  return (
    <AppContext.Provider value={{socket, currentRoom, setCurrentRoom, members, setMembers,
     messages, setMessages, privateMemberMsg, setPrivateMemberMsg, rooms, setRooms, newMessages,
      setNewMessages, userBanStatus, setUserBanStatus}}>
    <BrowserRouter>
    <Navigation/>
    <Routes>
      <Route path="/" element={<Home />} />
      {!user && (
        <>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        </>
        )
      }
      {user && user.isAdmin && (
        <>
        <Route path="/admin" element={<Admin/>} />
        </>
      )}
      {user && (
        <Route path="/register" element={<Register />} />
      )}
      <Route path="/chat" element={<Chat />} />
    </Routes>
    </BrowserRouter>
    </AppContext.Provider>
    );
}

export default App;
