import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { fetchCustomers,fetchSalesOrders } from '../../Helper/handle-api';
const DashboardCards = () => {
    //fetch all customers
    const [customers, setCustomers] = useState([]);
    const [salesOrders, setSalesOrders] = useState([]);
    useEffect(() => {
        getSalesOrders();
        fetchCustomers().then(data => setCustomers(data));
    }, []);
    //fetch sales orders
    const getSalesOrders = async () => {
        const response = await fetchSalesOrders();
        if (response && Array.isArray(response.orders)) {
            setSalesOrders(response.orders);
        } else {
            setSalesOrders([]);
            console.error('Expected an array in response.orders, but got:', response);
        }
    };
      // Calculate total balance amount
      const totalBalanceAmount = salesOrders.reduce((accumulator, order) => {
        return accumulator + (order.balanceAmount || 0); // Add balanceAmount, default to 0 if undefined
    }, 0);
  return (
    <div className="row mb-30">
        <div className="col-lg-4 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3><CountUp end={salesOrders.length}/></h3>
                    <p> Sales Orders</p>
                    <Link to="/salesorders">Excluding orders in transit</Link>
                </div>
                <div className="right">
                    <span className="text-primary">{`${(salesOrders.length / 100).toFixed(1)}`}</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-bag-shopping"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-4 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3><CountUp end={customers.length}/></h3>
                    <p>Customers</p>
                    <Link to="/allCustomer">See details</Link>
                </div>
                <div className="right">
                    <span className="text-primary"> {`${(customers.length / 100).toFixed(1)}`}</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-user"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-4 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3>$<CountUp end={totalBalanceAmount}/></h3>
                    <p> Balance Amount</p>
                    <Link to="#">Credit</Link>
                </div>
                <div className="right">
                    <span className="text-primary">   {`${(totalBalanceAmount / 100).toFixed(1)}`}</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-credit-card"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashboardCards