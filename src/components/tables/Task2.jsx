import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { fetchCustomerOrder, URL } from "../../Helper/handle-api";
import axios from "axios";

const OrderListTable = () => {
  const [dataPerPage] = useState(10);
  const [allOrder, setAllOrder] = useState([]);
  const [productStock, setProductStock] = useState([]);

  // Fetch customer orders
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

  // Check stock availability
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

  // Mark as delivered and deduct stock
  const handleDelivered = async (order) => {
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
        console.log(order.orderId, "marked as customer order delivered");
        
      } else {
        console.log("Failed to mark as delivered");
      }
    } catch (error) {
      console.error("Error marking as delivered:", error);
    }
  };

  // Filter orders for "Out for Delivery"
  const filteredOrders = allOrder.filter(order => order.deliveryStatus === "Out for delivery");

  return (
    <>
      <OverlayScrollbarsComponent>
        <br/><br/>
        <h6>All Customer Orders</h6>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Shop Name</th>
              <th>Product</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Credit</th>
              <th>Balance</th>
              <th>Delivery Status</th>
              <th>Delivery Date</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((data, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={data.products?.length || 1}>
                    <Link to="/invoices">{data.orderId}</Link>
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.customerName}
                  </td>
                  <td rowSpan={data.products?.length || 1}>{data.shopName}<br/> {data.address}</td>
                  <td>
                    {data.products?.[0]?.productDetails?.mainCategory || "N/A"} X {data.products?.[0]?.sizeDetails?.quantity || "N/A"}
                  </td>
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

                  <td rowSpan={data.products?.length || 1}>
                    {data.deliveryStatus}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.deliveryDate === "Not Delivered"
                      ? data.deliveryDate
                      : data.deliveryDate
                      ? new Date(data.deliveryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      disabled={data.deliveryStatus === "Delivered"}
                      onClick={() => handleDelivered(data)}
                    >
                     Delivered
                    </Button>
                  </td>
                </tr>
                {data.products?.slice(1).map((product, productIndex) => (
                  <tr key={`${index}-${productIndex}`}>
                    <td>{product.productDetails?.mainCategory || "N/A"} X {product.sizeDetails?.quantity || "N/A"}</td>
                    <td>{product.productDetails?.price || "N/A"}</td>
                    <td>
                      <Button
                        variant="primary"
                        disabled={data.deliveryStatus === "Delivered"}
                        onClick={() => handleDelivered(data)}
                      >
                        Mark as Delivered
                      </Button>
                      <Button 
                        variant="danger" 
                        disabled={data.deliveryStatus !== "Delivered" || data.return}
                        onClick={() => handleReturn(data)}
                      >
                        {data.return ? "Returned" : "Return"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
    </>
  );
};

export default OrderListTable;
