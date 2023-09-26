const Sib=require('sib-api-v3-sdk');
require('dotenv').config();


exports.passwordreset=async(req, res, next)=>{
    try{
        Sib.ApiClient.instance.authentications['api-key'].apiKey=process.env.API_KEY ;
        const final=await new Sib.TransactionalEmailsApi().sendTransacEmail({
            'sender':{
                'email':'kundapurprathiksha@gmail.com','name':'Expense App'
            },
            'to':[{
                'email':`${req.body.email}`
            }],
            'subject':'Reset password for expense app',
            'textContent':'the reset code is 1234'
        })
        res.status(201).json({data:final,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err.message,success:false});
    }   
}; 