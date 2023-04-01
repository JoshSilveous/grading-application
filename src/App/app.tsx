import React from 'react'



export default function App() {

    // An example of a function that uses the ipc context bridge.
    // This function, example(), is running from the main file, and has access to node modules.
    
    async function testdb() {
        await window.api.dbtest()
        console.log(await window.class.getClassData(4))
        let newassignment = await window.assignment.createAssignment(4, "test asg", "testy", "HOMEWORK", false, 69)
        console.log('assignment', newassignment, 'added')
        console.log(await window.class.getClassData(4))
        await window.enrollment.addEnrollment(4, 1)
        console.log('student 1 added')
        console.log(await window.class.getClassData(4))
    }

    testdb()

    return (
        <div>👋 Hello from React!</div>
    )
}