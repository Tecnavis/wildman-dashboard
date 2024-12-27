import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import React from 'react'
import Couponcreate from "./couponcreate"

const CustomizedDataTableSection = () => {
  return (
    <div className="col-12">
        <div className="card">
            <div className="card-body">
                <Couponcreate/>
                <OverlayScrollbarsComponent>
                    <table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>CODE</th>
                                <th>Discount</th>
                                <th>Expire</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="table-product-card">
                                        <div className="part-img" style={{height: '80px', width: '80px'}}>
                                            <img src="assets/images/product-img-3.jpg" alt="Image"/>
                                        </div>
                                    </div>
                                </td>
                                <td>CSJ0158</td>
                                <td>12</td>
                                <td>$560</td>
                                <td>12/24/2023 01:05 PM</td>
                                <td>
                                    <div className="btn-box">
                                        <button><i className="fa-light fa-eye"></i></button>
                                        <button><i className="fa-light fa-pen"></i></button>
                                        <button><i className="fa-light fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </OverlayScrollbarsComponent>       
            </div>
        </div>
    </div>
  )
}

export default CustomizedDataTableSection