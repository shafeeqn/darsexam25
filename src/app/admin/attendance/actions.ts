'use server';

import path from 'path';
import { promises as fs } from 'fs';

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
        const jsonDirectory = path.join(process.cwd());
        // Using the exact filename observed in the file exploration
        const fileContents = await fs.readFile(jsonDirectory + '/src/data/students_All Sections_2025-12-30.json', 'utf8');
        const allStudents: Student[] = JSON.parse(fileContents);

        const filteredStudents = allStudents.filter(
            (student) => student.Institution === institutionName
        );

        return filteredStudents;
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}
