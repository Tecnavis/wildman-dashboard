import React, { useEffect, useState } from "react";
import { fetchMainCategory, createSubCategory, fetchSubCategory } from "../../Helper/handle-api";
import { useForm } from "../../Helper/useForm";
import Swal from "sweetalert2";

const CategorySection = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryBtn, setCategoryBtn] = useState(false);
  const [addNewCat, setAddNewCat] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [values, handleChanges] = useForm({ subcategory: "", category: "" });

  useEffect(() => {
    loadMainCategories();
  }, []);

  const loadMainCategories = async () => {
    try {
      const response = await fetchMainCategory();
      setMainCategories(response);
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  };

  const loadSubCategories = async (categoryId) => {
    try {
      const response = await fetchSubCategory();
      const filteredSubCategories = response.filter(
        (sub) => sub.category._id === categoryId
      );
      setSubCategories(filteredSubCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleCategoryBtn = () => {
    setCategoryBtn(!categoryBtn);
  };

  const handleAddNewCat = () => {
    setAddNewCat(!addNewCat);
  };

  const handleExpandCategory = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setSubCategories([]);
    } else {
      setExpandedCategory(categoryId);
      await loadSubCategories(categoryId);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!values.subcategory || !values.category) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Subcategory name and main category are required",
      });
      return;
    }
    try {
      const response = await createSubCategory(values);
      Swal.fire({
        icon: "success",
        title: "Subcategory Created",
        text: `New subcategory "${response.subcategory}" created successfully!`,
      });
      handleChanges({ target: { name: "subcategory", value: "" } });
      // Refresh the subcategories if the current expanded category is the one we just added to
      if (expandedCategory === values.category) {
        await loadSubCategories(values.category);
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  // Filter the categories based on the search term
  const filteredCategories = mainCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="panel mb-30">
      <div className="panel-header">
        <h5>Category</h5>
        <div className="btn-box d-flex gap-2">
          <button
            className="btn btn-sm btn-icon btn-outline-primary panel-close"
            onClick={handleCategoryBtn}
          >
            <i className="fa-light fa-angle-up"></i>
          </button>
        </div>
      </div>
      <div className={`panel-body ${categoryBtn ? "d-none" : ""}`}>
        <form className="input-group-with-icon mb-20">
          <span className="input-icon">
            <i className="fa-light fa-magnifying-glass"></i>
          </span>
          <input
            type="search"
            placeholder="Search category"
            value={searchTerm} // Controlled input
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
          />
        </form>

        <div className="product-categories">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((main) => (
              <div key={main._id} className="cat-group">
                <div className="form-check">
                  <input
                    className="form-check-input has-sub"
                    onChange={() => handleExpandCategory(main._id)}
                    checked={expandedCategory === main._id}
                    type="checkbox"
                    id={`cat-${main._id}`}
                  />
                  <label className="form-check-label" htmlFor={`cat-${main._id}`}>
                    {main.name}{" "}
                    <span role="button" onClick={() => handleExpandCategory(main._id)}>
                      <i
                        className={`fa-light ${
                          expandedCategory === main._id ? "fa-minus" : "fa-plus"
                        }`}
                      ></i>
                    </span>
                  </label>
                </div>
                {expandedCategory === main._id && (
                  <div className="sub-cat-group">
                    {subCategories.map((sub) => (
                      <div key={sub._id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`sub-${sub._id}`}
                        />
                        <label className="form-check-label" htmlFor={`sub-${sub._id}`}>
                          {sub.subcategory}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No categories found</p>
          )}
        </div>
      </div>

      <div className="border-top"></div>
      <div className={`panel-body ${categoryBtn ? "d-none" : ""}`}>
        <div className="d-flex justify-content-end">
          <button
            className="btn-flush add-category-btn"
            onClick={handleAddNewCat}
          >
            <i className={`fa-light ${addNewCat ? "fa-minus" : "fa-plus"}`}></i>{" "}
            Add new subcategory
          </button>
        </div>
        <div className={`add-new-category-panel ${addNewCat ? "" : "d-none"}`}>
          <form onSubmit={handleAddSubCategory}>
            <input
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Sub category name"
              name="subcategory"
              value={values.subcategory}
              onChange={handleChanges}
            />
            <select
              className="form-control form-control-sm mb-3"
              data-placeholder="Select Parent"
              name="category"
              value={values.category}
              onChange={handleChanges}
            >
              <option value="">Select Main category</option>
              {mainCategories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-sm btn-primary"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
