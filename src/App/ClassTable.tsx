import React from 'react'

interface ClassTableProps {
    class_id: number
}

export function ClassTable(props:ClassTableProps) {

    const [classData, setClassData] = React.useState<ClassData>(null)
    React.useEffect(() => {
        window.class.getClassData(props.class_id)
            .then(res => setClassData(res))
    }, [props.class_id])

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
            const gradesDisplay = stu.grades.map(grade => {
                return (
                    <td key={`${grade.assignment_id} ${grade.student_id}`}>
                        {grade.earned_points.toString()}
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

    return (<> { !classData ? <h2>Loading...</h2> : 
        <table>
            <tr>
                <th>Assignments</th>
                {assignmentDisplay}
            </tr>
            {studentsDisplay}
        </table>
    }</>)
}