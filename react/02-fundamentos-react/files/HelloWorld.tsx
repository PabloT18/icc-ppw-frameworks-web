function HelloWorld() {
    const nombreSitio = 'ReactStore'
    const descripcion = 'Tu tienda de productos favorita'
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <>
            <header style={{ background: '#1a1a1a', color: 'white', padding: '1rem' }}>
                <h1>{nombreSitio}</h1>
            </header>
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <p>{descripcion}</p>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                    {fechaActual}
                </p>
            </main>
        </>
    )
}

export default HelloWorld
