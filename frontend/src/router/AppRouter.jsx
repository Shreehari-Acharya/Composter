import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Pages
import LandingPage from "../pages/LandingPage.jsx";
import DocsLayout from "../components/layout/DocsLayout.jsx";
import Intro from "../pages/docs/Intro.jsx";
import Installation from "../pages/docs/Installation.jsx";
import CLI from "../pages/docs/CLI.jsx";
import Manual from "../pages/docs/Manual.jsx";

import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import DashboardHome from "../pages/Dashboard/DashboardHome.jsx";
import ComponentsList from "../pages/Dashboard/ComponentsList.jsx";
import ComponentDetail from "../pages/Dashboard/ComponentDetail.jsx";
import UploadComponent from "../pages/Dashboard/UploadComponent.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*Public Routes*/}
        <Route path="/" element={<LandingPage />} />
        
        {/* Docs Section */}
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Intro />} />
          <Route path="installation" element={<Installation />} />
          <Route path="cli" element={<CLI />} />
          <Route path="manual" element={<Manual />} />
        </Route>

        {/*Dashboard Routes*/}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="components" element={<ComponentsList />} />
          <Route path="components/:id" element={<ComponentDetail />} />
          <Route path="upload" element={<UploadComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
