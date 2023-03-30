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
}