const express=require('express')
const { testFunction, postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const router=express.Router()
const {categoryValidation,validation, productValidation}=require('../validation/validator')
const { requireSignin, requireAdmin } = require('../controllers/userController')
const upload = require('../middleware/fileUpload')



router.get('/demo',testFunction)
router.post('/postcategory',requireAdmin,upload.single('product_image'),productValidation,validation,categoryValidation,validation,postCategory)   //post for send data
router.get('/categorylist',categoryList)    //get to reteve data
router.get('/categorydetails/:id',categoryDetails)
router.put('/updatecategory/:id',requireAdmin,upload.single('product_image'),productValidation,validation,categoryValidation,validation,updateCategory)  //put is use for update 
router.delete('/deletecategory/:id',requireAdmin,upload.single('product_image'),productValidation,validation,deleteCategory)



 
module.exports=router