import React from 'react'
import './newAssignmentPopup.scss'
import popup from '../../Popup/popup'




function checkForBannedChars(input: string): boolean {

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

function trigger(class_id: number) {
    return new Promise<number>((resolve, reject) => {

        const content =
            <div className='new_assignment_popup'>
                <h1>Create A New Assignment</h1>
                <p className='error_message'></p>

                <div className='field_container'>
                    <label htmlFor='name'>Assignment Name:</label>
                    <input type='text' id='name' maxLength={50} />
                </div>
                <div className='field_container'>
                    <label htmlFor='description'>
                        Description:<br />
                        <span className="subtext">optional</span>
                    </label>
                    <textarea id='description' maxLength={200} onKeyDown={(e) => {
                        if (e.key === 'Enter') {e.preventDefault()}
                    }}/>
                </div>
                <div className='field_container radio'>
                    <label className='fieldname'>Assignment Type:</label>
                    <label htmlFor='HOMEWORK'>Homework</label>
                    <input type='radio' name='type' id='HOMEWORK' />
                    <label htmlFor='TEST'>Test</label>
                    <input type='radio' name='type' id='TEST' />
                </div>
                <div className='field_container extra_credit'>
                    <label htmlFor='is_extra_credit'>Extra Credit:</label>
                    <input type='checkbox' id='is_extra_credit' />
                </div>
                <div className='field_container'>
                    <label htmlFor='max_points'>Maximum Points:</label>
                    <input type='number' id='max_points' />
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

            const inputTypeHomeworkNode = buttonNode.parentElement.childNodes[4].childNodes[2] as HTMLInputElement
            const inputTypeIsHomework: boolean = inputTypeHomeworkNode.checked

            const inputTypeTestNode = buttonNode.parentElement.childNodes[4].childNodes[4] as HTMLInputElement
            const inputTypeIsTest: boolean = inputTypeTestNode.checked

            const inputExtraCreditNode = buttonNode.parentElement.childNodes[5].childNodes[1] as HTMLInputElement
            const inputIsExtraCredit: boolean = inputExtraCreditNode.checked

            const inputMaxPointsNode = buttonNode.parentElement.childNodes[6].childNodes[1] as HTMLInputElement
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
