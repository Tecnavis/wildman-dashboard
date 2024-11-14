import React, { useContext, useEffect, useState } from 'react';
import { DigiContext } from '../../context/DigiContext';
import { Form, Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import { fetchCustomerOrder } from '../../Helper/handle-api';
import { Link } from 'react-router-dom';

const AudienceTable = () => {
    const {
        currentPage,
        handleCheckboxChange,
        currentData,
        paginate,
        totalPages,
        pageNumbers
    } = useContext(DigiContext);

    const [allOrder, setAllOrder] = useState([]);

    // Fetch customer orders
    useEffect(() => {
        fetchCustomerOrder()
            .then((response) => {
                if (response && response.orders) {
                    setAllOrder(response.orders);
                } else {
                    setAllOrder([]);
                }
            })
            .catch((err) => console.log("Error fetching data:", err));
    }, []);

    // Filter orders to show only those with delivery status "Returned"
    const filteredOrders = allOrder.filter(order => order.deliveryStatus === 'Returned');

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
                            <th>Product Count</th>
                            <th>Price</th>
                            <th>Total Price</th>
                            <th>Credit</th>
                            <th>Balance</th>
                            <th>Address</th>
                            <th>Payment Method</th>
                            <th>Delivery Status</th>
                            <th>Order Date</th>
                            <th>Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((data, index) => (
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
                                    </tr>
                                    {data.products?.slice(1).map((product, productIndex) => (
                                        <tr key={`${index}-${productIndex}`}>
                                            <td>{product.productDetails?.mainCategory || "N/A"}</td>
                                            <td>{product.sizeDetails?.quantity || "N/A"}</td>
                                            <td>{product.productDetails?.price || "N/A"}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center">No returned orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </OverlayScrollbarsComponent>
            <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />
        </>
    );
};

export default AudienceTable;
