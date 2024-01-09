const Product = require("../model/userAddProductsModel");
const Notification = require("../model/notificationModel");

// Add Products
const addProducts = async (req, res) => {
  try {
    const { name, price, previousPrice,  description, category, sizes } = req.body;
    const image = req.file;

    const newProduct = new Product({
      name,
      price,
      previousPrice, 
      image: image.path,
      description,
      category,
      sizes,
    });

    await newProduct.save();
    console.log("New Product:", newProduct);

    //Save the Notification
    const newNotification = new Notification({content: "New Product Add", type:1});
    await newNotification.save();

    res.status(201).json({success: true, message: "Add New Product Successfully",
      newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View all products in table
const viewAllProducts = async (req, res) => {
  try {
    let search = req.query.search || "";
    let products = await Product.find({
      name: { $regex: search, $options: "i" },
    });

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }  
};

// Edit Product by ID
const editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price, previousPrice, offer, description, category, sizes } = req.body;
    const image = req.file;

    const updatedProduct = {
      name,
      price,
      previousPrice,
      offer,
      description,
      category,
      sizes,
    };

    if (image) {
      updatedProduct.image = image.path;
    }
    const result = await  Product.findByIdAndUpdate({_id:productId}, updatedProduct, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: result,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Delete Product by ID
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getProductGraphData
const monthlyProductData = async(req,res)=>{
  try{
    const monthlyData = await Product.aggregate([
      {
        $group: {
          _id: {
            year: {$year: '$createdAt'},
            month:{$month: '$createdAt'},
          },
          count: { $sum: 1},
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
      { $sort: {year:1, month:1}},
    ]);
    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly product data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//getLatestProducts
const getLatestProducts = async(req, res) =>{
  try{
    const latestPrpducts = await Product.find()
    .sort({createdAt: -1})
    .limit(3);
    return res.status(200).json(latestPrpducts);
  } catch (error){
    console.error("Error fetching latest products:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { addProducts, getProductById, editProduct, deleteProduct, monthlyProductData, getLatestProducts, viewAllProducts,
};
