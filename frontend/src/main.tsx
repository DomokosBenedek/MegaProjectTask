import React from 'react';
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import Kezdolap from './components/kezdolap';
import TelephoneSearch from './components/TelephoneSearch';
import TelephoneModification from './components/TelephoneModification';
import TelephoneList from './components/TelephoneList';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Kezdolap />,
  },
  {
    path: "/telephoneList",
    element: <TelephoneList />,
  },
  {
    path: "/telephoneModification",
    element: <TelephoneModification />,
  },

  {
    path: "/telephoneSearch",
    element: <TelephoneSearch />,
  },
]);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
