import React from 'react'
import './editAssignmentPopup.scss'
import popup from '../../Popup/popup'




function checkForBannedChars(input: string): boolean {

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

async function trigger(assignment_id: number) {

    const asgnData = await window.assignment.getAssignment(assignment_id)

    return new Promise<void>((resolve, reject) => {
        const content =
            <div className='edit_assignment_popup'>
                <h1>Edit Assignment</h1>
                <p className='error_message'></p>

                <div className='field_container'>
                    <label htmlFor='name'>Assignment Name:</label>
                    <input type='text' id='name' maxLength={50} defaultValue={asgnData.name}/>
                </div>
                <div className='field_container'>
                    <label htmlFor='description'>
                        Description:<br />
                        <span className="subtext">optional</span>
                    </label>
                    <textarea 
                        id='description' 
                        maxLength={200} 
                        defaultValue={asgnData.description}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') {e.preventDefault()}
                    }}/>
                </div>
                <div className='field_container radio'>
                    <label className='fieldname'>Assignment Type:</label>
                    <label htmlFor='HOMEWORK'>Homework</label>
                    <input 
                        type='radio' 
                        name='type' 
                        id='HOMEWORK' 
                        defaultChecked={asgnData.assignment_type === "HOMEWORK"}
                    />
                    <label htmlFor='TEST'>Test</label>
                    <input 
                        type='radio' 
                        name='type' 
                        id='TEST' 
                        defaultChecked={asgnData.assignment_type === "TEST"}
                    />
                </div>
                <div className='field_container extra_credit'>
                    <label htmlFor='is_extra_credit'>Extra Credit:</label>
                    <input type='checkbox' id='is_extra_credit' defaultChecked={asgnData.is_extra_credit}/>
                </div>
                <div className='field_container'>
                    <label htmlFor='max_points'>Maximum Points:</label>
                    <input type='number' id='max_points' defaultValue={asgnData.max_points}/>
                </div>

                <div className='button_container'>
                    <button onClick={handleDelete} className='delete'>Delete</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>

        popup.triggerPopup(content, null, () => reject("editAssignmentPopup closed by user"))
 
        function handleDelete() {
            popup.triggerPopup(
                <div className='delete_confirm'>
                    <h3>Are you sure you'd like to delete this assignment?</h3>
                    <div className='button_container'>
                        <button onClick={handleDeny}>No, take me back</button>
                        <button onClick={handleConfirm} className='delete'>Yes, delete</button>
                    </div>
                </div>
            , "warning")

            function handleDeny() {
                popup.closePopup()
                trigger(assignment_id)
            }
            function handleConfirm(){ 
                window.assignment.deleteAssignment(assignment_id)
                    .then(() => {
                        popup.closePopup()
                        resolve()
                    })
            }
        }

        function handleSave(e: React.MouseEvent<HTMLButtonElement>) {
            const buttonNode = e.target as HTMLButtonElement
        
            const errorNode = buttonNode.parentElement.parentElement.childNodes[1] as HTMLParagraphElement
        
            const inputNameNode = buttonNode.parentElement.parentElement.childNodes[2].childNodes[1] as HTMLInputElement
            const inputName: string = inputNameNode.value

            const inputDescriptionNode = buttonNode.parentElement.parentElement.childNodes[3].childNodes[1] as HTMLInputElement
            const inputDescription: string = inputDescriptionNode.value

            const inputTypeHomeworkNode = buttonNode.parentElement.parentElement.childNodes[4].childNodes[2] as HTMLInputElement
            const inputTypeIsHomework: boolean = inputTypeHomeworkNode.checked

            const inputTypeTestNode = buttonNode.parentElement.parentElement.childNodes[4].childNodes[4] as HTMLInputElement
            const inputTypeIsTest: boolean = inputTypeTestNode.checked

            const inputExtraCreditNode = buttonNode.parentElement.parentElement.childNodes[5].childNodes[1] as HTMLInputElement
            const inputIsExtraCredit: boolean = inputExtraCreditNode.checked

            const inputMaxPointsNode = buttonNode.parentElement.parentElement.childNodes[6].childNodes[1] as HTMLInputElement
            const inputMaxPoints: number = parseInt(inputMaxPointsNode.value)



            let errorMsg = "Error(s) detected:"
            let errorFound = false

            const inputNameIsValid = checkForBannedChars(inputName)
            const inputDescriptionIsValid = inputDescription.trim() === "" ? true : checkForBannedChars(inputDescription)
            const inputTypeIsChosen = inputTypeIsHomework || inputTypeIsTest
            const inputMaxPointsIsValid = !isNaN(inputMaxPoints)


            if (inputName.trim().length === 0) {
                errorMsg += "\nAssignment Name cannot be blank."
                errorFound = true
                inputNameNode.classList.add('error')
            } else if (!inputNameIsValid) {
                errorMsg += "\nAssignment Name cannot contain any of the following characters:\n;  :  <  >  (  )  {  }  [  ]  *  %"
                errorFound = true
                inputNameNode.classList.add('error')
            } else {inputNameNode.classList.remove('error')}


            if (!inputDescriptionIsValid) {
                errorMsg += "\nDescription cannot contain any of the following characters:\n;  :  <  >  (  )  {  }  [  ]  *  %"
                errorFound = true
                inputDescriptionNode.classList.add('error')
            } else {inputDescriptionNode.classList.remove('error')}


            if (!inputTypeIsChosen) {
                errorMsg += '\nYou must select either "Homework" or "Test"'
                errorFound = true
                inputTypeHomeworkNode.classList.add('error')
                inputTypeTestNode.classList.add('error')
            } else {
                inputTypeHomeworkNode.classList.remove('error')
                inputTypeTestNode.classList.remove('error')
            }

            if (!inputMaxPointsIsValid) {
                errorFound = true
                inputMaxPointsNode.classList.add('error')
                errorMsg += '\nYou must enter a value for Maximum Points'
            } else {
                inputMaxPointsNode.classList.remove('error')
            }




            if (errorFound) {
                errorNode.innerText = errorMsg
            } else {
                const inputType = inputTypeIsHomework ? "HOMEWORK" : "TEST"

                window.assignment.editAssignment(
                    assignment_id,
                    inputName,
                    inputDescription,
                    inputType,
                    inputIsExtraCredit,
                    inputMaxPoints
                    ).then(() => resolve())

                
                popup.closePopup()
            }

        }
    })
}

declare global {

    interface EditAssignment_exports {
    
        /**
         * Triggers a popup to create a new student, creates the student in the DB, and returns the new `student_id`.
         * @param class_id The ID of the class to create the assignment in.
         * @returns A promise that resolves with the new student's ID, or `"newStudentPopup closed by user"` if closed without creating a new student.
         */
        trigger: (class_id: number) => Promise<void>
    }
}
export default {
    trigger
} as EditAssignment_exports
