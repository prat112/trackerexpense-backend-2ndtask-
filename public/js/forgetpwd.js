const form=document.getElementById('Data-form');


form.addEventListener('submit',sendmail);

async function sendmail(e){
    try{    
        e.preventDefault(); 
        const details={
            email:e.target.email.value
        }
        const response=await axios.post(`http://54.210.69.239:3100/password/forgotpassword`,details); 
        console.log(response); 
    }   
    catch(err){
        console.log(err);
    }
}