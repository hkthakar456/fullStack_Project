import { BrowserRouter, Routes, Route } from "react-router";

import AppLayout from "../layouts/AppLayout/AppLayout";
import WatchLayout from "../layouts/WatchLayout/WatchLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Watch from "../pages/Watch/Watch";
import Search from "../pages/Search/Search";
import History from "../pages/History/History";
import Channel from "../pages/Channel/Channel";
import Studio from "../pages/Studio/Studio";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main application routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/channel/:username" element={<Channel />} />

          {/* Protected main routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/history" element={<History />} />
            {/* <Route path="/account" element={<Account />} /> */}
            {/* <Route path="/settings" element={<Settings />} /> */}

            {/* Studio — temporary route until StudioLayout is built */}
            <Route path="/studio" element={<Studio />} />

          </Route>

        </Route>

        {/* Watch route */}
        <Route element={<WatchLayout />}>
          <Route path="/watch/:videoId" element={<Watch />} />
        </Route>

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;