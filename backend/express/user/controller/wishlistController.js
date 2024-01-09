const Wishlist = require("../model/wishlistModel");
const Product = require("../model/userAddProductsModel");

const wishlistController = {
  addToWishList: async (req, res) => {
    try {
      let userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing in the request.");
      }

      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        const newWishlist = new Wishlist({ user: userId, products: [] });
        wishlist = await newWishlist.save();
      }

      const isProductInWishlist = wishlist.products.some((p) =>
        p.productId.equals(req.body.productId)
      );
      if (isProductInWishlist) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }

      let product = await Product.findOne({ _id: req.body.productId });
      if (!product) {
        return res.status(404).send("Item not found!");
      }

    const { name, price, previousPrice, image } = product;
    
    wishlist.products.push({
      productId: req.body.productId,
      name,
      price,
      previousPrice,
      image,
      quantity: 1,
    });

      wishlist = await wishlist.save();
      return res.status(201).send(wishlist);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res
        .status(500)
        .json({ message: "Error adding to wishlist", error: error.message });
    }
  },

 
  removeFromWishlist: async (req, res) => {
    try {
      const userId = req.decoded.userId;
      const productId = req.params.productId;

      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

      const index = wishlist.products.findIndex((p) =>
        p.productId.equals(productId)
      );
      if (index === -1) {
        return res
          .status(400)
          .json({ message: "Product not found in wishlist" });
      }
      wishlist.products.splice(index, 1);
      wishlist = await wishlist.save();
      return res.status(200).send(wishlist);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res
        .status(500)
        .json({
          message: "Error removing from wishlist",
          error: error.message,
        });
    }
  },

  getWishlist: async (req, res) => {
    const userId = req.decoded.userId;
    try {
      let wishlist = await Wishlist.findOne({ user: userId });
      if (wishlist) {
        res.status(200).send(wishlist);
      } else {
        res.status(404).json({ message: "Wishlist not found" });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res
        .status(500)
        .json({ message: "Error fetching wishlist", error: error.message });
    }
  },

  getAllWishlist: async(req, res) =>{
    try {
      const wishlists = await Wishlist.find();
      res.json(wishlists);
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
};


module.exports = wishlistController;
