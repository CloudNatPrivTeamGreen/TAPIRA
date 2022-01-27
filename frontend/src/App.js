import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { DatePicker, message, Input } from 'antd';
import OpenApiList from './components/OpenApiList';
import CompareJson from './components/CompareJson';
import './App.scss';

const { Search } = Input;

const oldData = {
  name: 'super',
  age: 18,
  task: [
    { name: 'eat', time: '09:00' },
    { name: 'work', time: '10:00' },
    { name: 'sleep', time: '22:00' }
  ]
};
const newData = {
  name: 'coolapt',
  age: 20,
  task: [
    { name: 'eat', time: '09:00' },
    { name: 'work', time: '10:00' },
    { name: 'sleep', time: '23:00' },
    { name: 'running', time: '08:00' }
  ]
};

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
        <div style={{ margin: '40px 60px' }}>
          <CompareJson oldData={oldData} newData={newData} />
        </div>
        <p>The Current time is {currentTime} </p>
      </div>
    </div>
  );
}

export default App;
