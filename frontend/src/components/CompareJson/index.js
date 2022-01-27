import React from 'react';
import ReactJsonViewCompare from 'react-json-view-compare';

const CompareJson = ({ oldData, newData }) => {
  return <ReactJsonViewCompare oldData={oldData} newData={newData} />;
}

export default CompareJson;