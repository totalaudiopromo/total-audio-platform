import type { ContactsTableData } from "@/types/case-study";

interface ContactsTableProps {
  data: ContactsTableData;
}

export function ContactsTable({ data }: ContactsTableProps) {
  return (
    <section id="enriched-contacts" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">{data.heading}</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-900 uppercase tracking-wider text-xs md:text-sm">
            <tr>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Role & Show</th>
              <th className="py-3 px-4">Submission Notes</th>
              <th className="py-3 px-4">Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.contacts.map((contact, index) => (
              <tr key={index}>
                <td className="py-4 px-4 font-semibold">{contact.name}</td>
                <td className="py-4 px-4">{contact.roleAndShow}</td>
                <td className="py-4 px-4">{contact.submissionNotes}</td>
                <td className="py-4 px-4">{contact.validation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.disclaimer && (
        <p className="text-sm text-gray-500">{data.disclaimer}</p>
      )}
    </section>
  );
}
