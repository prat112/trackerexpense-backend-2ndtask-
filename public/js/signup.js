const form = document.getElementById('Data-form');
const pwShowHide = document.querySelectorAll(".eye-icon");
const errorMessageElement = document.getElementById('error-message'); // Error message element

form.addEventListener('submit', formSubmit);

pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

        pwFields.forEach(password => {
            if (password.type === "password") {
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
            } else {
                password.type = "password";
                eyeIcon.classList.replace("bx-show", "bx-hide");
            }
        });

    });
});

async function formSubmit(e) {
    try {
        e.preventDefault();
        const details = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        };

        const response = await axios.post(`http://localhost:3100/user/signup`, details);

        if (response.status === 201) {
            console.log("User registered successfully");
            // Redirect to a success page or perform other actions
        } else {
            throw new Error('Failed to register');
        }
    } catch (err) {
        console.error(err);
        errorMessageElement.textContent = 'An error occurred during registration.'; // Display error message
    }
}
