import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import AuthSignIn from "./components/AuthSignIn";
import AuthSignUp from "./components/AuthSignUp";
import Home from "./components/Home";
import Classes from "./components/Classes";
import { ClassesProvider } from "./context/classesContext";
// import { createClient } from "@supabase/supabase-js";

function App() {
  // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

  // const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // async function deleteSupabaseUser(userId: string) {
  //   const { data, error } = await supabase.auth.admin.deleteUser(userId);

  //   if (error) {
  //     console.error("Error deleting user:", error.message);
  //     return { success: false, error: error.message };
  //   } else {
  //     console.log("User deleted successfully:", data);
  //     return { success: true, data };
  //   }
  // }
  // deleteSupabaseUser("b6aeac33-6eb3-4199-a54c-70ab4f908d00");

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
            <ClassesProvider>
              <Dashboard />
            </ClassesProvider>
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
