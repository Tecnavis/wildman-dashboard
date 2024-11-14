import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchCustomerOrder, URL,deleteCustomerOrder } from "../../Helper/handle-api";
import axios from "axios";
const OrderListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrder, setAllOrder] = useState([]);
  const [productStock, setProductStock] = useState({});
//fetch customer orders
  useEffect(() => {
    fetchCustomerOrder()
      .then((response) => {
        if (response && response.orders) {
          setAllOrder(response.orders);
          checkStockAvailability(response.orders);
        } else {
          setAllOrder([]);
        }
      })
      .catch((err) => console.log("Error fetching data:", err));
  }, []);

//check stock availability
  const checkStockAvailability = async (orders) => {
    const stockInfo = {};
    for (const order of orders) {
      for (const product of order.products) {
        const productId = product.productDetails.id;
        const size = product.sizeDetails.size;
        const orderedQuantity = product.sizeDetails.quantity;

        if (!stockInfo[productId]) {
          try {
            const response = await axios.get(`${URL}/product/${productId}`);
            const productData = response.data;
            stockInfo[productId] = productData.sizes.reduce((acc, sizeObj) => {
              acc[sizeObj.size] = sizeObj.stock;
              return acc;
            }, {});
          } catch (error) {
            console.error(`Error fetching stock for product ${productId}:`, error);
            stockInfo[productId] = {};
          }
        }

        const availableStock = stockInfo[productId][size] || 0;
        product.stockAvailable = availableStock >= orderedQuantity;
        product.stockCount = availableStock;
      }
    }
    setProductStock(stockInfo);
    setAllOrder([...orders]);
  };
//edit customer order
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
  
      if (name.includes('products')) {
        const match = name.match(/products\[(\d+)\]\.sizeDetails\.quantity/);
        if (match) {
          const index = match[1];
          const quantity = parseInt(value, 10);
          newOrder.products[index].sizeDetails.quantity = quantity;
  
          // Recalculate totalAmount
          newOrder.totalAmount = newOrder.products.reduce((total, product) => {
            return total + (product.sizeDetails.quantity * product.productDetails.price);
          }, 0);
  
          // Recalculate balanceAmount
          newOrder.balanceAmount = newOrder.totalAmount - newOrder.paidAmount;
        }
      } else if (name === 'paidAmount') {
        // Update paidAmount
        const paidAmount = parseFloat(value);
        newOrder.paidAmount = paidAmount;
  
        // Recalculate balanceAmount
        newOrder.balanceAmount = newOrder.totalAmount - paidAmount;
      } else if (name === 'deliveryStatus') {
        // Update deliveryStatus
        newOrder.deliveryStatus = value;
  
        // Set deliveryDate based on deliveryStatus
        if (value === "Delivered") {
          newOrder.deliveryDate = new Date().toISOString(); 
        } else {
          newOrder.deliveryDate = "Not Delivered"; 
        }
      } else {
        newOrder[name] = value;
      }
  
      return newOrder;
    });
  };
  
  
