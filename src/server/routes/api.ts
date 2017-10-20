import { Data } from '../data';
import { Router, Request, Response } from 'express';
//const express = require('express');
const router = Router();
const data = new Data();

/**
 * USER API
 */
router.get('/users', (req: Request, res: Response) => {
    console.log("GET /users");
    data.getUsers()
        .then( result => res.json(result));
});

router.post('/users', (req: Request, res: Response) => {
    console.log("POST /users");
    var newUsername = req.body.newUsername;
    data.createUser(newUsername)
        .then(() => data.getUsers())
        .then(result => res.json(result));
})

router.delete('/users/:id', (req: Request, res: Response) => {
    console.log("DELETE /users/",req.params.id);
    data.deleteUser(req.params.id)
        .then(() => data.getUsers())
        .then(result => res.json({}));
})

/**
 * GIFT API
 */
router.get('/gifts/:id', (req: Request, res: Response) => {
    console.log("GET /gifts/", req.params.id);
    data.getGifts(req.params.id)
        .then( result => res.json(result));
});

router.post('/gifts', (req: Request, res: Response) => {
    console.log("POST /gifts");
    var title = req.body.title;
    var forUser = req.body.userFor;
    var where = req.body.where;
    var cost = req.body.cost;

    data.createGift(title, cost, where, forUser)
        .then(() => data.getGifts(forUser))
        .then(result => res.json(result));
})

router.put('/gifts', (req: Request, res: Response) => {
    console.log("PUT /gifts");
})

router.delete('/gifts/:id', (req: Request, res: Response) => {
    console.log("DELETE /gifts/",req.params.id);
    data.deleteGift(req.params.id)
        .then(result => res.json({}));
})



module.exports = router; 