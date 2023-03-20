const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const toyService = require('../toy/toy.service')
const authService = require('../auth/auth.service')
const asyncLocalStorage = require('../../services/als.service')
// const socketService = require('../../services/socket.service')
const reviewService = require('./review.service')

async function getReviews(req, res) {
    try {
        const filterBy = {
            toyId: req.query.toyId,
            userId: req.query.userId,
            reviewId: req.query.reviewId
        }
        const reviews = await reviewService.query(filterBy)
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

async function deleteReview(req, res) {
    try {
        const deletedCount = await reviewService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove review' })
        }
    } catch (err) {
        logger.error('Failed to delete review', err)
        res.status(500).send({ err: 'Failed to delete review' })
    }
}


async function addReview(req, res) {
    
    // var {loggedinUser} = req
    const { loggedinUser } = asyncLocalStorage.getStore()
 
    try {
        var review = req.body
        review.userId = loggedinUser._id
        review = await reviewService.add(review)
        
        // prepare the updated review for sending out
        review.toy = await toyService.getById(review.toyId)
        delete review.toy.createdAt
        delete review.toy.inStock
        delete review.toy.labels

        review.user = loggedinUser

        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)
        delete review.userId
        delete review.toyId

        // socketService.broadcast({type: 'review-added', data: review, userId: loggedinUser._id})
        // socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUser._id})
        
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(review)

    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

module.exports = {
    getReviews,
    deleteReview,
    addReview
}