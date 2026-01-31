import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDonations, Donation } from '@/hooks/useDonations';
import { useCenter } from '@/context/CenterContext';
import { Eye, Package, Plus } from 'lucide-react';

export default function DonationList() {
  const { findAll } = useDonations();
  const { activeCenter } = useCenter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonations() {
      if (activeCenter?.id) {
        setLoading(true);
        const data = await findAll(activeCenter.id);
        setDonations(data);
        setLoading(false);
      }
    }
    loadDonations();
  }, [activeCenter, findAll]);

  if (loading && donations.length === 0) {
    return <div className="p-8 text-center text-slate-500">Cargando donaciones...</div>;
  }

  if (!activeCenter) {
    return <div className="p-8 text-center text-slate-500">Selecciona un centro activo.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Donaciones</h1>
          <p className="text-sm text-slate-500">Listado de ingresos del centro {activeCenter.name}.</p>
        </div>
        <Link
          to="/donations/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Nueva Donación
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm uppercase font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Donante</th>
              <th className="p-4 text-center">Items</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {donations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <Package className="h-10 w-10 text-slate-300 mb-2" />
                    <p>No se encontraron donaciones.</p>
                  </div>
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-500">{donation.id.slice(0, 8)}...</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {new Date(donation.received_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {donation.donors.first_name} {donation.donors.last_name}
                    </div>
                    <div className="text-xs text-slate-500">{donation.donors.rut}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {donation.donation_items[0]?.count || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : donation.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                      {donation.status === 'pending' ? 'Pendiente' : donation.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/donations/${donation.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm inline-flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
