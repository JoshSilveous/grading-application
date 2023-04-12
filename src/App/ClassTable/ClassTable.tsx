import React from 'react'
import './ClassTable.scss'
import popup from '../../Popup/popup'
import FIXTHISIMPORT from '../StudentDirectory/newStudentPopup'

interface ClassTableProps {
    class_id: number
}

export function ClassTable(props: ClassTableProps) {

    const [classData, setClassData] = React.useState<ClassData>(null)
    const gradeRefs = React.useRef<HTMLTableCellElement[]>([])
    const rowRefs = React.useRef<HTMLTableRowElement[]>([])
    const saveBtnRef = React.useRef()
    const undoBtnRef = React.useRef()

    React.useEffect(() => {
        updateClassData()
    }, [props.class_id])

    function updateClassData() {
        window.class.getClassData(props.class_id)
            .then(res => setClassData(res))
    }



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
                gradeNode.classList.remove('pending_change')
            }

            inputNode.value = newGradeInt.toString()
            inputNode.dataset.previousvalidinput = newGradeInt.toString()
            pendingChanges.push(
                { student_id, assignment_id, newEarnedPoints: newGradeInt }
            )

            // Update the percentage shown
            percentNode.innerText = Math.round((newGradeInt / maxPoints) * 1000) / 10 + '%'
            updateTotal(rowNum)
        }
    }

    function handleExemptChange(e: React.MouseEvent<HTMLSpanElement>) {
        const spanNode = e.target as HTMLSpanElement
        const student_id = parseInt(spanNode.dataset.student_id)
        const assignment_id = parseInt(spanNode.dataset.assignment_id)
        const rowNum = parseInt(spanNode.dataset.rownum)

        if (spanNode.className === "exempt disabled") {
            spanNode.className = "exempt enabled"
            spanNode.title = "Remove Exemption"
            spanNode.innerText = "\u2691"
            pendingChanges.push(
                { student_id, assignment_id, newIsExempt: true }
            )
        } else {
            spanNode.className = "exempt disabled"
            spanNode.title = "Make Exempt"
            spanNode.innerText = "\u2690"
            pendingChanges.push(
                { student_id, assignment_id, newIsExempt: false }
            )
        }
        updateTotal(rowNum)
    }

    function handleSaveChanges() {

        if (pendingChanges.length !== 0) {
            window.grade.applyBulkChanges(pendingChanges)
            updateClassData()

            const allgradeNodes = gradeRefs.current
            allgradeNodes.forEach(gradeNode => {
                gradeNode.classList.remove('pending_change')
            })

            pendingChanges = []
        }
    }

    function handleUndoChanges() {
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
            })

        }
    }

    function handleAddStudent() {
        // if pendingChanges isn't empty, tell user to save changes first
        if (pendingChanges.length !== 0) {
            function handlePopupSaveChanges() {
                handleSaveChanges()
                popup.closePopup()
                handleAddStudent()
            }
            function handlePopupUndoChanges() {
                handleUndoChanges()
                popup.closePopup()
                handleAddStudent()
            }
            const popupContent =
                <div className="save-changes-popup">You have changes still pending, would you like to
                    <span className="save" onClick={handlePopupSaveChanges}> ✔ save </span>
                    or
                    <span className="undo" onClick={handlePopupUndoChanges}> ✖ undo </span>
                    your changes?
                </div>

            popup.triggerPopup(popupContent, "warning")
        } else {
            FIXTHISIMPORT.triggerNewStudentPopup()
                .then(res => console.log('student created', res))
        }
    }

    function updateTotal(rowNum: number) {

        let totalStuPoints: number = 0
        let totalMaxPoints: number = 0

        const rowNodes = rowRefs.current[rowNum].childNodes as NodeListOf<HTMLTableCellElement>
        rowNodes.forEach((node, index) => {

            if (index !== 0 && index !== rowNodes.length - 1) {
                const isExemptNode = node.firstChild.childNodes[4] as HTMLSpanElement

                if (isExemptNode.className === "exempt disabled") {
                    let thisGradeNode = node.firstChild.firstChild as HTMLInputElement
                    totalStuPoints += parseInt(thisGradeNode.value)

                    let thisGradeMaxPoints = node.firstChild.childNodes[2].nodeValue
                    totalMaxPoints += parseInt(thisGradeMaxPoints)
                }
            }
        })
        const totalNode = rowNodes[rowNodes.length - 1]
        const totalStuPointsNode = totalNode.childNodes[0] as HTMLSpanElement
        const totalMaxPointsNode = totalNode.childNodes[1] as HTMLSpanElement
        const totalLetterNode = totalNode.childNodes[2] as HTMLSpanElement
        const totalPercentNode = totalNode.childNodes[3] as HTMLSpanElement

        const unformattedPercentGrade = totalMaxPoints === 0 ? 1 : totalStuPoints / totalMaxPoints
        const formattedPercentGrade = totalMaxPoints === 0 ? '100%' :
            (Math.round(unformattedPercentGrade * 1000) / 10) + '%'

        totalStuPointsNode.innerText = totalStuPoints.toString()
        totalMaxPointsNode.innerText = "/ " + totalMaxPoints.toString()
        totalLetterNode.innerText = getLetterGrade(unformattedPercentGrade)
        totalPercentNode.innerText = formattedPercentGrade
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
    if (classData) {
        gradeRefs.current = []  // reset refs to prevent overlap on re-render
        assignmentDisplay = classData.assignments.map(asgn => {
            return (
                <th key={asgn.assignment_id} className="assignment">
                    {asgn.name}
                </th>
            )
        })
        studentsDisplay = classData.studentInfo.map((stu, stuIndex) => {
            rowRefs.current = []  // reset refs to prevent overlap on re-render
            const gradesDisplay = stu.grades.map((grade, index) => {
                const max_points = classData.assignments[index].max_points
                return (
                    <td
                        className="grade_cell"
                        key={`${grade.assignment_id} ${stu.student_id}`}
                        ref={elem => {
                            if (elem) { gradeRefs.current.push(elem) }
                        }}
                    >
                        <span className="content_wrapper">
                            <input
                                type="text"
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
                                    className="exempt enabled"
                                    title="Remove Exemption"
                                    data-student_id={stu.student_id.toString()}
                                    data-assignment_id={grade.assignment_id.toString()}
                                    data-rownum={stuIndex}
                                >{"\u2691"}</span> :
                                <span
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
            })

            let totalStuPoints = 0
            stu.grades.forEach(grade => {
                if (!grade.is_exempt) {
                    totalStuPoints += grade.earned_points
                }
            })

            let totalMaxPoints = 0
            classData.assignments.forEach((asgn, asgnIndex) => {
                if (!stu.grades[asgnIndex].is_exempt) {
                    totalMaxPoints += asgn.max_points
                }
            })
            const unformattedPercentGrade = totalMaxPoints === 0 ? 1 : totalStuPoints / totalMaxPoints
            const formattedPercentGrade = (Math.round(unformattedPercentGrade * 1000) / 10) + '%'

            const letterGrade = getLetterGrade(unformattedPercentGrade)

            return (
                <tr key={stu.student_id} ref={elem => {
                    if (elem) { rowRefs.current.push(elem) }
                }}>
                    <th className="studentname">{stu.first_name} {stu.last_name}</th>
                    {gradesDisplay}
                    <td className="total_cell">
                        <span className="earned">{totalStuPoints}</span>
                        <span className="max">/ {totalMaxPoints}</span>
                        <span className="letter">{letterGrade}</span>
                        <span className="percent">{formattedPercentGrade}</span>
                    </td>
                </tr>
            )

        })
    }





    return (<> {!classData ? <h2>Loading...</h2> : <>
        <table className="class_table">
            <tbody>
                <tr>
                    <th className="corner"></th>
                    {assignmentDisplay}
                    <th className="total">Total</th>
                </tr>
                {studentsDisplay}
            </tbody>
        </table>
        <button className="addstudent" onClick={handleAddStudent}>
            <span className="icon">+</span>
            <span className="label">Add Student</span>
        </button>
        <div className="save_undo_container">
            <button className="undo_changes" onClick={handleUndoChanges} ref={undoBtnRef}>
                <span className="icon">✖</span>
                <span className="label">Undo Changes</span>
            </button>
            <button className="save_changes" onClick={handleSaveChanges} ref={saveBtnRef}>
                <span className="icon">✔</span>
                <span className="label">Save Changes</span>
            </button>

        </div>
    </>}</>)
}