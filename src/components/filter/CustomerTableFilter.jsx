import React from "react";
import SelectFilter from "../filter/SelectFilter";
import { useNavigate } from "react-router-dom";

const CustomerTableFilter = () => {
  const navigate = useNavigate();
  return (
    <div className="table-filter-option">
      <div className="row g-3">
        <div className="col-xl-10 col-9 col-xs-12">
          <form className="row g-2">
            <div className="col">
              <button
                className="btn btn-sm btn-primary w-100"
                onClick={() => navigate("/purchaseform")}
              >
                NEW PURCHASE
              </button>
            </div>
          </form>
        </div>
        <div className="col-xl-2 col-3 col-xs-12 d-flex justify-content-end">
          <SelectFilter />
        </div>
      </div>
    </div>
  );
};

export default CustomerTableFilter;
