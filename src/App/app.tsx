import React from 'react'
import { ClassTable } from './ClassTable/ClassTable'
import './app.scss'
import newClassPopup from './PopupLib/newClassPopup'
import popup from '../Popup/popup'
import studentManagerPopup from './PopupLib/studentManagerPopup'



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
        popup.triggerPopup(
            <div className='delete_confirm'>
                <h3>Are you sure you'd like to delete this class?</h3>
                <div className='button_container'>
                    <button onClick={handleDeny}>No, take me back</button>
                    <button onClick={handleConfirm} className='delete'>Yes, delete</button>
                </div>
            </div>
        , "warning")

        function handleDeny() {
            popup.closePopup()
        }
        function handleConfirm(){ 
            window.class.deleteClass(currentClass)
                .then(() => {
                    popup.closePopup()
                    selectRef.current.selectedIndex = 0
                    updateClassList()
                    setCurrentClass(parseInt(selectRef.current.value))
                })
        }
    }
    
    

    // descriptionContent defaults to "" if not provided
    let descriptionContent = ""
    if (currentClassInfo) {
        if (currentClassInfo.description) {
            descriptionContent = currentClassInfo.description
        } else {
            descriptionContent = ""
        }
    }
    
    function handleStudentManager() {
        studentManagerPopup.trigger()
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
                <button className='student_manager' onClick={handleStudentManager}>Student Manager</button>
            </div>
            
            <ClassTable class_id={currentClass} />
        </>}
    </>)
}