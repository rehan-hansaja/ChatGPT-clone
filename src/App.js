import { useState, useEffect } from "react"

// Define the main component of the application
const App = () => {
  // Define state variables using the useState hook
  const [value, setValue] = useState(null)   // Input value
  const [message, setMessage] = useState(null)   // Response message from server
  const [previousChats, setPreviousChats] = useState([])   // Array to store previous chats
  const [currentTitle, setCurrentTitle] = useState(null)   // Title of the current chat

  // Function to create a new chat session
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  // Function to handle clicks on chat titles in the sidebar
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  // Function to send user input to the server and receive a response
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch("http://localhost:8000/completions", options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

  // useEffect hook to update previousChats and currentTitle when message or currentTitle changes
  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  // Filter current chat messages based on the currentTitle
  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

  // Extract unique chat titles from previousChats
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title.split('\n')[0])))

  // Render the application UI
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Rehan Hansaja</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>CloneGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-secton">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">A Clone Version of ChatGPT 3.5 in 2023. Free Research Preview. ChatGPT can make mistakes. Consider checking important information.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
