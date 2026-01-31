import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts, Product, ProductInput } from '@/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import { ArrowLeft } from 'lucide-react';

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createProduct, updateProduct, findOne, loading: hookLoading } = useProducts();
  const [initialData, setInitialData] = useState<Product | undefined>(undefined);
  const [loadingData, setLoadingData] = useState(!!id);

  const isEdit = !!id;

  useEffect(() => {
    async function loadProduct() {
      if (id) {
        const product = await findOne(id);
        if (product) {
          setInitialData(product);
        } else {
          navigate('/products'); // Redirect if not found
        }
        setLoadingData(false);
      }
    }
    loadProduct();
  }, [id, findOne, navigate]);

  const handleSubmit = async (data: ProductInput) => {
    let success = false;
    if (isEdit && id) {
      success = await updateProduct(id, data);
    } else {
      success = await createProduct(data);
    }

    if (success) {
      navigate('/products');
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loadingData) {
    return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-slate-500">Completa los datos del producto.</p>
        </div>
        <Link to="/products" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>

      <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
        <strong>Nota:</strong> Los productos son globales para todos los centros.
      </div>

      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={hookLoading}
        onCancel={handleCancel}
      />
    </div>
  );
}
