'use server';

import resultsData from '@/data/JM RESULT 2025.json';

export type ResultRecord = {
    "S.No": number | string;
    "Register No": string;
    "Password": string;
    "Name of student": string;
    "Name of Dars": string;
    "Section": string;
    "Subject 1 Code": string;
    "Subject 1": string;
    "Mark 1"?: number | string;
    "Subject 2 Code": string;
    "Subject 2 "?: string;
    "Mark 2"?: number | string;
    "Total"?: number | string;
    "Status": string;
    "Column15"?: number | string;
    "Column16"?: string;
};

export async function getResultsForInstitution(institutionName: string): Promise<ResultRecord[]> {
    try {
        const records = resultsData as unknown as ResultRecord[];

        const filteredRecords = records.filter((record) => {
            if (!record["Name of Dars"]) return false;
            const darsName = `${record["Name of Dars"]}`.trim();
            const instTrimmed = institutionName.trim();
            return darsName === instTrimmed || record["Name of Dars"] === institutionName;
        });

        return filteredRecords;
    } catch (error) {
        console.error('Error fetching results:', error);
        return [];
    }
}
