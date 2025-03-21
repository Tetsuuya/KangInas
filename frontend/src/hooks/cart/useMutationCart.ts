import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, removeFromCart, updateCartItemQuantity } from '../../api/cart/cartApi';
import { CartItem } from '../../utils/types';

export const useMutationCart = () => {
  const queryClient = useQueryClient();

  const addItemMutation = useMutation<CartItem, Error, { productId: number; quantity: number }, { previousCart: CartItem[] }>({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      
      const newCart = [...previousCart];
      const existingItem = newCart.find(item => item.product === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        newCart.push({
          id: Date.now(),
          product: productId,
          quantity,
          product_name: '',  // Will be updated after server response
          product_price: 0
        });
      }

      queryClient.setQueryData<CartItem[]>(['cart'], newCart);
      return { previousCart };
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<CartItem[]>(['cart'], context.previousCart);
      }
      window.alert('Failed to add item to cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeItemMutation = useMutation<void, Error, number, { previousCart: CartItem[] }>({
    mutationFn: removeFromCart,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      const newCart = previousCart.filter((item: CartItem) => item.product !== productId);
      queryClient.setQueryData<CartItem[]>(['cart'], newCart);
      return { previousCart };
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<CartItem[]>(['cart'], context.previousCart);
      }
      window.alert('Failed to remove item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const updateQuantityMutation = useMutation<CartItem, Error, { productId: number; quantity: number }, { previousCart: CartItem[] }>({
    mutationFn: ({ productId, quantity }) => updateCartItemQuantity(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      const newCart = previousCart.map((item: CartItem) =>
        item.product === productId ? { ...item, quantity } : item
      );
      queryClient.setQueryData<CartItem[]>(['cart'], newCart);
      return { previousCart };
    },
    onError: (_, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<CartItem[]>(['cart'], context.previousCart);
      }
      window.alert('Failed to update quantity');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  return {
    addItemMutation,
    removeItemMutation,
    updateQuantityMutation
  };
};