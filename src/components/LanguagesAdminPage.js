import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "../axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "./Loading";

function LanguagesAdminPage() {
  const [newLanguage, setNewLanguage] = useState('')
  const [newFlagCode, setNewFlagCode] = useState('')

  const [languages, setLanguages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const user = useSelector((state) => state.user);

  const handleCloseAddLanguage = () => setShowAdd(false);
  const handleAddLanguage = () => setShowAdd(true);
  const handleCloseEditLanguage = () => setShowEdit(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    flag_code: "",
  });
  console.log(formData);

  async function getLanguages() {
    try {
      const response = await axios.get("/rooms");
      setLoading(false);
      setLanguages(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    try {
      const response = await axios.post("/addlanguage", {newLanguage, newFlagCode});
      setLoading(false);
      const success = response.status === 200
      if(success) {
      handleCloseAddLanguage()
      getLanguages();
    }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  const handleEditLanguage = (_id, name, flag_code) => {
    setShowEdit(true)
    setFormData((prevState) => ({
      ...prevState,
      _id: _id,
      name: name,
      flag_code: flag_code,
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
      const response = await axios.patch("/editlanguage", {formData});
      const success = response.status === 200
      setLoading(false);
      if(success) {
        handleCloseEditLanguage()
        getLanguages();
      }

    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }
  
  
  async function handleDeleteLanguage(id) {
    if (window.confirm("Are you sure?")) 
    try {
      const response = await axios.delete("/deletelanguage", {
        data: { _id: id}
    });
      setLoading(false);
      const success = response.status === 200
      if(success) {
        getLanguages();
      }

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  

  useEffect(() => {
    setLoading(true);
    getLanguages();
  }, []);

  if (loading) return <Loading />;


  return (
    <div className="content-wrapper">
      <Button variant="primary" onClick={handleAddLanguage} className="mb-2">
        Add Language
      </Button>

      {/* Add Language */}
      <Modal show={showAdd} onHide={handleCloseAddLanguage}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Language</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Language Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="For example: Indonesian"
                autoFocus
                className="mb-2"
                name="name"
                onChange={(e) => setNewLanguage(e.target.value)} 
                value={newLanguage} 
                required={true}
              />
              <Form.Label>Flag Code</Form.Label>
              <div style={{ fontSize: "11px", marginBottom: "5px" }}>
                Please refer to{" "}
                <a href="https://flagicons.lipis.dev/">this website</a> to see
                the code of the flag.
              </div>
              <Form.Control
                type="text"
                placeholder="For example: en / id / gb"
                autoFocus
                name="flag_code"
                onChange={(e) => setNewFlagCode(e.target.value)} 
                value={newFlagCode} 
                required={true}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddLanguage}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Language */}
      <Modal show={showEdit} onHide={handleCloseEditLanguage}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Existing Language</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Language Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="For example: Indonesian"
                autoFocus
                className="mb-2"
                name="name"
                onChange={handleEditChange} 
                value={formData.name} 
                required={true}
              />
              <Form.Label>Flag Code</Form.Label>
              <div style={{ fontSize: "11px", marginBottom: "5px" }}>
                Please refer to{" "}
                <a href="https://flagicons.lipis.dev/">this website</a> to see
                the code of the flag.
              </div>
              <Form.Control
                type="text"
                placeholder="For example: en / id / gb"
                autoFocus
                name="flag_code"
                onChange={handleEditChange} 
                value={formData.flag_code} 
                required={true}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddLanguage}>
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
            <th>ID</th>
            <th>Language</th>
            <th>Flag Code</th>
            <th style={{ width: "155px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {languages &&
            languages.map((language, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{language._id}</td>
                <td>{language.name}</td>
                <td>{language.flag_code}</td>
                <td style={{ justifyContent: "space-evenly", display: "flex" }}>
                  <Button
                    variant="warning"
                    onClick={() => handleEditLanguage(language._id, language.name, language.flag_code)}
                    
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteLanguage(language._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default LanguagesAdminPage;
