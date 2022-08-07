import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "../services/appApi";
import {Form} from 'react-bootstrap'
import "./Register.css";
import { ToastContainer, toast } from "react-toastify";
import botImg from '../assets/bot.png';

import "react-toastify/dist/ReactToastify.css";



function Register() {
  const user = useSelector((state) => state.user);
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  // setImage
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size > 1048576) {
      return alert("Max file size is 1 mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "h5ajwmxy");
    try {
      setUploadingImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dwr7dpnc9/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  const [formData, setFormData] = useState({
    _id: user._id,
    picture: "",
    name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    birthplace: "",
    phnumber: "",
    gender_identity: "",
    nik: "",
    npm: "",
    class: "",
    address: "",
    course: "",
  });

  async function getUser() {

   
      setFormData((prevState) => ({
        ...prevState,
        picture: user.picture,
        name: user.name,
        dob_day: user.dob_day,
        dob_month: user.dob_month,
        dob_year: user.dob_year,
        gender_identity: user.gender_identity,
        phnumber: user.phnumber,
        course: user.course,
        address: user.address,
        nik: user.nik,
        npm: user.npm,
        class: user.class,
        birthplace: user.birthplace,
      }));
    }

  useEffect(() => {
    getUser();
  }, []);

  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const url = await uploadImage(image);
   await updateUser({user_id: user._id, formData, picture: url}).then(({data}) => { 
      if(data) {
        toast.success('Data anda telah berhasil tersimpan, mohon menunggu konfirmasi dari admin!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
          });
      console.log("DATA DARI EDIT", data)
      }
    })
      
  }

  // handle String
  function handleChange(e) {
    
    console.log("e", e);
    const { value, name } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  // handle Array

  // function handleMultipleChange(e) {
  //   const { value, checked, name } = e.target;
  //   console.log(value, checked, name);

  //   // check if true or false
  //   if (checked) {
  //     setFormData((prevState) => {
  //       const checkedLanguages = [...prevState.learning_languages, value];

  //       return { ...prevState, [name]: checkedLanguages };
  //     });
      
  //   } else {
  //     setFormData((prevState) => {
  //       // It fetches all data from the prevState and get all languages that don't have the same value as the unselected box(es).
  //       const uncheckedLanguages = prevState.learning_languages.filter(
  //         (language) => language !== value
  //       );
  //       console.log(uncheckedLanguages);

  //       return { ...prevState, [name]: uncheckedLanguages };
  //     });
  //   }
  // }

  console.log(formData);

  return (
    <>
      <div className="onboarding">
        <h2>FORM PENDAFTARAN KURSUS</h2>

        <form onSubmit={handleSubmit}>
          <section>
            {/* picture */}
            <div className="signup-profile-pic__container">
              <img
                src={imagePreview || user.picture || botImg}
                className="signup-profile-pic"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={validateImg}
                
              />
            </div> 
            <Form.Text className="text-muted img-text-info" style={{alignItems: "center"}}>
            Pas Foto 4x6 (JPG/PNG), maks 1mb      </Form.Text>
     

            <label htmlFor="username">Nama Lengkap*</label>
            <input
              id="username"
              type="text"
              name="name"
              placeholder="Masukkan Nama Lengkap"
              required={true}
              value={formData.name}
              onChange={handleChange}
            />

        <label>Tanggal Lahir*</label>
            <div className="multiple-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="Hari"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="Bulan"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="Tahun"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            <label htmlFor="phnumber">Nomor HP*</label>
            <input
              id="phnumber"
              type="text"
              name="phnumber"
              placeholder="Masukkan Nomor HP"
              required={true}
              value={formData.phnumber}
              onChange={handleChange}
            />

<label htmlFor="alamat">Alamat Lengkap*</label>
            <input
              id="alamat"
              type="text"
              name="address"
              placeholder="Masukkan Alamat"
              required={true}
              value={formData.address}
              onChange={handleChange}
            />

            <label htmlFor="birthplace">Tempat Lahir*</label>
            <input
              id="birthplace"
              type="text"
              name="birthplace"
              placeholder="Masukkan Tempat Lahir"
              required={true}
              value={formData.birthplace}
              onChange={handleChange}
            />

        <label>Jenis Kelamin*</label>
            <div className="multiple-input-container">
              <input
                id="man-gender-identity"
                type="radio"
                name="gender_identity"
                value={"Laki-laki"}
                onChange={handleChange}
                checked={formData.gender_identity === "Laki-laki"}
              />
              <label htmlFor="man-gender-identity">Laki-laki</label>
              <input
                id="woman-gender-identity"
                type="radio"
                name="gender_identity"
                value={"Perempuan"}
                onChange={handleChange}
                checked={formData.gender_identity === "Perempuan"}
              />
              <label htmlFor="woman-gender-identity">Perempuan</label>
             
            </div>

            <label htmlFor="nik">NIK*</label>
            <input
              id="nik"
              type="text"
              name="nik"
              placeholder="Masukkan NIK"
              required={true}
              value={formData.nik}
              onChange={handleChange}
            />

            <label htmlFor="npm">NPM*</label>
            <input
              id="npm"
              type="text"
              name="npm"
              placeholder="Masukkan NPM"
              required={true}
              value={formData.npm}
              onChange={handleChange}
            />

            <label htmlFor="kelas">Kelas*</label>
            <input
              id="kelas"
              type="text"
              name="class"
              placeholder="Masukkan Kelas"
              required={true}
              value={formData.class}
              onChange={handleChange}
            />

            <label>Jenis Kursus*</label>
            <div className="multiple-input-container">
              <input
                id="web"
                type="radio"
                name="course"
                value={"Web Programming"}
                onChange={handleChange}
                checked={formData.course === "Web Programming"}
              />
              <label htmlFor="web">Web Programming</label>
              <input
                id="mobile"
                type="radio"
                name="course"
                value={"Mobile Programming"}
                onChange={handleChange}
                checked={formData.course === "Mobile Programming"}
              />
              <label htmlFor="mobile">Mobile Programming</label>
              <input
                id="desktop"
                type="radio"
                name="course"
                value={"Desktop Programming"}
                onChange={handleChange}
                checked={formData.course === "Desktop Programming"}
              />
              <label htmlFor="desktop">Desktop Programming</label>
              
            </div>

            <div className="arrow-submit">
              <button type="submit">
                <FaAngleRight className="submit-btn" />
              </button>
            </div>

            <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  draggable
                  pauseOnHover
                />
          </section>

        </form>
      </div>
    </>
  );
}
export default Register;
