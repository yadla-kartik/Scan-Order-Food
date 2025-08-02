const express = require('express');
const { route } = require('./user');
const { checkForAuthAndRedirect } = require('../middlewares/auth');
const Food = require('../models/menu');
const router = express.Router();

router.get('/payment', checkForAuthAndRedirect('userToken'), async(req, res)=>{
    try{
      if(!req.user){
        res.redirect('/user')
      }
      res.render('payment');
    }
    catch(err){
      console.error('Error fetching food items:', err.message);
      res.status(500).send('Internal Server Error');
    }
})
router.post('/payment-success', checkForAuthAndRedirect('userToken'), async (req, res) => {
  const userId = req.user._id;

  try {
    const updated = await Food.updateMany(
      { "userItem.createdBy": userId },
      {
        $set: {
          "userItem.$[elem].paymentStatus": "Payment Done",
        },
      },
      {
        arrayFilters: [{ "elem.createdBy": userId }],
      }
    );

    res.status(200).json({ message: 'Payment status updated successfully', updated });
  } catch (err) {
    console.error('Error updating payment status:', err.message);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/coc', checkForAuthAndRedirect('userToken'), async (req, res) => {
  const userId = req.user._id;
  try {
    await Food.updateMany(
      { "userItem.createdBy": userId },
      {
        $set: {
          "userItem.$[elem].paymentStatus": "Cash on Counter",
        },
      },
      {
        arrayFilters: [{ "elem.createdBy": userId }],
      }
      
    );
    console.log("Success")
  } catch (err) {
    console.error('Error updating payment status:', err.message);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router
  