const exForm=document.getElementById('expform');
const displayList=document.querySelector('.list-group');
exForm.addEventListener('submit',formSubmit);
 
function formSubmit(e)
{   
    e.preventDefault();
    const amount=document.getElementById('expamt').value;
    const description=document.getElementById('desc').value;
    const category=document.getElementById('sel-list').value;
    let myobj={
      amount,description,category
    }
    axios
      .post("http://localhost:3100/expense/add-expense",myobj)
      .then(response=>{
        console.log(response);
        showExp(response.data.newExpenseData);
      })
      .catch(err=>{
        document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"    
        console.log(err)});

    
}

window.addEventListener("DOMContentLoaded",()=>{
    axios
        .get("http://localhost:3100/expense")
        .then((response)=>{
            for(var i=0;i<response.data.expenseData.length;i++)
              showExp(response.data.expenseData[i]);
        })
        .catch((error)=>console.log(error));
})

function showExp(myobj)
{
    const addNewelem=document.createElement('li');
    addNewelem.className="list-group-item bg-light";
    const text=document.createTextNode(myobj.amount+"-"+myobj.description+"-"+myobj.category);
    addNewelem.appendChild(text);

    const deletebtn=document.createElement('button');
    deletebtn.className='btn btn-danger btn-sm float-end delete'
    deletebtn.appendChild(document.createTextNode('Delete'));
    addNewelem.appendChild(deletebtn);

    displayList.appendChild(addNewelem);

    deletebtn.addEventListener('click',function(){
        const dId=myobj.id;
          axios
            .delete(`http://localhost:3100/expense/delete-expense/${dId}`)
            .then(()=>{
                displayList.removeChild(addNewelem);
            })
            .catch((err)=>console.log(err));
           
      })
}