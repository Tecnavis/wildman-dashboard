import React, { useEffect, useState } from 'react'
import { fetchCustomers } from '../../Helper/handle-api'

const NewCustomer = () => {
    const logoSrc ="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000";

    // Fetch all customers
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers().then(data => {
            const latestCustomers = data.slice(-6).reverse(); 
            setCustomers(latestCustomers);
        });
    }, []);

    return (
        <div className="col-xl-12 col-md-6">
            <div className="panel">
                <div className="panel-header">
                    <h5>New Customers</h5>
                </div>
                <div className="panel-body">
                    <table className="table table-borderless new-customer-table">
                        <tbody>
                            {customers.map((data) => (
                                <tr key={data._id}>
                                    <td>
                                        <div className="new-customer">
                                            <div className="part-img">
                                                <img src={logoSrc} alt="Image" />
                                            </div>
                                            <div className="part-txt">
                                                <p className="customer-name">{data.name}</p>
                                                <span>{data.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{data.phone}</td>
                                    <td>{data.shopname}<br />{data.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default NewCustomer;
