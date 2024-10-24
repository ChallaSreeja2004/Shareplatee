//donate-food.js
/*document.getElementById('donation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const foodDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        quantity: document.getElementById('quantity').value,
        description: document.getElementById('description').value,
        location: {
            type: 'Point',
            coordinates: [
                parseFloat(document.getElementById('longitude').value), // Longitude first
                parseFloat(document.getElementById('latitude').value)   // Latitude second
            ]
        },
        donorId: localStorage.getItem('donorId') // Retrieve this dynamically as needed
    };

    try {
        const response = await axios.post('/food-donations/donate-food', foodDetails);

        if (response.status === 200) {
            alert('Food donation added successfully.');
            // Optionally reset the form or perform additional actions

            document.getElementById('donation-form').reset(); // Reset form after successful submission
        } else {
            alert('Failed to add food donation.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the donation. Please try again.');
    }
});*/


document.getElementById('donation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form inputs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const description = document.getElementById('description').value.trim();
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    // Clear previous error messages
    clearErrors();

    // Stricter email validation using a custom approach
    const emailValid = validateEmail(email);
    // Manual mobile number validation for India (starts with 6-9, exactly 10 digits)
    const mobileValid = validateMobile(mobile);

    let isValid = true;

    // Input validations
    if (!name) {
        displayError('name', 'Name is required.');
        isValid = false;
    }
    if (!emailValid) {
        displayError('email', 'Please enter a valid email address.');
        isValid = false;
    }
    if (!mobileValid) {
        displayError('mobile', 'Mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits.');
        isValid = false;
    }
    if (isNaN(quantity) || quantity <= 0) {
        displayError('quantity', 'Please enter a valid positive number for food quantity.');
        isValid = false;
    }
    if (!description) {
        displayError('description', 'Please provide a description of the food.');
        isValid = false;
    }
    if (!latitude || !longitude) {
        alert('Please select a valid location on the map.');
        return;
    }

    if (!isValid) {
        return; // Stop submission if validation fails
    }

    // Prepare the data to be submitted
    const foodDetails = {
        name: name,
        email: email,
        mobile: mobile,
        quantity: parseInt(quantity),
        description: description,
        location: {
            type: 'Point',
            coordinates: [
                parseFloat(longitude), // Longitude first
                parseFloat(latitude)   // Latitude second
            ]
        },
        donorId: localStorage.getItem('donorId') // Retrieve this dynamically as needed
    };

    // Submit the data
    try {
        const response = await axios.post('/food-donations/donate-food', foodDetails);

        if (response.status === 200) {
            alert('Food donation added successfully.');
            document.getElementById('donation-form').reset(); // Reset form after successful submission
        } else {
            alert('Failed to add food donation.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the donation. Please try again.');
    }
});

// Email validation function (strict)
function validateEmail(email) {
    // This regex ensures that the email has correct basic format, avoiding common issues
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

// Mobile validation function (manual)
function validateMobile(mobile) {
    // Ensure mobile starts with 6, 7, 8, or 9 and is exactly 10 digits
    if (mobile.length === 10 && /^[6-9]/.test(mobile) && !isNaN(mobile)) {
        return true;
    }
    return false;
}

// Helper function to display error messages
function displayError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.innerText = message;
    field.parentNode.appendChild(errorElement);
}

// Helper function to clear previous error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}
