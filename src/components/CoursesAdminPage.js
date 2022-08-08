import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "../axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function CoursesAdminPage() {
  const [newCourse, setNewCourse] = useState('')
  const [newTime, setNewTime] = useState('')

  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const user = useSelector((state) => state.user);

  const handleCloseAddCourse = () => setShowAdd(false);
  const handleAddCourse = () => setShowAdd(true);
  const handleCloseEditCourse = () => setShowEdit(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    course_name: "",
    time: "",
  });
  console.log(formData);

  async function getCourses() {
    try {
      const response = await axios.get("/courses");
      setLoading(false);
      setCourses(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await axios.post("/addcourse", {newCourse, newTime});
      setLoading(false);
      const success = response.status === 200
      if(success) {
      handleCloseAddCourse()
      getCourses();
    }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  const handleEditCourse = (_id, name, time) => {
    setShowEdit(true)
    setFormData((prevState) => ({
      ...prevState,
      _id: _id,
      course_name: name,
      time: time,
    }));
  } 

  const handleEditChange = (e) => {
    console.log("e", e);
    const { value, name } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    try {
      const response = await axios.patch("/editcourse", {formData});
      const success = response.status === 200
      setLoading(false);
      if(success) {
        handleCloseEditCourse()
        getCourses();
       
      }

    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }
  
  
  async function handleDeleteCourse(id) {
    if (window.confirm("Are you sure?")) 
    try {
      const response = await axios.delete("/deletecourse", {
        data: { _id: id}
    });
      setLoading(false);
      const success = response.status === 200
      if(success) {
        getCourses();
      }

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  

  useEffect(() => {
    setLoading(true);
    getCourses();
  }, []);

  if (loading) return <Loading />;


  return (
    <div className="content-wrapper">
      <Button variant="primary" onClick={handleAddCourse} className="mb-2">
        Tambah Kursus
      </Button>

      {/* Add Course */}
      <Modal show={showAdd} onHide={handleCloseAddCourse}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Kursus Baru</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nama Kursus</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contoh: Web Programming"
                autoFocus
                className="mb-2"
                name="name"
                onChange={(e) => setNewCourse(e.target.value)} 
                value={newCourse} 
                required={true}
              />
              <Form.Label>Waktu Kursus</Form.Label>
              <div style={{ fontSize: "11px", marginBottom: "5px" }}>
                Format: Hari, Tanggal Bulan Tahun
              </div>
              <Form.Control
                type="text"
                placeholder="Contoh: Minggu, 21 Agustus 2022"
                autoFocus
                name="flag_code"
                onChange={(e) => setNewTime(e.target.value)} 
                value={newTime} 
                required={true}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddCourse}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Course */}
      <Modal show={showEdit} onHide={handleCloseEditCourse}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Kursus</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nama Kursus</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contoh: Desktop Programming"
                autoFocus
                className="mb-2"
                name="course_name"
                onChange={handleEditChange} 
                value={formData.course_name} 
                required={true}
              />
              <Form.Label>Waktu Kursus</Form.Label>
              <div style={{ fontSize: "11px", marginBottom: "5px" }}>
              Format: Hari, Tanggal Bulan Tahun
              </div>
              <Form.Control
                type="text"
                placeholder="Contoh: Minggu, 21 Agustus 2022"
                autoFocus
                name="time"
                onChange={handleEditChange} 
                value={formData.time} 
                required={true}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditCourse}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "70px" }}>No</th>
            <th>Nama Kursus</th>
            <th>Jadwal Kursus</th>
            <th style={{ width: "155px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {courses &&
            courses.map((course, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{course.course_name}</td>
                <td>{course.time}</td>
                <td style={{ justifyContent: "space-evenly", display: "flex" }}>
                  <Button
                    variant="warning"
                    onClick={() => handleEditCourse(course._id, course.course_name, course.time)}
                    
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
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
    </div>
  );
}

export default CoursesAdminPage;
