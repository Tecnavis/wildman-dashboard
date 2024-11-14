import React, { useContext, useState } from 'react';
import { DigiContext } from '../../context/DigiContext';
import { Form } from 'react-bootstrap';

const CompanyHeader = () => {

  return (
    <div className="panel-header">
      <h5>Supplier</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
          <Form.Control type="text" placeholder="Search..."/>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
