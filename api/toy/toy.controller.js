const toyService = require('./toy.service.js')
const asyncLocalStorage = require('../../services/als.service')

const logger = require('../../services/logger.service')

async function getToys(req, res) {
  try {
    const filterBy = {
      name: req.query.name || '',
      labels: req.query.labels || [],
      inStock: req.query.inStock === 'true' || false,
      sortBy: req.query.sortBy || {},
      page: req.query.page || 0,
      maxPrice: req.query.maxPrice || 1000,
    }
    logger.debug('Getting toys', filterBy)
    const toys = await toyService.query(filterBy)
    res.json(toys)
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

async function getToyById(req, res) {
  try {
    const { toyId } = req.params
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

async function addToy(req, res) {
  const { loggedinUser } = asyncLocalStorage.getStore()

  try {
    const toy = req.body
    toy.owner = loggedinUser
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}


async function updateToy(req, res) {
  try {
    const toy = req.body
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}

async function removeToy(req, res) {
  try {
    const { id } = req.params
    await toyService.remove(id)
    res.send()
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

async function addToyMsg(req, res) {
  const { loggedinUser } = asyncLocalStorage.getStore()
  try {
    const { toyId } = req.params
    const msg = {
      txt: req.body.msg,
      by: loggedinUser
    }
    const savedMsg = await toyService.addToyMsg(toyId, msg)
    return res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}



async function removeToyMsg(req, res) {
  const { loggedinUser } = asyncLocalStorage.getStore()
  try {
    const { toyId } = req.params
    const { msgId } = req.params
    const msg = await toyService.getMsgById(toyId, msgId)
    if (loggedinUser._id !== msg.by._id) return res.status(401).send('Not Authenticated')

    const removedId = await toyService.removeToyMsg(toyId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy msg', err)
    res.status(500).send({ err: 'Failed to remove toy msg' })

  }
}

module.exports = {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  addToyMsg,
  removeToyMsg
}
