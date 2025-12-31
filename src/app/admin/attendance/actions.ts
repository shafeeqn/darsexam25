'use server';

import allStudentsData from '@/data/all_students.json';

// Define the Student type based on the JSON structure
export type Student = {
    "Registration Number": string;
    "Name": string;
    "Section": string;
    "Subject 1 Code": string;
    "Subject 2 Code": string;
    "Institution": string;
    "Institution Place": string;
};

export async function getStudentsForInstitution(institutionName: string): Promise<Student[]> {
    try {
        const allStudents = allStudentsData as Student[];

        const filteredStudents = allStudents.filter(
            (student) => student.Institution === institutionName
        );

        return filteredStudents;
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}
