import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Editor from "./pages/Editor";
import Search from "./pages/Search";
import PublicNote from "./pages/PublicNote";
import EditorWrapper from "./pages/EditorWrapper";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Notes Dashboard */}
        <Route path="/" element={<Notes />} />
        <Route path="/notes" element={<Notes />} />

        {/* Editor with dynamic noteId */}
        <Route path="/editor/:noteId" element={<EditorWrapper />} />

        {/* Search */}
        <Route path="/search" element={<Search />} />

        {/* Public Share Link */}
        <Route path="/public/:token" element={<PublicNote />} />
      </Routes>
    </Router>
  );
};

export default App;
