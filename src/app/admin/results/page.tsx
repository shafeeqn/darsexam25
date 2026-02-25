import ResultsRegister from '@/components/ResultsRegister';
import resultsData from '@/data/JM RESULT 2025.json';

type Institution = {
    institution: string;
    place: string;
};

async function getInstitutions(): Promise<Institution[]> {
    const data = resultsData as any[];
    const uniqueInstitutions = new Set<string>();

    data.forEach((item) => {
        if (item["Name of Dars"]) {
            uniqueInstitutions.add(item["Name of Dars"].trim());
        }
    });

    return Array.from(uniqueInstitutions).map((inst) => ({
        institution: inst,
        place: '',
    })).sort((a, b) => a.institution.localeCompare(b.institution));
}

export default async function ResultsPage() {
    const institutions = await getInstitutions();

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Results Generator</h1>
                    <p className="text-gray-600 mt-2">Select an institution to generate and print the exam results sheet.</p>
                </header>

                <ResultsRegister institutions={institutions} />
            </div>
        </div>
    );
}
