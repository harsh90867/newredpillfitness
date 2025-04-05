import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./ResetPasswordPage";
import Home from "./Home";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reset_password" element={<ResetPasswordPage />} />
            </Routes>
        </Router>
    );
}

export default App;
