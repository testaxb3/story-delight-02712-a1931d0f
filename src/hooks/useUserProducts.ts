import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PurchasedProduct {
  id: string;
  name: string;
  type: string;
  price?: number;
  purchased_at: string;
}

interface ProductUnlock {
  product_id: string;
  unlocks: string[];
}

/**
 * Hook to manage user's purchased products and unlock logic
 * Queries approved_users.products JSONB array and product_config for unlocks
 */
export function useUserProducts() {
  const { user } = useAuth();

  // Fetch user's purchased products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['user-products', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      const { data, error } = await supabase
        .from('approved_users')
        .select('products')
        .eq('email', user.email.toLowerCase())
        .single();

      if (error) {
        console.error('Error fetching user products:', error);
        return [];
      }

      return (data?.products as PurchasedProduct[]) || [];
    },
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch product config to map product_id to unlocks
  const { data: productConfig = [], isLoading: isLoadingConfig } = useQuery({
    queryKey: ['product-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_config')
        .select('product_id, unlocks');

      if (error) {
        console.error('Error fetching product config:', error);
        return [];
      }

      return data as ProductUnlock[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour (config changes rarely)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const isLoading = isLoadingProducts || isLoadingConfig;

  /**
   * Check if user has purchased a specific product by product_id
   */
  const hasProduct = (productId: string): boolean => {
    return products.some(p => String(p.id) === String(productId));
  };

  /**
   * Check if user has a specific unlock key (e.g., 'audio_lessons', 'calm_mom_ebook')
   */
  const hasUnlock = (unlockKey: string): boolean => {
    // Get all product IDs user has purchased
    const purchasedProductIds = products.map(p => String(p.id));

    // Check if any of those products grant the requested unlock
    return productConfig.some(config => 
      purchasedProductIds.includes(config.product_id) &&
      (config.unlocks as string[]).includes(unlockKey)
    );
  };

  /**
   * Get all unlock keys the user has access to
   */
  const getAllUnlocks = (): string[] => {
    const purchasedProductIds = products.map(p => String(p.id));
    const unlocks = new Set<string>();

    productConfig.forEach(config => {
      if (purchasedProductIds.includes(config.product_id)) {
        (config.unlocks as string[]).forEach(unlock => unlocks.add(unlock));
      }
    });

    return Array.from(unlocks);
  };

  /**
   * Check if user has app access (purchased main product)
   */
  const hasAppAccess = (): boolean => {
    return hasUnlock('app_access');
  };

  return {
    products,
    isLoading,
    hasProduct,
    hasUnlock,
    getAllUnlocks,
    hasAppAccess,
  };
}
