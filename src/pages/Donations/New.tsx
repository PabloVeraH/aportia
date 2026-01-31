import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useDonations, CreateDonationPayload } from '@/hooks/useDonations';
import { useCenter } from '@/context/CenterContext';
import { DonorForm } from '@/components/donations/DonorForm';
import { DonationItems } from '@/components/donations/DonationItems';
import { Link } from 'react-router-dom';

export default function NewDonation() {
  const navigate = useNavigate();
  const { createDonation, loading: submitting, error: submitError } = useDonations();
  const { activeCenter } = useCenter();

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<CreateDonationPayload>({
    defaultValues: {
      items: [],
      donor_rut: '',
      donor_first_name: '',
      donor_last_name: '',
      donor_email: '',
      donor_id: ''
    }
  });

  const onSubmit = async (data: CreateDonationPayload) => {
    if (!activeCenter) {
      alert('Debes seleccionar un centro activo primero.');
      return;
    }

    const payload = {
      ...data,
      center_id: activeCenter.id
    };

    const success = await createDonation(payload);
    if (success) {
      navigate('/');
    }
  };

  if (!activeCenter) {
    return (
      <div className="p-8 text-center">
        <p>Por favor, selecciona un centro operativo en el Dashboard antes de continuar.</p>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 block">Volver al Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Registrar Donación</h1>
          <p className="text-slate-500">Centro: <span className="font-medium text-slate-700 dark:text-slate-300">{activeCenter.name}</span></p>
        </div>
        <Link to="/" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <DonorForm register={register} setValue={setValue} errors={errors} />

        <DonationItems
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
        />

        <div className="flex justify-end gap-4 mt-8">
          <Link to="/" className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? 'Guardando...' : (
              <>
                <Save className="h-4 w-4" /> Registrar Donación
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
