require('dotenv').config({
  path: ".env"
})
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { connectDB } = require("./connection");
const userRoute = require("./routes/user");
const userMenu = require("./routes/menu");
const cartRoute = require('./routes/cart');
const { checkForAuthAndRedirect } = require("./middlewares/auth");
const Food = require("./models/menu");
const { timeEnd, log } = require("console");
const User = require("./models/user");
mongoose.set("strictQuery", true);
const compression = require('compression');
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



// EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Home route
app.get("/", checkForAuthAndRedirect('userToken'), (req, res) => {
  if (req.user) {
    user = req.user;
    return res.render("home",{
      user,
    });
  }
  else {
    return res.redirect("/user");
  }
});

// My Orders Route
app.get('/order', (req, res) =>{
     return res.render('totalOrders');
})

// Login Route
app.get("/user", (req, res) => {
    return res.render("login");
});
app.use("/user", userRoute);

// Logout Route
app.get('/logout', (req, res) => {
  res.clearCookie('userToken'); 
  return res.redirect('/user'); 
});

// Home Post Route
app.use("/", userMenu);

// Cart Route
app.use('/', cartRoute);


// OrderBill
app.get('/orderBill', checkForAuthAndRedirect('userToken'), async(req, res)=>{
  if(!req.user){
    res.redirect('/user')
  }
  const foodItems = await Food.find({
    'userItem.createdBy': req.user._id
  })
  let userItems = foodItems.flatMap(item => 
    item.userItem.map(userItem => ({
      ...userItem._doc, 
      amt: userItem.price * userItem.quantity, 
    
  })).filter(item => item.paymentStatus === 'Pending')
);
  return res.render('orderBill',{
    user: req.user,
    UserItems: userItems,
  })
});


// Chef Route
app.get('/chef', async(req, res)=>{
  try{
    const pendingOrders = await Food.find({ 'userItem.status': 'Pending' });

    const user = await User.find({});
    let chefOrders = pendingOrders.flatMap(order => order.userItem.filter(item => item.status === 'Pending'));
 
    res.render('chef', { 
      users: user,
      chefOrders 
    });
  } catch (err) {
    res.status(500).send(err.message);
  } 
  }
)

app.post('/markAsDone', async (req, res) => {
  const { itemId } = req.body;

  try {
    await Food.updateOne(
      { 'userItem._id': itemId },
      { $set: { 'userItem.$.status': 'Completed' } }
    );
    res.redirect('/chef'); 
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ADMIN Route
app.get('/admin', async(req, res)=>{

  try {
    const pendingOrders = await Food.find({ 'userItem.paymentStatus': 'Pending' });

    const user = await User.find({});
    let chefOrders = pendingOrders.flatMap(order =>
      order.userItem
    );
    return res.render('admin',{
      user,
      chefOrders,
    })
  } catch (error) {
    console.log(error);
  }

})

app.post('/paymentSuccess', async(req, res)=>{
  const { itemId } = req.body;

  try {
    await Food.updateOne(
      { 'userItem._id': itemId },
      { $set: { 'userItem.$.paymentStatus': 'Success' } }
    );
    res.redirect('/admin'); 
  } catch (err) {
    res.status(500).send(err.message);
  }
})


// Connection
connectDB()


app.listen(port, () => console.log("Server Started at PORT", port));