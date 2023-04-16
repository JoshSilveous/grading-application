import React from 'react'
import './editStudentPopup.scss'
import popup from '../../Popup/popup'




function validateName(input: string): boolean {
    if (input.trim().length === 0) { return false }
    if (input.length > 25) { return false }

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

function trigger(student_id: number) {
    
    return new Promise<void>(async (resolve, reject) => {

        try {
            const curStuInfo = await window.student.getStudentInfo(student_id)
            const content =
                <div className='edit_student_popup'>
                    <h1>Edit Student</h1>
                    <p className='error_message'></p>
                    <div className='field_container'>
                        <label htmlFor='first_name'>First Name:</label>
                        <input type='text' id='first_name' maxLength={25} defaultValue={curStuInfo.first_name}></input>
                    </div>
                    <div className='field_container'>
                        <label htmlFor='last_name'>Last Name:</label>
                        <input type='text' id='last_name' maxLength={25} defaultValue={curStuInfo.last_name}></input>
                    </div>
                    <div className='button_container'>
                        <button onClick={handleDelete} className='delete'>Delete Student</button>
                        <button onClick={handleCreate}>Save</button>

                    </div>
                </div>
    
            popup.triggerPopup(content, null, () => reject("editStudentPopup closed by user"))
     
            function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
                const buttonNode = e.target as HTMLButtonElement
            
                const errorNode = buttonNode.parentElement.parentElement.childNodes[1] as HTMLParagraphElement
            
                const inputFirstNameNode = buttonNode.parentElement.parentElement.childNodes[2].childNodes[1] as HTMLInputElement
                const inputLastNameNode = buttonNode.parentElement.parentElement.childNodes[3].childNodes[1] as HTMLInputElement
                const inputFirstNameValue = inputFirstNameNode.value
                const inputLastNameValue = inputLastNameNode.value
            
            
            
                const firstNameIsValid = validateName(inputFirstNameValue)
                const lastNameIsValid = validateName(inputLastNameValue)
                if (!firstNameIsValid || !lastNameIsValid) {
            
                    errorNode.innerText = 
                        "Incorrect input detected. Each field must be less than 25 characters, and must not contain banned characters."
            
                    if (!firstNameIsValid) {
                        inputFirstNameNode.className = 'error'
                    } else {
                        inputFirstNameNode.className = ''
                    }
            
                    if (!lastNameIsValid) {
                        inputLastNameNode.className = 'error'
                    } else {
                        inputLastNameNode.className = ''
                    }
                } else {

                    // check if changes were made
                    if (inputFirstNameValue !== curStuInfo.first_name || inputLastNameValue !== curStuInfo.last_name) {
                        popup.closePopup()
                        window.student.editStudent(student_id, inputFirstNameValue, inputLastNameValue).then(() => {
                            resolve()
                        })
                    } else {
                        reject()
                    }

                }
            }

            function handleDelete() {
                popup.triggerPopup(
                    <div className='delete_confirm'>
                        <h3>Are you sure you'd like to delete this student?</h3>
                        <div className='button_container'>
                            <button onClick={handleDeny}>No, take me back</button>
                            <button onClick={handleConfirm} className='delete'>Yes, delete</button>
                        </div>
                    </div>
                , "warning")
    
                function handleDeny() {
                    popup.closePopup()
                    trigger(student_id)
                }
                function handleConfirm(){ 
                    window.student.deleteStudent(student_id)
                        .then(() => {
                            popup.closePopup()
                            resolve()
                        })
                }
            }
        } catch {
            reject(`error occured, can not retrieve StudentInfo for student_id = ${student_id}`)
        }


        
    })
}

declare global {

    interface EditStudent_exports {
    
        /**
         * Triggers a popup to edit a student's name.
         * @returns A promise that resolves if changes are made, and rejects if not.
         */
        trigger: (student_id: number) => Promise<void>
    }
}
export default {
    trigger
} as EditStudent_exports

// this should be structured so that trigger() returns the student_id instead as a promise.
// add 25 char limit to input 