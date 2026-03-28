import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

const Editor = ({ noteId }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit("join-note", noteId);

    socket.on("receive-changes", (data) => {
      setContent(data);
    });
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);

    socket.emit("edit-note", {
      noteId,
      content: e.target.value,
    });
  };

  return (
    <textarea value={content} onChange={handleChange} />
  );
};

export default Editor;