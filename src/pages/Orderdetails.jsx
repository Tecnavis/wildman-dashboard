import React, { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import OrderDetailsTable from "../components/tables/OrderDetails";
import { Tab, Nav } from "react-bootstrap";
import OrderInformation from "../components/user/tab-panes/OrderInformation";
import axios from "axios";
import { URL } from "../Helper/handle-api";

const StockList = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [cartItems, setCartItems] = useState([]);
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
        setCartItems(bag.products);
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };

    fetchCartItems();
  }, [adminId]);

  return (
    <div className="main-content">
      <div className="row g-4">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Shopping Bag</h5>
              <br />

              <p>
                <b>{cartItems.length} Items</b> in your bag
              </p>
            </div>
            <div className="panel-body">
              <OrderDetailsTable />
              <br />
              <div className="row">
                <br />
                <hr />
                <div className="col-12">
                  <div className="panel">
                    <div className="panel-header">
                      <Nav
                        variant="tabs"
                        activeKey={activeTab}
                        onSelect={handleTabChange}
                        className="btn-box d-flex flex-wrap gap-1"
                      >
                        <Nav.Item>
                          <Nav.Link
                            eventKey="edit"
                            className={`btn btn-sm btn-outline-primary ${
                              activeTab === "edit" ? "active" : ""
                            }`}
                          >
                            Order Details
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <div className="panel-body">
                      <Tab.Content className="profile-edit-tab">
                        <Tab.Pane
                          eventKey="edit"
                          className={`tab-pane ${
                            activeTab === "edit" ? "show active" : ""
                          }`}
                        >
                          {orderDetails ? (
                            <OrderInformation />
                          ) : (
                            <p>Do any order</p>
                          )}
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StockList;
