import "./App.css";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";

function Landing() {
  const { onLogin } = useAuth();
  return <h1>Landing <button onClick={onLogin}>Klik</button></h1>;
}

function App() {
  const { user, loading } = useAuth();

  console.log(user, "ini", loading)

  if(loading) return <h1>Loading...</h1>

  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="landing" element={<Landing />} />
      <Route element={<ProtectedRoute isAllowed={!!user && !loading} />}>
        <Route path="home" element={<h1>Home</h1>} />
        <Route path="dashboard" element={<h1>Dashboard</h1>} />
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
