interface Window {
    /**
     * A user-defined API that carries functions over from preload.ts to the renderer.
     */
    api: {
        /**
         * Returns an promise, then an object containing the class id, name, description, and student info.
         * @param class_id the ID of the class requesting
         * @returns Object containing all data about the class, it's students, and their grades.
         */
        dbtest: () => Promise<ClassData>
    }
    /**
     * Contains functions relating to setting up the database tables.
     */
    setup: {
        /**
         * Creates all tables in the database.
         */
        generateTables: () => Promise<void>,
        /**
         * Drops all tables in the database.
         * Intended for debug purposes
         */
        dropTables: () => Promise<void>
    }
    /**
     * Contains functions for testing purposes, not used in production.
     */
    test: {
        /**
         * Inserts some testing data into the database.
         * Debug purposes only.
         */
        insertTestData: () => Promise<void>
    }
    /**
     * Contains functions for interacting with classes in the database.
     */
    class: {
        /**
         * Gets verbose information about a class.
         * @param class_id the ID of the class being requested.
         * @returns Object containing all data about the class, it's assignments, it's students, and their grades.
         */
        getClassData: (class_id: Number) => Promise<ClassData>,
        /**
         * Creates a class in the database.
         * @param name The name of the class. Max 50 chars.
         * @param description A brief description of the class. Max 200 chars.
         * @returns The newly-created `class_id`.
         */
        createClass: (name: String, description: String) => Promise<Number>,
        /**
         * Deletes a class from the database.
         * @param class_id The ID of the class.
         */
        deleteClass: (class_id: Number) => Promise<void>,
        /**
         * Gets surface-level information about the class.
         * @param class_id The ID of the class.
         * @returns Object containing `class_id`, `name`, and `description`.
         */
        getClassInfo: (class_id: Number) => Promise<ClassInfo>,
        /**
         * Gets surface-level information about all classes
         * @returns Array of objects containing `class_id`, `name`, and `description`.
         */
        getClassList: () => Promise<ClassInfo[]>,
        /**
         * Edit a class's name & description. You must provide both parameters, so if
         * you only want to change the name, provide back the original description
         * (and vice versa).
         * @param class_id The ID of the class.
         * @param name The new name for the class. Max 50 chars.
         * @param description The new description for the class. Max 200 chars.
         */
        editClass: (class_id: Number, name?: String, description?: String) => Promise<void>,
        /**
         * Gets students that are not in a class (for list)
         * @param class_id The ID of the class.
         * @returns An array of objects containing the id and names of students.
         */
        getStudentsNotInClass: (class_id: Number) => Promise<StudentInfo[]>
    }
    /**
     * Contains functions for interacting with students in the database.
     */
    student: {
        /**
         * Removes a student from the database, including enrollments and grades.
         * @param student_id The ID of the student.
         */
        deleteStudent: (student_id: Number) => Promise<void>,
        /**
         * Creates a new student in the database.
         * @param first_name First name of the student. Max 25 chars.
         * @param last_name Last name of the student. Max 25 chars.
         * @returns The newly-created student's ID.
         */
        createStudent: (first_name: String, last_name: String) => Promise<Number>,
        /**
         * Edit a student's name.
         * @param student_id The ID of the student.
         * @param first_name New irst name of the student. Max 25 chars.
         * @param last_name New last name of the student. Max 25 chars.
         */
        editStudent: (student_id: Number, first_name: String, last_name: String) => Promise<void>
        /**
         * Gets an array of classes the student is in.
         * @param student_id The ID of the student.
         * @returns An array of objects containing the class's IDs, names, and descriptions.
         */
        getStudentEnrollments: (student_id: Number) => Promise<ClassInfo[]>,
        /**
         * Gets an array of all students in the database.
         * @returns An array of objects containing the students's IDs and names.
         */
        getStudentList: () => Promise<StudentInfo[]>
    }
    /**
     * Contains functions for interacting with assignments in the database.
     */
    assignment: {
        /**
         * Creates an assignment in the database.
         * @param class_id The ID of the class associated.
         * @param name The name of the assignment.
         * @param description The description of the assignment (can be blank, must be provided).
         * @param assignment_type The type of assignment. "HOMEWORK" or "TEST".
         * @param is_extra_credit Boolean, whether the assignment should impact grade negatively.
         * @param max_points Total points the assignment is worth.
         * @returns The ID of the newly-created class.
         */
        createAssignment: (
            class_id: Number,
            name: String, 
            description: String, 
            assignment_type: AssignmentInfo['assignment_type'], 
            is_extra_credit: Boolean, 
            max_points: Number
        ) => Promise<Number>,
        /**
         * Edit an assignment in the database.
         * @param assignment_id The ID of the assignment.
         * @param name The name of the assignment.
         * @param description The description of the assignment (can be blank, must be provided).
         * @param assignment_type The type of assignment. "HOMEWORK" or "TEST".
         * @param is_extra_credit Boolean, whether the assignment should impact grade negatively.
         * @param max_points Total points the assignment is worth.
         */
        editAssignment: (
            assignment_id: Number,
            name: String, 
            description: String, 
            assignment_type: AssignmentInfo['assignment_type'], 
            is_extra_credit: Boolean, 
            max_points: Number
        ) => Promise<void>,
        /**
         * Delete an assignment from the database.
         * @param assignment_id The ID of the assignment.
         */
        deleteAssignment: (assignment_id: Number) => Promise<void>,
        /**
         * Get an assignment's data from the database
         * @param assignment_id The ID of the assignment.
         * @returns An object containing all of the assignment's data.
         */
        getAssignment: (assignment_id: Number) => Promise<AssignmentInfo>,
        /**
         * Updates the display order for the assignment in the class.
         * @param assignment_id The ID of the assignment.
         * @param order_position The display order for the assignment.
         */
        updateAssignmentOrder: (assignment_id: Number, order_position: Number) => Promise<void>
    }
    /**
     * Contains functions for interacting with enrollments in the database.
     */
    enrollment: {
        /**
         * Adds an enrollment to the database.
         * @param class_id The ID of the class.
         * @param student_id The ID of the student.
         */
        addEnrollment: (class_id: Number, student_id: Number) => Promise<void>,
        /**
         * Deletes an enrollment from the database.
         * @param class_id The ID of the class.
         * @param student_id The ID of the student.
         */
        deleteEnrollment: (class_id: Number, student_id: Number) => Promise<void>
    }
}