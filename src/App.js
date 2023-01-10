import "./App.css";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";
import { Navigation } from "./components/Navigation";
import { Landing } from "./Pages/Landing";
import { Dashboard } from "./Pages/Dashboard";


function App() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <Navigation />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="landing" element={<Landing />} />
        <Route element={<ProtectedRoute isAllowed={!!user && !loading} />}>
          <Route path="me" element={<h1>My Profile</h1>} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        {/* <Route
        path="analytics"
        element={
          <ProtectedRoute
            redirectPath="/home"
            isAllowed={!!user && user.permissions.includes("analyze")}
          >
            <h1>Analitics</h1>
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute
            redirectPath="/home"
            isAllowed={!!user && user.roles.includes("admin")}
          >
            <h1>Admin</h1>
          </ProtectedRoute>
        }
      /> */}
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </>
  );
}

function ProtectedRoute({ isAllowed, redirectPath = "/landing", children }) {
  const location = useLocation();
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}

export default App;
