// 3

const express=require('express')
const { postProduct, productList, productDetails, updateProduct, deleteProduct } = require('../controllers/productController')
const router=express.Router()
const upload=require('../middleware/fileUpload')
const {productValidation,validation}=require('../validation/validator')
const { requireSignin, requireAdmin } = require('../controllers/userController')



router.post('/postproduct',requireSignin,requireAdmin,upload.single('product_image'),productValidation,validation,postProduct)
router.get('/productlist',productList)
router.get('/productdetails/:id',productDetails)
router.put('/updateproduct/:id',requireSignin,requireAdmin,upload.single('product_image'),productValidation,validation,upload.single('product_image'),productValidation,validation,updateProduct)
router.delete('/deleteproduct/:id',deleteProduct)



module.exports=router