import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ServiceSpecVersionView = (props) => {
  const params = useParams();

  useEffect(() => {
    console.log('%c checking params', 'color: yellow', params);
  }, [params]);

  return <React.Fragment></React.Fragment>;
};

export default ServiceSpecVersionView;
