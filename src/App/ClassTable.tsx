import React from 'react'

interface ClassTableProps {
    class_id: number
}

export function ClassTable(props: ClassTableProps) {

    const [classData, setClassData] = React.useState<ClassData>(null)
    const tdRefs = React.useRef<HTMLTableCellElement[]>([])
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
        const tdNode = e.target.parentElement.parentElement
        const percentNode = e.target.parentElement.lastChild as HTMLSpanElement
        const inputNode = e.target.parentElement.firstChild as HTMLInputElement
        const newGradeInt = parseInt(inputNode.value)
        const student_id = parseInt(inputNode.dataset.student_id)
        const assignment_id = parseInt(inputNode.dataset.assignment_id)


        const maxPoints = parseInt(tdNode.childNodes[0].childNodes[2].nodeValue)

        if (isNaN(newGradeInt) || newGradeInt.toString() != inputNode.value.trim() || inputNode.id === inputNode.value) {
            // reset value to original if invalid
            inputNode.value = inputNode.id

        } else {
            if (inputNode.value !== inputNode.defaultValue) {
                tdNode.classList.add('unsaved-change')
            } else {
                tdNode.classList.remove('unsaved-change')
            }

            inputNode.value = newGradeInt.toString()
            inputNode.id = newGradeInt.toString()
            pendingChanges.push(
                { student_id, assignment_id, newEarnedPoints: newGradeInt }
            )

            // Update the percentage shown
            percentNode.innerText = Math.round((newGradeInt / maxPoints) * 1000) / 10 + '%'
        }
        console.log(tdRefs)
    }

    function handleSaveChanges() {
        if (pendingChanges.length !== 0) {
            window.grade.applyBulkChanges(pendingChanges)
            updateClassData()

            const allTdNodes = tdRefs.current
            allTdNodes.forEach(tdNode => {
                tdNode.classList.remove('unsaved-change')
            })
        }
    }

    function handleUndoChanges() {
        if (pendingChanges.length !== 0) {

            const allTdNodes = tdRefs.current
            allTdNodes.forEach(tdNode => {
                const percentNode = tdNode.childNodes[0].lastChild as HTMLSpanElement
                const inputNode = tdNode.childNodes[0].firstChild as HTMLInputElement
                const oldValue = parseInt(inputNode.defaultValue)

                tdNode.classList.remove('unsaved-change')
                const maxPoints = parseInt(tdNode.childNodes[0].childNodes[2].nodeValue)
                inputNode.value = inputNode.defaultValue

                // Update the percentage shown
                percentNode.innerText = Math.round((oldValue / maxPoints) * 1000) / 10 + '%'
            })
        }
    }


    let assignmentDisplay
    let studentsDisplay
    if (classData) {
        tdRefs.current = []
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
                function addTdRef(elem: HTMLTableCellElement) {
                    if (elem) { tdRefs.current.push(elem) }
                }
                return (
                    <td
                        key={`${grade.assignment_id} ${stu.student_id}`}
                        ref={addTdRef}
                    >
                        <span className="table-grade-cell">
                            <input
                                type="text"
                                data-assignment_id={grade.assignment_id}
                                data-student_id={stu.student_id}
                                defaultValue={grade.earned_points.toString()}
                                className="table-cell-span-editable"
                                tabIndex={grade.assignment_id * 100 + stu.student_id} // changes tab behavior to vertical
                                id={grade.earned_points.toString()} // Used to store old value, in case new value is invalid
                                onBlur={handleGradeChange}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault()
                                        e.currentTarget.blur()
                                    }
                                }}
                            />/ {max_points}<span className="table-cell-span-percentage">
                                {Math.round((grade.earned_points / max_points) * 1000) / 10}%
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
        <button onClick={handleSaveChanges} ref={saveBtnRef}>Save Changes</button>
        <button onClick={handleUndoChanges} ref={undoBtnRef}>Undo Changes</button>
    </>}</>)
}