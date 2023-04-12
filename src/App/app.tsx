import React from 'react'
import { ClassTable } from './ClassTable/ClassTable'
import './app.scss'



export default function App() {

    // An example of a function that uses the ipc context bridge.
    // This function, example(), is running from the main file, and has access to node modules.
    const [currentClass, setCurrentClass] = React.useState<number>()
    const [classList, setClassList] = React.useState<ClassInfo[]>()
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

    React.useEffect(() => {
        window.class.getClassList()
            .then(res => {
                setClassList(res)
                setCurrentClass(res[0].class_id)
                setIsLoaded(true)
            })
    }, [])
    let optionsDisplay
    if (classList) {
        optionsDisplay = classList.map(cls => {
            return (
                <option value={cls.class_id} key={cls.class_id}>
                    {cls.name}
                </option>
            )
        })
    }

    function handleClassChange(e: React.ChangeEvent<HTMLSelectElement>) {
        console.log(e.target.value)
        setCurrentClass(parseInt(e.target.value))
    }

    return (<>
        {!isLoaded ? <h2>Loading...</h2> : <>
            <div className='classinfo_container'>
                <h2>Current Class: </h2>
                <select onChange={handleClassChange}>
                    {optionsDisplay}
                </select>
            </div>
            
            <ClassTable class_id={currentClass} />
        </>}
    </>)
}