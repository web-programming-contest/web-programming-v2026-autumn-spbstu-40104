import {useState} from 'react';
import type {FormEvent} from 'react';

import type {CartItem} from '../../types/cart';

import type {DeliveryType, PaymentType, OrderRequest} from '../../types/order';

import {Input} from '../Input/Input';
import {Button} from '../Button/Button';
import {Checkbox} from '../Checkbox/Checkbox';
import {RadioButton} from '../RadioButton/RadioButton';
import {Select} from '../Select/Select';

import styles from './CheckoutForm.module.scss';

interface CheckoutFormProps {
  selectedItems: CartItem[];
  isSubmitting: boolean;
  onSubmit: (data: OrderRequest) => Promise<boolean>;
}

interface FormErrors {
  phone?: string;
  email?: string;
  address?: string;
  payment?: string;
  items?: string;
}

const paymentOptions = [
  {value: 'card', label: 'По карте'},
  {value: 'cash', label: 'Наличными'},
];

export function CheckoutForm({
  selectedItems,
  isSubmitting,
  onSubmit,
}: CheckoutFormProps) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [delivery, setDelivery] = useState<DeliveryType>('pickup');

  const [address, setAddress] = useState('');

  const [payment, setPayment] = useState<PaymentType | ''>('');

  const [packaging, setPackaging] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  function clearError(field: keyof FormErrors) {
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    const normalizedPhone = phone.trim();
    const digits = normalizedPhone.replace(/\D/g, '');

    if (!normalizedPhone) {
      newErrors.phone = 'Заполните обязательное поле';
    } else if (
      !/^\+?[0-9\s()-]{10,18}$/.test(normalizedPhone) ||
      digits.length < 10 ||
      digits.length > 15
    ) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Введите корректный E-mail';
    }

    if (delivery === 'delivery' && !address.trim()) {
      newErrors.address = 'Заполните обязательное поле';
    }

    if (!payment) {
      newErrors.payment = 'Выберите способ оплаты';
    }

    if (selectedItems.length === 0) {
      newErrors.items = 'Выберите товары для оформления заказа';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validate() || !payment) {
      return;
    }

    const orderData: OrderRequest = {
      items: selectedItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),

      phone: phone.trim(),
      email: email.trim() || null,

      delivery,
      address: delivery === 'delivery' ? address.trim() : null,

      payment,
      packaging,
    };

    const success = await onSubmit(orderData);

    if (success) {
      setPhone('');
      setEmail('');
      setDelivery('pickup');
      setAddress('');
      setPayment('');
      setPackaging(false);
      setErrors({});
    }
  }

  return (
    <section className={styles.checkout}>
      <h2 className={styles.title}>Оформление заказа</h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
      >
        <div className={styles.contactFields}>
          <Input
            label="Телефон"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            required
            fullWidth
            disabled={isSubmitting}
            error={errors.phone}
            onChange={(event) => {
              setPhone(event.target.value);
              clearError('phone');
            }}
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            fullWidth
            disabled={isSubmitting}
            error={errors.email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError('email');
            }}
          />
        </div>

        <div
          className={styles.deliveryOptions}
          role="group"
          aria-label="Способ получения"
        >
          <RadioButton
            name="delivery"
            label="Самовывоз"
            value="pickup"
            checked={delivery === 'pickup'}
            disabled={isSubmitting}
            onChange={() => {
              setDelivery('pickup');
              clearError('address');
            }}
          />

          <RadioButton
            name="delivery"
            label="Доставка"
            value="delivery"
            checked={delivery === 'delivery'}
            disabled={isSubmitting}
            onChange={() => setDelivery('delivery')}
          />
        </div>

        {delivery === 'delivery' && (
          <div className={styles.addressField}>
            <Input
              label="Адрес доставки"
              name="address"
              autoComplete="street-address"
              value={address}
              required
              fullWidth
              disabled={isSubmitting}
              error={errors.address}
              onChange={(event) => {
                setAddress(event.target.value);
                clearError('address');
              }}
            />
          </div>
        )}

        <Select
          label="Способ оплаты"
          name="payment"
          options={paymentOptions}
          value={payment}
          placeholder="Не выбрано"
          required
          disabled={isSubmitting}
          error={errors.payment}
          onChange={(event) => {
            const value = event.target.value;

            if (value === 'card' || value === 'cash') {
              setPayment(value);
              clearError('payment');
            }
          }}
        />

        <Checkbox
          label="Нужна упаковка"
          checked={packaging}
          disabled={isSubmitting}
          onChange={(event) => {
            setPackaging(event.target.checked);
          }}
        />

        {errors.items && selectedItems.length === 0 && (
          <p className={styles.error} role="alert">
            {errors.items}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Оформляем заказ...' : 'Оформить заказ'}
        </Button>
      </form>
    </section>
  );
}
