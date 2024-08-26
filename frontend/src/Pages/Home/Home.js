import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';


function Home() {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [cheaters, setCheaters] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const url=process.env.REACT_APP_URL;
  console.log(url)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("API Key:", apiKey);
    console.log("Secret Key:", secretKey);

    setLoading(true); // Set loading to true when the request starts

    try {

      const response = await axios.post(`${url}/getcheaters`, {
        apikey: apiKey,
        secretkey: secretKey,
      });

      const data = response.data;

      if (data.success) {
        setCheaters(data.cheaters);
        console.log("Cheaters List:", data.cheaters);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CF COP</h1>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="apiKey">API Key:</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="secretKey">Secret Key:</label>
            <input
              type="password"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Test</button>
        </form>
        <p >Steps On how to get your own api key and secret key <a href="/help">Click Here</a></p>
        {loading && (
          <div className="loading-spinner">
            <h5>Fetching...</h5>
          </div>
        )}

        {!loading && cheaters.length > 0 && (
          <div className="cheaters-list">
            <h2>Cheaters Detected:</h2>
            <table border={10}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Contest IDs</th>
                </tr>
              </thead>
              <tbody>
                {cheaters.map((cheater, index) => (
                  <tr key={index}>
                    <td>
                      <a
                        href={`https://codeforces.com/profile/${cheater.cheaterName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cheater.cheaterName}
                      </a>
                    </td>
                    <td>
                      {cheater.contests.map((contestId, contestIndex) => (
                        <span key={contestIndex}>
                          <a
                            href={`https://codeforces.com/contest/${contestId}/standings/friends/true`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {contestId}
                          </a>
                          {contestIndex < cheater.contests.length - 1 && ', '}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default Home;
