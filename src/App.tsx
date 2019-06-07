import React from 'react';
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import firebase from 'firebase'
import Calendar from './components/calendar'
import './App.css';
import {db_config} from './config'


const App: React.FC = () => {
  return (
    <FirebaseDatabaseProvider firebase={firebase} {...db_config}>
      <Calendar></Calendar>
    </FirebaseDatabaseProvider>  
  );
}

export default App;
