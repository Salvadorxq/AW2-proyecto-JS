import express from 'express'
import fs from 'fs'

const app = express()

app.use(express.json())

const usuarios = JSON.parse(fs.readFileSync('./usuarios.json', 'utf-8'))
const productos = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'))
const ventas = JSON.parse(fs.readFileSync('./ventas.json', 'utf-8'))

const port = 3000

app.listen(port, () => {
    console.log(`Servidor funcionando en puerto ${port}`)
})


app.get('/usuarios', (req, res) => {
    res.json(usuarios)
})

app.get('/productos', (req, res) => {
    res.json(productos)
})



app.post('/usuarios', (req, res) => {
    const nuevoUsuario = req.body

    usuarios.push(nuevoUsuario)

    res.json(nuevoUsuario)
})

app.post('/ventas', (req, res) => {
    const nuevaVenta = req.body

    ventas.push(nuevaVenta)

    res.json(nuevaVenta)
})



app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const producto = productos.find(producto => producto.id === id)

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    producto.precio = req.body.precio

    res.json(producto)
})



app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const productoEnVenta = ventas.some(venta =>
        venta.productos.some(producto => producto.id_producto === id)
    )

    if (productoEnVenta) {
        return res.status(400).json({
            mensaje: 'No se puede eliminar el producto porque está relacionado con una venta'
        })
    }

    const indice = productos.findIndex(producto => producto.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    const productoEliminado = productos.splice(indice, 1)

    res.json({
        mensaje: 'Producto eliminado correctamente',
        producto: productoEliminado[0]
    })
})