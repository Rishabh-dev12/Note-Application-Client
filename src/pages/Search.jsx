// src/pages/Search.jsx
import { useState } from "react";
import axios from "axios";
import { endpoints } from "../services/endpoint";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await networkRequest().post(`${endpoints.SEARCH}/?q=${q}`, {
      headers: { authorization: localStorage.getItem("token") },
    });

    setResults(res.data);
  };

  return (
    <div>
      <input onChange={(e) => setQ(e.target.value)} />
      <button onClick={search}>Search</button>

      {results.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  );
}
