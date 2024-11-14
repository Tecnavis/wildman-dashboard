import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { URL } from "../../Helper/handle-api";

const AllColorTable = () => {
  const [colors, setColors] = useState([]); // State to store fetched colors

  // Fetch colors from the backend
  const fetchColors = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/color`); // Adjust the URL based on your API
      setColors(response.data); // Set the fetched colors to state
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching colors!',
      });
    }
  };

  // Delete a color by ID
  const deleteColor = async (colorId) => {
    try {
      const response = await axios.delete(`${URL}/attribute/${colorId}`); // Adjust the URL based on your API
      if (response.status === 200) {
        // Remove the deleted color from state
        setColors(colors.filter(color => color._id !== colorId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Color has been deleted.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error deleting color!',
      });
    }
  };

  useEffect(() => {
    fetchColors(); // Fetch colors when the component mounts
  }, []);

  return (
    <>
      <OverlayScrollbarsComponent style={{ backgroundColor: "white" }}>
        <div className="container">
          <h5 style={{ color: "gray", textAlign: "center", marginTop: "28px" }}>
            ALL COLORS
          </h5>
        </div>
        <br />
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th style={{ textAlign: "start" }}>Color</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
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
                    <button onClick={() => deleteColor(color._id)}>
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

export default AllColorTable;
