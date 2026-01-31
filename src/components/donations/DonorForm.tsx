import { useState } from 'react';
import { useDonations } from '@/hooks/useDonations';
import { Search } from 'lucide-react';

interface DonorFormProps {
  register: any;
  setValue: any;
  errors: any;
}

export function DonorForm({ register, setValue, errors }: DonorFormProps) {
  const { searchDonor } = useDonations();
  const [searching, setSearching] = useState(false);
  const [rut, setRut] = useState('');

  const handleSearch = async () => {
    if (!rut) return;
    setSearching(true);
    const donor = await searchDonor(rut);
    setSearching(false);

    if (donor) {
      setValue('donor_first_name', donor.first_name);
      setValue('donor_last_name', donor.last_name);
      setValue('donor_email', donor.email);
      setValue('donor_id', donor.id);
    } else {
      // Clear ID if not found, let user create new
      setValue('donor_id', '');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Datos del Donante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* RUT Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RUT Donante</label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register('donor_rut', {
                required: 'El RUT es requerido',
                onChange: (e: any) => setRut(e.target.value)
              })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
              placeholder="12.345.678-9"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || !rut}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {searching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {errors.donor_rut && <p className="mt-1 text-sm text-red-600">{errors.donor_rut.message}</p>}
          <p className="text-xs text-slate-500 mt-1">Ingresa el RUT para buscar si ya existe.</p>
        </div>

        {/* Names */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombres</label>
          <input
            type="text"
            {...register('donor_first_name', { required: 'El nombre es requerido' })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
          />
          {errors.donor_first_name && <p className="mt-1 text-sm text-red-600">{errors.donor_first_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Apellidos</label>
          <input
            type="text"
            {...register('donor_last_name', { required: 'El apellido es requerido' })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
          />
          {errors.donor_last_name && <p className="mt-1 text-sm text-red-600">{errors.donor_last_name.message}</p>}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Opcional)</label>
          <input
            type="email"
            {...register('donor_email')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
          />
        </div>

        <input type="hidden" {...register('donor_id')} />
      </div>
    </div>
  );
}
