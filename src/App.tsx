import React from 'react';
import logo from './logo.svg';
import './App.css';
import {StorageProvider} from "./storage/StorageProvider";
import {Person} from "./app/models/Person";
import {ListController} from "./app/ListController";
import 'bootstrap-scss/bootstrap.scss';

function App() {
  return (
    <div className="App">
      <StorageProvider decoder={(input:any)=>new Person(input)}>
          <ListController/>
      </StorageProvider>
    </div>
  );
}

export default App;
