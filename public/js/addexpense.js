const exForm=document.getElementById('expform');
const displayList=document.querySelector('.list-group');
const nonpreuser=document.getElementById('nonpremiumuser');
const preUser=document.getElementById('premiumuser');
const razorButton=document.getElementById('razorbtn');
const lBoardbutton=document.getElementById('lBoard');
const leaderBoard=document.getElementById('Leaderboard');
const downloadbtn=document.getElementById('Downbtn');
const historyList=document.getElementById('urlhistory');

exForm.addEventListener('submit',formSubmit);
razorButton.addEventListener('click',paymentfunc);
lBoardbutton.addEventListener('click',showleaderBoard);
downloadbtn.addEventListener('click',download);

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded",async()=>{
    try{
     const token=localStorage.getItem('token');
     const decodedtoken=parseJwt (token);
     const ispremiumuser=decodedtoken.ispremiumuser;
     if(ispremiumuser){
         preUser.style.display='block';
     }
     else{
        nonpreuser.style.display='block';
     }
     const response=await axios.get("http://localhost:3100/expense",{ headers:{"Authorization":token}})
     for(var i=0;i<response.data.expenseData.length;i++)
         showExp(response.data.expenseData[i]);

    const history=await axios.get("http://localhost:3100/user/dhistory",{ headers:{"Authorization":token}})
    for(var i=0;i<history.data.downloadData.length;i++)
        showhistory(history.data.downloadData[i]);
     }
     catch(error){
         console.log(error)
     };
 })

async function formSubmit(e)
{   try{
    e.preventDefault();
    const amount=document.getElementById('expamt').value;
    const description=document.getElementById('desc').value;
    const category=document.getElementById('sel-list').value;
    const token=localStorage.getItem('token');

    let myobj={
      amount,description,category
    }
        const response=await axios.post("http://localhost:3100/expense/add-expense",myobj,{headers:{"Authorization":token}})
        showExp(response.data.newExpenseData);
      
    }
    catch(err){
        document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"    
        console.log(err)
    };   
}

async function showExp(myobj)
{
    try{
        const addNewelem=document.createElement('li');
    addNewelem.className="list-group-item bg-light";
    const text=document.createTextNode(myobj.amount+"-"+myobj.description+"-"+myobj.category);
    addNewelem.appendChild(text);

    const deletebtn=document.createElement('button');
    deletebtn.className='btn btn-danger btn-sm float-end delete'
    deletebtn.appendChild(document.createTextNode('Delete'));
    addNewelem.appendChild(deletebtn);
 
    displayList.appendChild(addNewelem);

    deletebtn.addEventListener('click',async function(){
        try{
            const token=localStorage.getItem('token');
            const dId=myobj.id;
            await axios.delete(`http://localhost:3100/expense/delete-expense/${dId}`,{headers:{"Authorization":token}})
                displayList.removeChild(addNewelem);
        }
        catch(err){
            console.log(err)
        };     
    })
    }
    catch(error){
        console.log(error)
    };
}
var count=1;
async function showhistory(myobj)
{
    try{
       
        const addNewelem=document.createElement('li');
        addNewelem.className=" text-truncate list-group-item bg-light";
        const text=document.createTextNode(count++ +"."+myobj.url+"-"+myobj.createdAt);
        addNewelem.appendChild(text);
        historyList.appendChild(addNewelem);
    }
    catch(error){
        console.log(error)
    };
}

async function paymentfunc(e){
    const token=localStorage.getItem('token');
    const response=await axios.get(`http://localhost:3100/purchase/premiummembership`,{headers:{"Authorization":token}});
    var options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
           const res= await axios.post(`http://localhost:3100/purchase/updatetrstatus`,{
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id},
            {headers:{"Authorization":token}})
            console.log(res);
            alert('You are a Premium User Now');
            preUser.style.display='block';
            nonpreuser.style.display='none';
            localStorage.setItem('token',res.data.token);
        }
    };
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',async function(response){
            await axios.post(`http://localhost:3100/purchase/updatetrstatus`,{
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id},
            {headers:{"Authorization":token}})
            alert('Something went wrong');
    })

}

var clicked=true;
async function showleaderBoard(){
    if(clicked){
        clicked=false;
        const token=localStorage.getItem('token');
        const lbArray=await axios.get(`http://localhost:3100/premium/showleaderboard`,{headers:{"Authorization":token}})
        leaderBoard.innerHTML += '<h1> Leader Board</h1>';
        var count=1;
        lbArray.data.forEach(user => {
        leaderBoard.innerHTML += `<li class='list-group-item'>${count++}. Name - ${user.name} &nbsp&nbsp&nbsp Total Expenses - ${user.totalexpense}</li>`
    });
    }
    
}

async function download(){
    try{
        console.log('clicked dload');
        const token=localStorage.getItem('token');
        const response=await axios.get('http://localhost:3100/user/download', { headers: {"Authorization" : token} });
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }
    }
    catch(err){
        console.log(err);
        document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
    }
}