import axios from "axios";
import { useState, useEffect } from "react";

// const url = "localhost:3001/info";
const baseUrl = "http://localhost:3001/info";

function App() {
  const [about, setAbout] = useState([]);

  useEffect(() => {
    axios.get(baseUrl).then((response) => setAbout(response.data));
  }, []);

  console.log(about);
  return (
    <>
      <div>Hello</div>
      <div>{about?.length ? <p>{about?.length}</p> : ""}</div>
    </>
  );
}

export default App;
