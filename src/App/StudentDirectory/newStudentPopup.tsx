import React from 'react'
import './newStudentPopup.scss'
import popup from '../../Popup/popup'




function validateName(input: string): boolean {
    if ( input.trim().length === 0 ) { return false }
    if ( input.length > 25 ) { return false }

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if ( bannedCharacters.some(char => input.includes(char)) ){ return false }

    return true

}

function triggerNewStudentPopup() {
    return new Promise<number>((resolve, reject) => {

        const content =
            <div className='new_student_popup'>
                <h1>Create A New Student</h1>
                <p className='error_message'></p>
                <div className='field_container'>
                    <label htmlFor='first_name'>First Name:</label>
                    <input type='text' id='first_name' maxLength={25}></input>
                </div>
                <div className='field_container'>
                    <label htmlFor='last_name'>Last Name:</label>
                    <input type='text' id='last_name' maxLength={25}></input>
                </div>
                <button onClick={handleCreate}>Create</button>
            </div>

        popup.triggerPopup(content, null, () => reject("newStudentPopup closed by user"))
 
        function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
            const buttonNode = e.target as HTMLButtonElement
        
            const errorNode = buttonNode.parentElement.childNodes[1] as HTMLParagraphElement
        
            const inputFirstNameNode = buttonNode.parentElement.childNodes[2].childNodes[1] as HTMLInputElement
            const inputLastNameNode = buttonNode.parentElement.childNodes[3].childNodes[1] as HTMLInputElement
            const inputFirstNameValue = inputFirstNameNode.value
            const inputLastNameValue = inputLastNameNode.value
        
            console.log(validateName(inputFirstNameValue))
            console.log(inputFirstNameValue)
        
        
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
                popup.closePopup()
                window.student.createStudent(inputFirstNameValue, inputLastNameValue).then(res => {
                    resolve(res)
                })
            }
        }
        
    })
}


interface AddNewStudent_exports {

    /**
     * Triggers a popup to create a new student, creates the student in the DB, and returns the new `student_id`.
     * @returns A promise that resolves with the new student's ID, or `"newStudentPopup closed by user"` if closed without creating a new student.
     */
    triggerNewStudentPopup: () => Promise<number>
}
export default {
    triggerNewStudentPopup
} as AddNewStudent_exports

// this should be structured so that triggerNewStudentPopup() returns the student_id instead as a promise.
// add 25 char limit to input 