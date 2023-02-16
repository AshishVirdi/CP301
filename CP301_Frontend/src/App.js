import Login from "./pages/Login";
import Home from "./pages/Home";
import CourseCatalog from "./pages/CourseCatalog";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<CourseCatalog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
