const express = require('express');
const Food = require('../models/menu');

const router = express.Router();

router.post('/item', async(req, res)=>{
    try{
    const { name, description, price} = req.body;
    
        await Food.create({
           userItem:[{
                name,
                description,
                price,
                createdBy: user._id,
                quantity: 1,
           }],
        })
        res.status(200).json({ message: 'Item added to cart successfully!' });
    } catch (error){
        console.log(error);
    }

})


router.post('/confirm-order', async (req, res) => {
    const { paymentMethod, userId } = req.body;
  
    // Example logic: Update the order with the payment method
    try {
      await Food.updateMany(
        { 'userItem.createdBy': userId }, 
        { $set: { 'userItem.$[].paymentStatus': 'Pending', 'userItem.$[].paymentMethod': paymentMethod } }
      );
      return res.redirect('/orderBill')
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong!");
    }
  });

router.post('/paid', async (req, res) => {
    const { paymentMethod, userId } = req.body;
  
    // Example logic: Update the order with the payment method
    try {
      await Food.updateMany(
        { 'userItem.createdBy': userId }, 
        { $set: { 'userItem.$[].paymentStatus': 'Success', 'userItem.$[].paymentMethod': paymentMethod } }
      );
     return res.redirect('/orderBill')
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong!");
    }
  });
  
module.exports = router;