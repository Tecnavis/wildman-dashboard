import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { fetchCustomers, fetchAdmins, fetchPurchase } from '../../Helper/handle-api';

const CrmDashboardCards = () => {
    // Fetch all customers, admins, and purchases
    const [customers, setCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [totalPaidAmount, setTotalPaidAmount] = useState(0); // State to hold total paid amount

    useEffect(() => {
        fetchCustomers().then(res => {
            setCustomers(res);
        });

        fetchAdmins().then(res => {
            setAdmins(res);
        });

        fetchPurchase().then(res => {
            setPurchases(res);
            const total = res.reduce((sum, purchase) => sum + purchase.paidAmount, 0); // Calculate total from the fetched data
            setTotalPaidAmount(total);
        });
    }, []);
    
    return (
        <div className="row mb-30">
            <div className="col-lg-4 col-6 col-xs-12">
                <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                    <div className="d-flex justify-content-between align-items-center mb-20">
                        <div className="right">
                            <div className="part-icon text-light rounded">
                                <span><i className="fa-light fa-user-plus"></i></span>
                            </div>
                        </div>
                        <div className="left">
                            <h3 className="fw-normal"><CountUp end={customers.length}/></h3>
                        </div>
                    </div>
                    <div className="progress-box">
                        <p className="d-flex justify-content-between mb-1">Total Client <small>{`${(customers.length / 100).toFixed(1)}`}</small></p>
                        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-success" style={{width:`${(customers.length / 100).toFixed(1)}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-6 col-xs-12">
                <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                    <div className="d-flex justify-content-between align-items-center mb-20">
                        <div className="right">
                            <div className="part-icon text-light rounded">
                                <span><i className="fa-light fa-user-secret"></i></span>
                            </div>
                        </div>
                        <div className="left">
                            <h3 className="fw-normal"><CountUp end={admins.length}/></h3>
                        </div>
                    </div>
                    <div className="progress-box">
                        <p className="d-flex justify-content-between mb-1">Total Admin <small>{`${(admins.length / 100).toFixed(1)}`}</small></p>
                        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-primary" style={{width:`${(admins.length / 100).toFixed(1)}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-6 col-xs-12">
                <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                    <div className="d-flex justify-content-between align-items-center mb-20">
                        <div className="right">
                            <div className="part-icon text-light rounded">
                                <span><i className="fa-light fa-money-bill"></i></span>
                            </div>
                        </div>
                        <div className="left">
                            <h3 className="fw-normal">$<CountUp end={totalPaidAmount}/></h3>
                        </div>
                    </div>
                    <div className="progress-box">
                        <p className="d-flex justify-content-between mb-1">Total Expenses <small>{`${(totalPaidAmount / 100).toFixed(1)}`}</small></p>
                        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-warning" style={{width:`${(totalPaidAmount / 100).toFixed(1)}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrmDashboardCards;
