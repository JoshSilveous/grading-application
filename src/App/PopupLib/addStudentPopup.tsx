import React from 'react'
import './addStudentPopup.scss'
import popup from '../../Popup/popup'
import createStudentPopup from './createStudentPopup'




function validateName(input: string): boolean {
    if (input.trim().length === 0) { return false }
    if (input.length > 25) { return false }

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

async function trigger(class_id: number) {

    let studentOptions = await window.class.getStudentsNotInClass(class_id)
    console.log(studentOptions)
    return new Promise<number>((resolve, reject) => {

        const content =
            <div className='add_student_popup'>
                <h1>Add a Student to this class</h1>
                <div className='field_container'>
                    <label htmlFor='first_name'>Add Existing Student:</label>
                    <select>
                        {
                        studentOptions.map(stu => {return (
                                <option key={stu.student_id} value={stu.student_id}>
                                    {stu.first_name} {stu.last_name}
                                </option>
                        )})
                        }
                    </select>
                    <button onClick={handleAddStudent}>Add</button>
                </div>
                
                <h3>- or -</h3>
                <button onClick={handleCreateStudent}>Create a new Student</button>
            </div>

        popup.triggerPopup(content, null, () => reject("addStudentPopup closed by user"))
 
        function handleAddStudent(e: React.MouseEvent<HTMLButtonElement>) {
            const buttonNode = e.target as HTMLButtonElement
            const currentValueNode = buttonNode.parentNode.childNodes[1] as HTMLSelectElement
            const currentValue = parseInt(currentValueNode.value)
            
            popup.closePopup()
            resolve(currentValue)
        }

        function handleCreateStudent() {
            popup.closePopup()
            createStudentPopup.trigger()
                .then(newStudentID => resolve(newStudentID))
                .catch(error => reject(error))
        }


    })
}

declare global {

    interface AddNewStudent_exports {
    
        /**
         * Triggers a popup to create a new student, creates the student in the DB, and returns the new `student_id`.
         * @returns A promise that resolves with the new student's ID, or `"newStudentPopup closed by user"` if closed without creating a new student.
         */
        trigger: (class_id: number) => Promise<number>
    }
}
export default {
    trigger
} as AddNewStudent_exports

// this should be structured so that trigger() returns the student_id instead as a promise.
// add 25 char limit to input 