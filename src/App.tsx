import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages/routes';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
      <ToastContainer theme="colored" autoClose={3000} />
    </BrowserRouter>
  );
}
