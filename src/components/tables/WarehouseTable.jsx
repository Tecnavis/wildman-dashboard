import React from "react";
import Footer from "../footer/Footer";
import WarehouseTable from "./AllwarehouseTable";
import { Form } from "react-bootstrap";
import SelectFilter from "../filter/SelectFilter";
import { useNavigate } from "react-router-dom";

const Warehouse = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/createform");
  };
  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Warehouse</h5>
              <div className="btn-box d-flex gap-2">
                <div id="tableSearch">
                  <Form.Control type="text" placeholder="Search..." />
                </div>
              </div>
            </div>
            <div className="panel-body">
              <div className="table-filter-option">
                <div className="row g-3">
                  <div className="col-xl-10 col-9 col-xs-12">
                    <div className="row g-3">
                      <div className="col">
                        <form className="row g-2">
                          <div className="col">
                            <button
                              className="btn btn-sm btn-primary w-100"
                              onClick={handleClick}
                            >
                              NEW WAREHOUSE
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-3 col-xs-12 d-flex justify-content-end">
                    <SelectFilter />
                  </div>
                </div>
              </div>
              <WarehouseTable />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Warehouse;
