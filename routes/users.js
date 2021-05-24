const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { check , validationResult } = require('express-validator');

const userModel = require('../models/userModel');
/** register user router */

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'please enter valid email').isEmail(),
    check('password', 'please enter password with min 6 or more character').isLength({
        min: 6})


],  async (req, res)  => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()}) ;  
    }
    const {name, email, password} = req.body;
    try{
        /** if user already exists */
        let user =  await userModel.findOne({email});
        if(user){
            return res.status(400).json({msg: 'user already exits with email provided'});
        }

        /** if new user then save */
        user = new userModel({
            name,
            email,
            password
        })
        /** password convert into hash */

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
       const payload = {
           user: {
               id: user.id
           }
       };
       jwt.sign(payload, config.get('SecretKey'),{
           expiresIn: 360000
       },(err, token) => {
           if(err) throw err;
           res.json({token});
       })

    } catch(error) {

    }
});  

module.exports = router;
