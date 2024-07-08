// const mongoose=require('mongoose')

// mongoose.connect(process.env.DATABASE)
// .then(()=>console.log('database connected'))
// .catch(err=>console.log(err))



const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE)
.then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});
