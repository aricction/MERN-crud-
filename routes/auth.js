const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { check , validationResult } = require('express-validator');
const auth = require('../middlewares/auth');

/** privat route, loggedin users can access it */ 
router.get('/', auth, async (req, res) => {
   try{
        const user = await (await userModel.findById(req.user.id)).select('-password');
        res.json(user);

   } catch (err){
       console.log(err.message);
       res.status(500).send('server error');

   }

});

router.post('/',[
    check('email', 'please enter valid email').isEmail(),
    check('password', 'please enter password').exists()
],
 async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()}
        ) ;  
    }

    const { email, password } = req.body;
    try{
        let user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'user not found with provided email'});
        }
        const checkpassword = await bcrypt.compare(password, user.password);
        if(!checkpassword) {
            return res.status(400).json({msg: 'wrong password'});
        }
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
    } catch (error){
        console.log(error.message);
        res.status(500).send('server error');

    }
});

module.exports = router;