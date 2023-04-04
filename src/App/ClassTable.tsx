import React from 'react'

interface ClassTableProps {
    class_id: number
}

export function ClassTable(props: ClassTableProps) {

    const [classData, setClassData] = React.useState<ClassData>(null)
    const saveBtnRef = React.useRef()
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
    function handleGradeChange(
        student_id: number, assignment_id: number, max_points: number, event: React.ChangeEvent<HTMLSpanElement>
    ) {
        const node = event.target
        const newGradeInt = parseInt(node.innerText)
        if (isNaN(newGradeInt) || newGradeInt.toString() != node.innerText.trim() || node.id === node.innerText) {
            node.innerText = node.id
        } else {
            node.innerText = newGradeInt.toString()
            node.id = newGradeInt.toString()
            pendingChanges.push(
                {student_id ,assignment_id, newEarnedPoints: newGradeInt}
            )

            // Update the percentage shown
            node.nextElementSibling.innerHTML = `(${Math.round((newGradeInt / max_points) * 1000) / 10}%)`
        }
    }

    function handleSave() {
        if (pendingChanges.length !== 0) {
            window.grade.applyBulkChanges(pendingChanges)
        }
    }

    let assignmentDisplay
    let studentsDisplay
    if (classData) {
        assignmentDisplay = classData.assignments.map(asgn => {
            return (
                <th key={asgn.assignment_id}>
                    {asgn.name}
                </th>
            )
        })
        studentsDisplay = classData.studentInfo.map(stu => {
            const gradesDisplay = stu.grades.map((grade, index) => {
                const max_points = classData.assignments[index].max_points
                return (
                    <td key={`${grade.assignment_id} ${stu.student_id}`}>
                        <span className="table-grade-cell">
                            <span
                                contentEditable={true}
                                tabIndex={grade.assignment_id * 100 + stu.student_id} // changes tab behavior to vertical
                                id={grade.earned_points.toString()} // Used to store old value, in case new value is invalid
                                onBlur={(e) => { handleGradeChange(stu.student_id, grade.assignment_id, max_points, e) }}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault()
                                        e.currentTarget.blur()
                                    }
                                }}
                            >
                                {grade.earned_points.toString()}
                            </span>&nbsp;<span>
                                ({Math.round((grade.earned_points / max_points) * 1000 ) / 10}%)
                            </span>
                        </span>
                    </td>
                )
            })
            return (
                <tr key={stu.student_id}>
                    <th>{stu.first_name} {stu.last_name}</th>
                    {gradesDisplay}
                </tr>
            )
        })
    }

    return (<> {!classData ? <h2>Loading...</h2> : <>
        <table>
            <tbody>
                <tr>
                    <th>Assignments</th>
                    {assignmentDisplay}
                </tr>
                {studentsDisplay}
            </tbody>
        </table>
        <button onClick={handleSave} ref={saveBtnRef}>Save</button>
    </>}</>)
}