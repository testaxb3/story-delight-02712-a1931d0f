import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { notificationManager } from "@/lib/notifications";

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

// Product-specific notification messages
const PRODUCT_MESSAGES: Record<string, { title: string; description: string; route: string }> = {
  '27499673': { 
    title: '🎉 NEP System Unlocked!', 
    description: 'Your access to Scripts, Videos and Ebooks is now active!',
    route: '/scripts'
  },
  '27577169': { 
    title: '🎉 NEP System Unlocked!', 
    description: 'Your access to Scripts, Videos and Ebooks is now active!',
    route: '/scripts'
  },
  '27845678': { 
    title: '🎧 NEP Listen Unlocked!', 
    description: 'Premium audio tracks are now available!',
    route: '/listen'
  },
  '27851448': { 
    title: '🎧 NEP Listen Unlocked!', 
    description: 'Premium audio tracks are now available!',
    route: '/listen'
  },
};

/**
 * Detect new products by comparing old and new arrays
 */
const detectNewProducts = (
  oldProducts: PurchasedProduct[], 
  newProducts: PurchasedProduct[]
): PurchasedProduct[] => {
  const oldIds = new Set(oldProducts.map(p => String(p.id)));
  return newProducts.filter(p => !oldIds.has(String(p.id)));
};

/**
 * Notify user about unlocked product via toast and push
 */
const notifyProductUnlocked = async (product: PurchasedProduct) => {
  const message = PRODUCT_MESSAGES[String(product.id)] || {
    title: '🎉 Content Unlocked!',
    description: `${product.name} is now available!`,
    route: '/bonuses'
  };
  
  // Toast notification (in-app)
  toast.success(message.title, {
    description: message.description,
    duration: 6000,
    action: {
      label: 'View',
      onClick: () => {
        window.location.href = message.route;
      }
    }
  });
  
  // Local push notification (if app in background)
  try {
    if (notificationManager.getPermission() === 'granted') {
      await notificationManager.showNotification(message.title, {
        body: message.description,
        tag: 'product-unlocked',
        data: { productId: product.id, route: message.route }
      });
    }
  } catch (error) {
    console.error('Failed to show push notification:', error);
  }
};

/**
 * Hook to manage user's purchased products and unlock logic
 * Queries approved_users.products JSONB array and product_config for unlocks
 */
export function useUserProducts() {
  const { user } = useAuth();
  const previousProductsRef = useRef<PurchasedProduct[]>([]);
  const isInitializedRef = useRef(false);
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
  const queryClient = useQueryClient();

  // Keep previousProductsRef synced with initial/fetched products
  useEffect(() => {
    if (products.length > 0 && !isInitializedRef.current) {
      previousProductsRef.current = products;
      isInitializedRef.current = true;
    }
  }, [products]);

  // Real-time subscription for instant updates when purchases are made
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel('user-products-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'approved_users',
          filter: `email=eq.${user.email.toLowerCase()}`
        },
        (payload) => {
          const newProducts = ((payload.new as any)?.products as PurchasedProduct[]) || [];
          const oldProducts = previousProductsRef.current;
          
          // Only notify if we have initialized state (prevents false positives on first load)
          if (isInitializedRef.current) {
            const addedProducts = detectNewProducts(oldProducts, newProducts);
            
            // Notify for each new product
            addedProducts.forEach(product => {
              notifyProductUnlocked(product);
            });
          } else {
            // First realtime event before React Query loaded - initialize without notifications
            isInitializedRef.current = true;
          }
          
          // Update reference for next comparison
          previousProductsRef.current = newProducts;
          
          // Invalidate cache to refetch
          queryClient.invalidateQueries({ queryKey: ['user-products', user.email] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email, queryClient]);

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
