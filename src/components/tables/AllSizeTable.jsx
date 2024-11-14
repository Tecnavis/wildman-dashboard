import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { URL } from "../../Helper/handle-api";

const AllSizeTable = () => {
  const [sizes, setSizes] = useState([]); 

  // Fetch sizes from the backend
  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/size`); // Adjust the URL based on your API
      setSizes(response.data); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching sizes!',
      });
    }
  };

  // Delete a size by ID
  const deleteSize = async (sizeId) => {
    try {
      const response = await axios.delete(`${URL}/attribute/size/${sizeId}`); // Adjust the URL based on your API
      if (response.status === 200) {
        // Remove the deleted size from state
        setSizes(sizes.filter(size => size._id !== sizeId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Size has been deleted.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error deleting size!',
      });
    }
  };

  useEffect(() => {
    fetchSizes(); // Fetch sizes when the component mounts
  }, []);

  return (
    <>
      <OverlayScrollbarsComponent style={{ backgroundColor: "white" }}>
        <div className="container">
          <h5 style={{ color: "gray", textAlign: "center", marginTop: "28px" }}>
            ALL SIZES
          </h5>
        </div>
        <br />
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th style={{ textAlign: "start" }}>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size._id}>
                <td>
                  <div className="table-category-card">
                    <div className="part-txt">
                      <span className="subcategory-name">{size.value}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="btn-box">
                    <button onClick={() => deleteSize(size._id)}>
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

export default AllSizeTable;
