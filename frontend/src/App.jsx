import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/SignIn.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import { useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser.jsx";
import getSuggestedUsers from "./hooks/getSuggestedUsers.jsx";
import getAllPosts from "./hooks/getAllPosts.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Upload from "./pages/Upload.jsx";
import Loops from "./pages/Loops.jsx";
import Story from "./pages/Story.jsx";
import getAllLoops from "./hooks/getAllLoops.jsx";
import getAllStories from "./hooks/getAllStories.jsx";
import Messages from "./pages/Messages.jsx";
import MessageArea from "./pages/MessageArea.jsx";
export const serverUrl = "http://localhost:8080";

function App() {
  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllLoops();
  getAllStories();
  const { userData } = useSelector((state) => state.user);
  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/getProfile/:username"
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/story/:username"
        element={userData ? <Story /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editprofile"
        element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messages"
        element={userData ? <Messages /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/upload"
        element={userData ? <Upload /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/loops"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messageArea"
        element={userData ? <MessageArea /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
}

export default App;
