import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SignUp from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import User from "./pages/User";
import MyProfile from "./pages/MyProfile";
import FriendList from "./pages/FriendList";
import SwapRequests from "./pages/SwapRequests";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin"
import NotFound from "./pages/NotFound"
let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile/:username",
    element: 
    <ProtectedRoute>
        <User />
    </ProtectedRoute>,
  },
  {
    path: "/my-profile",
    element: 
    <ProtectedRoute>
        <MyProfile />
    </ProtectedRoute>,
  },
  {
    path: "/friends",
    element: 
    <ProtectedRoute>
        <FriendList />
    </ProtectedRoute>,
  },
  {
    path: "/swap-requests",
    element: 
    <ProtectedRoute>
        <SwapRequests />
    </ProtectedRoute>,
  },
  {
    path: "/dashboard",
    element: 
    <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>
  },
  {
    path: "/admin",
    element: 
    <ProtectedRoute restrictedRoles={ ["user"] } >
        <Admin />
    </ProtectedRoute>
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ToastContainer />
    </div>
  )
}
export default App
