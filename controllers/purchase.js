const Razorpay=require('razorpay');
const order=require('../models/order');
const jwt=require('jsonwebtoken');
require('dotenv').config();

function generateAcToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser},process.env.TOKEN_SECRET);
}

exports.purchasepremium=async(req,res,next)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;

        rzp.orders.create({amount,currency:"INR"},async(err,order)=>{
            try{
                if(err)
                {
                    throw new Error(JSON.stringify(err));
                }
                await req.user.createOrder({orderid:order.id,status:'PENDING'}) 

                return res.status(201).json({order,key_id:rzp.key_id});
            }
            catch(err){
                throw new Error(err);
            }
        })  
    }
    catch(err){
        res.status(403).json({message:'something went wrong in prm',error:err});
    }
}

exports.updateTransactionStatus=async(req,res,next)=>{
        try{
                if(req.body.payment_id==null){
                    const {order_id}=req.body;
                    const data= await order.findOne({where:{orderid:order_id}});
                    await data.update({status:'FAILED'});
                    return res.status(202).json({success:false,message:"Transaction unsuccessfull"});
                }
                const userId=req.user.id;
                const {payment_id,order_id}=req.body;
                const data= await order.findOne({where:{orderid:order_id}});
                const p1= await data.update({paymentid:payment_id,status:'SUCCESSFULL'});
                const p2=await req.user.update({ispremiumuser:true});

                await Promise.all([p1,p2])
                return res.status(202).json({success:true,message:"Transaction successfull",token:generateAcToken(userId,undefined,true)});
        }   
        catch(err){
            console.log(err);
            res.status(403).json({message:'something went wrong',error:err});
        }
}