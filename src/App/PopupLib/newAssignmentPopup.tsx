import React from 'react'
import './newAssignmentPopup.scss'
import popup from '../../Popup/popup'




function validateInput(input: string, maxLength: number): boolean {
    if (input.trim().length === 0) { return false }
    if (input.length > maxLength) { return false }

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

function trigger(class_id: number) {
    return new Promise<number>((resolve, reject) => {

        const content =
            <div className='new_student_popup'>
                <h1>Create A New Assignment</h1>
                <p className='error_message'></p>

                <div className='field_container'>
                    <label htmlFor='name'>Name:</label>
                    <input type='text' id='name' maxLength={50}></input>
                </div>
                <div className='field_container'>
                    <label htmlFor='description'>Description:</label>
                    <input type='text' id='description' maxLength={200}></input>
                </div>
                <div className='field_container'>
                    <label htmlFor='HOMEWORK'>Homework</label>
                    <input type='radio' name='type' id='HOMEWORK'></input>
                    <label htmlFor='TEST'>Test</label>
                    <input type='radio' name='type' id='TEST'></input>
                </div>
                <div className='field_container'>
                    <label htmlFor='is_extra_credit'>Extra Credit:</label>
                    <input type='checkbox' id='is_extra_credit'></input>
                </div>
                <div className='field_container'>
                    <label htmlFor='max_points'>Maximum Points:</label>
                    <input type='number' id='max_points'></input>
                </div>


                <button onClick={handleCreate}>Create</button>
            </div>

        popup.triggerPopup(content, null, () => reject("newAssignmentPopup closed by user"))
 
        function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
            const buttonNode = e.target as HTMLButtonElement
        
            const errorNode = buttonNode.parentElement.childNodes[1] as HTMLParagraphElement
        
            const inputNameNode = buttonNode.parentElement.childNodes[2].childNodes[1] as HTMLInputElement
            const inputName: string = inputNameNode.value

            const inputDescriptionNode = buttonNode.parentElement.childNodes[3].childNodes[1] as HTMLInputElement
            const inputDescription: string = inputDescriptionNode.value

            const inputTypeHomeworkNode = buttonNode.parentElement.childNodes[4].childNodes[1] as HTMLInputElement
            const inputTypeIsHomework: boolean = inputTypeHomeworkNode.checked

            const inputTypeTestNode = buttonNode.parentElement.childNodes[4].childNodes[3] as HTMLInputElement
            const inputTypeIsTest: boolean = inputTypeTestNode.checked

            const inputExtraCreditNode = buttonNode.parentElement.childNodes[5].childNodes[1] as HTMLInputElement
            const inputIsExtraCredit: boolean = inputExtraCreditNode.checked

            const inputMaxPointsNode = buttonNode.parentElement.childNodes[6].childNodes[1] as HTMLInputElement
            const inputMaxPoints: number = parseInt(inputMaxPointsNode.value)




            let errorFound = false

            if (validateInput(inputName, 50) === false) {
                errorFound = true
                inputNameNode.classList.add('error')
            } else {inputNameNode.classList.remove('error')}

            if (validateInput(inputDescription, 200) === false) {
                errorFound = true
                inputDescriptionNode.classList.add('error')
            } else {inputDescriptionNode.classList.remove('error')}

            if (!inputTypeIsHomework && !inputTypeIsTest) {
                errorFound = true
                inputTypeHomeworkNode.classList.add('error')
                inputTypeTestNode.classList.add('error')
            } else {
                inputTypeHomeworkNode.classList.remove('error')
                inputTypeTestNode.classList.remove('error')
            }

            if (isNaN(inputMaxPoints)) {
                errorFound = true
                inputMaxPointsNode.classList.add('error')
            } else {
                inputMaxPointsNode.classList.remove('error')
            }


            if (errorFound === false) {

                const inputType = inputTypeIsHomework ? "HOMEWORK" : "TEST"

                window.assignment.createAssignment(
                    class_id,
                    inputName,
                    inputDescription,
                    inputType,
                    inputIsExtraCredit,
                    inputMaxPoints
                ).then(newAsgnID => resolve(newAsgnID))
                
                popup.closePopup()
            }

        }
    })
}

declare global {

    interface AddNewAssignment_exports {
    
        /**
         * Triggers a popup to create a new student, creates the student in the DB, and returns the new `student_id`.
         * @param class_id The ID of the class to create the assignment in.
         * @returns A promise that resolves with the new student's ID, or `"newStudentPopup closed by user"` if closed without creating a new student.
         */
        trigger: (class_id: number) => Promise<number>
    }
}
export default {
    trigger
} as AddNewAssignment_exports
