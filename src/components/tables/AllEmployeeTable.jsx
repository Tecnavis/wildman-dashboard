import React, { useState, useEffect } from "react";
import { fetchAdmins, URL } from "../../Helper/handle-api";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const AllEmployeeTable = () => {
  const [admins, setAdmins] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  useEffect(() => {
    const fetchAdminsData = async () => {
      const admins = await fetchAdmins();
      setAdmins(admins);
    };
    fetchAdminsData();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setShowEditModal(true);
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingAdmin(null);
    setError(null);
  };

  // Function to handle block/unblock
  const handleToggleBlock = async (admin) => {
    try {
      const response = await axios.put(`${URL}/admin/block/${admin._id}`);
      const updatedAdmin = response.data.admin;
      setAdmins(
        admins.map((a) => (a._id === updatedAdmin._id ? updatedAdmin : a))
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: updatedAdmin.blocked
          ? "Admin has been blocked"
          : "Admin has been unblocked",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to toggle block status",
      });
    }
  };

  // Function to delete admin
  const handleDeleteAdmin = async (adminId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${URL}/admin/${adminId}`);
        setAdmins(admins.filter((admin) => admin._id !== adminId));
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to delete the admin",
        });
      }
    }
  };

  // Function to edit and update admin
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", editingAdmin.email);
      formData.append("name", editingAdmin.name);
      formData.append("phone", editingAdmin.phone);
      formData.append("role", editingAdmin.role);
      formData.append("address", editingAdmin.address);
      formData.append("facebook", editingAdmin.facebook);
      formData.append("twitter", editingAdmin.twitter);
      formData.append("linkedin", editingAdmin.linkedin);
      formData.append("instagram", editingAdmin.instagram);
      formData.append("youtube", editingAdmin.youtube);
      formData.append("whatsapp", editingAdmin.whatsapp);

      if (editingAdmin.newImage) {
        formData.append("image", editingAdmin.newImage);
      }

      const response = await axios.put(
        `${URL}/admin/${editingAdmin._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedAdmin = response.data.updatedAdmin;
      setAdmins(
        admins.map((admin) =>
          admin._id === updatedAdmin._id ? updatedAdmin : admin
        )
      );
      handleCloseModal();
    } catch (err) {
      let errorMessage = "An error occurred during admin update";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    }
  };
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Open Password Modal
  const handlePasswordChange = (admin) => {
    setEditingAdmin(admin);
    setShowPasswordModal(true);
  };

  // Handle Password Save
  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Password cannot be empty",
      });
    }

    try {
      const response = await axios.put(
        `${URL}/admin/change-password/${editingAdmin._id}`,
        {
          newPassword: newPassword,
        }
      );
      const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));

      if (adminDetails && adminDetails._id === editingAdmin._id) {
        adminDetails.password = newPassword;
        localStorage.setItem("adminDetails", JSON.stringify(adminDetails));
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
      setShowPasswordModal(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to update password",
      });
    }
  };

  // Password Modal JSX

  return (
    <>
      <table
        className="table table-dashed table-hover digi-dataTable all-employee-table table-striped"
        id="allEmployeeTable"
      >
        <thead>
          <tr>
            <th>Action</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Section</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((data) => (
            <tr key={data._id}>
              <td>
                <div className="digi-dropdown dropdown d-inline-block">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleDropdown(data._id)}
                  >
                    Action <i className="fa-regular fa-angle-down"></i>
                  </button>
                  {openDropdownId === data._id && (
                    <ul className="digi-table-dropdown digi-dropdown-menu dropdown-menu dropdown-slim dropdown-menu-sm show">
                      <li>
                        <a
                          href="#"
                          className="dropdown-item"
                          onClick={() => handlePasswordChange(data)}
                        >
                          <span className="dropdown-icon">
                            <i className="fa-light fa-key"></i>
                          </span>{" "}
                          Password
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="dropdown-item"
                          onClick={() => handleEdit(data)}
                        >
                          <span className="dropdown-icon">
                            <i className="fa-light fa-pen-to-square"></i>
                          </span>{" "}
                          Edit
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="dropdown-item"
                          onClick={() => handleToggleBlock(data)}
                        >
                          <span className="dropdown-icon">
                            <i className="fa-light fa-pen-nib"></i>
                          </span>
                          {data.blocked ? "Unblock" : "Revoke"}
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="dropdown-item"
                          onClick={() => handleDeleteAdmin(data._id)}
                        >
                          <span className="dropdown-icon">
                            <i className="fa-light fa-trash-can"></i>
                          </span>{" "}
                          Delete
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </td>
              <td>
                <div className="avatar">
                  <img src={`${URL}/images/${data.image}`} alt="User" />
                </div>
              </td>
              <td>{data.name}</td>
              <td>{data.role}</td>
              <td>{data.phone}</td>
              <td>{data.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {editingAdmin && (
            <Form onSubmit={handleSaveEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.name}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.role}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, role: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.phone}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, phone: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.address}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, address: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Facebook</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.facebook}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, facebook: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Twitter</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.twitter}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, twitter: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Linkedin</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.linkedin}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, linkedin: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Instagram</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.instagram}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, instagram: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Youtube</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.youtube}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, youtube: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Whatsapp</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.whatsapp}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, whatsapp: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Update Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setEditingAdmin({
                      ...editingAdmin,
                      newImage: e.target.files[0],
                    })
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePassword}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AllEmployeeTable;
