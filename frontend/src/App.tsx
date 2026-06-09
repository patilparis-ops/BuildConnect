
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import PreviewPage from "./pages/PreviewPage";
import HistoryPage from "./pages/History";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Main Workspace */}
        <Route path="/workspace" element={<Workspace />} />

        {/* Preview Page with Dynamic Project ID */}
        <Route
          path="/preview/:projectId"
          element={<PreviewPage />}
        />

        {/* Project History */}
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

