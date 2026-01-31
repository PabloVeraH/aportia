import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, Product } from '@/hooks/useProducts';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

export default function ProductList() {
  const { findAll, deleteProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const data = await findAll();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [findAll]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const success = await deleteProduct(id);
      if (success) {
        loadProducts();
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="p-8 text-center text-gray-500">Cargando productos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Productos</h1>
          <p className="text-slate-500">Administra el catálogo de productos disponibles.</p>
        </div>
        <Link
          to="/products/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm upppercase font-semibold">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Unidad</th>
              <th className="p-4">Código</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <Package className="h-10 w-10 text-slate-300 mb-2" />
                    <p>No se encontraron productos.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                    <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-full dark:bg-slate-700 dark:text-slate-300">
                      {product.unit}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {product.barcode || '-'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${product.active
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                    >
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
