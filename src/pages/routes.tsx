import React from 'react';
import { Routes as ContainerRoutes, Route } from 'react-router-dom';

import Customers from './Customers';
import Home from './Home';

export default function Routes() {
  return (
    <ContainerRoutes>
      <Route index element={<Home />} />
      <Route path="/customers" element={<Customers />} />
    </ContainerRoutes>
  );
}
