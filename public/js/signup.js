const form = document.getElementById('Data-form');
const pwShowHide = document.querySelectorAll(".eye-icon");

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
    e.preventDefault();
    const details = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const response = await axios.post(`http://localhost:3100/user/signup`, details);

        if (response.status === 201) {
            console.log("Success: User added");
            // Redirect to the login page after successful signup
            window.location.href = "./login.html";
        } else {
            throw new Error('Something went wrong');
        }
    } catch (err) {
        console.error(err);
        // Handle the error, display a message, or perform other actions
    }
}