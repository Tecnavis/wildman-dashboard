import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { fetchSubCategory, URL } from "../../Helper/handle-api";

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [editedSubcategoryName, setEditedSubcategoryName] = useState("");

  // Fetch subcategories with their main categories
  useEffect(() => {
    fetchSubCategory().then((data) => {
      setSubcategories(data);
    });
  }, []);

  // Fetch a specific subcategory by ID for editing
  const handleEdit = (subcategoryId) => {
    axios
      .get(`${URL}/subcategory/${subcategoryId}`)
      .then((response) => {
        setEditingSubcategoryId(subcategoryId);
        setEditedSubcategoryName(response.data.subcategory); // Set the subcategory for editing
      })
      .catch((error) => {
        console.error("Error fetching subcategory:", error);
      });
  };

  // Handle input change for subcategory name
  const handleInputChange = (e) => {
    setEditedSubcategoryName(e.target.value);
  };

  // Update the subcategory
  const handleUpdate = (subcategoryId) => {
    axios
      .put(`${URL}/subcategory/${subcategoryId}`, { subcategory: editedSubcategoryName }) // Update only subcategory
      .then((response) => {
        const updatedSubcategories = subcategories.map((subcat) =>
          subcat._id === subcategoryId ? { ...subcat, subcategory: response.data.subcategory } : subcat
        );
        setSubcategories(updatedSubcategories); // Update state with new data
        setEditingSubcategoryId(null); // Exit editing mode
      })
      .catch((error) => {
        console.error("Error updating subcategory:", error);
      });
  };

  // Delete a subcategory using SweetAlert2
  const handleDelete = (subcategoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with the delete request
        axios
          .delete(`${URL}/subcategory/${subcategoryId}`)
          .then(() => {
            const updatedSubcategories = subcategories.filter((subcat) => subcat._id !== subcategoryId);
            setSubcategories(updatedSubcategories); // Update state after deletion

            Swal.fire("Deleted!", "Subcategory has been deleted.", "success"); // Show success alert
          })
          .catch((error) => {
            Swal.fire("Error!", "An error occurred while deleting the subcategory.", "error");
            console.error("Error deleting subcategory:", error);
          });
      }
    });
  };

  return (
    <>
      <OverlayScrollbarsComponent style={{backgroundColor: "white"}}>
        <div className="container">
          <h5 style={{ color: "gray", textAlign: "center", marginTop: "28px", }}>
            SUB CATEGORIES
          </h5>
        </div>
        <br />
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable"  >
          <thead >
            <tr>
              <th style={{ textAlign: "start" }}>Main Category</th>
              <th style={{ textAlign: "start" }}>Sub Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((data) => (
              <tr key={data._id}>
                <td>
                  <div className="table-category-card">
                    <div className="part-txt">
                      <span className="category-name">{data.category.name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="table-category-card">
                    <div className="part-txt">
                      {/* Allow editing only subcategory */}
                      {editingSubcategoryId === data._id ? (
                        <input
                          type="text"
                          value={editedSubcategoryName}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        <span className="subcategory-name">{data.subcategory}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="btn-box">
                    {editingSubcategoryId === data._id ? (
                      <>
                        <button onClick={() => handleUpdate(data._id)} className="btn btn-success">
                          Update
                        </button>
                        <button onClick={() => setEditingSubcategoryId(null)} className="btn btn-secondary">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(data._id)}>
                          <i className="fa-light fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => handleDelete(data._id)}>
                          <i className="fa-light fa-trash"></i>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <br/>
      </OverlayScrollbarsComponent>
    </>
  );
};

export default Subcategory;
