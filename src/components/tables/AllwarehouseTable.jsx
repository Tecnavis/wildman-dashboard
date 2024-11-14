import React, { useState, useEffect } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchWarehouses, updateWarehouse ,deleteWarehouse} from "../../Helper/handle-api"; 
import Swal from 'sweetalert2';

const WarehouseTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [warehouses, setWarehouses] = useState([]);
  const [editWarehouse, setEditWarehouse] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  // Fetch warehouses on component mount
  useEffect(() => {
    const getWarehouses = async () => {
      try {
        const warehouseData = await fetchWarehouses();
        setWarehouses(warehouseData);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
    getWarehouses();
  }, []);

  // Function to format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle edit button click
  const handleEditClick = (warehouse) => {
    setEditWarehouse({ ...warehouse });
    setShowModal(true);
  };

  // Handle input change in the modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditWarehouse((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update the changes
  const handleSave = async () => {
    try {
      const updatedWarehouse = await updateWarehouse(editWarehouse._id, editWarehouse);
      setWarehouses((prevWarehouses) =>
        prevWarehouses.map((warehouse) =>
          warehouse._id === updatedWarehouse._id ? updatedWarehouse : warehouse
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = warehouses.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(warehouses.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  //handle delete button click

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteWarehouse(id);
          setWarehouses((prevWarehouses) =>
            prevWarehouses.filter((warehouse) => warehouse._id !== id)
          );
  
          Swal.fire('Deleted!', 'The warehouse has been deleted.', 'success');
        } catch (error) {
          console.error("Error deleting warehouse:", error);
          Swal.fire('Error', 'There was an issue deleting the warehouse.', 'error');
        }
      }
    });
  };
  

  return (
    <>
      <OverlayScrollbarsComponent>
        <table className="table table-dashed table-hover digi-dataTable company-table table-striped" id="WarehouseTable">
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="markAllCompany" />
                </div>
              </th>
              <th>Code</th>
              <th>Warehouse</th>
              <th>Manager</th>
              <th>Address</th>
              <th>Date</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="no-sort">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((warehouse) => (
                <tr key={warehouse._id}>
                  <td>
                    <div className="form-check">
                      <Form.Check className="form-check-input" type="checkbox" />
                    </div>
                  </td>
                  <td>{warehouse.code}</td>
                  <td>{warehouse.warehouse}</td>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.address}</td>
                  <td>{formatDate(warehouse.date)}</td>
                  <td>{warehouse.email}</td>
                  <td>{warehouse.phone}</td>
                  <td>
                    <div>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditClick(warehouse)}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(warehouse._id)}
                      >
                        <i className="fa-regular fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No warehouses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>

      <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />

      {/* Modal for Editing */}
      {editWarehouse && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Warehouse</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Code (Uneditable)</Form.Label>
                <Form.Control type="text" value={editWarehouse.code} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Warehouse</Form.Label>
                <Form.Control
                  type="text"
                  name="warehouse"
                  value={editWarehouse.warehouse}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Manager</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editWarehouse.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={editWarehouse.address}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editWarehouse.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={editWarehouse.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default WarehouseTable;
