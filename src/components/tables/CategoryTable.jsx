import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import axios from "axios";
import Swal from "sweetalert2"; // Make sure to import SweetAlert2
import { fetchMainCategory, URL } from "../../Helper/handle-api";

const CategoryTable = () => {
  const [category, setCategory] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [image, setImage] = useState(null);

  // Fetch main categories
  useEffect(() => {
    fetchMainCategory().then((data) => {
      setCategory(data);
    });
  }, []);

  // Fetch a specific category by ID to edit
  const handleEdit = (categoryId) => {
    axios
      .get(`${URL}/category/${categoryId}`)
      .then((response) => {
        setEditingCategory(categoryId);
        setEditedName(response.data.name);
        setImage(response.data.image); // Preload the current image
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      });
  };

  // Handle input change for name
  const handleInputChange = (e) => {
    setEditedName(e.target.value);
  };

  // Handle image file input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Update the category along with the image
  const handleUpdate = (categoryId) => {
    const formData = new FormData();
    formData.append("name", editedName);
    if (image) {
      formData.append("image", image); // Attach the new image
    }

    axios
      .put(`${URL}/category/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for handling files
        },
      })
      .then((response) => {
        const updatedCategories = category.map((cat) =>
          cat._id === categoryId
            ? { ...cat, name: response.data.name, image: response.data.image }
            : cat
        );
        setCategory(updatedCategories);
        setEditingCategory(null);
        Swal.fire("Success", "Category updated successfully!", "success");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        Swal.fire("Error", "Failed to update category", "error");
      });
  };

  // Delete a main category using SweetAlert2
  const handleDelete = (categoryId) => {
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
        axios
          .delete(`${URL}/category/${categoryId}`)
          .then(() => {
            const updatedCategories = category.filter(
              (cat) => cat._id !== categoryId
            );
            setCategory(updatedCategories);

            Swal.fire("Deleted!", "Category has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "An error occurred while deleting the category.",
              "error"
            );
            console.error("Error deleting category:", error);
          });
      }
    });
  };

  return (
    <>
      <OverlayScrollbarsComponent>
        <div className="container">
          <h5 style={{ color: "gray", textAlign: "center" }}>MAIN CATEGORIES</h5>
        </div>
        <br />
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th style={{ textAlign: "start" }}>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category.map((data) => (
              <tr key={data._id}>
                <td>
                  <div className="table-category-card">
                    <div className="part-icon">
                      <span>
                        <img
                          src={`${URL}/images/${data.image}`}
                          alt="image"
                        />
                      </span>
                    </div>
                    <div className="part-txt">
                      {editingCategory === data._id ? (
                        <>
                          <input
                            type="text"
                            value={editedName}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                          <br/>
                          <input
                            type="file"
                            onChange={handleImageChange}
                            className="form-control"
                          />
                        </>
                      ) : (
                        <span className="category-name">{data.name}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="btn-box">
                    {editingCategory === data._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(data._id)}
                          className="btn btn-success"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="btn btn-secondary"
                        >
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
      </OverlayScrollbarsComponent>
    </>
  );
};

export default CategoryTable;
