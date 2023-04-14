import React from 'react'
import './newClassPopup.scss'
import popup from '../../Popup/popup'




function checkForBannedChars(input: string): boolean {

    const bannedCharacters = [';', '"', ':', '<', '>', '(', ')', '{', '}', '[', ']', '*', '%']
    if (bannedCharacters.some(char => input.includes(char))) { return false }

    return true

}

function trigger() {
    return new Promise<number>((resolve, reject) => {

        const content =
            <div className='new_class_popup'>
                <h1>Create A New Class</h1>
                <p className='error_message'></p>

                <div className='field_container'>
                    <label htmlFor='name'>Class Name:</label>
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

                <button onClick={handleCreate}>Create</button>
            </div>

        popup.triggerPopup(content, null, () => reject("newClassPopup closed by user"))
 
        function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
            const buttonNode = e.target as HTMLButtonElement

            const errorNode = buttonNode.parentElement.childNodes[1] as HTMLParagraphElement

            const inputNameNode = buttonNode.parentElement.childNodes[2].childNodes[1] as HTMLInputElement
            const inputName: string = inputNameNode.value

            const inputDescriptionNode = buttonNode.parentElement.childNodes[3].childNodes[1] as HTMLInputElement
            const inputDescription: string = inputDescriptionNode.value

            let errorMsg = "Error(s) detected:"
            let errorFound = false

            const inputNameIsValid = checkForBannedChars(inputName)
            const inputDescriptionIsValid = inputDescription.trim() === "" ? true : checkForBannedChars(inputDescription)
            
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


            if (errorFound) {
                errorNode.innerText = errorMsg
            } else {
                window.class.createClass(
                    inputName,
                    inputDescription
                ).then(newClassID => resolve(newClassID))
                
                popup.closePopup()
            }

        }
    })
}

declare global {

    interface AddNewClass_exports {
    
        /**
         * Triggers a popup to create a new class.
         * @returns A promise which resolves with the new class_id.
         */
        trigger: () => Promise<number>
    }
}
export default {
    trigger
} as AddNewClass_exports
