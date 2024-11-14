import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DigiContext } from '../../context/DigiContext';

const AllCustomerHeader = () => {
    
  return (
    <div className="panel-header">
        <h5>All Customer</h5>
        <div className="btn-box d-flex gap-2">
            <div id="tableSearch">
                <Form.Control type='text' placeholder='Seach...'/>
            </div>  
        </div>
    </div>
  )
}

export default AllCustomerHeader