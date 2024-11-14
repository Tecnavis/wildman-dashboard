import React, { useEffect, useState } from "react";
import "./logo.css";
import { Button } from "react-bootstrap";
import { URL } from "../../../Helper/handle-api";
import axios from "axios";
import Swal from "sweetalert2";
const logoSrc ="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000";

const Logo = () => {
  const [logo, setLogo] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${URL}/logo`);
        setLogo(response.data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!selectedFile) {
      Swal.fire("Error", "Please select a file to upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.put(
        `${URL}/logo/${logo[0]?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Update the logo after successful upload
      setLogo([response.data]);
      Swal.fire("Success", "Logo uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading logo:", error);
      Swal.fire("Error", "Failed to upload logo", "error");
    }
  };

  return (
    <div className="logo-container">
      {logo.map((data) => (
        <img
          key={data._id}
          className="logo"
          src={`${URL}/images/${data.image}` || { logoSrc }}
          alt="Business Logo"
        />
      ))}
      <div className="display-flex">
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleLogoUpload}>
          <i className="fa-thin fa-download"></i>
        </Button>
      </div>
    </div>
  );
};

export default Logo;
