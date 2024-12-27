import React, { useEffect, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import Couponcreate from './couponcreate';
import { fetchCoupons, deleteCoupon, updateCoupon, fetchProducts } from '../../Helper/handle-api';
import "./coupon.css"
import { useForm } from '../../Helper/useForm';
const CustomizedDataTableSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [editCouponData, setEditCouponData] = useState(null); // State for coupon being edited
  const [isEditing, setIsEditing] = useState(false); // Modal visibility

  // Fetch coupons
  useEffect(() => {
    fetchCoupons()
      .then((res) => {
        setCoupons(res || []);
      })
      .catch((error) => {
        console.error('Error fetching coupons:', error);
        setCoupons([]);
      });
      fetchProducts()
        .then((res) => {
          setAllproducts(res || []);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setAllproducts([]);
        });
  }, []);

  // Handle edit button click
  const handleEditClick = (coupon) => {
    console.log('Edit button clicked:', coupon); // Log the clicked coupon
    setEditCouponData(coupon);
    setIsEditing(true);
  };
  

  // Handle updating coupon
  const handleUpdateCoupon = () => {
    if (editCouponData) {
      updateCoupon(editCouponData._id, editCouponData)
        .then((updatedCoupon) => {
          setCoupons((prevCoupons) =>
            prevCoupons.map((coupon) =>
              coupon._id === updatedCoupon._id ? updatedCoupon : coupon
            )
          );
          setIsEditing(false); // Close modal
        })
        .catch((error) => {
          console.error('Error updating coupon:', error);
        });
    }
  };
  const [products, setAllproducts] = useState([]);



  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <Couponcreate />
          <OverlayScrollbarsComponent>
            <table
              className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
              id="allProductTable"
            >
              <thead>
                <tr>
                  <th>Product</th>
                  <th>CODE</th>
                  <th>Discount</th>
                  <th>Product</th>
                  <th>Expire</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>
                      <div
                        className="table-product-card"
                        style={{ height: '80px', width: '80px' }}
                      >
                        <img src="assets/images/coupon.jpg" alt="Image" />
                      </div>
                    </td>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}</td>
                    <td>
                      {Array.isArray(coupon.products) ? (
                        coupon.products.map((product, index) => (
                          <div key={index}>{product.modelNo}</div>
                        ))
                      ) : (
                        <div>{coupon.products}</div>
                      )}
                    </td>
                    <td>{coupon.expirationDate}</td>
                    <td>{coupon.status}</td>
                    <td>
                      <div className="btn-box">
                        <button
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <i className="fa-light fa-eye"></i>
                        </button>
                        <button
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                          }}
                          onClick={() => handleEditClick(coupon)}
                        >
                          <i className="fa-light fa-pen"></i>
                        </button>
                        <button
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                          }}
                          onClick={() => deleteCoupon(coupon._id)}
                        >
                          <i className="fa-light fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </OverlayScrollbarsComponent>

          {/* Edit Coupon Modal */}
         {/* Edit Coupon Modal */}
{isEditing && (
  <div className="modal-overlay">
    <div className="modal-container">
      <div className="modal-header">
        <h5 className="modal-title">Edit Coupon</h5>
        <button
          className="modal-close-btn"
          onClick={() => setIsEditing(false)}
        >
          &times;
        </button>
      </div>
      <div className="modal-body">
        {editCouponData && (
          <form>
            <div className="form-group">
              <label>Code</label>
              <input
                type="text"
                value={editCouponData.code}
                onChange={(e) =>
                  setEditCouponData({ ...editCouponData, code: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                value={editCouponData.discount}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    discount: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Expiration Date</label>
              <input
                type="date"
                value={editCouponData.expirationDate}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    expirationDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Products</label>
              <select
                multiple
                value={editCouponData.products}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    products: Array.from(e.target.selectedOptions, (option) =>
                      option.value
                    ),
                  })
                }
              >
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.modelNo}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editCouponData.status}
                onChange={(e) =>
                  setEditCouponData({
                    ...editCouponData,
                    status: e.target.value,
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </form>
        )}
      </div>
      <div className="modal-footer">
        <button className="btn-primary" onClick={handleUpdateCoupon}>
          Update
        </button>
        <button
          className="btn-secondary"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


        </div>
      </div>
    </div>
  );
};

export default CustomizedDataTableSection;
