// Set up the port number for the server
const PORT = 8000

// Import necessary modules: express for creating the server, cors for handling cross-origin requests, and dotenv for loading environment variables from a .env file
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Create an instance of the Express application
const app = express()

// Use middleware to parse JSON requests and enable CORS
app.use(express.json())
app.use(cors())

// Retrieve the API key from the environment variables
const API_KEY = process.env.API_KEY

// Define a route to handle POST requests to endpoint
app.post('/completions', async (req,res)=>{
    // Define options for the HTTP request to OpenAI's API
    const options ={
        method:"POST",
        headers:{
            "Authorization":`Bearer ${API_KEY}`,     // Include the API key in the Authorization header
            "Content-Type":"application/json"       // Specify the content type as JSON
        },
        // Construct the request body with the model name, user message, and maximum number of tokens
        body:JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role:"user", content:req.body.message}],
            max_tokens: 1000,
        })
    }

    try{
        // Send the HTTP request to OpenAI's API to generate completions
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()    // Parse the JSON response from the API
        res.send(data)                        // Send the response data back to the client
    } catch(error){
        console.error(error)            // Handle any errors that occur during the request
    }
})

// Start the server and listen on the specified port
app.listen(PORT,()=> console.log("Your Server is running on PORT "+PORT))
