import React from 'react'
import './studentManagerPopup.scss'
import popup from '../../Popup/popup'
import editStudentPopup from './editStudentPopup'
import createStudentPopup from './createStudentPopup'


function trigger() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const stuData = await window.student.getStudentList()
            console.log(stuData)

            function editStudent(student_id: number) {
                editStudentPopup.trigger(student_id)
                    .then(() => {
                        trigger()
                    })
                    .catch(() => {
                        trigger()
                    })
            }
            function handleCreateStudent() {
                createStudentPopup.trigger()
                    .then(() => {
                        console.log('student created')
                        trigger()
                    })
                    .catch(() => {
                        trigger()
                    })
            }

            const stuListDisplay = stuData.map((stu, stuIndex) => {
                return (
                    <React.Fragment key={stu.student_id}>
                        {stuIndex !== 0 && <hr />}
                        <div className='student'>
                            <span>{stu.first_name} {stu.last_name}</span>
                            <button onClick={() => editStudent(stu.student_id)}>Edit</button>
                        </div>
                    </React.Fragment>
                )
            })

            const content =
                <div className='student_manager_popup'>
                    <h3>Student Manager</h3>
                    <div className='student_list'>
                        {stuListDisplay}
                    </div>
                    <button onClick={handleCreateStudent}>Create New Student</button>
                </div>
    
            popup.triggerPopup(content, null, () => {resolve()})
        } catch {
            reject()
            return
        }
 
    })
}

declare global {

    interface StudentManager_exports {
    
        /**
         * Triggers a popup to edit a student's enrollment.
         * @returns A promise that resolves if changes are made, or rejects otherwise.
         */
        trigger: () => Promise<void>
    }
}
export default {
    trigger
} as StudentManager_exports
