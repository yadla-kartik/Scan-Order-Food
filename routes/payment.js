const express = require('express');
const { route } = require('./user');
const { checkForAuthAndRedirect } = require('../middlewares/auth');
const Food = require('../models/menu');
const User = require('../models/user');
const router = express.Router();

router.get('/payment', checkForAuthAndRedirect('userToken'), async(req, res)=>{
    try{
      if(!req.user){
        res.redirect('/user')
      }
      let userid = req.user._id;
      await User.findByIdAndUpdate(userid, {isOrderDone: false})
      const foodItems = await Food.find({
              'userItem.createdBy': req.user._id
            })
            let userItems = foodItems.flatMap(item => item.userItem.filter(item => item.paymentStatus === 'Pending'));
      res.render('payment',{
user: req.user,
        UserItems: userItems, 
      });
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
          "userItem.$[elem].paymentStatus": "✅ Paid ",
          "userItem.$[elem].payed": "Online",
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
          "userItem.$[elem].paymentStatus": "❌ Not Paid",
          "userItem.$[elem].payed": "Cash On Counter",
        },
      },
      {
        arrayFilters: [{ "elem.createdBy": userId }],
      }
    );
    res.status(200).json({ message: 'Payment status updated to Cash on Counter' });
  } catch (err) {
    console.error('Error updating payment status:', err.message);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router
  