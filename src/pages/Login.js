import React, {useContext, useState} from 'react'
import {Row, Col, Form, Container, Button, Spinner} from 'react-bootstrap'
import { useLoginUserMutation } from '../services/appApi'
import {Link, useNavigate} from "react-router-dom"
import "./Login.css"
import {AppContext} from '../context/appContext'

function Login() {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const navigate = useNavigate();
  const {socket} = useContext(AppContext);
  const [loginUser, {isLoading, error}] = useLoginUserMutation();

  function handleLogin(e) {
    e.preventDefault()
    // login logic
    loginUser({email, password}).then(({data}) => {
      if(data) {
        // socket work here
        socket.emit('new-user')
        // navigate to admin page
        console.log("data isAdmin", data.isAdmin)
        if(data.isAdmin){
          navigate("/admin")
        } else {
          // navigate to the chat
          navigate("/register")
        }

      }
    })

  }

  return (
  <Container>
    <Row>
    <div md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
    <Form style={{width: '80%', maxWidth:500}} onSubmit={handleLogin}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
    <h1 className="text-center">Sign In</h1>
      {error && <p className='alert alert-danger'>{error.data}</p>}
      <Form.Label>Alamat Email</Form.Label>
      <Form.Control type="email" placeholder="Masukkan alamat email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Masukkan password" onChange={(e) => setPassword(e.target.value)} value={password} required/>
    </Form.Group>

    <Button variant="primary" type="submit">
      {isLoading ? <Spinner animation="grow"/> : "Login"}
    </Button>
    <div className="py-4">
      <p className="text-center">
        Belum Punya Akun? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  </Form>
  </div>
  </Row>

    </Container>
 );
}

export default Login