import {CheckoutForm} from '../../components/CheckoutForm/CheckoutForm';

import {createOrder} from '../../api/orders';
import {ApiError} from '../../api/client';

import type {Order, OrderRequest} from '../../types/order';

import {useState} from 'react';

import {useCartStore} from '../../store/cartStore';

import {CartItem} from '../../components/CartItem/CartItem';
import {EmptyCart} from '../../components/EmptyCart/EmptyCart';
import {Checkbox} from '../../components/Checkbox/Checkbox';
import {Modal} from '../../components/Modal/Modal';
import {Button} from '../../components/Button/Button';
import {OrderHistory} from '../../components/OrderHistory/OrderHistory';

import styles from './CartPage.module.scss';

type CartTab = 'cart' | 'history';

import {getProductWord} from '../../utils/getProductWord';

export function CartPage() {
  const items = useCartStore((state) => state.items);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeProducts = useCartStore((state) => state.removeProducts);

  const [activeTab, setActiveTab] = useState<CartTab>('cart');

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  const [isOrdering, setIsOrdering] = useState(false);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [orderError, setOrderError] = useState('');

  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.product.id),
  );

  const selectedQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const selectedTotal = selectedItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  function toggleProduct(id: number) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id],
    );
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.product.id));
    }
  }

  function confirmDelete() {
    removeProducts(deleteIds);

    setSelectedIds((previous) =>
      previous.filter((id) => !deleteIds.includes(id)),
    );

    setDeleteIds([]);
  }

  const productToDelete = items.find(
    (item) => item.product.id === deleteIds[0],
  );

  async function handleOrder(data: OrderRequest): Promise<boolean> {
    if (isOrdering) {
      return false;
    }

    setIsOrdering(true);
    setOrderError('');

    try {
      const order = await createOrder(data);

      const orderedIds = data.items.map((item) => item.product_id);

      removeProducts(orderedIds);

      setSelectedIds([]);

      if (useCartStore.getState().items.length === 0) {
        useCartStore.persist.clearStorage();
      }

      setCompletedOrder(order);

      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setOrderError('Сессия истекла. Войдите в аккаунт повторно.');
        } else if (error.status === 422) {
          setOrderError('Проверьте правильность заполнения данных заказа.');
        } else {
          setOrderError(error.message);
        }
      } else {
        setOrderError('Не удалось оформить заказ. Попробуйте позже.');
      }

      return false;
    } finally {
      setIsOrdering(false);
    }
  }

  return (
    <section className={styles.cartPage}>
      <div className={`container ${styles.container}`}>
        <nav className={styles.tabs} aria-label="Разделы корзины">
          <button
            type="button"
            aria-pressed={activeTab === 'cart'}
            className={`${styles.tab} ${
              activeTab === 'cart' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('cart')}
          >
            Корзина
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'history'}
            className={`${styles.tab} ${
              activeTab === 'history' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('history')}
          >
            История заказов
          </button>
        </nav>

        {activeTab === 'cart' ? (
          items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <section className={styles.cartContent} inert={isOrdering}>
                <div className={styles.toolbar}>
                  <Checkbox
                    label="Выбрать все"
                    checked={allSelected}
                    onChange={toggleAll}
                  />

                  {selectedItems.length > 0 && (
                    <button
                      type="button"
                      className={styles.deleteSelected}
                      onClick={() =>
                        setDeleteIds(
                          selectedItems.map((item) => item.product.id),
                        )
                      }
                    >
                      <span aria-hidden="true">×</span>

                      {allSelected ? 'Удалить все' : 'Удалить выбранные'}
                    </button>
                  )}
                </div>

                <div className={styles.items}>
                  {items.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      selected={selectedIds.includes(item.product.id)}
                      onSelect={toggleProduct}
                      onIncrease={increaseQuantity}
                      onDecrease={decreaseQuantity}
                      onRemove={(id) => setDeleteIds([id])}
                    />
                  ))}
                </div>

                <div className={styles.total}>
                  {selectedQuantity} {getProductWord(selectedQuantity)} на{' '}
                  {selectedTotal.toLocaleString('ru-RU')} ₽
                </div>
              </section>

              <CheckoutForm
                selectedItems={selectedItems}
                isSubmitting={isOrdering}
                onSubmit={handleOrder}
              />
            </>
          )
        ) : (
          <OrderHistory />
        )}
      </div>

      <Modal
        isOpen={deleteIds.length > 0}
        onClose={() => setDeleteIds([])}
        title="Вы действительно хотите удалить?"
        actions={
          <>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setDeleteIds([])}
            >
              Отмена
            </button>

            <Button onClick={confirmDelete}>Да, удалить</Button>
          </>
        }
      >
        <p>
          {deleteIds.length === 1
            ? productToDelete?.product.name
            : 'Выбранные товары будут удалены из корзины.'}
        </p>
      </Modal>

      <Modal
        isOpen={completedOrder !== null}
        onClose={() => setCompletedOrder(null)}
        title="Спасибо за заказ!"
        actions={<Button onClick={() => setCompletedOrder(null)}>Ок</Button>}
      >
        {completedOrder && (
          <div className={styles.orderSuccess}>
            <p>Спасибо, ваш заказ успешно оформлен.</p>

            <p>Номер заказа {completedOrder.id}.</p>

            <p>
              {completedOrder.delivery === 'delivery'
                ? 'Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для вас время доставки.'
                : 'Мы свяжемся с вами для уточнения деталей самовывоза.'}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(orderError)}
        onClose={() => setOrderError('')}
        title="Ошибка оформления заказа"
        actions={<Button onClick={() => setOrderError('')}>Ок</Button>}
      >
        <p>{orderError}</p>
      </Modal>
    </section>
  );
}
