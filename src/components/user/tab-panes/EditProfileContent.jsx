import React, { useState, useEffect } from "react";
import { URL } from "../../../Helper/handle-api";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from "./logo";

const EditProfileContent = () => {
  const [adminDetails, setAdminDetails] = useState({
    id: "",
    name: "",
    address: "",
    role: "",
    phone: "",
    email: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
    image: "",
  });

  useEffect(() => {
    const adminDetailsFromLocalStorage = JSON.parse(
      localStorage.getItem("adminDetails")
    );

    if (adminDetailsFromLocalStorage) {
      setAdminDetails(adminDetailsFromLocalStorage);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", adminDetails.name);
    formData.append("address", adminDetails.address);
    formData.append("role", adminDetails.role);
    formData.append("phone", adminDetails.phone);
    formData.append("email", adminDetails.email);
    formData.append("facebook", adminDetails.facebook);
    formData.append("twitter", adminDetails.twitter);
    formData.append("linkedin", adminDetails.linkedin);
    formData.append("instagram", adminDetails.instagram);
    formData.append("youtube", adminDetails.youtube);
    formData.append("whatsapp", adminDetails.whatsapp);

    // Append image if it's a file
    if (adminDetails.image instanceof File) {
      formData.append("image", adminDetails.image);
    }

    try {
      if (!adminDetails._id) {
        throw new Error("Admin ID is undefined. Cannot update details.");
      }

      const response = await axios.put(
        `${URL}/admin/${adminDetails._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem(
        "adminDetails",
        JSON.stringify(response.data.updatedAdmin)
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Admin details updated successfully!",
      });
    } catch (error) {
      console.error("Error updating admin details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update admin details. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="profile-edit-tab-title">
        <h6>Change Logo</h6>
      </div>
      <Logo />

      <div className="profile-edit-tab-title">
        <h6>Public Information</h6>
      </div>
      <div className="public-information mb-30">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="admin-profile">
              <div className="image-wrap">
                <div className="part-img rounded-circle overflow-hidden">
                  <img
                    src={`${URL}/images/${adminDetails.image}`}
                    alt="admin"
                  />
                </div>
                <label
                  className="image-change"
                  style={{ paddingInline: "6px", paddingTop: "3px" }}
                >
                  <i className="fa-light fa-camera" />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setAdminDetails({
                        ...adminDetails,
                        image: e.target.files[0],
                      })
                    }
                  />
                </label>
              </div>
              <span className="admin-name">{adminDetails.name}</span>
              <span className="admin-role">{adminDetails.role}</span>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row g-3">
              <div className="col-sm-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-light fa-user" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    value={adminDetails.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <textarea
                  className="form-control h-150-p"
                  placeholder="Address"
                  name="address"
                  value={adminDetails.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-edit-tab-title">
        <h6>Private Information</h6>
      </div>
      <div className="private-information mb-30">
        <div className="row g-3">
          <div className="col-md-12 col-sm-6">
            <div className="input-group flex-nowrap">
              <span className="input-group-text">
                <i className="fa-light fa-user-tie" />
              </span>
              <select
                className="form-control select-search"
                name="role"
                value={adminDetails.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="Main Admin">Main Admin</option>
                <option value="Secondary Admin">Secondary Admin</option>
                <option value="Accountant">Accountant</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-light fa-phone" />
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                name="phone"
                value={adminDetails.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-light fa-envelope" />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={adminDetails.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="profile-edit-tab-title">
        <h6>Social Information</h6>
      </div>
      <div className="social-information">
        <div className="row g-3">
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-facebook-f" />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Facebook"
                name="facebook"
                value={adminDetails.facebook}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-twitter" />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Twitter"
                name="twitter"
                value={adminDetails.twitter}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-linkedin-in" />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Linkedin"
                name="linkedin"
                value={adminDetails.linkedin}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-instagram" />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Instagram"
                name="instagram"
                value={adminDetails.instagram}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-youtube" />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Youtube"
                name="youtube"
                value={adminDetails.youtube}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-whatsapp" />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Whatsapp"
                name="whatsapp"
                value={adminDetails.whatsapp}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfileContent;
