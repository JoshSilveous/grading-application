import React from 'react'
import './newStudentPopup.scss'
import popup from '../../Popup/popup'

function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
    const buttonNode = e.target as HTMLButtonElement
    const inputFirstNameNode = buttonNode.parentElement.childNodes[0].childNodes[1] as HTMLInputElement
    const inputLastNameNode = buttonNode.parentElement.childNodes[1].childNodes[1] as HTMLInputElement
    const inputFirstNameValue = inputFirstNameNode.value
    const inputLastNameValue = inputLastNameNode.value


    const firstNameTooLong = inputFirstNameValue.length > 25
    const lastNameTooLong = inputLastNameValue.length > 25

}

function triggerNewStudentPopup() {

    const content =
        <div className='new_student_popup'>
            <h1>Create A New Student</h1>
            <p></p>
            <div className='field_container'>
                <label htmlFor='first_name'>First Name:</label>
                <input type='text' id='first_name'></input>
            </div>
            <div className='field_container'>
                <label htmlFor='last_name'>Last Name:</label>
                <input type='text' id='last_name'></input>
            </div>
            <button onClick={handleCreate}>Create</button>
        </div>

    popup.triggerPopup(content)
}


interface AddNewStudent_exports {

    triggerNewStudentPopup: () => void
}
export default {
    triggerNewStudentPopup
} as AddNewStudent_exports