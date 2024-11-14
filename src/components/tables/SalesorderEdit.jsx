import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { fetchAdmins, fetchProducts } from "../../Helper/handle-api";

const EditSalesOrderModal = ({ show, onHide, order, handleUpdate }) => {
  const [editSalesOrder, setEditSalesOrder] = useState(order || {});
  const [productDetails, setProductDetails] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdmins();
    setEditSalesOrder(order);
    if (order) {
      fetchProductDetails(order.products);
    }
  }, [order]);

  const fetchProductDetails = async (orderProducts) => {
    setLoading(true);
    try {
      const fetchedProducts = await fetchProducts();

      const productDetailsMap = {};
      orderProducts.forEach((orderProduct) => {
        const matchedProduct = fetchedProducts.find(
          (p) => p._id === orderProduct.id
        );
        if (matchedProduct) {
          productDetailsMap[`${orderProduct.id}-${orderProduct.size}`] = {
            ...matchedProduct,
            quantity: orderProduct.quantity,
            originalQuantity: orderProduct.quantity,
            size: orderProduct.size,
          };
        }
      });

      setProductDetails(productDetailsMap);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to fetch product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditSalesOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (productId, size, e) => {
    const { name, value } = e.target;
    setEditSalesOrder((prev) => ({
      ...prev,
      products: prev.products.map((product) => {
        if (product.id === productId && product.size === size) {
          const updatedProduct = { ...product, [name]: parseInt(value) };
          const fullProduct = productDetails[`${productId}-${size}`];
          const sizeStock =
            fullProduct?.sizes?.find((s) => s.size === parseInt(size))?.stock || 0;
          const maxQuantity = sizeStock + product.originalQuantity;

          if (name === "quantity" && updatedProduct.quantity > maxQuantity) {
            setError(
              `Maximum available quantity for ${product.mainCategory} size ${size} is ${maxQuantity}`
            );
            return { ...product, quantity: maxQuantity };
          }
          setError("");
          return updatedProduct;
        }
        return product;
      }),
    }));
  };

  useEffect(() => {
    const totalAmount = editSalesOrder?.products?.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);
    setEditSalesOrder((prev) => ({ ...prev, totalAmount }));
  }, [editSalesOrder.products]);

  useEffect(() => {
    const balanceAmount =
      editSalesOrder.totalAmount - editSalesOrder.paidAmount;
    setEditSalesOrder((prev) => ({ ...prev, balanceAmount }));
  }, [editSalesOrder.totalAmount, editSalesOrder.paidAmount]);

  useEffect(() => {
    const { totalAmount, balanceAmount } = editSalesOrder;
  
    let paymentStatus = "";
    
    if (balanceAmount === 0) {
      paymentStatus = "Paid";
    } else if (balanceAmount === totalAmount) {
      paymentStatus = "Unpaid";
    } else {
      paymentStatus = "Partially Paid";
    }
  
    setEditSalesOrder((prev) => ({ ...prev, paymentStatus }));
  }, [editSalesOrder.balanceAmount, editSalesOrder.totalAmount]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) {
      return;
    }
    handleUpdate(editSalesOrder);
    onHide();
  };

  const [admins, setAdmins] = useState([]);
  
  const getAdmins = async () => {
    try {
      const response = await fetchAdmins();
      if (Array.isArray(response)) {
        setAdmins(response);
      } else {
        setAdmins([]);
        console.error("Expected an array, but got:", response);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Body>Loading...</Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Salesorder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Admin</Form.Label>
                <Form.Select
                  name="adminName"
                  value={editSalesOrder?.adminName || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Admin</option>
                  {admins.map((admin) => (
                    <option key={admin._id} value={admin.name}>
                      {admin.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={editSalesOrder?.customerName || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Display and edit each product's quantity */}
          {editSalesOrder?.products?.map((product, index) => {
            const fullProduct = productDetails[`${product.id}-${product.size}`];
            const sizeStock =
              fullProduct?.sizes?.find((s) => s.size === parseInt(product.size))
                ?.stock || 0;
            const maxQuantity = sizeStock + (product.originalQuantity || 0);
            const total = maxQuantity;
            return (
              <Row key={`${product.id}-${product.size}`}>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={product.mainCategory}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(product.id, product.size, e)}
                      min="0"
                    />
                    <div className="d-flex justify-content-between mt-1">
                      <Form.Text
                        className={`font-weight-bold ${
                          total === 0 ? "text-danger" : "text-primary"
                        }`}
                      >
                        {total === 0
                          ? "No More Stock"
                          : total >= 1
                          ? `Available: ${total}  `
                          : ""}
                      </Form.Text>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Size</Form.Label>
                    <Form.Control
                      type="number"
                      name="size"
                      value={product.size}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Unit Price</Form.Label>
                    <Form.Control
                      readOnly
                      type="number"
                      name="price"
                      value={product.price}
                    />
                  </Form.Group>
                </Col>
              </Row>
            );
          })}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={editSalesOrder?.phone || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={editSalesOrder?.email || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={editSalesOrder?.paymentMethod || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash on delivery">Cash on delivery</option>
                  <option value="UPI">UPI</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  readOnly
                  type="number"
                  name="totalAmount"
                  value={editSalesOrder?.totalAmount || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Paid Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="paidAmount"
                  value={editSalesOrder?.paidAmount || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Balance</Form.Label>
                <Form.Control
                  type="text"
                  name="balanceAmount"
                  value={editSalesOrder?.balanceAmount || ""}
                  onChange={handleChange}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Status</Form.Label>
                <Form.Select
                  name="deliveryStatus"
                  value={editSalesOrder?.deliveryStatus || ""}
                  onChange={handleChange}
                >
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Delivered">Delivered</option>
                  <option value="On transist">On transist</option>
                  <option value="Pending">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentStatus"
                  value={editSalesOrder?.paymentStatus || "Partially Paid"}
                  readOnly
                  style={{
                    color:
                      editSalesOrder.paymentStatus === "Paid" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shop Name</Form.Label>
                <Form.Control
                  type="text"
                  name="shopName"
                  value={editSalesOrder?.shopName || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Date</Form.Label>
                <Form.Control
                  type="date"
                  name="deliveryDate"
                  value={editSalesOrder?.deliveryDate || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Update Order Details
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSalesOrderModal;
