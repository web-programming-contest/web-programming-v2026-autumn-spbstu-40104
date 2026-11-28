import {useState} from 'react';

import type {Product} from '../../types/product';

import {useCartStore, useProductQuantity} from '../../store/cartStore';

import {ProductModal} from '../ProductModal/ProductModal';

import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  showCartControls?: boolean;
}

export default function ProductCard({
  product,
  showCartControls = true,
}: ProductCardProps) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const quantity = useProductQuantity(product.id);

  const addProduct = useCartStore((state) => state.addProduct);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  return (
    <>
      <article className={styles.card}>
        <button
          type="button"
          className={styles.openDetails}
          aria-label={`Подробнее: ${product.name}`}
          aria-haspopup="dialog"
          onClick={() => setIsProductModalOpen(true)}
        />

        <div className={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />

          <div className={styles.labels}>
            {product.isNew && <span className={styles.new}>Новинка</span>}

            {product.isHit && <span className={styles.hit}>Хит</span>}
          </div>
        </div>

        <div className={styles.price}>
          {product.price.toLocaleString('ru-RU')} ₽
        </div>

        <div className={styles.name}>{product.name}</div>

        <div className={styles.rating}>
          <span>★</span> {product.rating}
        </div>

        {showCartControls &&
          (quantity === 0 ? (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addProduct(product)}
            >
              В корзину
            </button>
          ) : (
            <div className={styles.quantity}>
              <span className={styles.inCart}>В корзине</span>

              <button
                type="button"
                aria-label="Уменьшить количество"
                onClick={() => decreaseQuantity(product.id)}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Увеличить количество"
                onClick={() => increaseQuantity(product.id)}
              >
                +
              </button>
            </div>
          ))}
      </article>

      {isProductModalOpen && (
        <ProductModal
          product={product}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
        />
      )}
    </>
  );
}
