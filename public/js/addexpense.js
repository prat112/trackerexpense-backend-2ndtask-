document.addEventListener('DOMContentLoaded', () => {
    const exForm = document.getElementById('expform');
    const displayList = document.querySelector('.list-group');
    const razorButton = document.getElementById('razorbtn');
    const preUser = document.getElementById('premiumuser');
    const lBoardbutton = document.getElementById('lBoard');
    const leaderBoard = document.getElementById('Leaderboard');

    if (exForm) {
        exForm.addEventListener('submit', formSubmit);
    }

    if (razorButton) {
        razorButton.addEventListener('click', paymentfunc);
    }

    if (lBoardbutton) {
        lBoardbutton.addEventListener('click', showleaderBoard);
    }

    async function formSubmit(e) {
        try {
            e.preventDefault();
            const amount = document.getElementById('expamt').value;
            const description = document.getElementById('desc').value;
            const category = document.getElementById('sel-list').value;
            const token = localStorage.getItem('token');

            let myobj = {
                amount,
                description,
                category
            }
            const response = await axios.post("http://localhost:3100/expense/add-expense", myobj, {
                headers: { "Authorization": token }
            });
            showExp(response.data.newExpenseData);
        } catch (err) {
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>"
            console.log(err)
        };
    }

    async function showExp(myobj) {
        try {
            const addNewelem = document.createElement('li');
            addNewelem.className = "list-group-item bg-light";
            const text = document.createTextNode(myobj.amount + "-" + myobj.description + "-" + myobj.category);
            addNewelem.appendChild(text);

            const deletebtn = document.createElement('button');
            deletebtn.className = 'btn btn-danger btn-sm float-end delete'
            deletebtn.appendChild(document.createTextNode('Delete'));
            addNewelem.appendChild(deletebtn);

            displayList.appendChild(addNewelem);

            deletebtn.addEventListener('click', async function () {
                try {
                    const token = localStorage.getItem('token');
                    const dId = myobj.id;
                    await axios.delete(`http://localhost:3100/expense/delete-expense/${dId}`, { headers: { "Authorization": token } });
                    displayList.removeChild(addNewelem);
                } catch (err) {
                    console.log(err)
                };
            })
        } catch (error) {
            console.log(error)
        };
    }

    async function paymentfunc(e) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3100/purchase/premiummembership`, { headers: { "Authorization": token } });
            var options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function (response) {
                    await axios.post(`http://localhost:3100/purchase/updatetrstatus`, {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { "Authorization": token } });
                    alert('You are a Premium User Now');
                    if (preUser) {
                        preUser.style.display = 'block';
                    }
                }
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
            e.preventDefault();

            rzp1.on('payment.failed', async function (response) {
                await axios.post(`http://localhost:3100/purchase/updatetrstatus`, {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } });
                alert('Something went wrong');
            })
        } catch (error) {
            console.log(error);
        }
    }

    var clicked = true;

    async function showleaderBoard() {
        if (clicked) {
            clicked = false;
            const token = localStorage.getItem('token');
            const lbArray = await axios.get(`http://localhost:3100/premium/showleaderboard`, { headers: { "Authorization": token } });
            leaderBoard.innerHTML += '<h1> Leader Board</h1>';
            var count = 1;
            lbArray.data.forEach(user => {
                leaderBoard.innerHTML += `<li class='list-group-item'>${count++}. Name - ${user.name} &nbsp&nbsp&nbsp Total Expenses - ${user.expense}</li>`
            });
        }
    }
});
