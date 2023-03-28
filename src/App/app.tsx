import React from 'react'



export default function App() {

    // An example of a function that uses the ipc context bridge.
    // This function, example(), is running from the main file, and has access to node modules.
    window.api.example().then(result => {
        console.log(result)
    })
    
    return (
        <div>👋 Hello from React!</div>
    )
}