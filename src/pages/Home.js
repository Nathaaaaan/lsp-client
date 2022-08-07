import React from 'react'
import {Row, Col, Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { useSelector } from 'react-redux';
import './Home.css'


function Home() {
  const user = useSelector((state) => state.user)

  return (
    <div className='homepage'>
  <Row>
    <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
      <div className='text-column'>
        <h1>Website Pendaftaran Kursus</h1>
        <LinkContainer to={"/register"}>
          <Button variant="secondary">
             Daftar Sekarang<i className='fas fa-comments home-message-icon'></i>
            </Button>
        </LinkContainer>
      </div>
    </Col>
    <Col md={6} className="home__bg"></Col>
  </Row>
  {/* <div className='footer'>Copyright® 2022 Unitive</div> */}
  </div>
  )
    
  
}

export default Home