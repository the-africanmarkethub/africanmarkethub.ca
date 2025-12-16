"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  sales_prices?: number;
  image: string;
  qty: number;
  stockQty?: number;
  stock?: boolean;
  description?: string;
  color?: string;
  size?: string;
  slug?: string;
  type?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // const addToCart = (item: CartItem) => {
  //   setCart((prev) => {
  //     const existing = prev.find((c) => c.id === item.id);
  //     if (existing) {
  //       return prev.map((c) =>
  //         c.id === item.id ? { ...c, qty: c.qty + item.qty } : c
  //       );
  //     }
  //     return [...prev, item];
  //   });
  // };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);

      if (existing) {
        const newQty = Math.min(
          existing.qty + item.qty,
          item.stockQty ?? Infinity
        );

        return prev.map((c) => (c.id === item.id ? { ...c, qty: newQty } : c));
      }

      return [
        ...prev,
        {
          ...item,
          qty: Math.min(item.qty, item.stockQty ?? item.qty),
        },
      ];
    });
  };


  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

 const updateQty = (id: number, qty: number) => {
   setCart((prev) =>
     prev.map((c) =>
       c.id === id
         ? {
             ...c,
             qty: Math.max(1, Math.min(qty, c.stockQty ?? qty)),
           }
         : c
     )
   );
 };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