//update customer orders
  const handleSaveChanges = async () => {
    console.log("Selected Order:", selectedOrder); 
    try {
      const response = await axios.put(
        `${URL}/customerorder/${selectedOrder._id}`,
        selectedOrder
      );
  
      if (response.status === 200) {
        console.log("Order updated:", response.data.order);
        setAllOrder((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? response.data.order : order
          )
        );
        setShowModal(false);
      } else {
        console.log("Failed to update the order");
      }
    } catch (error) {
      console.error("Error updating order:", error); 
    }
  };
  ///mark as delivered and deduct stock
  const handleDelivered = async (order) => {
    console.log("Order object:", order); // Log the order object

    // Check if the order has products and sizeDetails available
    if (!order.products || order.products.length === 0 || !order.products[0].sizeDetails) {
        console.error("No products or size details available to mark as delivered.");
        return;
    }

    try {
        const response = await axios.put(`${URL}/customerorder/${order._id}/delivered`);
        if (response.status === 200) {
            setAllOrder((prevOrders) =>
                prevOrders.map((o) =>
                    o._id === order._id
                        ? { ...o, deliveryStatus: "Delivered", deliveryDate: new Date().toISOString() }
                        : o
                )
            );
        } else {
            console.log("Failed to mark as delivered");
        }
    } catch (error) {
        console.error("Error marking as delivered:", error);
    }
};
const handleReturn = async (order) => {
    try {
      const response = await axios.put(`${URL}/customerorder/${order._id}/return`);
      if (response.status === 200) {
        setAllOrder((prevOrders) =>
          prevOrders.map((o) =>
            o._id === order._id
              ? { ...o, return: true }
              : o
          )
        );
        console.log("Order returned successfully");
      } else {
        console.log("Failed to return the order");
      }
    } catch (error) {
      console.error("Error returning the order:", error);
    }
  };

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(allOrder.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Shop Name</th>
              <th>Product</th>
              <th>Product count</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Credit</th>
              <th>Balance</th>
              <th>Address</th>
              <th>Payment Method</th>
              <th>Delivery Status</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Product Availability</th>
              <th>Delivered</th>
              <th>Return</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrder.map((data, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={data.products?.length || 1}>
                    <Link to="/invoices">{data.orderId}</Link>
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.customerName}
                  </td>
                  <td rowSpan={data.products?.length || 1}>{data.shopName}</td>
                  <td>
                    {data.products?.[0]?.productDetails?.mainCategory || "N/A"}
                  </td>
                  <td>{data.products?.[0]?.sizeDetails?.quantity || "N/A"}</td>
                  <td>{data.products?.[0]?.productDetails?.price || "N/A"}</td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.totalAmount}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.paidAmount}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.balanceAmount}
                  </td>
                  <td rowSpan={data.products?.length || 1}>{data.address}</td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.paymentMethod}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.deliveryStatus}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.orderDate
                      ? new Date(data.orderDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.deliveryDate === "Not Delivered"
                      ? data.deliveryDate
                      : data.deliveryDate
                      ? new Date(data.deliveryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td >
                    {data.products.every(product => product.stockAvailable)
                      ? "In Stock"
                      : "Out of Stock"}
                  </td>   
                  <td rowSpan={data.products?.length || 1}>
                    <Button
                      variant="primary"
                      // disabled={data.deliveryStatus === "Delivered"}
                      disabled={data.deliveryStatus === "Delivered" || !data.products.every(product => product.stockAvailable)}
                      onClick={() => handleDelivered(data)}
                    >
                      Mark as Delivered
                    </Button>
                  </td>    
                  <td rowSpan={data.products?.length || 1}>
                  <Button 
                      variant="danger" 
                      disabled={data.deliveryStatus !== "Delivered" || data.return}
                      onClick={() => handleReturn(data)}
                    >
                      {data.return ? "Returned" : "Return"}
                    </Button>
                    </td>         
                  <td rowSpan={data.products?.length || 1}>
                    <div className="btn-box">
                      <button onClick={() => handleEditClick(data)}>
                        <i className="fa-light fa-pen"></i>
                      </button>
                      <button>
                        <i className="fa-light fa-trash" onClick={() => deleteCustomerOrder(data._id)}></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {data.products?.slice(1).map((product, productIndex) => (
                  <tr key={`${index}-${productIndex}`}>
                    <td>{product.productDetails?.mainCategory || "N/A"}</td>
                    <td>{product.sizeDetails?.quantity || "N/A"}</td>
                    <td>{product.productDetails?.price || "N/A"}</td>
                    <td>{product.stockAvailable ? "In Stock" : "Out of Stock"}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />

      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="orderId">
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedOrder.orderId || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="customerName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={selectedOrder.customerName || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={4}>
                  <Form.Group controlId="shopName">
                    <Form.Label>Shop Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="shopName"
                      value={selectedOrder.shopName || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="paymentMethod">
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="totalAmount"
                      value={selectedOrder.totalAmount || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="paidAmount">
                    <Form.Label>Paid Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="paidAmount"
                      value={selectedOrder.paidAmount || 0}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="balanceAmount">
                    <Form.Label>Balance Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="balanceAmount"
                      value={selectedOrder.balanceAmount || 0}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={selectedOrder.address || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="paymentMethod">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control
                      type="text"
                      name="paymentMethod"
                      value={selectedOrder.paymentMethod || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="deliveryStatus">
                    <Form.Label>Delivery Status</Form.Label>
                    <Form.Select
                      name="deliveryStatus"
                      value={selectedOrder.deliveryStatus || ""}
                      onChange={handleInputChange}
                    >
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="On transist">On transist</option>
                      <option value="Pending">Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="orderDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        selectedOrder.orderDate
                          ? new Date(
                              selectedOrder.orderDate
                            ).toLocaleDateString()
                          : ""
                      }
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="deliveryDate">
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="deliveryDate"
                      value={
                        selectedOrder.deliveryDate
                          ? new Date(
                              selectedOrder.deliveryDate
                            ).toLocaleDateString()
                          : "Not Delivered"
                      }
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Form.Group controlId="productDetails">
                <Form.Label>Product Details</Form.Label>
                {selectedOrder.products?.map((product, index) => (
                  <div key={index}>
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId={`product-${index}-mainCategory`}>
                          <Form.Label>Main Category</Form.Label>
                          <Form.Control
                            type="text"
                            value={product.productDetails?.mainCategory || ""}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId={`product-${index}-quantity`}>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            name={`products[${index}].sizeDetails.quantity`}
                            value={product.sizeDetails?.quantity || 0}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId={`product-${index}-price`}>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            value={product.productDetails?.price || 0}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <br />
                  </div>
                ))}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default OrderListTable;