import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import React, { useEffect, useState } from 'react'
import Couponcreate from "./couponcreate"
import { fetchCoupons ,deleteCoupon} from '../../Helper/handle-api'

const CustomizedDataTableSection = () => {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
      fetchCoupons()
        .then((res) => {
          setCoupons(res || []);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setCoupons([]);
        });
    })
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
                            {coupons.map((coupon) => (
                                <tr key={coupon.id}>
                                    <td>
                                        <div className="table-product-card">
                                            <div className="part-img" style={{height: '80px', width: '80px'}}>
                                                <img src="assets/images/coupon.jpg" alt="Image"/>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{coupon.code}</td>
                                    <td>{coupon.discount}</td>
                                    <td>{coupon.expirationDate}</td>
                                    <td>{coupon.status}</td>
                                    <td>
                                        <div className="btn-box" >
                                            <button style={{border: 'none',backgroundColor: 'transparent'}}><i className="fa-light fa-eye"></i></button>
                                            <button style={{border: 'none',backgroundColor: 'transparent'}}><i className="fa-light fa-pen"></i></button>
                                            <button style={{border: 'none',backgroundColor: 'transparent'}} onClick={() => deleteCoupon(coupon._id)}><i className="fa-light fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </OverlayScrollbarsComponent>       
            </div>
        </div>
    </div>
  )
}

export default CustomizedDataTableSection