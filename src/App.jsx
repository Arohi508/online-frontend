import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateExam from "./pages/CreateExam";
import ExamPage from "./pages/ExamPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Result from "./pages/Result";
import AdminRoute from "./components/AdminRoute";
import StudentResults from "./pages/StudentResults";
import Instructions from "./pages/Instructions";
import ManageQuestions from "./pages/ManageQuestions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/create-exam"
  element={
    <AdminRoute>
      <CreateExam />
    </AdminRoute>
  }
/>

<Route
  path="/results"
  element={
    <AdminRoute>
      <StudentResults />
    </AdminRoute>
  }
/>

<Route
  path="/manage-questions/:examId"
  element={
    <AdminRoute>
      <ManageQuestions />
    </AdminRoute>
  }
/>

        <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/instructions"
  element={
    <ProtectedRoute>
      <Instructions />
    </ProtectedRoute>
  }
/>

        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;