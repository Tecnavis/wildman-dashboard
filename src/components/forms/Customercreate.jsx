import React, { useState } from "react";
import { createCustomer } from "../../Helper/handle-api";
import { useForm } from "../../Helper/useForm";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

const CustomerCreate = () => {
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    phone: "",
    shopname: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const customer = {
      ...values,
    };

    try {
      await createCustomer(customer);
      Swal.fire({
        icon: "success",
        title: "Customer created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      setError("Failed to create customer. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create customer. Please try again.",
      });
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="panel">
        <div
          className="panel-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <h5>Create Customer</h5>
          </div>
          <Button
            className="btn btn-sm btn-primary"
            onClick={() => (window.location.href = "/allCustomer")}
          >
            All Customers
          </Button>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Your Name*"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                  required
                />
              </div>
              <div className="col-sm-6">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Your Email*"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  required
                />
              </div>
              <div className="col-sm-6">
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  placeholder="Your Phone*"
                  name="phone"
                  onChange={handleChange}
                  value={values.phone}
                  required
                />
              </div>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Your Shopname*"
                  name="shopname"
                  onChange={handleChange}
                  value={values.shopname}
                  required
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  rows="8"
                  placeholder="Your Address*"
                  name="address"
                  onChange={handleChange}
                  value={values.address}
                  required
                ></textarea>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <div className="col-12 text-end">
                <button
                  className="btn btn-sm btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreate;
