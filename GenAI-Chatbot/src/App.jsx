import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([])
  const supriseOptions = [
    "What is the biggest planet in the Solar system?",
    "Are aliens real?",
    "who is the greatest batsman of all time?"
  ]

  const suprise = () => {
    const randomValue = supriseOptions[Math.floor(Math.random() * supriseOptions.length)]
    setValue(randomValue);
  }

  const getResponse = async () => {
    if(!value){
      setError("Please ask a question!");
      return;
    }
    try{
      const options = {
        method: 'POST',
        body : JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-type': 'application/json'
        }
      } 

      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      setChatHistory(oldChatHistory => [...oldChatHistory, 
        {
          role: 'user',
          parts: value
        },
        {
          role: 'model',
          parts: data
        }
    ]);
    setValue("");

    }
    catch (error){
      console.error(error);
      setError("Something went wrong please try again!");

    }
  }

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  }

  return(
      <div className="app">
        <div>
          <p className="model-title">Chat with <span className="genai-title">GenAI</span></p>
        </div>
        <p className="question">What do you want to know? 
          <button className="suprise" onClick={suprise} disabled={!chatHistory}>Suprise Me</button>
        </p>
        <div className="input-container">
          <input 
            value={value}
            placeholder="eg. Who won the most amount of Bahrat Ratna Awards?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => <div key={_index}>
            <p className="answer"><span class="role">{chatItem.role}</span> : {chatItem.parts}</p>
          </div>)}  
        </div>
      </div>

  );

} 



export default App;