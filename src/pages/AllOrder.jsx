import React from "react";
import Footer from "../components/footer/Footer";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AllOrderTable from "../components/tables/OrderTable";

const OrderList = () => {
  return (
    <div className="main-content">
      <div className="row g-4">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Order</h5>
              <div className="btn-box d-flex flex-wrap gap-2">
                <div id="tableSearch">
                  <Form.Control type="text" placeholder="Seach..." />
                </div>
                <div className="btn-box">
                  <Link to="/shoppingbag" className="btn btn-sm btn-primary">
                  <i className="fa-light fa-cart-plus"/> Shopping Bag
                  </Link>
                </div>
                
              </div>
            </div>
            <div className="panel-body">
              <AllOrderTable />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderList;
