import { useState, useEffect } from 'react';
import { useFieldArray, Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Plus, Trash2, Search } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';

interface DonationItemsProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
}

export function DonationItems({ control, register, setValue, errors }: DonationItemsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { searchProducts } = useProducts();

  // Helper to append a new empty row
  const handleAddItem = () => {
    append({ product_id: '', product_name: '', quantity: 1, unit: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Items de la Donación</h2>
        <button
          type="button"
          onClick={handleAddItem}
          className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Agregar Item
        </button>
      </div>

      <div className="overflow-x-visible"> {/* Visible overflow for autocomplete dropdowns */}
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
            <tr>
              <th className="p-3 rounded-l-lg">Producto</th>
              <th className="p-3 w-32">Cantidad</th>
              <th className="p-3 w-24">Unidad</th>
              <th className="p-3 w-16 rounded-r-lg"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {fields.map((field, index) => (
              <ItemRow
                key={field.id}
                index={index}
                register={register}
                setValue={setValue}
                searchProducts={searchProducts}
                onRemove={() => remove(index)}
                errors={errors}
              />
            ))}
          </tbody>
        </table>

        {fields.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No hay items agregados.
          </div>
        )}
        {errors.items && <p className="mt-2 text-sm text-red-600 text-center">{errors.items.message || "Debe agregar al menos un item"}</p>}
      </div>
    </div>
  );
}

// Sub-component for individual rows to handle autocomplete state independently
function ItemRow({ index, register, setValue, searchProducts, onRemove, errors }: any) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Register hidden fields
  useEffect(() => {
    register(`items.${index}.product_id`, { required: true });
    register(`items.${index}.unit`);
  }, [register, index]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(`items.${index}.product_name`, query); // Maintain input state

    if (query.length >= 3) {
      const results = await searchProducts(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectProduct = (product: Product) => {
    setValue(`items.${index}.product_id`, product.id);
    setValue(`items.${index}.product_name`, product.name);
    setValue(`items.${index}.unit`, product.unit);
    setShowSuggestions(false);
  };

  return (
    <tr className="group">
      <td className="p-2 relative">
        <div className="relative">
          <input
            type="text"
            {...register(`items.${index}.product_name`, { required: "Seleccione un producto" })}
            onChange={handleSearch}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
            placeholder="Buscar producto..."
            autoComplete="off"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((p) => (
              <div
                key={p.id}
                onClick={() => selectProduct(p)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm"
              >
                {p.name} <span className="text-xs text-gray-500">({p.unit})</span>
              </div>
            ))}
          </div>
        )}
        {errors.items?.[index]?.product_name && <p className="text-xs text-red-600 mt-1">Requerido</p>}
      </td>
      <td className="p-2">
        <input
          type="number"
          {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1, required: true })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2 border"
          min="1"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          {...register(`items.${index}.unit`)}
          className="block w-full rounded-md border-gray-200 bg-slate-50 text-slate-500 sm:text-sm p-2 border"
          readOnly
        />
      </td>
      <td className="p-2 text-center">
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
