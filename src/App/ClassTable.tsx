import React from 'react'

interface ClassTableProps {
    class_id: number
}

export function ClassTable(props: ClassTableProps) {

    const [classData, setClassData] = React.useState<ClassData>(null)
    React.useEffect(() => {
        updateClassData()
    }, [props.class_id])

    function updateClassData() {
        window.class.getClassData(props.class_id)
            .then(res => setClassData(res))
    }

    function handleGradeChange(student_id: number, assignment_id: number, event: React.ChangeEvent<HTMLSpanElement>) {
        const newGradeInt = parseInt(event.target.innerText)
        if (isNaN(newGradeInt) || newGradeInt.toString() != event.target.innerText.trim()) {
            event.target.innerText = event.target.id
        } else {
            event.target.innerText = newGradeInt.toString()
            event.target.id = newGradeInt.toString()
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
                return (
                    <td key={`${grade.assignment_id} ${stu.student_id}`}>
                        <span className="table-grade-cell">
                            <span
                                contentEditable={true}
                                tabIndex={grade.assignment_id * 100 + stu.student_id} // changes tab behavior to vertical
                                id={grade.earned_points.toString()} // Used to store old value, in case new value is invalid
                                onBlur={(e) => { handleGradeChange(stu.student_id, grade.assignment_id, e) }}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault()
                                        e.currentTarget.blur()
                                    }
                                }}
                            >
                                {grade.earned_points.toString()}
                            </span>&nbsp;<span>
                                ({grade.earned_points / classData.assignments[index].max_points})
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

    return (<> {!classData ? <h2>Loading...</h2> :
        <table>
            <tbody>
                <tr>
                    <th>Assignments</th>
                    {assignmentDisplay}
                </tr>
                {studentsDisplay}
            </tbody>
        </table>
    }</>)
}