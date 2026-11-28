import type {CartItem as CartItemType} from '../../types/cart';

import {Checkbox} from '../Checkbox/Checkbox';

import styles from './CartItem.module.scss';

interface CartItemProps {
  item: CartItemType;
  selected: boolean;

  onSelect: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export function CartItem({
  item,
  selected,
  onSelect,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const {product, quantity} = item;

  const totalPrice = product.price * quantity;

  return (
    <article className={styles.cartItem}>
      <Checkbox
        checked={selected}
        aria-label={`Выбрать ${product.name}`}
        onChange={() => onSelect(product.id)}
      />

      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>

      <h3 className={styles.name}>{product.name}</h3>

      <div className={styles.quantity}>
        <button
          type="button"
          className={styles.quantityButton}
          disabled={quantity <= 1}
          onClick={() => onDecrease(product.id)}
          aria-label="Уменьшить количество"
        >
          −
        </button>

        <span className={styles.quantityValue}>{quantity}</span>

        <button
          type="button"
          className={styles.quantityButton}
          onClick={() => onIncrease(product.id)}
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>

      <span className={styles.price}>
        {totalPrice.toLocaleString('ru-RU')} ₽
      </span>

      <button
        type="button"
        className={styles.removeButton}
        onClick={() => onRemove(product.id)}
      >
        <span aria-hidden="true">×</span>
        Удалить
      </button>
    </article>
  );
}
