import './App.css'
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ApplyPage from "./pages/ApplyPage.tsx";
import {NotificationGetPage} from "./pages/NotificationGetPage.tsx";

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="notification-get" element={<NotificationGetPage />} />
        </Routes>
    </>
  )
}

export default App
