import {useId, useState} from 'react';

import type {Product} from '../../types/product';
import ProductCard from '../ProductCard/ProductCard';

import styles from './Carousel.module.scss';

interface CarouselProps {
  title: string;
  description: string;
  products: Product[];
  variant: 'hit' | 'new';
}

const VISIBLE_COUNT = 3;

export function Carousel({
  title,
  description,
  products,
  variant,
}: CarouselProps) {
  const titleId = useId();
  const [startIndex, setStartIndex] = useState(0);

  const total = products.length;
  const canScroll = total > VISIBLE_COUNT;

  const visibleProducts = Array.from(
    {length: Math.min(VISIBLE_COUNT, total)},
    (_, index) => products[(startIndex + index) % total],
  );

  function handleNext() {
    if (!canScroll) {
      return;
    }

    setStartIndex((previous) => (previous + 1) % total);
  }

  function handlePrevious() {
    if (!canScroll) {
      return;
    }

    setStartIndex((previous) => (previous - 1 + total) % total);
  }

  return (
    <section className={styles.carousel} aria-labelledby={titleId}>
      <div className={styles.info}>
        <div className={`${styles.icon} ${styles[variant]}`}>
          {variant === 'hit' ? (
            <img src="/images/icons/fire.svg" alt="" />
          ) : (
            <img src="/images/icons/sparkles.svg" alt="" />
          )}
        </div>

        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>

        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.slider}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.previous}`}
          onClick={handlePrevious}
          disabled={!canScroll}
          aria-label={`Предыдущий товар: ${title}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M15 5L8 12L15 19" />
          </svg>
        </button>

        <div className={styles.products}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showCartControls={false}
            />
          ))}

          {total === 0 && (
            <p className={styles.empty}>Товары пока отсутствуют</p>
          )}
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={handleNext}
          disabled={!canScroll}
          aria-label={`Следующий товар: ${title}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M9 5L16 12L9 19" />
          </svg>
        </button>
      </div>
    </section>
  );
}
