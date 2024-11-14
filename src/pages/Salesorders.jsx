import React, { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
// import OrderHeader from '../components/header/OrderHeader'
import SalesordersHeader from "../components/header/SalesorderHeader";
import SalesorderTable from "../components/tables/Salesorder";
import { fetchSalesOrders } from "../Helper/handle-api";

const Salesorders = () => {
    const [salesOrders, setSalesOrders] = useState([]);

    useEffect(() => {
        const getSalesOrders = async () => {
            const response = await fetchSalesOrders();
            if (response && Array.isArray(response.orders)) {
                setSalesOrders(response.orders);
            } else {
                setSalesOrders([]);
                console.error('Expected an array in response.orders, but got:', response);
            }
        };
        getSalesOrders();
    }, []);

    // Calculate delivery status counts
    const deliveredCount = salesOrders.filter(order => order.deliveryStatus === "Delivered").length;
    const outForDeliveryCount = salesOrders.filter(order => order.deliveryStatus === "Out for delivery").length;
    const canceledCount = salesOrders.filter(order => order.deliveryStatus === "Cancelled").length; // Adjust based on your status naming

    return (
        <div className="main-content">
            <div className="row g-4">
                <div className="col-12">
                    <div className="panel">
                        <SalesordersHeader />
                        <div className="panel-body">
                            <div className="product-table-quantity d-flex justify-content-between align-items-center mb-20">
                                <ul className="mb-0">
                                    <li className="text-white">All ({salesOrders.length})</li>
                                    <li>Delivered ({deliveredCount})</li>
                                    <li>Out for Delivery ({outForDeliveryCount})</li>
                                    <li>Cancel ({canceledCount})</li>
                                </ul>
                            </div>
                            <SalesorderTable salesOrders={salesOrders} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Salesorders;
