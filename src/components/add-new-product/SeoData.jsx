import React, { useState, useEffect } from "react";
import { filterSubCategory, fetchMainCategory, URL, fetchWarehouses } from "../../Helper/handle-api";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "../../Helper/useForm";

const ProductData = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(""); 
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(""); 
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    fetchSizes();
    fetchColors();
    fetchTags();
    getWarehouses();
    const getMainCategories = async () => {
      const categories = await fetchMainCategory();
      setMainCategories(categories);
    };
    getMainCategories();
  }, []);

  const handleMainCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    setSelectedMainCategory(selectedCategory);
    handleChange({ target: { name: "mainCategory", value: selectedCategory } });

    if (selectedCategory) {
      const subcategories = await filterSubCategory(selectedCategory);
      setSubCategories(subcategories);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (event) => {
    const selectedSub = event.target.value;
    setSelectedSubCategory(selectedSub);
    handleChange({ target: { name: "subCategory", value: selectedSub } });
  };


  const handleColorChange = (event) => {
    const selectedColorId = event.target.value;
    setSelectedColor(selectedColorId);
    handleChange({ target: { name: "color", value: selectedColorId } });
  };
  const handleTagChange = (event) => {
    const selectedTagId = event.target.value;
    setSelectedTags(selectedTagId);
    handleChange({ target: { name: "tag", value: selectedTagId } });
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/size`);
      setSizes(response.data.map(size => ({ ...size, selected: false, stock: 0 })));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching sizes!',
      });
    }
  };
  const handleSizeChange = (index) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].selected = !updatedSizes[index].selected;
    setSizes(updatedSizes);
  };

  const handleStockChange = (index, e) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].stock = parseInt(e.target.value);
    setSizes(updatedSizes);
  };
  const fetchColors = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/color`);
      setColors(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching colors!',
      });
    }
  };
