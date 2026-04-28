import type { Product } from '@/types/product.types'
import Badge from '@/components/Badge'
import styles from './ProductCard.module.css'

interface ProductCardProps {
    product: Product
}

function ProductCard({ product }: ProductCardProps) {
    const { title, price, thumbnail, category, rating } = product

    return (
        <article className={styles.card}>
            <img
                src={thumbnail}
                alt={title}
                className={styles.image}
                loading="lazy"
            />
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.price}>${price.toFixed(2)}</p>
                <div className={styles.footer}>
                    <Badge texto={category} tipo="categoria" />
                    <span className={styles.rating}>★ {rating.toFixed(1)}</span>
                </div>
            </div>
        </article>
    )
}

export default ProductCard
