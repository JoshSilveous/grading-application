import React from 'react'
import { ClassTable } from './ClassTable/ClassTable'
import './app.scss'
import newClassPopup from './PopupLib/newClassPopup'



export default function App() {

    // An example of a function that uses the ipc context bridge.
    // This function, example(), is running from the main file, and has access to node modules.
    const [currentClass, setCurrentClass] = React.useState<number>()
    const [currentClassInfo, setCurrentClassInfo] = React.useState<ClassInfo>()
    const [classList, setClassList] = React.useState<ClassInfo[]>()
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
    const [newClassCreated, setNewClassCreated] = React.useState<boolean>(false)
    const selectRef = React.useRef<HTMLSelectElement>()

    React.useEffect(() => {
        updateClassList()
    }, [])

    function updateClassList(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.class.getClassList()
                .then(res => {

                    if(res.length === 0) {
                        newClassPopup.trigger()
                            .then(class_id => {
                                updateClassList().then(() => {
                                    setCurrentClass(class_id)
                                    setNewClassCreated(true)
                                    updateClassInfo(class_id)
                                })
                            })
                            .catch(() => {
                                // If user closes out of popup to create FIRST class, exit out of application
                                window.app.closeApp()
                            })
                    }

                    setClassList(res)
                    setCurrentClass(res[0].class_id)
                    setIsLoaded(true)
                    resolve()
                    updateClassInfo(res[0].class_id)
                })
                .catch (() => reject())
        })
    }

    function updateClassInfo(class_id: number) {
        window.class.getClassInfo(class_id)
                .then(res => {
                    console.log('UPDATING AT 1 with', currentClass)
                    setCurrentClassInfo(res)
                })
    }

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

    React.useEffect(() => {
        if (newClassCreated) {
            selectRef.current.selectedIndex = selectRef.current.options.length - 2
            setNewClassCreated(false)
        }
    }, [newClassCreated])

    function handleClassChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectNode = e.target as HTMLSelectElement
        const class_id = selectNode.value
        
        if (class_id === "create_new_class") {
            selectNode.value = currentClass.toString()
            newClassPopup.trigger()
                .then(class_id => {
                    
                    updateClassList().then(() => {
                        setCurrentClass(class_id)
                        console.log('current', selectNode.value, 'new', class_id)
                        selectNode.value = class_id.toString()
                        setNewClassCreated(true)
                        updateClassInfo(class_id)
                    })
                })
        } else {
            setCurrentClass(parseInt(e.target.value))
            updateClassInfo(parseInt(e.target.value))
        }
    }

    function handleDelete() {
        window.class.deleteClass(currentClass)
            .then(() => {
                updateClassList()
            })
    }
    
    

    // descriptionContent defaults to "" if not provided
    let descriptionContent = ""
    if (currentClassInfo) {
        console.log('currentClassInfo found', currentClassInfo)
        if (currentClassInfo.description) {
            console.log('currentClassInfo.description found', currentClassInfo.description)
            descriptionContent = currentClassInfo.description
        } else {
            console.log('currentClassInfo.description not found', currentClassInfo.description)
            descriptionContent = ""
        }
    }
    

    return (<>
        {!isLoaded ? <h2>Loading...</h2> : <>
            <div className='classinfo_container'>
                <h2>Current Class: </h2>
                <select onChange={handleClassChange} ref={selectRef}>
                    {optionsDisplay}
                    <option value="create_new_class">+ Create New Class</option>
                </select>
                <p>{descriptionContent}</p> 
                <button className='delete' onClick={handleDelete}>Delete Class</button>
            </div>
            
            <ClassTable class_id={currentClass} />
        </>}
    </>)
}