//fetch tags
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${URL}/attribute/tag`);
      setTags(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching tags!',
      });
  }}
//fetch warehouses
const getWarehouses = async () => {
  try {
    const warehouseData = await fetchWarehouses();
    setWarehouses(warehouseData);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};
  const [values, handleChange] = useForm({
    tag:'',
    warehouse: '',
    returnpolicy: '',
    mainCategory: '',
    subCategory: '',
    modelNo: '',
    date: '',
    totalStock: '',
    title: '',
    description: '',
    price: '',
    color: '', 
  });

  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
};

const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]); // Save the single cover image
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Check if any required fields are empty
  if (!values.mainCategory || !values.subCategory || !values.modelNo || !values.date || 
      !values.title || !values.description || !values.price || !values.warehouse ||  !values.price ) {
    
    Swal.fire({
      icon: 'warning',
      title: 'Missing fields',
      text: 'Please fill out all the required fields.',
    });
    return;
  }

  const formData = new FormData();
  
  // Add the warehouse name instead of Id
  const warehouseName = warehouses.find(warehouse => warehouse._id === values.warehouse)?.warehouse;
  // Add the category, color, and tag names instead of IDs
  const mainCategoryName = mainCategories.find(category => category._id === selectedMainCategory)?.name;
  const subCategoryName = subCategories.find(subcategory => subcategory._id === selectedSubCategory)?.subcategory;
  const colorName = colors.find(color => color._id === selectedColor)?.value;
  const tagName = tags.find(tag => tag._id === selectedTags)?.value;

  // Append category names, color name, and tag name
  formData.append("mainCategory", mainCategoryName);
  formData.append("subCategory", subCategoryName);
  formData.append("color", colorName);
  formData.append("tag", tagName);
  formData.append("warehouse", warehouseName);

  // Append other form values
  Object.keys(values).forEach(key => {
    if (key !== 'mainCategory' && key !== 'subCategory' && key !== 'color' && key !== 'tag' && key !== 'warehouse') {
      formData.append(key, values[key]);
    }
  });

  images.forEach(image => formData.append('images', image));
  formData.append('coverimage', coverImage); 
  formData.append('sizes', JSON.stringify(sizes.filter(size => size.selected)));

  try {
    const response = await axios.post(`${URL}/product`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Product created successfully!',
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error creating product!',
    });
  }
};


  return (
    <div className="panel">
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <label htmlFor="mainCategory" className="col-md-2 col-form-label col-form-label-sm">
            Category
          </label>
          <div className="col-md-6">
            <div className="form-control-sm p-0">
              <select
                className="form-control form-control-sm"
                value={selectedMainCategory}
                onChange={handleMainCategoryChange}
                name="mainCategory"
              >
                <option value="">Select main category</option>
                {mainCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-control-sm p-0">
              <select 
                className="form-control form-control-sm"
                name="subCategory"
                onChange={handleSubCategoryChange} 
              >
                <option value="">Select subcategory</option>
                {subCategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <label htmlFor="price" className="col-md-2 col-form-label col-form-label-sm">
            Price ($)
          </label>
          <div className="col-md-10">
            <input
              type="number"
              className="form-control form-control-sm"
              id="price"
              name="price"
              placeholder="Price"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row g-3">
          <label htmlFor="ModelNo" className="col-md-2 col-form-label col-form-label-sm">
            Model No
          </label>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control form-control-sm"
              id="modelNo"
              name="modelNo"
              placeholder="Model No"
              onChange={handleChange}
            />
          </div>
        </div>
        <br/>

        <div className="row g-3">
          <label htmlFor="Warehouse" className="col-md-2 col-form-label col-form-label-sm">
            Warehouse 
          </label>
          <div className="col-md-5">
            <select className="form-control form-control-sm" onChange={handleChange} name="warehouse"   >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
           <select className="form-control form-control-sm" onChange={handleChange} name="returnpolicy" value={values.returnpolicy}  >
              <option value="">Select Return Policy</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              </select>
          </div>
        </div>
<br/>
        <div className="row g-3">
          <label htmlFor="date" className="col-md-2 col-form-label col-form-label-sm">
            Date & Tag
          </label>
          <div className="col-md-5">
            <input
              type="date"
              className="form-control form-control-sm"
              id="date"
              name="date"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-5">
            <select className="form-control form-control-sm" value={selectedTags}
                onChange={handleTagChange} name="tag" >
              <option value="">Select Tag</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br/>
        <div className="row g-3">
          <label htmlFor="title" className="col-md-2 col-form-label col-form-label-sm">
            Title
          </label>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control form-control-sm"
              id="title"
              name="title"
              placeholder="Title"
              onChange={handleChange}
            />
          </div>
        </div>
        <br/>
        <div className="row g-3">
          <label htmlFor="description" className="col-md-2 col-form-label col-form-label-sm">
            Description
          </label>
          <div className="col-md-10">
            <textarea
              className="form-control form-control-sm"
              id="description"
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />
          </div>
        </div>
       <br/>
        <div className="row g-3 mb-3">
          <label htmlFor="images" className="col-md-2 col-form-label col-form-label-sm">
            Images & Color
          </label>
          <div className="col-md-6">
            <div className="form-control-sm p-0">
              <input
                type="file"
                className="form-control form-control-sm"
                id="images"
                multiple
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-control-sm p-0">
            <select
                className="form-control form-control-sm"
                value={selectedColor}
                onChange={handleColorChange}
                name="color"
              >
                <option value="">Select color</option>
                {colors.map((color) => (
                  <option key={color._id} value={color._id}>
                    {color.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-3">
    <label htmlFor="coverImage" className="col-md-2 col-form-label col-form-label-sm">
        Cover Image
    </label>
    <div className="col-md-6">
        <input
            type="file"
            className="form-control form-control-sm"
            id="coverImage"
            onChange={handleCoverImageChange} // Handle cover image change
        />
    </div>
</div>

        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label col-form-label-sm">
            Available Sizes & Stock
          </label>
          <div className="col-md-10">
            {sizes.map((sizeData, index) => (
              <div key={sizeData._id} className="col-md-6 col-lg-4 mb-3">
                <div className="card p-2 shadow-sm">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`size-${sizeData._id}`}
                      checked={sizeData.selected}
                      onChange={() => handleSizeChange(index)}
                    />
                    <label htmlFor={`size-${sizeData._id}`} className="form-check-label">
                      Size {sizeData.value}
                    </label>
                  </div>
                  {sizeData.selected && (
                    <div className="mt-2">
                      <label htmlFor={`stock-${sizeData._id}`}>Stock Count</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id={`stock-${sizeData._id}`}
                        value={sizeData.stock}
                        onChange={(e) => handleStockChange(index, e)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </div>
  );
};

export default ProductData;