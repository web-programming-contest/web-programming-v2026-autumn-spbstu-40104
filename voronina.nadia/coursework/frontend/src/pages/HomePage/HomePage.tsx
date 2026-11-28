import {useEffect, useState} from 'react';

import {getGoods} from '../../api/goods';
import type {Product} from '../../types/product';

import {Carousel} from '../../components/Carousel/Carousel';
import {Advantages} from '../../components/Advantages/Advantages';
import {Contacts} from '../../components/Contacts/Contacts';

import styles from './HomePage.module.scss';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getGoods()
      .then((data) => {
        if (active) {
          setProducts(data);
        }
      })
      .catch(() => {
        if (active) {
          setError('Не удалось загрузить товары');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const hitProducts = products.filter((product) => product.isHit);

  const newProducts = products.filter((product) => product.isNew);

  return (
    <div className={`container ${styles.homePage}`}>
      <section className={styles.banner} aria-label="Специальное предложение">
        <img
          src="/images/banners/super-sale-banner.png"
          alt="Super Sale — умная колонка Яндекс Станция Лайт всего за 4 990 рублей."
          className={styles.bannerImage}
          width={1240}
          height={560}
        />
      </section>

      {isLoading ? (
        <p className={styles.status}>Загрузка товаров...</p>
      ) : error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        <>
          <Carousel
            title="Хиты продаж"
            description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
            products={hitProducts}
            variant="hit"
          />

          <Carousel
            title="Новинки"
            description="Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники"
            products={newProducts}
            variant="new"
          />
        </>
      )}

      <Advantages />

      <Contacts />
    </div>
  );
}
