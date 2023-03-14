const express = require('express')
const toyService = require('./services/toy.service')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3030
const corsOptions = {
  origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
  ],
  credentials: true
}

// Express App Configuration:
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())

// app.get('/**', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// LIST
app.get('/api/toy', (req, res) => {
  // const filterBy = req.query
  const filterBy = {
    name: req.query.name || '',
    labels: req.query.labels || [],
    inStock: req.query.inStock === 'true' || false,
    sortBy: req.query.sortBy || {},
    page: req.query.page || 0,
    maxPrice: req.query.maxPrice || 1000,
}

  toyService
    .query(filterBy)
    .then(toys => res.send(toys))
    .catch(err => res.status(500).send('Cannot get toys'))
})

// READ
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params

  toyService
    .getById(toyId)
    .then(toy => res.send(toy))
    .catch(err => res.status(500).send('Cannot get toy'))
})

// CREATE
app.post('/api/toy', (req, res) => {
  const toyToSave = {
    name: req.body.name,
    price: req.body.price,
    labels: req.body.labels,
    inStock: req.body.inStock,
}

  toyService
    .save(toyToSave)
    .then(savedToy => res.send(savedToy))
    .catch(err => res.status(500).send('Cannot save toy'))
})

// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  const toyToSave = {
    _id: req.body._id,
    name: req.body.name,
    price: req.body.price,
    labels: req.body.labels,
    inStock: req.body.inStock,
    createdAt: req.body.createdAt
}

  toyService
    .save(toyToSave)
    .then(savedToy => res.send(savedToy))
    .catch(err => res.status(500).send('Cannot save toy'))
})


app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  console.log("toyId: ", toyId);

  toyService
    .remove(toyId)
    .then(() => res.send('Removed!'))
    .catch(err => res.status(401).send(err))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
