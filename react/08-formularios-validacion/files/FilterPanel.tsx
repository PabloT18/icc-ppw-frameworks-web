import { useState } from 'react'
import type { ProductFilters } from '@/types/product.types'
import { FILTROS_INICIALES } from '@/types/product.types'
import styles from './FilterPanel.module.css'

interface FilterPanelProps {
    filtros: ProductFilters
    onAplicar: (filtros: ProductFilters) => void
}

function FilterPanel({ filtros, onAplicar }: FilterPanelProps) {
    const [form, setForm] = useState<ProductFilters>(filtros)
    const [errors, setErrors] = useState<{ precioMin?: string; precioMax?: string }>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        const esNumerico = ['precioMin', 'precioMax', 'ratingMin'].includes(name)
        setForm(prev => ({ ...prev, [name]: esNumerico ? Number(value) : value }))
        setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    const validar = (): boolean => {
        const nuevosErrors: typeof errors = {}

        if (form.precioMin < 0) {
            nuevosErrors.precioMin = 'El precio minimo no puede ser negativo'
        }
        if (form.precioMax < form.precioMin) {
            nuevosErrors.precioMax = 'El precio maximo debe ser mayor al minimo'
        }

        setErrors(nuevosErrors)
        return Object.keys(nuevosErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validar()) {
            onAplicar(form)
        }
    }

    const handleLimpiar = () => {
        setForm(FILTROS_INICIALES)
        setErrors({})
        onAplicar(FILTROS_INICIALES)
    }

    return (
        <form className={styles.panel} onSubmit={handleSubmit}>
            <h3 className={styles.titulo}>Filtros</h3>

            <div className={styles.grupo}>
                <label className={styles.label}>Rango de precio</label>
                <div className={styles.fila}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="number"
                            name="precioMin"
                            value={form.precioMin}
                            onChange={handleChange}
                            placeholder="Min"
                            className={`${styles.input} ${errors.precioMin ? styles.inputError : ''}`}
                            min={0}
                        />
                        {errors.precioMin && <span className={styles.error}>{errors.precioMin}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            type="number"
                            name="precioMax"
                            value={form.precioMax}
                            onChange={handleChange}
                            placeholder="Max"
                            className={`${styles.input} ${errors.precioMax ? styles.inputError : ''}`}
                            min={0}
                        />
                        {errors.precioMax && <span className={styles.error}>{errors.precioMax}</span>}
                    </div>
                </div>
            </div>

            <div className={styles.grupo}>
                <label className={styles.label}>Rating minimo: {form.ratingMin.toFixed(1)}</label>
                <input
                    type="range"
                    name="ratingMin"
                    value={form.ratingMin}
                    onChange={handleChange}
                    min={0}
                    max={5}
                    step={0.5}
                    className={styles.range}
                />
                <div className={styles.fila} style={{ justifyContent: 'space-between' }}>
                    <span className={styles.rangeLabel}>0</span>
                    <span className={styles.rangeLabel}>5</span>
                </div>
            </div>

            <div className={styles.grupo}>
                <label className={styles.label} htmlFor="ordenar">Ordenar por</label>
                <select
                    id="ordenar"
                    name="ordenar"
                    value={form.ordenar}
                    onChange={handleChange}
                    className={styles.select}
                >
                    <option value="nombre-asc">Nombre A-Z</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="rating-desc">Mejor valorados</option>
                </select>
            </div>

            <div className={styles.botones}>
                <button type="button" className={styles.btnLimpiar} onClick={handleLimpiar}>
                    Limpiar
                </button>
                <button type="submit" className={styles.btnAplicar}>
                    Aplicar filtros
                </button>
            </div>
        </form>
    )
}

export default FilterPanel
