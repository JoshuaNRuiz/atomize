import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

  const [response, setResponse] = useState("");

  function callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => setResponse(res));
  }

  useEffect(() => {
    callAPI();
  });
  
  return (
    <div className="App">
      <p className="App-intro">{response}</p>
    </div>
  );
}

export default App;
