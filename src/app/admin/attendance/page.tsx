import AttendanceRegister from '@/components/AttendanceRegister';
import institutionsData from '@/data/institutions.json';

type Institution = {
  institution: string;
  place: string;
};

async function getInstitutions(): Promise<Institution[]> {
  const data = institutionsData as string[];
  return data.map((item) => ({
    institution: item,
    place: '', // Place is included in the institution string for now
  }));
}

export default async function AttendancePage() {
  const institutions = await getInstitutions();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Register Generation</h1>
          <p className="text-gray-600 mt-2">Select an institution to generate and print the exam hall attendance sheet.</p>
        </header>

        <AttendanceRegister institutions={institutions} />
      </div>
    </div>
  );
}
