import React, { useEffect, useState } from 'react';
import { createCoupon, fetchProducts } from '../../Helper/handle-api';
import { useForm } from '../../Helper/useForm';

const Couponcreate = () => {
  const [products, setAllproducts] = useState([]);
  const [values, handleChange, setValues] = useForm({
    code: '',
    discount: '',
    expirationDate: '',
    products: [], // Updated to store multiple product IDs
    applyToAll: false, // Added to handle "All Products" selection
  });

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setAllproducts(res || []);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setAllproducts([]);
      });
  }, []);

  const handleProductCheckboxChange = (productId) => {
    if (values.products.includes(productId)) {
      // Remove the product if already selected
      setValues({
        ...values,
        products: values.products.filter((id) => id !== productId),
      });
    } else {
      // Add the product to the selected list
      setValues({
        ...values,
        products: [...values.products, productId],
      });
    }
  };

  const handleApplyToAllChange = () => {
    setValues({
      ...values,
      applyToAll: !values.applyToAll,
      products: !values.applyToAll ? [] : values.products, // Clear products if selecting "All Products"
    });
  };

  return (
    <div className="table-filter-option customized-data-table">
      <div className="row g-3">
        <div className="col-xl-10 col-md-9">
          <div className="row g-3">
            <div className="col">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Coupon Code"
                name="code"
                value={values.code}
                onChange={handleChange}
              />
              <input
                type="tel"
                className="form-control form-control-sm"
                placeholder="Discount"
                name="discount"
                value={values.discount}
                onChange={handleChange}
                pattern="[0-9]*"
                title="Please enter numbers only"
              />
              <input
                type="date"
                className="form-control form-control-sm"
                placeholder="Expiry Date"
                name="expirationDate"
                value={values.expirationDate}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="applyToAll"
                  checked={values.applyToAll}
                  onChange={handleApplyToAllChange}
                />
                <label className="form-check-label" htmlFor="applyToAll">
                  Apply to All Products
                </label>
              </div>
              {!values.applyToAll && (
                <div>
                  {products.map((product) => (
                    <div className="form-check" key={product._id}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`product-${product._id}`}
                        value={product._id}
                        checked={values.products.includes(product._id)}
                        onChange={() => handleProductCheckboxChange(product._id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`product-${product._id}`}
                      >
                        {product.modelNo}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => createCoupon(values)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Couponcreate;
