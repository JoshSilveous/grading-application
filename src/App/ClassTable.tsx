import React from 'react'

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
                gradeNode.classList.add('unsaved-change')
            } else {
                gradeNode.classList.remove('unsaved-change')
            }

            inputNode.value = newGradeInt.toString()
            inputNode.dataset.previousvalidinput = newGradeInt.toString()
            pendingChanges.push(
                { student_id, assignment_id, newEarnedPoints: newGradeInt }
            )
            console.log(pendingChanges)

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

        console.log('student_id: ', student_id)
        console.log('assignment_id: ', assignment_id)
        console.log(spanNode.dataset)
        if (spanNode.className === "exemptflag-disabled") {
            spanNode.className = "exemptflag-enabled"
            spanNode.innerText = "\u2691"
            pendingChanges.push(
                { student_id, assignment_id, newIsExempt: true }
            )
        } else {
            spanNode.className = "exemptflag-disabled"
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
                gradeNode.classList.remove('unsaved-change')
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

                gradeNode.classList.remove('unsaved-change')
                const maxPoints = parseInt(gradeNode.childNodes[0].childNodes[2].nodeValue)
                inputNode.value = inputNode.defaultValue

                // Update the percentage shown
                percentNode.innerText = Math.round((oldValue / maxPoints) * 1000) / 10 + '%'

                pendingChanges = []
            })

        }
    }

    function updateTotal(rowNum: number) {

        let totalStuPoints: number = 0
        let totalMaxPoints: number = 0

        const rowNodes = rowRefs.current[rowNum].childNodes as NodeListOf<HTMLTableCellElement>
        rowNodes.forEach((node, index) => {

            if (index !== 0 && index !== rowNodes.length - 1) {
                const isExemptNode = node.firstChild.childNodes[4] as HTMLSpanElement

                if (isExemptNode.className === "exemptflag-disabled") {
                    let thisGradeNode = node.firstChild.firstChild as HTMLInputElement
                    totalStuPoints += parseInt(thisGradeNode.value)
                    console.log('adding', parseInt(thisGradeNode.value), "to totalStuPoints, now", totalStuPoints)

                    let thisGradeMaxPoints = node.firstChild.childNodes[2].nodeValue
                    totalMaxPoints += parseInt(thisGradeMaxPoints)
                    console.log('adding', parseInt(thisGradeMaxPoints), "to totalMaxPoints, now", totalMaxPoints)
                }
            }
        })
        console.log('final totalStuPoints:', totalStuPoints, "totalMaxPoints:", totalMaxPoints)
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
                <th key={asgn.assignment_id}>
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
                        key={`${grade.assignment_id} ${stu.student_id}`}
                        ref={elem => {
                            if (elem) { gradeRefs.current.push(elem) }
                        }}
                    >
                        <span className="table-grade-cell">
                            <input
                                type="text"
                                data-assignment_id={grade.assignment_id.toString()}
                                data-student_id={stu.student_id.toString()}
                                data-rownum={stuIndex}
                                data-previousvalidinput={grade.earned_points.toString()}
                                defaultValue={grade.earned_points.toString()} // Used to store old value, in case new value is invalid
                                className="table-cell-span-editable"
                                tabIndex={grade.assignment_id * 100 + stu.student_id} // changes tab behavior to vertical
                                id={grade.earned_points.toString()}
                                onBlur={handleGradeChange}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault()
                                        e.currentTarget.blur()
                                    }
                                }}
                            />/ {max_points}<span className="table-cell-span-percentage">
                                {max_points === 0 ? 100 :
                                    Math.round((grade.earned_points / max_points) * 1000) / 10
                                }%
                            </span>
                            {grade.is_exempt ?
                                <span
                                    onClick={handleExemptChange}
                                    className="exemptflag-enabled"
                                    data-student_id={stu.student_id.toString()}
                                    data-assignment_id={grade.assignment_id.toString()}
                                    data-rownum={stuIndex}
                                >{"\u2691"}</span> :
                                <span
                                    onClick={handleExemptChange}
                                    className="exemptflag-disabled"
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
                    <th>{stu.first_name} {stu.last_name}</th>
                    {gradesDisplay}
                    <td className="totals_container">
                        <span className="totals_earned">{totalStuPoints}</span>
                        <span className="totals_max">/ {totalMaxPoints}</span>
                        <span className="totals_letter">{letterGrade}</span>
                        <span className="totals_percent">{formattedPercentGrade}</span>
                    </td>
                </tr>
            )

        })
    }





    return (<> {!classData ? <h2>Loading...</h2> : <>
        <table>
            <tbody>
                <tr>
                    <th></th>
                    {assignmentDisplay}
                    <th>Total</th>
                </tr>
                {studentsDisplay}
            </tbody>
        </table>
        <button onClick={handleSaveChanges} ref={saveBtnRef}>Save Changes</button>
        <button onClick={handleUndoChanges} ref={undoBtnRef}>Undo Changes</button>
    </>}</>)
}