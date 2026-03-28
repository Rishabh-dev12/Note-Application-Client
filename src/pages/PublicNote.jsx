// src/pages/PublicNote.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PublicNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/public/${token}`)
      .then(res => setNote(res.data));
  }, []);

  return <div>{note?.content}</div>;
}