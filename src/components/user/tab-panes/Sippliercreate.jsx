import React from 'react';
import { useForm } from '../../../Helper/useForm';
import { createWarehouse, createSupplier } from '../../../Helper/handle-api';
import Swal from 'sweetalert2';

const Suppliercreate = () => {
    const [values, handleChange] = useForm({
        name: '',
        email: '',
        warehouse: '',
        phone: '',
        address: '',
        date: '',
    });

    const [datas, handleChanges] = useForm({
        name: '',
        email: '',
        shop: '',
        phone: '',
        address: '',
        item: '',
    });

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate phone number format (for example, 10 digits)
    const validatePhone = (phone) => {
        const regex = /^\d{10}$/;
        return regex.test(phone);
    };

    // Handle form submission for creating warehouse
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!values.warehouse || !values.name || !values.email || !values.phone || !values.address || !values.date) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        if (!validateEmail(values.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        if (!validatePhone(values.phone)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a valid phone number (10 digits).',
            });
            return;
        }

        try {
            await createWarehouse(values);
            Swal.fire({
                icon: 'success',
                title: 'Warehouse created successfully',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error creating warehouse:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while creating the warehouse. Please try again.',
            });
        }
    };

    // Handle form submission for creating Supplier
    const handleCreate = async (e) => {
        e.preventDefault();
        // Validation checks
        if (!datas.shop || !datas.name || !datas.email || !datas.phone || !datas.address || !datas.item) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        if (!validateEmail(datas.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        if (!validatePhone(datas.phone)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a valid phone number (10 digits).',
            });
            return;
        }

        try {
            await createSupplier(datas);
            Swal.fire({
                icon: 'success',
                title: 'Supplier created successfully',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error creating supplier:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Do not use Existing Email or Phone. Please try again.',
            });
        }
    };

    return (
        <form>
            <div className="profile-edit-tab-title">
                <h6>Suppliers Information</h6>
            </div>
            <div className="private-information mb-30">
                <div className="row g-3">
                    <div className="col-md-4 col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-shop" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Shop Name"
                                value={datas.shop}
                                onChange={handleChanges}
                                name="shop"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text">
                                <i className="fa-light fa-user-tie" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={datas.name}
                                onChange={handleChanges}
                                name="name"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text">
                                <i className="fa-light fa-circle-check" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Item"
                                value={datas.item}
                                onChange={handleChanges}
                                name="item"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-envelope" />
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={datas.email}
                                onChange={handleChanges}
                                name="email"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-phone" />
                            </span>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Phone"
                                value={datas.phone}
                                onChange={handleChanges}
                                name="phone"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-location-dot" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Address"
                                value={datas.address}
                                onChange={handleChanges}
                                name="address"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <button type="submit" className="btn btn-primary" onClick={handleCreate}>
                            Save Supplier Information
                        </button>
                    </div>
                </div>
                <br />
            </div>
            {/* Warehouse create */}
            <div className="profile-edit-tab-title">
                <h6>Warehouse Information</h6>
            </div>
            <div className="social-information">
                <div className="row g-3">
                    <div className="col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-home" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Warehouse Name"
                                name='warehouse'
                                onChange={handleChange}
                                value={values.warehouse}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-envelope" />
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={values.email}
                                name='email'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-phone" />
                            </span>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Phone"
                                value={values.phone}
                                name='phone'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-location-dot" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Address"
                                value={values.address}
                                name='address'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-user-tie" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Manager Name"
                                value={values.name}
                                name='name'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-light fa-calendar" />
                            </span>
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Date"
                                value={values.date}
                                name='date'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                            Save Warehouse Information
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Suppliercreate;
