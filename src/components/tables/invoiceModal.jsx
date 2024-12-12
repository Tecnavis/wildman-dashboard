import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { URL } from "../../Helper/handle-api";
import axios from "axios";

const InvoiceModal = ({ show, onHide, order }) => {
  const totalAmount = order?.totalAmount || 0;
  const [logo, setLogo] = useState([]);

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
  return (
    <Modal show={show} onClick={onHide} centered size="xl">
      <Modal.Header closeButton style={{backgroundColor:"black"}}>
        <Modal.Title style={{color:"white"}}>Invoice Details</Modal.Title>
      </Modal.Header>

      {/* <Modal.Body> */}
        <div className="main-content" style={{ minHeight: "auto" }}>
          <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
            <h2>Invoices</h2>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-12">
              <div className="panel rounded-0">
                <div className="panel-body invoice" id="invoiceBody">
                  <div className="invoice-header mb-30">
                    <div className="row justify-content-between align-items-end">
                      <div className="col-xl-4 col-lg-5 col-sm-6">
                        <div className="shop-address">
                          <div className="logo mb-20">
                            {logo.map((data) => (
                              <img
                                key={data._id}
                                className="logo"
                                src={`${URL}/images/${data.image}`}
                                alt="Business Logo"
                                style={{
                                  width: "100px",
                                }}
                              />
                            ))}
                          </div>
                          <div className="part-txt">
                            <p className="mb-1">
                              Address: 456 E-Commerce Avenue, Cityville,
                              Countryland
                            </p>
                            <p className="mb-1">Email: support@warehouse.com</p>
                            <p className="mb-1">Phone: +1 (800) 123-4567</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-body">
                    <div className="info-card-wrap mb-30">
                      <div className="row">
                        <div className="col-md-6 col-sm-6">
                          <div className="info-card">
                            <h3>Customer Details:</h3>
                            <ul className="p-0">
                              <li>
                                <span>Name:</span> {order?.customerName}
                              </li>
                              <li>
                                <span>Email:</span> {order?.email}
                              </li>
                              <li>
                                <span>Phone:</span> {order?.phone}
                              </li>
                              <li>
                                <span>Address:</span> {order?.address}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 d-flex justify-content-end">
                          <div className="info-card">
                            <h3>Invoice Details:</h3>
                            <ul className="p-0">
                              <li>
                                <span>ORDER No.:</span> {order?.orderId}
                              </li>
                              <li>
                                <span>Order Date:</span>{" "}
                                {new Date(
                                  order?.orderDate
                                ).toLocaleDateString()}
                              </li>
                              <li>
                                <span>Total Amount:</span> ₹{" "}
                                {(
                                  totalAmount +
                                  order?.products?.reduce(
                                    (totalGst, product) =>
                                      totalGst +
                                      (product.productDetails?.gst || 0) *
                                        (product.sizeDetails?.quantity || 1),
                                    0
                                  )
                                ).toFixed(2)}
                              </li>
                              <li>
                                <span>Payment Type:</span> Cash on delivery
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive mb-30">
                      <table className="table table-bordered mb-0 invoice-table">
                        <thead style={{backgroundColor:"black"}}>
                          <tr >
                            <th style={{color:"white"}}>No.</th>
                            <th style={{color:"white"}}>Products</th>
                            <th style={{color:"white"}}>Qty.</th>
                            <th style={{color:"white"}}>Price</th>
                            <th style={{color:"white"}}>Offer Price</th>
                            <th style={{color:"white"}}>Tax</th>
                            <th style={{color:"white"}}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.products.map((product, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {product.productDetails?.mainCategory || ""}
                              </td>
                              <td>{product.sizeDetails?.quantity || 0}</td>
                              <td>₹{product.productDetails?.price || 0}</td>
                              <td>{product.productDetails?.discount || 0}%</td>
                              <td>₹{product.productDetails?.gst || 0}</td>
                              <td>
                                MRP Price: ₹
                                {(
                                  product.productDetails?.price *
                                    product.sizeDetails?.quantity +
                                  (product.shippingCost || 0) +
                                  (product.productDetails?.gst || 0)
                                ).toFixed(2)}
                                <br />
                                {/* // Display the discounted price minus % discount from the original price */}
                                <span>
                                  Offer Price: ₹{" "}
                                  {(
                                    (product.productDetails?.price || 0) *
                                    (1 -
                                      (product.productDetails?.discount || 0) /
                                        100)
                                  )*(product.sizeDetails?.quantity || 1).toFixed(2)}{" "}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {/* Total, Paid, and Balance Row */}
                          <tr>
                            <td colSpan="7" className="text-end" >
                              <p>If you add gift wrapping, it will take an extra ₹ 30.00</p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="6" className="text-end">
                              <strong>Total GST</strong>
                            </td>
                            <td>
                              ₹{" "}
                              {order?.products
                                ?.reduce(
                                  (totalGst, product) =>
                                    totalGst +
                                    (product.productDetails?.gst || 0) *
                                      (product.sizeDetails?.quantity || 1),
                                  0
                                )
                                .toFixed(2)}
                            </td>
                          </tr>
                          
                          <tr>
                            <td colSpan="6" className="text-end">
                              <strong>Total Amount (Including GST)</strong>
                            </td>
                            <td>
                              ₹
                              {(
                                totalAmount +
                                order?.products?.reduce(
                                  (totalGst, product) =>
                                    totalGst +
                                    (product.productDetails?.gst || 0) *
                                      (product.sizeDetails?.quantity || 1),
                                  0
                                )
                              ).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </Modal.Body> */}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
