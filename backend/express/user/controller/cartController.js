const Cart = require("../model/cartModel");
const Product = require("../model/userAddProductsModel");

const cartController = {
  addToCart: async (req, res) => {
    const { productId, quantity, size } = req.body;
    console.log('Decoded token in addToCart route:', req.decoded);
    try {
      let userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send('User ID is missing in the request.');
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        const newCart = new Cart({ user: userId, products: [] });
        cart = await newCart.save();
      }

      let product = await Product.findOne({ _id: productId });
      if (!product) {
        return res.status(404).send("Item not found!");
      };

      const { name, price, previousPrice, image } = product;

      let productIndex = cart.products.findIndex(
        (p) => p.productId === productId
      );

      if (productIndex > -1) {
        let productItem = cart.products[productIndex];
        if(productItem.size === size){
          productItem.quantity += quantity;
        cart.products[productIndex] = productItem;
        } else{
          return res.status(400).send('Product with a different size already exists in the cart.');
        }
        
      } else {
        cart.products.push({ productId, name, price,  previousPrice, image, quantity, size });
      }

      cart = await cart.save();
      return res.status(201).send({ cart, addedToCart: true });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res
        .status(500)
        .json({ message: "Error adding to cart", error: error.message });
    }
  },

  getCart: async (req, res) => {
    const userId = req.decoded.userId;
    console.log('UserId:', userId);
    try {
      let cart = await Cart.find({ user: userId });
      if (cart && cart?.length > 0) {
        res.send({ data: cart[0] });
      } else {
        res.send(null);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  },

  deleteFromCart: async (req, res) => {
    console.log('Delete from cart request received:', req.params.productId);
    const userId = req.decoded.userId;
    const productId = req.params.productId;

    try {
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).send("Cart not found");
      }

      const productIndex = cart.products.findIndex((product) => product.productId.equals(productId));

      if (productIndex > -1) {
        cart.products.splice(productIndex, 1);
        cart = await cart.save();
        return res.status(200).send(cart);
      } else {
        return res.status(404).send('Product not found in the cart');
      }
    } catch (error) {
      console.error("Error deleting product from cart", error);
      return res.status(500).json({
        message: "Error deleting product from cart",
        error: error.message,
      });
    }
  },

  updateCartItemQuantity: async (req, res) => {
    const userId = req.decoded.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).send('Cart not found');
      }

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

      if (productIndex > -1) {
        let productItem = cart.products[productIndex];

        if (quantity >= 1 && quantity <= 4) {
          productItem.quantity = quantity;
          cart.products[productIndex] = productItem;

          cart = await cart.save();
          return res.status(200).send(cart);
        } else {
          return res.status(400).send('Invalid quantity. Quantity must be between 1 and 4.');
        }
      } else {
        return res.status(404).send('Product not found in the cart');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      return res.status(500).json({ message: 'Error updating quantity', error: error.message });
    }
  },

  updateCartItemSize: async (req, res) => {
    const userId = req.decoded.userId;
    const productId = req.params.productId;
    const { size } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

        if (productIndex > -1) {
            let productItem = cart.products[productIndex];
            productItem.size = size;
            cart.products[productIndex] = productItem;

            cart = await cart.save();
            return res.status(200).send(cart);
        } else {
            return res.status(404).send('Product not found in the cart');
        }
    } catch (error) {
        console.error('Error updating size:', error);
        return res.status(500).json({ message: 'Error updating size', error: error.message });
    }
},

  checkProductInCart: async(req,res)=>{
    try{
      const userId = req.decoded._id;
      const productId = req.params.productId;
      const cart = await Cart.findOne({userId});
      const inCart = cart.products.some(product => product.productId === productId);
      res.status(200).json({inCart});
    } catch(error){
      console.error("Error checking product in cart:", error);
      res.status(500).json({error:'Internal Server Error'});
    }
  },

  getAllCart: async(req, res) =>{
    try {
      const carts = await Cart.find();
      res.json(carts);
    } catch (error) {
      console.error('Error fetching carts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

};

module.exports = cartController;
