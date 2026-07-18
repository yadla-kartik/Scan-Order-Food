export const image = (name) => `/Images/${name}`

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'shakes', label: 'Shakes' },
  { id: 'mocktails', label: 'Mocktails' },
  { id: 'sandwich', label: 'Sandwich' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'southIndian', label: 'South Indian' },
]

export const menuItems = [
  { id: 'cold-coffee', category: 'shakes', name: 'Cold Coffee', description: 'Cold coffee with crushed ice', price: 49, image: image('coldCoffe.jpg') },
  { id: 'strawberry', category: 'shakes', name: 'Strawberry Shake', description: 'Sweet, creamy, fruity bliss', price: 49, image: image('strawberry.jpg') },
  { id: 'mango', category: 'shakes', name: 'Mango Shake', description: 'Thick, tropical, mango delight', price: 49, image: image('mango.jpg') },
  { id: 'kitkat', category: 'shakes', name: 'Kit-kat Shake', description: 'With chocolate, icecream and Kit-kat', price: 59, image: image('kitkat.jpg') },
  { id: 'oreo', category: 'shakes', name: 'Oreo Shake', description: 'Creamy, chocolaty, cookie indulgence', price: 59, image: image('oreo.jpg') },
  { id: 'mojito', category: 'mocktails', name: 'Mojito', description: 'Refreshing, minty, citrusy drink', price: 79, image: image('mojito.jpg') },
  { id: 'blackberry', category: 'mocktails', name: 'Blackberry', description: 'Sweet, tangy, antioxidant-rich fruit', price: 79, image: image('blackberry.jpg') },
  { id: 'ocean-blue', category: 'mocktails', name: 'Ocean Blue', description: 'Sweet, tropical, icy beverage', price: 79, image: image('oceanBlue.jpg') },
  { id: 'blue-lagoon', category: 'mocktails', name: 'Blue Lagoon', description: 'Citrusy, refreshing, vibrant drink', price: 79, image: image('blueLagaon.jpg') },
  { id: 'rose-mint', category: 'mocktails', name: 'Rose Mint', description: 'Fragrant, cooling, floral, soothing', price: 89, image: image('roseMint.jpg') },
  { id: 'cheese-sandwich', category: 'sandwich', name: 'Chesse Sandwich', description: 'Toasty, creamy, melted cheese', price: 49, image: image('cheeseSandwich.jpg') },
  { id: 'paneer-sandwich', category: 'sandwich', name: 'Paneer Sandwich', description: 'Grilled, cheesy, flavorful paneer', price: 59, image: image('paneerSandwich.jpg') },
  { id: 'paneer-makhani', category: 'sandwich', name: 'Paneer Makhani', description: 'Creamy, buttery, spiced paneer', price: 59, image: image('paneerMakhani.jpg') },
  { id: 'mexican-sandwich', category: 'sandwich', name: 'Mexican Sandwich', description: 'Spicy, zesty, veggie-filled delight', price: 59, image: image('mexicanSandwich.jpg') },
  { id: 'tandoori-paneer', category: 'sandwich', name: 'Tandoori Paneer', description: 'Smoky, marinated, grilled paneer', price: 59, image: image('tandooriPaneer.jfif') },
  { id: 'onion-pizza', category: 'pizzas', name: 'Onion Pizza', description: 'Savory, crunchy, flavorful topping', price: 69, image: image('onionPizza.jpg') },
  { id: 'cheese-corn-pizza', category: 'pizzas', name: 'Cheese Corn Pizza', description: 'Creamy, cheesy, sweet, delicious', price: 69, image: image('cheeseCorn.jpg') },
  { id: 'paneer-pizza', category: 'pizzas', name: 'Paneer Pizza', description: 'Spicy, tangy, creamy, vegetarian', price: 79, image: image('paneerPizza.jpg') },
  { id: 'mexican-pizza', category: 'pizzas', name: 'Mexican Pizza', description: 'Spicy, tangy, zesty, flavorful', price: 79, image: image('mexicanPizza.jpg') },
  { id: 'special-pizza', category: 'pizzas', name: 'Special Pizza', description: 'Loaded, savory, assorted toppings', price: 99, image: image('specialPizza.jfif') },
  { id: 'idli', category: 'southIndian', name: 'Idli', description: 'Idli, With Coconut chutney and Sambar', price: 39, image: image('idli.png') },
  { id: 'dosa', category: 'southIndian', name: 'Masala Dosa', description: 'Thin, crispy, stuffed South crepe.', price: 59, image: image('dosa.png') },
  { id: 'uppama', category: 'southIndian', name: 'Uppama', description: 'Soft, savory, spiced semolina dish', price: 39, image: image('uppama.png') },
  { id: 'appe', category: 'southIndian', name: 'Appe', description: 'Round, crispy, soft rice bites.', price: 49, image: image('appe.png') },
  { id: 'wada', category: 'southIndian', name: 'Wada', description: 'Crispy, golden, savory deep-fried snack', price: 39, image: image('wada.png') },
]

export const offers = ['offer1.png', 'offer3.png', 'offer4.png', 'offer5.png'].map(image)

export const coupons = [
  ['Rs 5 OFF', 'SAVE10', 'Save Rs 5 on orders above Rs 30!'],
  ['Rs 10 OFF', 'LITE15', 'Flat Rs 10 off on Rs 50+ order!'],
  ['Rs 17 OFF', 'QUICK5', 'Get Rs 17 cashback on orders above Rs 80!'],
  ['20% OFF', 'SNACK20', 'Flat 20% off on this order!'],
  ['25% OFF', 'FOODIE25', 'Max discount Rs 30 on orders above Rs 145.'],
]

export const demoOrders = [
  { id: 'A12', table: 'T-04', customer: 'Guest User', status: 'Preparing', total: 207.32, items: ['Cold Coffee x1', 'Mojito x1'] },
  { id: 'A13', table: 'T-02', customer: 'Walk-in', status: 'Ready', total: 163.02, items: ['Paneer Pizza x1', 'Rose Mint x1'] },
  { id: 'A14', table: 'T-07', customer: 'Kartik', status: 'New', total: 136.88, items: ['Masala Dosa x1', 'Wada x1'] },
]
