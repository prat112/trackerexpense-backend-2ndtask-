const exForm = document.getElementById('expform');
const displayList = document.querySelector('.list-group');

exForm.addEventListener('submit', formSubmit);

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
      category,
    };

    // Send a POST request to the server
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.post(
      'http://localhost:3100/expense/add-expense',
      myobj,
      config
    );

    // Check if the response has the expected data structure
    if (response.data && response.data.newExpenseData) {
      showExp(response.data.newExpenseData);
    } else {
      throw new Error('Invalid response from the server');
    }
  } catch (err) {
    console.error(err);
    document.body.innerHTML +=
      '<h4>Something went wrong. Please try again later.</h4>';
  }
}

// Function to display expenses
function showExp(newExpenseData) {
  // Create a new list item to display the expense
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item bg-light';
  const text = document.createTextNode(
    `${newExpenseData.amount} - ${newExpenseData.description} - ${newExpenseData.category}`
  );
  listItem.appendChild(text);

  // Create a delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger btn-sm float-end delete';
  deleteButton.textContent = 'Delete';
  listItem.appendChild(deleteButton);

  displayList.appendChild(listItem);

  // Add event listener to the delete button
  deleteButton.addEventListener('click', async function () {
    try {
      const token = localStorage.getItem('token');
      const expenseId = newExpenseData.id;

      // Send a DELETE request to delete the expense
      await axios.delete(
        `http://localhost:3100/expense/delete-expense/${expenseId}`,
        {
          headers: { Authorization: token },
        }
      );

      // Remove the list item from the display
      displayList.removeChild(listItem);
    } catch (err) {
      console.error(err);
    }
  });
}

// Add an event listener to run code when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const token = localStorage.getItem('token');

    // Send a GET request to fetch expenses
    const response = await axios.get('http://localhost:3100/expense', {
      headers: { Authorization: token },
    });

    // Display the fetched expenses
    for (let i = 0; i < response.data.expenseData.length; i++) {
      showExp(response.data.expenseData[i]);
    }
  } catch (error) {
    console.log(error);
  }
});
