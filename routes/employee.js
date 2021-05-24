const express = require('express');
const router = express.Router();
const { check , validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const EmpModel = require('../models/EmployeeModel');
const auth = require('../middlewares/auth');

/** show all employee */
router.get('/', auth, async (req, res) => {
  try {
     const employees = await EmpModel.find({ user: req.user}).sort({ date: -1 });
     res.json(employees);  

  } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
       
  }

}); 

/** save employee */
router.post('/',[auth, 
    check('name', 'Name is required').not().isEmpty(),
    check('email','please enter valid email').isEmail(),
    check('designation', 'please enter designation').not().isEmpty() 
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({erross: errors.array()});
    }
    const{name, email, phone, designation, salary} = req.body;
    try {
        const newEmp = new EmpModel ({
            name,
            email,
            phone,
            designation, 
            salary,
            user: req.user
        });
        const savedemp = await newEmp.save();
        res.json(savedemp);  
    } catch (err) {
        console.log(err.message);
      res.status(500).send('server error');
    }


});

/** edit employee */
router.put('/:id', auth, async(req, res) => {
   const {name, email, phone, designation, salary} = req.body;
   const empfields = {};
   if(name) empfields.name = name;
   if(email) empfields.email = email;
   if(designation) empfields.designation = designation;
   if(salary) empfields.salary = salary;
   if(phone) empfields.phone = phone;
   try {
       
     let employee = await EmpModel.findById(req.params.id);
     if(!employee){
         return res.status(404).json({msg: 'Employee not found..'})
     }
     employee = await EmpModel.findByIdAndUpdate(req.params.id,{
         $set: empfields
     }, {new: true});
     res.json(employee);

   } catch (err) {
       console.log(err.message);
       res.status(500).send('server error');
   }

});

/** delete  employee */
router.delete('/:id', auth, async (req, res) => {
    try {
        let employee = await EmpModel.findById(req.params.id);
        if(!employee){
            return res.status(401).json({msg: 'employee not found'});

        }
        await EmpModel.findByIdAndRemove(req.params.id);
        res.json({msg:' employee deleted'})

    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
        
    }
});

module.exports = router;