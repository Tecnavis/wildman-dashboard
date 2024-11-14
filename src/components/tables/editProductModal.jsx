import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  filterSubCategory,
  fetchMainCategory,
  fetchWarehouses,
  fetchProductById,
  URL,
} from "../../Helper/handle-api";
import Swal from "sweetalert2";
import axios from "axios";

const EditProductModal = ({ productId, show, onClose, onSave }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tags, setTags] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [productSizes, setProductSizes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await fetchMainCategory();
        setMainCategories(categories);

        const sizesData = await axios.get(`${URL}/attribute/size`);
        setSizes(
          sizesData.data.map((size) => ({ ...size, selected: false, stock: 0 }))
        );

        const colorsData = await axios.get(`${URL}/attribute/color`);
        setColors(colorsData.data);

        const tagsData = await axios.get(`${URL}/attribute/tag`);
        setTags(tagsData.data);

        const warehousesData = await fetchWarehouses();
        setWarehouses(warehousesData);

        if (productId) {
          const productData = await fetchProductById(productId);
          setFormValues(productData);

          if (productData.images && productData.images.length > 0) {
            const previews = productData.images.map((img) => {
              const imageUrl = `${URL}/images/${img}`;
              return imageUrl.replace(/[[\]]/g, "");
            });
            setImagePreviews(previews);
          }

          if (productData.coverimage) {
            const coverImageUrl = `${URL}/images/${productData.coverimage}`;
            setCoverImagePreview(coverImageUrl.replace(/[[\]]/g, ""));
          }

          if (productData?.mainCategory) {
            const selectedCategory = categories.find(
              (cat) => cat.name === productData.mainCategory
            );
            if (selectedCategory) {
              const subcategories = await filterSubCategory(
                selectedCategory._id
              );
              setSubCategories(subcategories);
              setFormValues((prev) => ({
                ...prev,
                mainCategory: selectedCategory.name,
                subCategory: productData.subCategory,
              }));
            }
          }

          if (productData.sizes) {
            // Remove duplicates and keep only the latest entry for each size
            const uniqueSizes = Array.from(
              new Map(
                productData.sizes.map((item) => [item.size, item])
              ).values()
            );
            setProductSizes(uniqueSizes);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product data. Please try again.",
        });
      }
    };

    fetchData();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "mainCategory") {
      handleMainCategoryChange(value);
    }
  };

  const handleMainCategoryChange = async (selectedCategoryName) => {
    try {
      if (selectedCategoryName) {
        const selectedCategory = mainCategories.find(
          (cat) => cat.name === selectedCategoryName
        );
        if (selectedCategory) {
          const subcategories = await filterSubCategory(selectedCategory._id);
          setSubCategories(subcategories);
          setFormValues((prev) => ({ ...prev, subCategory: "" }));
        }
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load subcategories. Please try again.",
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSizeChange = (size) => {
    setProductSizes((prevSizes) => {
      const existingSize = prevSizes.find((s) => s.size === size);
      if (existingSize) {
        return prevSizes.filter((s) => s.size !== size);
      } else {
        return [...prevSizes, { size, stock: 0 }];
      }
    });
  };

  const handleStockChange = (size, stock) => {
    setProductSizes((prevSizes) =>
      prevSizes.map((s) =>
        s.size === size ? { size, stock: parseInt(stock) } : s
      )
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formValues.modelNo ||
      !formValues.date ||
      !formValues.title ||
      !formValues.description ||
      !formValues.price ||
      !formValues.warehouse
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill out all the required fields.",
      });
      return;
    }

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key !== "sizes") {
        formData.append(key, formValues[key]);
      }
    });

    images.forEach((image) => formData.append("images", image));
    if (coverImage) {
      formData.append("coverimage", coverImage);
    }

    // Handle sizes
    const uniqueSizes = productSizes.map(({ size, stock }) => ({
      size,
      stock,
    }));
    formData.append("sizes", JSON.stringify(uniqueSizes));

    try {
      const response = await axios.put(
        `${URL}/product/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product updated successfully!",
        });
        onSave();
        onClose();
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the product. Please try again.",
      });
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Category</label>
            <select
              value={formValues.mainCategory}
              onChange={handleInputChange}
              name="mainCategory"
              className="form-control"
            >
              <option value="">Select main category</option>
              {mainCategories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Subcategory</label>
            <select
              value={formValues.subCategory}
              onChange={handleInputChange}
              name="subCategory"
              className="form-control"
            >
              <option value="">Select subcategory</option>
              {subCategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory.subcategory}>
                  {subcategory.subcategory}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Price</label>
            <input
              type="number"
              value={formValues.price}
              onChange={handleInputChange}
              name="price"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Model No</label>
            <input
              type="text"
              value={formValues.modelNo}
              onChange={handleInputChange}
              name="modelNo"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Color</label>
            <select
              value={formValues.color}
              onChange={handleInputChange}
              name="color"
              className="form-control"
            >
              <option value="">Select color</option>
              {colors.map((color) => (
                <option key={color._id} value={color.value}>
                  {color.value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Warehouse</label>
            <select
              value={formValues.warehouse}
              onChange={handleInputChange}
              name="warehouse"
              className="form-control"
            >
              <option value="">Select warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse.name}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Tag</label>
            <select
              value={formValues.tag}
              onChange={handleInputChange}
              name="tag"
              className="form-control"
            >
              <option value="">Select tag</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag.value}>
                  {tag.value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Date</label>
            <input
              type="date"
              value={formValues.date ? formValues.date.split("T")[0] : ""}
              onChange={handleInputChange}
              name="date"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              name="title"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              value={formValues.description}
              onChange={handleInputChange}
              name="description"
              className="form-control"
            />
          </div>

          <div className="row g-3 mb-3">
            <label className="col-md-2 col-form-label col-form-label-sm">
              Available Sizes & Stock
            </label>
            <div className="col-md-10">
              {sizes.map((sizeData) => {
                const productSize = productSizes.find(
                  (ps) => ps.size === sizeData.value
                );
                return (
                  <div key={sizeData._id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card p-2 shadow-sm">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`size-${sizeData._id}`}
                          checked={!!productSize}
                          onChange={() => handleSizeChange(sizeData.value)}
                        />
                        <label
                          htmlFor={`size-${sizeData._id}`}
                          className="form-check-label"
                        >
                          Size {sizeData.value}
                        </label>
                      </div>
                      {productSize && (
                        <div className="mt-2">
                          <label htmlFor={`stock-${sizeData._id}`}>
                            Stock Count
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id={`stock-${sizeData._id}`}
                            value={productSize.stock}
                            onChange={(e) =>
                              handleStockChange(sizeData.value, e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-3">
            <label>Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Cover Image</label>
            <input
              type="file"
              onChange={handleCoverImageChange}
              className="form-control"
            />
          </div>

          {/* Preview Cover Image */}
          {coverImagePreview && (
            <div className="mb-3">
              <label>Cover Image Preview</label>
              <img
                src={coverImagePreview}
                alt="Cover Preview"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}

          {/* Preview Images */}
          {imagePreviews.length > 0 && (
            <div className="mb-3">
              <label>Images Preview</label>
              <div className="d-flex flex-wrap">
                {imagePreviews.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      marginRight: "5px",
                      marginBottom: "5px",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
