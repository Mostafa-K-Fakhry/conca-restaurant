"use client";

import { useCart } from "../context/CartContext";

type Props = {
  product: { id: string; nameAr: string };
  variant: { id: string; nameAr: string; price: string };
};

export default function AddToCartButton({ product, variant }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          productId: product.id,
          nameAr: product.nameAr,
          variantId: variant.id,
          variantName: variant.nameAr,
          price: Number(variant.price),
          quantity: 1,
        })
      }
      className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-conca-gold active:scale-95 transition-all shadow-md cursor-pointer"
    >
      +
    </button>
  );
}