import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchCustomers, URL } from "../../Helper/handle-api";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";

const AllCustomerTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false); // Control modal visibility
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Hold selected customer data

  const [formData, setFormData] = useState({
    name: "",
    shopname: "",
    phone: "",
    email: "",
    address: "",
  });
  // State to hold customers
  const [customers, setCustomers] = useState([]);

  // Fetch all customers on component mount
  useEffect(() => {
    const getAllCustomers = async () => {
      try {
        const response = await fetchCustomers();
        setCustomers(response);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    getAllCustomers();
  }, []);

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = customers.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(customers.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  //delete customer
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${URL}/customer/${id}`);
          setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer._id !== id)
          );
          Swal.fire("Deleted!", "The customer has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting customer:", error);
          Swal.fire(
            "Error",
            "There was an issue deleting the customer.",
            "error"
          );
        }
      }
    });
  };

  //edit customer
  const handleEdit = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      shopname: customer.shopname,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission for updating customer details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL}/customer/${selectedCustomer._id}`, formData);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === selectedCustomer._id
            ? { ...customer, ...formData }
            : customer
        )
      );
      Swal.fire("Success", "Customer details updated successfully!", "success");
      setShowEditModal(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire("Error", error.response.data.message, "error");
      }
      console.error("Error updating customer:", error);
      Swal.fire("Error", error.response.data.message, "error");
    }
  };

  return (
    <>
      <OverlayScrollbarsComponent>
        <Button
          className="btn btn-primary"
          style={{ marginBottom: "10px" }}
          onClick={() => (window.location.href = "/customercreate")}
        >
          Create
        </Button>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Shop Name</th>
              <th>Phone </th>
              <th>Email</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((customer, index) => (
              <tr key={customer._id}>
                <td>{indexOfFirstData + index + 1}</td>
                <td>
                  <Link to="#">{customer.name}</Link>
                </td>
                <td>{customer.shopname}</td>
                <td>{customer.phone}</td>
                <td>
                  <Link to="#">{customer.email}</Link>
                </td>
                <td>{customer.address} </td>
                <td>
                  <div>
                    <button className="btn btn-sm btn-primary me-2">
                      <i
                        className="fa-regular fa-pen-to-square"
                        onClick={() => handleEdit(customer._id)}
                      ></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(customer._id)}
                    >
                      <i className="fa-regular fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formShopName">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="shopname"
                value={formData.shopname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AllCustomerTable;
