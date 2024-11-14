import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { URL } from "../../Helper/handle-api";

const AllTagTable = () => {
  const [tag, setTags] = useState([]); // State to store fetched colors

  // Fetch colors from the backend
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/tag`); // Adjust the URL based on your API
      setTags(response.data); // Set the fetched colors to state
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching tags!',
      });
    }
  };

  // Delete a color by ID
  const deleteTags = async (tagId) => {
    try {
      const response = await axios.delete(`${URL}/attribute/${tagId}`); // Adjust the URL based on your API
      if (response.status === 200) {
        // Remove the deleted color from state
        setTags(tag.filter(tags => tags._id !==tagId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Tag has been deleted.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error deleting Tag!',
      });
    }
  };

  useEffect(() => {
    fetchTags(); // Fetch colors when the component mounts
  }, []);

  return (
    <>
      <OverlayScrollbarsComponent style={{ backgroundColor: "white" }}>
        <div className="container">
          <h5 style={{ color: "gray", textAlign: "center", marginTop: "28px" }}>
            ALL TAGS
          </h5>
        </div>
        <br />
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th style={{ textAlign: "start" }}>Tag</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tag.map((color) => (
              <tr key={color._id}>
                <td>
                  <div className="table-category-card">
                    <div className="part-txt">
                      <span className="subcategory-name">{color.value}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="btn-box">
                    <button onClick={() => deleteTags(color._id)}>
                      <i className="fa-light fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <br />
      </OverlayScrollbarsComponent>
    </>
  );
};

export default AllTagTable;
