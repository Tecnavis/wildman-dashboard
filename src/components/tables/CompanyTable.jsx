import React, { useEffect, useState } from "react";
import { companyData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchSuppliers, updateSupplier ,deleteSupplier} from "../../Helper/handle-api";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const CompanyTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState(companyData);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = dataList.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(dataList.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Get all suppliers
  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await fetchSuppliers();
      setSuppliers(response);
    };
    fetchSupplier();
  }, []);

  // Edit supplier
  const handleEditClick = (supplier) => {
    setEditSupplier({ ...supplier });
    setShowModal(true);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSupplier((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save changes
 // Handle save changes
const handleSaveChanges = async () => {
  // Check for empty fields
  const { shop, name, address, email, phone, item } = editSupplier;
  if (!shop || !name || !address || !email || !phone || !item) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'All fields must be filled out!',
    });
    return;
  }

  // Check for existing email or phone
  const existingSupplier = suppliers.find(supplier => 
    (supplier.email === email && supplier._id !== editSupplier._id) || 
    (supplier.phone === phone && supplier._id !== editSupplier._id)
  );

  if (existingSupplier) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Email or Phone number already exists!',
    });
    return;
  }

  // update supplier if validations pass
  try {
    const updatedSupplier = await updateSupplier(editSupplier._id, editSupplier);
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier._id === updatedSupplier._id ? updatedSupplier : supplier
      )
    );
    setShowModal(false);
  } catch (error) {
    console.error("Error updating supplier:", error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: 'There was an error updating the supplier.',
    });
  }
};


  // Handle delete supplier
 
  
  // Handle delete supplier
  const handleDelete = async (supplierId) => {
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
        await deleteSupplier(supplierId); // Call your API to delete the supplier
        setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier._id !== supplierId));
        Swal.fire("Deleted!", "Your supplier has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        Swal.fire("Error!", "There was an error deleting the supplier.", "error");
      }
    }
  };
  return (
    <>
      <OverlayScrollbarsComponent>
        <table
          className="table table-dashed table-hover digi-dataTable company-table table-striped"
          id="companyTable"
        >
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Supplier Name</th>
              <th>Address</th>
              <th>Item</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.shop}</td>
                <td>{supplier.name}</td>
                <td>{supplier.address}</td>
                <td>{supplier.item}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>
                  <div>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(supplier)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(supplier._id)}>
                      <i className="fa-regular fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />

      {/* Modal for Editing */}
      {editSupplier && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Suppliers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Shop Name</Form.Label>
                <Form.Control
                  type="text"
                  name="shop"
                  value={editSupplier.shop}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editSupplier.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={editSupplier.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editSupplier.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="number"
                  name="phone"
                  value={editSupplier.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Item</Form.Label>
                <Form.Control
                  type="text"
                  name="item"
                  value={editSupplier.item}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CompanyTable;
