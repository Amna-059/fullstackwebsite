require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Classic White Linen Shirt',
    description: 'A timeless white linen shirt perfect for any occasion.',
    price: 89, discountPrice: 69,
    category: 'Women', subCategory: 'Tops',
    images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=400', public_id: '1' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Cream', hex: '#FFF8E7' }],
    stock: 50, featured: true, trending: true, rating: 4.5, numReviews: 12
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Classic slim fit chinos for a sharp, modern look.',
    price: 119, discountPrice: 0,
    category: 'Men', subCategory: 'Bottoms',
    images: [{ url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', public_id: '2' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#1B2A4A' }],
    stock: 30, featured: true, rating: 4.2, numReviews: 8
  },
  {
    name: 'Floral Maxi Dress',
    description: 'Elegant floral maxi dress for summer occasions.',
    price: 149, discountPrice: 99,
    category: 'Women', subCategory: 'Dresses',
    images: [{ url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400', public_id: '3' }],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Floral Pink', hex: '#FFB6C1' }],
    stock: 20, trending: true, rating: 4.8, numReviews: 24
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Product.deleteMany();
  await User.deleteMany();
  await Product.insertMany(products);
  await User.create({ name: 'Admin User', email: 'admin@luxedrip.com', password: 'admin123', isAdmin: true });
  console.log('✅ Data seeded!');
  process.exit();
}).catch(console.error);