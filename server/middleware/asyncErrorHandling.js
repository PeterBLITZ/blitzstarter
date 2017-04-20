// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/

const wrap = fn => (...args) => fn(...args).catch(args[2]);
export default wrap;

// import wrap from '../middlewares/wrap';
// //wrap will catch all errors and pass them to next function
// app.get('/your_route', wrap(async(req,res,next)=>{
//    //sync promise.each
//    array.forEach(async x=>{
//        await Model.create(x);
//    });
//    //promise all
//    let { foud, created } = await Promise.all([
//            Model.find(),
//            Model.create()
//    ]);
//    let item = await Model.find();
// }));
