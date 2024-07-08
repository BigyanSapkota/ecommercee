const {check,validationresult, validationResult}=require('express-validator')

exports.categoryValidation=[
    check('category_name','category is required').notEmpty()
    .isLength({min:3}).withMessage('category name must be of at least 3 characters')
] 

exports.productValidation=[
    check('product_name','product name is required').notEmpty()
    .isLength({min:3}).withMessage('Product name must be at least 3 characters'),
    
    check('product_price','price is required').notEmpty()
    .isNumeric().withMessage('Price must be a numeric value'),

    check('countInStock','stock is required').notEmpty()
    .isNumeric().withMessage('Stock must be in numeric value'),

    check('product_description','description must required').notEmpty()
    .isString({min:20}).withMessage('at least 20 characters'),

    check('category','category is required').notEmpty()

]

exports.validation=(req,res,next)=>{
    const errors=validationResult(req)
    if (errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error:errors.array()[0].msg})
    }
}
// validation during register

//uservalidation
exports.userValidation=[
    check('name','name is require').notEmpty()
    .isLength({min:3})
    .withMessage('name must be at least 3 character'),
    
    check('email','email is require').notEmpty()
    .isEmail().withMessage('email format is incorrect')

]
//password Validation
exports.passwordValidation=[
    check('password','password is required').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain at least one lower case')
    .matches(/[A-Z]/).withMessage('password must contain at least one upper case')
    .matches(/[0-9]/).withMessage('password must contain numeric value')
    .matches(/[@#$_?!]/).withMessage('password must contain special character')
    .isLength({min:8}).withMessage('password must contain atleast 8 character')
]