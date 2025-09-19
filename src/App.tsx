import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import AuthSignIn from "./components/AuthSignIn";
import AuthSignUp from "./components/AuthSignUp";
import Home from "./components/Home";
import Classes from "./components/Classes";
import { ClassesProvider } from "./context/classesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div className="font-Geist">
      <Routes>
        <Route path="/" element={<Authentication />}>
          <Route index element={<Navigate to="signIn" replace />} />
          <Route path="signIn" element={<AuthSignIn />} />
          <Route path="signUp" element={<AuthSignUp />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ClassesProvider>
                <Dashboard />
              </ClassesProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="classes" element={<Classes />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
