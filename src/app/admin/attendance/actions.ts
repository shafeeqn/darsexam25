'use server';

import studentsData from '@/data/students.json';

// Define the Student type based on the JSON structure
export type Student = {
    "Registration Number": string;
    "Name": string;
    "Section": string;
    "Subject 1 Code": string;
    "Subject 2 Code": string;
    "Institution": string;
};

export async function getStudentsForInstitution(institutionName: string): Promise<Student[]> {
    try {
        const students = studentsData as unknown as Student[];

        // The institutionName from the dropdown comes from institutions.json, which appears to be "InstitutionName PlaceName"
        // So we interpret the input as the full string and try to match it against combined student fields
        const filteredStudents = students.filter((student) => {
            const studentFull = `${student.Institution}`.trim();
            // Check for exact match (trimming to be safe)
            return studentFull === institutionName || student.Institution === institutionName;
        });

        return filteredStudents;
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}
