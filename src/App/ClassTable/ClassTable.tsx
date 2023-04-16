import React from 'react'
import './ClassTable.scss'
import popup from '../../Popup/popup'
import addStudentPopup from '../PopupLib/addStudentPopup'
import editEnrollmentPopup from '../PopupLib/editEnrollmentPopup'
import newAssignmentPopup from '../PopupLib/newAssignmentPopup'
import editAssignmentPopup from '../PopupLib/editAssignmentPopup'

interface ClassTableProps {
    class_id: number
}


export function ClassTable(props: ClassTableProps) {

    const [classData, setClassData] = React.useState<ClassData>(null)
    const [asgnViewType, setAsgnViewType] = React.useState<"BOTH" | "HOMEWORK" | "TEST">("BOTH")
    const gradeRefs = React.useRef<HTMLTableCellElement[]>([])
    const rowRefs = React.useRef<HTMLTableRowElement[]>([])

    React.useEffect(() => {
        updateClassData()
    }, [props.class_id])

    function updateClassData() {
        window.class.getClassData(props.class_id)
            .then(res => {
                setClassData(res)
            })
    }

    let tableIsEmpty = false
    if (classData) {
        if (classData.assignments.length === 0 && classData.studentInfo.length === 0) {
            tableIsEmpty = true
        }
    }

    // Set the buttonContainer's width to equal the table's width, for a cleaner looking UI.
    // Unfortunantly, couldn't find a way to do this is pure CSS.
    const tableRef = React.useRef<HTMLTableElement>()
    const buttonContainerRef = React.useRef<HTMLDivElement | null>()
    React.useEffect(() => {
        if (buttonContainerRef.current && tableRef.current) {
            buttonContainerRef.current.style.width = tableRef.current.clientWidth.toString() + 'px'
        }
        rowRefs.current.forEach(row => {
            updateTotal(parseInt(row.dataset.rownum))
        })
    }, [classData])



    /*  When a grade is changed, state is NOT updated. This is meant to minimize re-renders, as well as
    allow the user to back out of changes. This function will add the change to a `PendingChange[]` array,
    and will only apply changes to the database when "Save" is pressed.
    */
    let pendingChanges: PendingChange[] = []
    function handleGradeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const gradeNode = e.target.parentElement.parentElement
        const percentNode = e.target.parentElement.childNodes[3] as HTMLSpanElement
        const inputNode = e.target.parentElement.firstChild as HTMLInputElement
        const newGradeInt = parseInt(inputNode.value)
        const student_id = parseInt(inputNode.dataset.student_id)
        const assignment_id = parseInt(inputNode.dataset.assignment_id)
        const rowNum = parseInt(inputNode.dataset.rownum)
        const siblingExemptNode = inputNode.parentElement.childNodes[4] as HTMLSpanElement

        const maxPoints = parseInt(gradeNode.childNodes[0].childNodes[2].nodeValue)

        if (isNaN(newGradeInt) ||
            newGradeInt.toString() != inputNode.value.trim() ||
            inputNode.dataset.previousvalidinput === inputNode.value
        ) {
            // reset value to previous valid input if invalid
            inputNode.value = inputNode.dataset.previousvalidinput

        } else {
            if (inputNode.value !== inputNode.defaultValue) {
                gradeNode.classList.add('pending_change')
            } else {
                // check to make sure there isn't changes already pending from exemptFlag
                if(siblingExemptNode.dataset.defaultstatus === siblingExemptNode.classList[1]) {
                    gradeNode.classList.remove('pending_change')
                }
                
            }

            inputNode.value = newGradeInt.toString()
            inputNode.dataset.previousvalidinput = newGradeInt.toString()
            pendingChanges.push(
                { student_id, assignment_id, newEarnedPoints: newGradeInt }
            )
            const undoBtn = buttonContainerRef.current.childNodes[2] as HTMLButtonElement
            const saveBtn = buttonContainerRef.current.childNodes[3] as HTMLButtonElement

            undoBtn.classList.remove('disabled')
            saveBtn.classList.remove('disabled')

            

            // Update the percentage shown
            percentNode.innerText = Math.round((newGradeInt / maxPoints) * 1000) / 10 + '%'
            updateTotal(rowNum)
        }
    }
    
    function handleAsgnViewChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setAsgnViewType(e.target.value as "BOTH" | "HOMEWORK" | "TEST")
    }

    async function openAsgnSettings(assignment_id: number) {
        try {
            await promptSaveIfPendingChanges()
            await editAssignmentPopup.trigger(assignment_id)
            updateClassData()
        } catch {return}
    }
    
    async function handleStudentClick(student_id: number) {
        try {
            await promptSaveIfPendingChanges()
            await editEnrollmentPopup.trigger(student_id, props.class_id)
            updateClassData()
        } catch {return}
    }

    function handleExemptChange(e: React.MouseEvent<HTMLSpanElement>) {
        const spanNode = e.target as HTMLSpanElement
        const gradeNode = spanNode.parentElement.parentElement
        const student_id = parseInt(spanNode.dataset.student_id)
        const assignment_id = parseInt(spanNode.dataset.assignment_id)
        const rowNum = parseInt(spanNode.dataset.rownum)
        const siblingInputNode = spanNode.parentNode.childNodes[0] as HTMLInputElement


        if (spanNode.className === "exempt disabled") {

            // if this is a changed value
            if (spanNode.dataset.defaultstatus === "disabled") {
                // AND the sibling input isn't changed
                if (siblingInputNode.defaultValue === siblingInputNode.value) {
                    gradeNode.classList.add('pending_change')
                }
            // if this is changing back to default value
            } else {
                // AND the sibling input isn't changed
                if (siblingInputNode.defaultValue === siblingInputNode.value) {
                    gradeNode.classList.remove('pending_change')
                }
            }

            spanNode.className = "exempt enabled"
            spanNode.title = "Remove Exemption"
            spanNode.innerText = "\u2691"
            pendingChanges.push(
                { student_id, assignment_id, newIsExempt: true }
            )

            const undoBtn = buttonContainerRef.current.childNodes[2] as HTMLButtonElement
            const saveBtn = buttonContainerRef.current.childNodes[3] as HTMLButtonElement

            undoBtn.classList.remove('disabled')
            saveBtn.classList.remove('disabled')

        } else {

            // if this is a changed value
            if (spanNode.dataset.defaultstatus === "enabled") {
                // AND the sibling input isn't changed
                if (siblingInputNode.defaultValue === siblingInputNode.value) {
                    gradeNode.classList.add('pending_change')
                }
            // if this is changing back to default value
            } else {
                // AND the sibling input isn't changed
                if (siblingInputNode.defaultValue === siblingInputNode.value) {
                    gradeNode.classList.remove('pending_change')
                }
            }

            spanNode.className = "exempt disabled"
            spanNode.title = "Make Exempt"
            spanNode.innerText = "\u2690"
            pendingChanges.push(
                { student_id, assignment_id, newIsExempt: false }
            )

            const undoBtn = buttonContainerRef.current.childNodes[2] as HTMLButtonElement
            const saveBtn = buttonContainerRef.current.childNodes[3] as HTMLButtonElement

            undoBtn.classList.remove('disabled')
            saveBtn.classList.remove('disabled')
        }
        updateTotal(rowNum)

        
    }

    function handleSaveChanges(e?: React.MouseEvent<HTMLButtonElement>) {
        
        // lose focus on button after select/enter. Better visually, and still allows for keyboard control
        if (e) {
            let node = e.target as HTMLElement
            if (node.className === "undo_changes") {
                node = node as HTMLButtonElement
            } else {
                node = node.parentNode as HTMLButtonElement
            }
            node.blur()
        }


        if (pendingChanges.length !== 0) {
            window.grade.applyBulkChanges(pendingChanges)
            updateClassData()

            const allgradeNodes = gradeRefs.current
            allgradeNodes.forEach(gradeNode => {
                gradeNode.classList.remove('pending_change')
                
            })
            

            pendingChanges = []
            
            const undoBtn = buttonContainerRef.current.childNodes[2] as HTMLButtonElement
            const saveBtn = buttonContainerRef.current.childNodes[3] as HTMLButtonElement

            undoBtn.classList.add('disabled')
            saveBtn.classList.add('disabled')
        }
    }

    function handleUndoChanges(e?: React.MouseEvent<HTMLButtonElement>) {

        // lose focus on button after select/enter. Better visually, and still allows for keyboard control
        if (e) {
            let node = e.target as HTMLElement
            if (node.className === "undo_changes") {
                node = node as HTMLButtonElement
            } else {
                node = node.parentNode as HTMLButtonElement
            }
            node.blur()
        }


        if (pendingChanges.length !== 0) {
            const allgradeNodes = gradeRefs.current
            allgradeNodes.forEach(gradeNode => {
                const percentNode = gradeNode.childNodes[0].childNodes[3] as HTMLSpanElement
                const inputNode = gradeNode.childNodes[0].firstChild as HTMLInputElement
                const oldValue = parseInt(inputNode.defaultValue)

                gradeNode.classList.remove('pending_change')
                const maxPoints = parseInt(gradeNode.childNodes[0].childNodes[2].nodeValue)
                inputNode.value = inputNode.defaultValue

                // Update the percentage shown
                percentNode.innerText = Math.round((oldValue / maxPoints) * 1000) / 10 + '%'

                pendingChanges = []
            
                const undoBtn = buttonContainerRef.current.childNodes[2] as HTMLButtonElement
                const saveBtn = buttonContainerRef.current.childNodes[3] as HTMLButtonElement
    
                undoBtn.classList.add('disabled')
                saveBtn.classList.add('disabled')
            })

        }
    }

    
    async function handleAddStudent(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault() 
        try {
            await promptSaveIfPendingChanges()
            

            let newStudentID = await addStudentPopup.trigger(props.class_id)
            window.enrollment.addEnrollment(props.class_id, newStudentID)
            updateClassData()

            // function cancels if user closes out of a popup
        } catch {return}     
    }
    async function handleCreateAssignment(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try {
            await promptSaveIfPendingChanges()
            await newAssignmentPopup.trigger(props.class_id)
            updateClassData()
            // create prompt for new assignment

            // function cancels if user closes out of a popup
        } catch {return}  
    }
    


    /**
     * Resolves if user saves/undos changes, rejects if cancelled.
     */
    function promptSaveIfPendingChanges(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            // if pendingChanges isn't empty, tell user to save changes first
            if (pendingChanges.length !== 0) {
                function handlePopupSaveChanges() {
                    handleSaveChanges()
                    popup.closePopup()
                    resolve()
                }
                function handlePopupUndoChanges() {
                    handleUndoChanges()
                    popup.closePopup()
                    resolve()
                }

                const popupContent =
                    <div className="save-changes-popup">You have changes still pending, would you like to
                        <span className="save" onClick={handlePopupSaveChanges}> ✔ save </span>
                        or
                        <span className="undo" onClick={handlePopupUndoChanges}> ✖ undo </span>
                        your changes?
                    </div>

                popup.triggerPopup(popupContent, "warning", () => reject())
            } else {
                resolve()
            }
        })
    }
    

    function updateTotal(rowNum: number) {
        if (!tableIsEmpty) {
            let totalStuPoints: number = 0
            let totalMaxPoints: number = 0

            const rowNodes = rowRefs.current[rowNum].childNodes as NodeListOf<HTMLTableCellElement>
            // add together all scores and maxPoints for each assignment
            rowNodes.forEach((node, index) => {

                if (index !== 0 && index !== rowNodes.length - 1) {
                    const isExemptNode = node.firstChild.childNodes[4] as HTMLSpanElement

                    if (isExemptNode.className === "exempt disabled") {
                        let thisGradeNode = node.firstChild.firstChild as HTMLInputElement
                        totalStuPoints += parseInt(thisGradeNode.value)
                        
                        if (classData && !classData.assignments[index - 1].is_extra_credit) {
                            let thisGradeMaxPoints = node.firstChild.childNodes[2].nodeValue
                            totalMaxPoints += parseInt(thisGradeMaxPoints)
                        }

                    }
                }
            })
            const totalNode = rowNodes[rowNodes.length - 1]
            const totalStuPointsNode = totalNode.childNodes[0].childNodes[0] as HTMLSpanElement
            const totalMaxPointsNode = totalNode.childNodes[0].childNodes[1] as HTMLSpanElement
            const totalLetterNode = totalNode.childNodes[0].childNodes[2] as HTMLSpanElement
            const totalPercentNode = totalNode.childNodes[0].childNodes[3] as HTMLSpanElement

            const unformattedPercentGrade = totalMaxPoints === 0 ? 1 : totalStuPoints / totalMaxPoints
            const formattedPercentGrade = totalMaxPoints === 0 ? '100%' :
                (Math.round(unformattedPercentGrade * 1000) / 10) + '%'

            totalStuPointsNode.innerText = totalStuPoints.toString()
            totalMaxPointsNode.innerText = "/ " + totalMaxPoints.toString()
            totalLetterNode.innerText = getLetterGrade(unformattedPercentGrade)
            totalPercentNode.innerText = formattedPercentGrade
        }
    }
    

    function getLetterGrade(percent: number): string {
        if (percent >= .97) { return "A+" }
        else if (percent >= .93) { return "A" }
        else if (percent >= .90) { return "A-" }
        else if (percent >= .87) { return "B+" }
        else if (percent >= .83) { return "B" }
        else if (percent >= .80) { return "B-" }
        else if (percent >= .77) { return "C+" }
        else if (percent >= .73) { return "C" }
        else if (percent >= .70) { return "C-" }
        else if (percent >= .67) { return "D+" }
        else if (percent >= .60) { return "D" }
        else { return "F" }
    }


    

    let assignmentDisplay
    let studentsDisplay
    if (classData && !tableIsEmpty) {
        gradeRefs.current = []  // reset refs to prevent overlap on re-render
        assignmentDisplay = classData.assignments.map(asgn => {
            if (asgnViewType === asgn.assignment_type || asgnViewType === "BOTH") {
                return (
                    <th 
                        data-assignment_id={asgn.assignment_id}
                        key={asgn.assignment_id} 
                        className="assignment"
                        title={asgn.description}
                        onClick={() => openAsgnSettings(asgn.assignment_id)}
                    >
                        <div className="content">
                            <h3>{asgn.name}</h3>
                            <span className="attributes">
                                <h4>{asgn.is_extra_credit ? "EXTRA CREDIT" : ""}</h4>
                                <h4>{asgn.assignment_type}</h4>
                            </span>
                        </div>
                    </th>
                )
            } else {return}
        })
        studentsDisplay = classData.studentInfo.map((stu, stuIndex) => {
            rowRefs.current = []  // reset refs to prevent overlap on re-render
            const gradesDisplay = stu.grades.map((grade, index) => {
                const max_points = classData.assignments[index].max_points
                const assignment_type = classData.assignments[index].assignment_type
                if (asgnViewType === assignment_type || asgnViewType === "BOTH") {
                    return (
                        <td
                            className="grade_cell"
                            data-assignment_id={grade.assignment_id}
                            key={`${grade.assignment_id} ${stu.student_id}`}
                            ref={elem => {
                                if (elem) { gradeRefs.current.push(elem) }
                            }}
                        >
                            <span className="content_wrapper">
                                <input
                                    type="number"
                                    data-assignment_id={grade.assignment_id.toString()}
                                    data-student_id={stu.student_id.toString()}
                                    data-rownum={stuIndex}
                                    data-previousvalidinput={grade.earned_points.toString()}
                                    defaultValue={grade.earned_points.toString()} // Used to store old value, in case new value is invalid
                                    className="grade_cell_content_input"
                                    tabIndex={grade.assignment_id * 100 + stu.student_id} // changes tab behavior to vertical
                                    id={grade.earned_points.toString()}
                                    onBlur={handleGradeChange}
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter") {
                                            e.preventDefault()
                                            e.currentTarget.blur()
                                        }
                                    }}
                                />/ {max_points}<span className="percentage">
                                    {max_points === 0 ? 100 :
                                        Math.round((grade.earned_points / max_points) * 1000) / 10
                                    }%
                                </span>
                                {grade.is_exempt ?
                                    <span
                                        onClick={handleExemptChange}
                                        data-defaultstatus="enabled"
                                        className="exempt enabled"
                                        title="Remove Exemption"
                                        data-student_id={stu.student_id.toString()}
                                        data-assignment_id={grade.assignment_id.toString()}
                                        data-rownum={stuIndex}
                                    >{"\u2691"}</span> :
                                    <span
                                        data-defaultstatus="disabled"
                                        onClick={handleExemptChange}
                                        className="exempt disabled"
                                        title="Make Exempt"
                                        data-student_id={stu.student_id.toString()}
                                        data-assignment_id={grade.assignment_id.toString()}
                                        data-rownum={stuIndex}
                                    >{"\u2690"}</span>
                                }
                            </span>
                        </td>
                    )
                } else {return}
            })
            return (
                <tr data-rownum={stuIndex} key={stu.student_id} ref={elem => {
                    if (elem) { rowRefs.current.push(elem) }
                }}>
                    <th className="studentname" onClick={() => handleStudentClick(stu.student_id)}>
                        {stu.first_name} {stu.last_name}
                    </th>
                    {gradesDisplay}
                    <td className="total_cell">
                        <span className="content_wrapper">
                            <span className="earned"></span>
                            <span className="max"></span>
                            <span className="letter"></span>
                            <span className="percent"></span>
                        </span>
                    </td>
                </tr>
            )

        })
    }





    return (<> {!classData ? <h2>Loading...</h2> : <>
        <div className='classtable_wrap'>
            <div 
                className='tablewrap'
                hidden={tableIsEmpty}
            >
                <table className="class_table" ref={tableRef}>
                    <tbody>
                        <tr>
                            <th className="assignment_view">
                                <h3>View Type</h3>
                                <select onChange={handleAsgnViewChange}>
                                    <option value="BOTH">Both</option>
                                    <option value="HOMEWORK">Homework</option>
                                    <option value="TEST">Test</option>
                                </select>
                            </th>
                            {assignmentDisplay}
                            <th className="total">Total</th>
                        </tr>
                        {studentsDisplay}
                    </tbody>
                </table>
            </div>

            <div className='button_container' ref={buttonContainerRef}
            >
                <button className="addstudent" onClick={handleAddStudent}>
                    <span className="icon">+</span>
                    <span className="label">Add Student</span>
                </button>
                <button className="addassignment" onClick={handleCreateAssignment}>
                    <span className="icon">+</span>
                    <span className="label">Create Assignment</span>
                </button>
                <button className="undo_changes disabled" onClick={handleUndoChanges}>
                    <span className="icon">✖</span>
                    <span className="label">Undo Changes</span>
                </button>

                <button className="save_changes disabled" onClick={handleSaveChanges}>
                    <span className="icon">✔</span>
                    <span className="label">Save Changes</span>
                </button>
            </div>
        </div>
    </>}</>)
}