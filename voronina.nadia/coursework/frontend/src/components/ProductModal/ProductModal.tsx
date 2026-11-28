import {useNavigate} from 'react-router-dom';

import type {Product} from '../../types/product';

import {useCartStore, useProductQuantity} from '../../store/cartStore';

import {useAuthStore} from '../../store/authStore';

import {Modal} from '../Modal/Modal';
import {Button} from '../Button/Button';

import styles from './ProductModal.module.scss';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({product, isOpen, onClose}: ProductModalProps) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const quantity = useProductQuantity(product.id);

  const addProduct = useCartStore((state) => state.addProduct);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  function handleAddProduct() {
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }

    addProduct(product);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      size="wide"
      hideTitle
    >
      <div className={styles.product}>
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

        <div className={styles.information}>
          <h2 className={styles.name}>{product.name}</h2>

          <div className={styles.rating}>
            <span>★</span>

            {product.rating.toLocaleString('ru-RU')}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.specifications}>
            <h3>Характеристики</h3>

            <dl className={styles.specificationList}>
              {Object.entries(product.specifications).map(([name, value]) => (
                <div className={styles.specification} key={name}>
                  <dt>{name}</dt>

                  <span className={styles.line} aria-hidden="true" />

                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.purchase}>
            <div className={styles.price}>
              {product.price.toLocaleString('ru-RU')} ₽
            </div>

            {!user || quantity === 0 ? (
              <Button icon="/images/icons/card.svg" onClick={handleAddProduct}>
                В корзину
              </Button>
            ) : (
              <div className={styles.cartControls}>
                <div className={styles.quantity}>
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

                <span className={styles.inCart}>
                  <img src="/images/icons/card.svg" alt="" />В корзине{' '}
                  {quantity} шт.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
