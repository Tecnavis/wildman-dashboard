import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { createMainCategory } from '../../Helper/handle-api';
import { useForm } from '../../Helper/useForm';
import Swal from 'sweetalert2';

const ProductTags = () => {
  const [productTagBtn, setProductTagBtn] = useState(false);
  const [values, handleChange] = useForm({ name: '' });
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleProductTagBtn = () => {
    setProductTagBtn(!productTagBtn);
  };

  //create main category with image
  const handleAddCategory = async () => {
    if (!values.name) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: "Category name can't be empty",
      });
      return;
    }

    if (!image) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: "Please select an image",
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', image);

    try {
      const newCategory = await createMainCategory(formData); // Pass formData instead of an object
      Swal.fire({
        icon: 'success',
        title: 'Category Created',
        text: `New category "${newCategory.name}" created successfully!`,
      });

      // Clear the input after creation
      handleChange({ target: { name: 'name', value: '' } });
      setImage(null); // Clear the image
    } catch (error) {
      console.error('Error creating category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error creating the category. Please try again.',
      });
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h5>Main Category</h5>
        <div className="btn-box d-flex gap-2">
          <button className="btn btn-sm btn-icon btn-outline-primary panel-close" onClick={handleProductTagBtn}>
            <i className="fa-light fa-angle-up"></i>
          </button>
        </div>
      </div>
      <div className={`panel-body ${productTagBtn ? 'd-none' : ''}`}>
        <div className="product-tag-area">
          <div className="row g-3">
            <div className="col-12">
              <Form.Control
                type="file"
                id="productTags"
                accept="image/*"
                name="image"
                onChange={handleImage}
              />
            </div>
            <div className="col-9">
              <Form.Control
                type="text"
                id="productTags"
                placeholder="Add new Main category"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-3">
              <button
                className="btn btn-sm btn-primary w-100"
                id="addTags"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTags;
