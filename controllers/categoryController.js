const Category=require('../models/categoryModel')


exports.testFunction=(req,res)=>{
    res.send('This is from the category controller')
}


// to insert the category
exports.postCategory=async(req,res)=>{
    let category=new Category({
        category_name:req.body.category_name
    })
    
    // to check if category already exists in database
    Category.findOne({category_name:category.category_name})
    .then(async categories=>{
        if(categories){
            return res.status(400).json({error:'category must be unique'})
        }
        else{
            category=await category.save()
            if(!category){
                return res.status(400).json({error:'Something went wrong'})
            }
            res.send(category)
        }
    })
    .catch(err=>res.status(400).json({error:err}))


    category=await category.save()
    if(!category){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(category)
}

// to retrive all data
exports.categoryList=async(req,res)=>{
    const category =await Category.find()
    if(!category){
        return res.status(400).json({error:"Something went wronggggg"})
    }
    res.send(category)
}


// to view category details
exports.categoryDetails=async(req,res)=>{
    const category=await Category.findById(req.params.id)
    if(!category){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(category)
}

// update category
exports.updateCategory=async(req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name:req.body.category_name
        },
        {new:true}
    )
    if(!category){
        return res.status(400).json({error:'Something went wrong for update'})
    }
    res.send(category)
}

//delete category
exports.deleteCategory=(req,res)=>{
    Category.findByIdAndDelete(req.params.id)
    .then(category=>{
        if(!category){
            return res.status(404).json({error:'Category with that id is not found'})
        }
        else{
            return res.status(200).json({message:'category deleted'})
        }

    })
    .catch(err=>{
         return res.status(400).json({reeor:err})
    })
}