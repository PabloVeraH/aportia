import { useForm } from 'react-hook-form';
import { ProductInput, Product } from '@/hooks/useProducts';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductInput) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, loading, onCancel }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductInput>({
    defaultValues: {
      name: initialData?.name || '',
      barcode: initialData?.barcode || '',
      unit: initialData?.unit || '',
      active: initialData ? initialData.active : true, // Default to active for new
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es requerido' })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
            placeholder="Ej: Arroz Grado 2"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Barcode */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código de Barras (Opcional)</label>
          <input
            type="text"
            {...register('barcode')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
            placeholder="Ej: 7801234567890"
          />
        </div>

        {/* Unit */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unidad de Medida</label>
          <select
            {...register('unit', { required: 'La unidad es requerida' })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
          >
            <option value="">Selecciona una unidad</option>
            <option value="Kg">Kilogramo (Kg)</option>
            <option value="Lt">Litro (Lt)</option>
            <option value="Unidad">Unidad</option>
            <option value="Paquete">Paquete</option>
            <option value="Caja">Caja</option>
            <option value="Saco">Saco</option>
          </select>
          {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
        </div>

        {/* Active */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="active"
            {...register('active')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
            Producto Activo
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}
