import React, { useState, useEffect } from "react";
import { Table, Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { URL } from "../../Helper/handle-api";
import "./style.css";
import Swal from "sweetalert2";

const OrderDetailsTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedSize, setSelectedSize] = useState({});
  const [quantities, setQuantities] = useState({});
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  const adminId = adminDetails ? adminDetails._id : null;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!adminId) {
          console.error("Admin ID not found in localStorage");
          return;
        }
        const response = await axios.get(`${URL}/shopping/${adminId}`);
        const bag = response.data;

        const fetchedCartItems = bag.products.map((product) => ({
          id: product.productId._id,
          mainCategory: product.productId.mainCategory,
          color: product.productId.color,
          sizes: product.productId.sizes,
          price: product.productId.price,
          coverimage: product.productId.coverimage,
        }));

        setCartItems(fetchedCartItems);

        const initialQuantities = {};
        const initialSelectedSize = {};

        fetchedCartItems.forEach((item) => {
          initialQuantities[item.id] = {}; // Initialize for each size
          item.sizes.forEach((size) => {
            initialQuantities[item.id][size.size] = 0; // Initialize each size to 0
          });
          if (item.sizes.length > 0) {
            initialSelectedSize[item.id] = item.sizes[0].size;
          }
        });

        setQuantities(initialQuantities);
        setSelectedSize(initialSelectedSize);
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };

    fetchCartItems();
  }, [adminId]);

  useEffect(() => {
    calculateCartTotal();
  }, [cartItems, quantities, selectedSize]);

  const calculateCartTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const stock =
        item.sizes.find((size) => size.size === selectedSize[item.id])?.stock ||
        0;
      const currentQuantity = quantities[item.id]?.[selectedSize[item.id]] || 0;
      if (stock > 0) {
        return sum + item.price * currentQuantity;
      }
      return sum;
    }, 0);
    setCartTotal(total); // This sets the local state
    localStorage.setItem("cartTotal", total); // Save to localStorage here
  };

  useEffect(() => {
    const storedCartTotal = localStorage.getItem("cartTotal");
    if (storedCartTotal) {
      setCartTotal(parseFloat(storedCartTotal)); // Set cart total from localStorage if it exists
    }
  }, []);

  const increaseQuantity = (id, size) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const currentQuantity = quantities[id]?.[size] || 0;
      const stock = item.sizes.find((s) => s.size === size)?.stock || 0;
      if (currentQuantity < stock) {
        setQuantities((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            [size]: currentQuantity + 1,
          },
        }));
      }
    }
  };

  const decreaseQuantity = (id, size) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [size]: Math.max((prev[id]?.[size] || 0) - 1, 0),
      },
    }));
  };

  const removeFromCart = async (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      delete newQuantities[productId];
      return newQuantities;
    });

    try {
      await axios.delete(`${URL}/shopping/${adminId}/remove/${productId}`);
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  // Function to handle Pay Now button click
  const handlePayNow = () => {
    // Recalculate cart total before proceeding
    const recalculatedCartTotal = cartItems.reduce((total, item) => {
      const sizeQuantities = Object.values(quantities[item.id] || {});
      const itemTotal = sizeQuantities.reduce(
        (qtySum, qty) => qtySum + qty * item.price,
        0
      );
      return total + itemTotal;
    }, 0);

    if (recalculatedCartTotal === 0) {
      Swal.fire({
        title: "Select Product",
        text: "Please select at least one product before proceeding to payment.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const totalQuantity = cartItems.reduce((sum, item) => {
      return (
        sum +
        Object.values(quantities[item.id] || {}).reduce(
          (sizeSum, qty) => sizeSum + qty,
          0
        )
      );
    }, 0);

    const filteredProductDetails = cartItems
      .map((item) =>
        item.sizes.map((size) => ({
          id: item.id,
          mainCategory: item.mainCategory,
          color: item.color,
          price: item.price,
          coverimage: item.coverimage,
          size: size.size,
          quantity: quantities[item.id]?.[size.size] || 0,
        }))
      )
      .flat()
      .filter((product) => product.quantity > 0);

    const orderData = {
      totalQuantity,
      cartTotal: recalculatedCartTotal, // Ensure the recalculated total is used
      productDetails: filteredProductDetails,
    };

    // Save order details and updated cart total to localStorage
    localStorage.setItem("cartTotal", recalculatedCartTotal); // Save updated cart total
    localStorage.setItem("orderDetails", JSON.stringify(orderData));

    Swal.fire({
      title: "Order Submitted",
      text: "Your order details have been saved successfully!",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <Row>
      <Col md={8}>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="OrderDetailsTable"
        >
          <thead style={{ backgroundColor: "black" }}>
            <tr>
              <th style={{ color: "white" }}>Product</th>
              <th style={{ color: "white" }}>Quantity</th>
              <th style={{ color: "white" }}>Price</th>
              {/* <th style={{ color: "white" }}>Total Price</th> */}
              <th style={{ color: "white" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="table-product-card">
                    <div className="part-img">
                      <img
                        src={`${URL}/images/${item.coverimage}`}
                        alt={item.mainCategory}
                      />
                    </div>
                    <div className="part-txt">
                      <span className="product-name">{item.mainCategory}</span>
                      <span>Color: {item.color}</span>
                      <div className="available-sizes">
                        {item.sizes.map((size) => (
                          <div key={size.size}>
                            <span>Size: {size.size}</span>
                            <button
                              className="count"
                              onClick={() =>
                                decreaseQuantity(item.id, size.size)
                              }
                              disabled={size.stock === 0}
                            >
                              {" "}
                              -{" "}
                            </button>
                            {quantities[item.id]?.[size.size] || 0}
                            <button
                              className="count"
                              onClick={() =>
                                increaseQuantity(item.id, size.size)
                              }
                              disabled={size.stock === 0}
                            >
                              {" "}
                              +{" "}
                            </button>
                            <span
                              style={{
                                color: size.stock === 0 ? "red" : "inherit",
                                fontWeight:
                                  size.stock === 0 ? "bold" : "normal",
                              }}
                            >
                              {size.stock > 0
                                ? `Available Stock: ${size.stock}`
                                : "Out of stock"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{`$${item.price}`}</td>
                <td>{`$${
                  item.price *
                  (quantities[item.id]?.[selectedSize[item.id]] || 0)
                }`}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    {" "}
                    X{" "}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Text style={{ fontFamily: "Lato sans-serif" }}>
              <b>Cart Total</b>
              <hr />

              {/* Product Count */}
              <div className="cart">
                <p>Product Item: </p>
                <p>
                  <b>{cartItems.length}</b>
                </p>
              </div>

              {/* Count of Product */}
              <div className="cart">
                <p>Count of Product: </p>
                <p>
                  <b>
                    {cartItems.reduce((sum, item) => {
                      return (
                        sum +
                        Object.values(quantities[item.id] || {}).reduce(
                          (qtySum, qty) => qtySum + qty,
                          0
                        )
                      );
                    }, 0)}
                  </b>
                </p>
              </div>

              {/* Sub Total */}
              <div className="cart">
                <p>Sub Total: </p>
                <p>
                  <b>
                    $
                    {cartItems
                      .reduce((total, item) => {
                        const sizeQuantities = Object.values(
                          quantities[item.id] || {}
                        );
                        const itemTotal = sizeQuantities.reduce(
                          (qtySum, qty) => qtySum + qty * item.price,
                          0
                        );
                        return total + itemTotal;
                      }, 0)
                      .toFixed(2)}
                  </b>
                </p>
              </div>

              {/* Discount */}
              <div className="cart">
                <p>Discount: </p>
                <p>
                  <b>$0</b>
                </p>{" "}
                {/* Placeholder for discount logic */}
              </div>

              {/* Cart Total */}
              <div className="cart">
                <p>Cart Total: </p>
                <p>
                  <b>
                    $
                    {cartItems
                      .reduce((total, item) => {
                        const sizeQuantities = Object.values(
                          quantities[item.id] || {}
                        );
                        const itemTotal = sizeQuantities.reduce(
                          (qtySum, qty) => qtySum + qty * item.price,
                          0
                        );
                        return total + itemTotal;
                      }, 0)
                      .toFixed(2)}
                  </b>
                </p>
              </div>

              <Button
                style={{ width: "100%" }}
                className="btn btn-success"
                onClick={handlePayNow}
              >
                Pay Now
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderDetailsTable;
