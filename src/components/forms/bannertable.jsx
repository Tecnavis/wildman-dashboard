import React, { useEffect, useState } from "react";
import {
  fetchBanner,
  URL,
  deleteBanner,
  updateBanner,
} from "../../Helper/handle-api";
import "./style.css";

const BannerTable = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchBanner().then((res) => {
      setBanners(res);
    });
  }, []);

  const handleEditClick = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (selectedBanner) {
      const updatedData = new FormData();
      updatedData.append("title", formData.title);
      updatedData.append("description", formData.description);
      if (formData.image) {
        updatedData.append("image", formData.image);
      }
      try {
        const response = await updateBanner(selectedBanner._id, updatedData);
        const updatedBanner = response.data;

        // Optionally refetch all banners
        const bannersAfterUpdate = await fetchBanner();
        setBanners(bannersAfterUpdate);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to update banner", error);
      }
    }
  };

  return (
    <div className="col-xl-12 col-lg-6 container">
      <div className="panel">
        <div className="panel-header">
          <h5>Banner List</h5>
        </div>
        <div className="panel-body p-0">
          <div className="table-responsive">
            <table className="table deadline-table table-hover">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`${URL}/images/${item.image}`}
                        alt=""
                        className="banner-img"
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>
                    <p className="banner-description">
                        {item.description}
                      </p>
                    </td>
                    <td>
                      <div>
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ marginRight: "5px" }}
                          onClick={() => handleEditClick(item)}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteBanner(item._id)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Editing Banner */}
      <div
        className={`modal fade ${isModalOpen ? "show" : ""}`}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Banner</h5>
              <button
                type="button"
                className="close"
                onClick={() => setIsModalOpen(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={handleUpdateBanner}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTable;
