import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from './Badge'

describe('Badge', () => {
    it('renderiza el texto correctamente', () => {
        render(<Badge texto="electronica" tipo="categoria" />)
        expect(screen.getByText('electronica')).toBeInTheDocument()
    })

    it('renderiza sin lanzar errores con diferentes tipos', () => {
        const { rerender } = render(<Badge texto="test" tipo="categoria" />)
        expect(screen.getByText('test')).toBeInTheDocument()

        rerender(<Badge texto="test" tipo="rating" />)
        expect(screen.getByText('test')).toBeInTheDocument()

        rerender(<Badge texto="test" tipo="descuento" />)
        expect(screen.getByText('test')).toBeInTheDocument()
    })

    it('el elemento Badge es un span', () => {
        render(<Badge texto="novedad" tipo="categoria" />)
        const badge = screen.getByText('novedad')
        expect(badge.tagName.toLowerCase()).toBe('span')
    })
})
