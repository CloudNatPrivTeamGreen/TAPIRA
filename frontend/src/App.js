import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { DatePicker, message, Input } from 'antd';
import OpenApiList from './components/OpenApiList';
import './App.scss';

const { Search } = Input;

function App() {
  const [currentTime, setCurrentTime] = useState(0); 
  const [date, setDate] = useState(null);

  const handleChange = value => {
    message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setDate(value);
  };

  const onSearch = value => message.info( value ? `Searched for: ${value}` : 'Getting all OpenAPI specs');

  useEffect(() => {
    fetch('/api/time')
    .then(res => res.json())
    .then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="App">
      <h1 className="page-header">
          Search for OpenAPI Specifications
      </h1>
      <div className="content">
        <Search placeholder="input search text" onSearch={onSearch} enterButton style={{ width: 304 }}/>
        <div style={{ margin: '40px 100px' }}>
          <OpenApiList />
        </div>
      </div>
    </div>
  );
}

export default App;
