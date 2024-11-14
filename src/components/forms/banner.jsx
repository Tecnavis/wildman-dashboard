import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./style.css";
import { Button } from "react-bootstrap";
import axios from "axios"; // Make sure to install axios
import { URL as API_URL } from "../../Helper/handle-api"; // Rename the imported URL
import BannerTable from "./bannertable";
import Swal from "sweetalert2";

const Banner = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // State for image preview

  const onDropSingle = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile); // Set the first file
    setPreviewUrl(URL.createObjectURL(selectedFile)); // Create preview URL using the global URL object
  }, []);

  const {
    getRootProps: getSingleRootProps,
    isDragActive: isSingleDragActive,
  } = useDropzone({ onDrop: onDropSingle, multiple: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !description) {
        Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axios.post(`${API_URL}/banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Banner created:", response.data);
      // Reset form after successful submission
      setFile(null);
      setTitle("");
      setDescription("");
      setPreviewUrl(""); // Reset preview URL
      Swal.fire("Success", "Banner created successfully!", "success");
      BannerTable();
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  };

  return (
    <div className="col-lg-12 col-md-6">
      <div className="card">
        <div className="card-header">File Upload</div>
        <div
          className={`card-body ${isSingleDragActive ? "dropzone-active" : ""}`}
          {...getSingleRootProps()}
        >
          <form className="dropzone dz-component" id="file-manager-upload">
            <div className="dz-default dz-message">
              <button className="dz-button" type="button">
                <i className="fa-light fa-cloud-arrow-up"></i>
                <span>Drop a file here or click to upload</span>
              </button>
            </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: '100%', height: 'auto', marginTop: '10px' }} // Style for the preview image
              />
            )}
          </form>
        </div>
        <div className="form-section">
          <div className="form-group">
            <input
              id="title"
              className="form-input"
              type="text"
              placeholder="Enter the title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <textarea
              id="description"
              className="form-input"
              rows="4"
              placeholder="Enter a description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Bind description
            ></textarea>
          </div>
          <div className="form-group">
            <Button variant="primary" style={{ width: "100%" }} onClick={handleSubmit}>
              Upload
            </Button>
          </div>
        </div>
      </div>
      <br/>
      <BannerTable/>
      <br/>
    </div>
  );
};

export default Banner;
