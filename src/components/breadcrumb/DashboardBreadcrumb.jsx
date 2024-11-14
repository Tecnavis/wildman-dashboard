import React, { useContext, useEffect, useRef } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DigiContext } from '../../context/DigiContext';

const DashboardBreadcrumb = ({ title }) => {
  const { setShowDatePicker } = useContext(DigiContext);
  const ref = useRef(null);

  // This function will be called when a click happens outside the component
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  // Use the useEffect hook to attach the event listener on component mount
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Function to format the current date and time
  const formatDateTime = (date) => {
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    return `${formattedDate} ${formattedTime}`;
  };

  // Get the current date and time
  const currentDate = new Date();

  return (
    <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
      <h2>{title}</h2>
      <div className="input-group dashboard-filter" ref={ref}>
        <input
          style={{ borderRightWidth: 1 }}
          type="text"
          className="form-control"
          name="basic"
          id="dashboardFilter"
          placeholder={formatDateTime(currentDate)} 
          readOnly
        />
      </div>
    </div>
  );
};

export default DashboardBreadcrumb;
