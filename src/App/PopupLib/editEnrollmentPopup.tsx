import React from 'react'
import './editEnrollmentPopup.scss'
import popup from '../../Popup/popup'
import editStudentPopup from './editStudentPopup'




function validateName(input: string): boolean {
    if (input.trim().length === 0) { return false }
    if (input.length > 25) { return false }

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

function trigger(student_id: number, class_id: number) {
    return new Promise<void>((resolve, reject) => {

        const content =
            <div className='edit_enrollment_popup'>
                <h1>Edit Enrollment</h1>
                <div className='button_container'>
                    <button onClick={handleRemove} className='delete'>Remove From Class</button>
                    <button onClick={handleEdit}>Edit Student</button>
                </div>
            </div>

        popup.triggerPopup(content, null, () => reject("editEnrollmentPopup closed by user"))
 
        function handleRemove() {
            popup.triggerPopup(
                <div className='delete_confirm'>
                    <h3>Are you sure you'd like to remove this student from this class?</h3>
                    <p>This will delete all of their current grades for this class!</p>
                    <div className='button_container'>
                        <button onClick={handleDeny}>No, take me back</button>
                        <button onClick={handleConfirm} className='delete'>Yes, remove</button>
                    </div>
                </div>
            , "warning")

            function handleDeny() {
                popup.closePopup()
                trigger(student_id, class_id)
            }
            function handleConfirm(){ 
                window.enrollment.deleteEnrollment(class_id, student_id)
                    .then(() => {
                        popup.closePopup()
                        resolve()
                    })
            }
        }

        function handleEdit() {
            editStudentPopup.trigger(student_id)
                .then(() => {
                    resolve()
                })
                .catch (() => {
                    reject()
                })
        }
        
    })
}

declare global {

    interface EditEnrollment_exports {
    
        /**
         * Triggers a popup to edit a student's enrollment.
         * @returns A promise that resolves if changes are made, or rejects otherwise.
         */
        trigger: (student_id: number, class_id: number) => Promise<void>
    }
}
export default {
    trigger
} as EditEnrollment_exports
