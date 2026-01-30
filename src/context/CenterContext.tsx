import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface Center {
  id: string;
  name: string;
  role: string;
}

interface CenterContextType {
  centers: Center[];
  activeCenter: Center | null;
  isAdmin: boolean;
  loading: boolean;
  switchCenter: (centerId: string) => void;
}

const CenterContext = createContext<CenterContextType>({
  centers: [],
  activeCenter: null,
  isAdmin: false,
  loading: true,
  switchCenter: () => { },
});

export const useCenter = () => useContext(CenterContext);

export const CenterProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [activeCenter, setActiveCenter] = useState<Center | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCenters() {
      if (!user) {
        setCenters([]);
        setActiveCenter(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Check if system admin
        const { data: globalRole } = await supabase
          .from('global_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('active', true)
          .eq('is_deleted', false)
          .maybeSingle(); // Use maybeSingle to avoid 406/JSON errors if no rows

        const isSystemAdmin = globalRole?.role === 'system_admin';
        setIsAdmin(isSystemAdmin);

        // 2. Get user centers
        const { data: userCenters, error } = await supabase
          .from('user_center_roles')
          .select(`
            center_id,
            role,
            centers (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .eq('active', true);

        if (error) {
          console.error('Error fetching user centers:', error);
          return;
        }

        // Transform data
        const mappedCenters: Center[] = (userCenters || []).map((uc: any) => ({
          id: uc.centers.id,
          name: uc.centers.name,
          role: uc.role,
        }));

        setCenters(mappedCenters);

        // 3. Determine active center
        const storedCenterId = localStorage.getItem('activeCenterId');
        let selectedCenter = null;

        if (storedCenterId) {
          selectedCenter = mappedCenters.find((c) => c.id === storedCenterId);
        }

        // Default to first if no valid stored selection
        if (!selectedCenter && mappedCenters.length > 0) {
          selectedCenter = mappedCenters[0];
        }

        if (selectedCenter) {
          setActiveCenter(selectedCenter);
          localStorage.setItem('activeCenterId', selectedCenter.id);
        } else {
          setActiveCenter(null);
          localStorage.removeItem('activeCenterId');
        }

      } catch (err) {
        console.error('Unexpected error loading centers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCenters();
  }, [user]);

  const switchCenter = (centerId: string) => {
    const center = centers.find((c) => c.id === centerId);
    if (center) {
      setActiveCenter(center);
      localStorage.setItem('activeCenterId', center.id);
      // Optional: Force a reload if deep functionality depends on this,
      // but ideally state updates propagate through the app.
      window.location.reload();
    }
  };

  const value = {
    centers,
    activeCenter,
    isAdmin,
    loading,
    switchCenter,
  };

  return <CenterContext.Provider value={value}>{children}</CenterContext.Provider>;
};
