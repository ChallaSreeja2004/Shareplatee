// Ensure Axios is included in your HTML if not already
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

/*document.getElementById('donation-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const quantity = document.getElementById('quantity').value;
    const description = document.getElementById('description').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    try {
        const response = await axios.post('/food-donations/donate-food', {
            name,
            email,
            mobile,
            quantity,
            description,
            latitude,
            longitude,
        });

        alert('Donation request submitted successfully!');
        // Reset the form or redirect as needed
        document.getElementById('donation-form').reset();
    } catch (error) {
        alert(error.response.data.message || 'Donation request failed. Please try again.');
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

    // Input validations
    // Validate Name
    if (!name) {
        alert('Name is required.');
        return;
    }

    // Validate Email
    if (!email || !email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate Mobile Number
    const mobileNumberLength = mobile.length;
    if (mobileNumberLength !== 10 || !['6', '7', '8', '9'].includes(mobile[0])) {
        alert('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
        return;
    }

    // Validate Quantity
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity of food. It must be a positive number.');
        return;
    }

    // Validate Description
    if (!description) {
        alert('Please provide a description of the food.');
        return;
    }

    // Validate Location
    if (!latitude || !longitude) {
        alert('Please select a valid location on the map.');
        return;
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

