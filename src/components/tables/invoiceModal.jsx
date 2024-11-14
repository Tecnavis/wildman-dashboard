import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { URL } from "../../Helper/handle-api";
import axios from "axios";

const InvoiceModal = ({ show, onHide, order }) => {
  const totalPaidAmount = order?.paidAmount || 0;
  const totalAmount = order?.totalAmount || 0;
  const balanceAmount = totalAmount - totalPaidAmount;
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
      <Modal.Header closeButton>
        <Modal.Title>Invoice Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
                            <p className="mb-1">Admin :{order?.adminName}</p>
                            <p className="mb-1">
                              Address: 456 E-Commerce Avenue, Cityville,
                              Countryland
                            </p>
                            <p className="mb-1">Email: support@warehouse.com</p>
                            <p className="mb-1">Phone: +1 (800) 123-4567</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex gap-xl-4 gap-3 status-row">
                          <div className="w-50">
                            <div className="payment-status">
                              <label className="form-label">
                                Payment Status:
                              </label>
                              <Form.Select
                                className="form-control"
                                value={order?.paymentStatus}
                              >
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Partial">Partial</option>
                              </Form.Select>
                            </div>
                          </div>
                          <div className="w-50">
                            <div className="Order-status">
                              <label className="form-label">
                                Order Status:
                              </label>
                              <Form.Select
                                className="form-control"
                                value={order?.orderStatus}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                              </Form.Select>
                            </div>
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
                                <span>Invoice No.:</span> {order?.orderId}
                              </li>
                              <li>
                                <span>Order Date:</span>{" "}
                                {new Date(
                                  order?.orderDate
                                ).toLocaleDateString()}
                              </li>
                              <li>
                                <span>Total Amount:</span> ${order?.totalAmount}
                              </li>
                              <li>
                                <span>Payment Type:</span> Cash on delivery
                              </li>
                              <li>
                                <span>Payment Status:</span>{" "}
                                <span
                                  className={
                                    order?.paymentStatus === "Paid"
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {order?.paymentStatus}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive mb-30">
                      <table className="table table-bordered mb-0 invoice-table">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Products</th>
                            <th>Qty.</th>
                            <th>Price</th>
                            <th>Shipping Cost</th>
                            <th>Tax</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.products.map((product, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{product.mainCategory}</td>
                              <td>{product.quantity}</td>
                              <td>${product.price}</td>
                              <td>${product.shippingCost || 0}</td>
                              <td>${product.tax || 0}</td>
                              <td>
                                $
                                {(
                                  product.price * product.quantity +
                                  (product.shippingCost || 0) +
                                  (product.tax || 0)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          {/* Total, Paid, and Balance Row */}
                          <tr>
                            <td colSpan="6" className="text-end">
                              <strong>Total Amount</strong>
                            </td>
                            <td>${totalAmount.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colSpan="6" className="text-end">
                              <strong>Paid Amount</strong>
                            </td>
                            <td>${totalPaidAmount.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colSpan="6" className="text-end">
                              <strong>Balance Amount</strong>
                            </td>
                            <td>${balanceAmount.toFixed(2)}</td>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
