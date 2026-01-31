import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDonations } from '@/hooks/useDonations';
import { ArrowLeft, Calendar, User, Package } from 'lucide-react';

export default function DonationDetail() {
  const { id } = useParams();
  const { findOne } = useDonations();
  const [donation, setDonation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonation() {
      if (id) {
        setLoading(true);
        const data = await findOne(id);
        setDonation(data);
        setLoading(false);
      }
    }
    loadDonation();
  }, [id, findOne]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando detalle de donación...</div>;
  }

  if (!donation) {
    return <div className="p-8 text-center text-slate-500">Donación no encontrada.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/donations" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Donación #{donation.id.slice(0, 8)}
              <span
                className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${donation.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
              >
                {donation.status}
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
            <User className="h-4 w-4" /> Información del Donante
          </h3>
          <div className="space-y-2">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              {donation.donors.first_name} {donation.donors.last_name}
            </p>
            <p className="text-slate-600 dark:text-slate-400">{donation.donors.rut}</p>
            <p className="text-slate-600 dark:text-slate-400">{donation.donors.email}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Detalles del Ingreso
          </h3>
          <div className="space-y-2">
            <p className="text-slate-900 dark:text-white">
              <span className="font-medium">Fecha:</span> {new Date(donation.received_at).toLocaleDateString()}
            </p>
            <p className="text-slate-900 dark:text-white">
              <span className="font-medium">Hora:</span> {new Date(donation.received_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Package className="h-5 w-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Items Donados</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm uppercase font-semibold">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Cantidad</th>
              <th className="p-4">Unidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {donation.donation_items.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="p-4 font-medium text-slate-900 dark:text-white">
                  {item.products?.name || 'Producto Desconocido'}
                </td>
                <td className="p-4 text-slate-900 dark:text-white">{item.quantity}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
