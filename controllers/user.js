const userModel=require('../models/user');

exports.signup=async(req,res,next)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const allData= await userModel.findAll();
        allData.forEach(element => {
           if(element.email===email) 
           {
                throw new Error('User already exists');
           }
        });
        await userModel.create({name:name,email:email,password:password});
        res.status(201).json({message:'new user created successfully'});
    }
    catch(err){
        res.status(500).json({err});
    }
}

exports.login=async(req,res,next)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const allData= await userModel.findAll();
        let loginCheck,passwordWrong,userExists=false;
        allData.forEach(element => {
           if(element.email===email&&element.password===password) 
           {
                loginCheck=true;
                userExists=true;
           }
           if(element.email===email&&element.password!==password)
           {
                passwordWrong=true;
                userExists=true;
           }
        });
        if(!userExists)
        {
            return res.status(404).json({message:'User not found'});
        }
        if(passwordWrong)
        {
            return res.status(401).json({message:'Incorrect password'});
        }
        if(loginCheck)
        {
            return res.status(201).json({message:'Login successfull'});
        }   
    }
    catch(err){
        res.status(500).json({err});
    }
}