import React, {useState} from 'react'
import {Row, Col, Form, Container, Button} from 'react-bootstrap'
import {useSignupUserMutation} from '../services/appApi'
import {Link, useNavigate} from "react-router-dom"
import "./Signup.css"
import botImg from '../assets/bot.png';


function Signup() {
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[signupUser, {isLoading, error}] = useSignupUserMutation();
  const navigate = useNavigate();

// image upload states
const[image, setImage] = useState(null);
const[uploadingImg, setUploadingImg] = useState(false);
const [imagePreview, setImagePreview] = useState(null);

function validateImg(e) {
  const file = e.target.files[0];
  if(file.size > 1048576) {
    return alert("Max file size is 1 mb");

  } else {
    setImage(file);
    setImagePreview(URL.createObjectURL(file))
  }
}

async function uploadImage() {
  const data = new FormData()
  data.append('file', image);
  data.append('upload_preset', 'h5ajwmxy')
  try {
    setUploadingImg(true);
    let res = await fetch('https://api.cloudinary.com/v1_1/dwr7dpnc9/image/upload', {
      method: 'post',
      body: data
    })
    const urlData = await res.json();
    setUploadingImg(false);
    return urlData.url
  } catch(error) {
    setUploadingImg(false);
    console.log(error);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  // if(!image) return alert('Please upload your profile picture!');
  // const url = await uploadImage(image)
  // console.log(url)
  // signup the user
  signupUser({name, email, password}).then(({ data }) => {
    if(data) {
      console.log(data)
      navigate("/register")
    }
  });

}

  return (
    <Container>
    <Row>
    <div md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
    <Form style={{width: '80%', maxWidth:500}} onSubmit={handleSignup}>

      <h1 className="text-center">Daftar Akun Baru</h1>
      {/* <div className='signup-profile-pic__container'>
        <img src={imagePreview || botImg} className="signup-profile-pic"/>
        <label htmlFor='image-upload' className="image-upload-label">
          <i className='fas fa-plus-circle add-picture-icon'></i>
        </label>
        <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={validateImg}/>
      </div> */}

    <Form.Group className="mb-3" controlId="formBasicName">
      <Form.Label>Nama</Form.Label>
      <Form.Control type="text" placeholder="Masukkan nama lengkap" onChange={(e) => setName(e.target.value)} value={name}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Alamat Email</Form.Label>
      <Form.Control type="email" placeholder="Masukkan alamat email" onChange={(e) => setEmail(e.target.value)} value={email}/>
     
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Masukkan password" onChange={(e) => setPassword(e.target.value)} value={password}/>
    </Form.Group>

    <Button variant="primary" type="submit">
    {uploadingImg ? 'Mendaftarkan Akun Anda...' : 'Daftar'}

    </Button>
    <div className="py-4">
      <p className="text-center">
        Sudah Punya Akun? <Link to="/login">Login</Link>
      </p>
    </div>
  </Form>
  </div>

  </Row>
    </Container>
  )
}

export default Signup