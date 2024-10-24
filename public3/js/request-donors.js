//request-donors.js
/*document.addEventListener('DOMContentLoaded', () => {
    const findDonorsBtn = document.getElementById('findDonorsBtn');
    const saveNgoBtn = document.getElementById('saveNgoBtn');
    const donorList = document.getElementById('donorList');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('latitude').value = position.coords.latitude;
            document.getElementById('longitude').value = position.coords.longitude;
        }, () => {
            alert('Geolocation permission was denied. Please enter your location manually.');
            // Optionally, show inputs for manual entry
        });
    } else {
        alert('Geolocation is not supported by your browser. Please enter your location manually.');
        // Optionally, show inputs for manual entry
    }

    // Save NGO details to the database
    saveNgoBtn.addEventListener('click', async () => {
        const ngoName = document.getElementById('ngoName').value;
        const mobileNumber = document.getElementById('mobileNumber').value;
        const email = document.getElementById('email').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!ngoName || !mobileNumber || !email || !latitude || !longitude) {
            alert('Please fill in all fields before saving.');
            return;
        }

        try {
            const response = await axios.post('/ngos', {
                name: ngoName,
                mobile: mobileNumber,
                email: email,
                latitude: latitude,
                longitude: longitude
            });

            alert('NGO details saved successfully!');
        } catch (error) {
            console.error('Error saving NGO details:', error);
            alert('Could not save NGO details. Please try again.');
        }
    });

    findDonorsBtn.addEventListener('click', async () => {
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!latitude || !longitude) {
            alert('Please enable location services and select your location.');
            return;
        }

        donorList.innerHTML = '<tr><td colspan="5">Loading nearby donors...</td></tr>';

        try {
            const response = await axios.get(`/food-donations/donors?latitude=${latitude}&longitude=${longitude}`);
            const donors = response.data;

            donorList.innerHTML = '';

            if (donors.length === 0) {
                donorList.innerHTML = '<tr><td colspan="5">No nearby donors found.</td></tr>';
                return;
            }

            donors.forEach(donor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donor.name}</td>
                    <td>${donor.mobile}</td>
                    <td>${donor.quantity}</td>
                    <td>${donor.description}</td>
                    <td><button class="request-btn" data-donor-id="${donor._id}">Request Food</button></td>
                `;
                donorList.appendChild(row);
            });

            document.querySelectorAll('.request-btn').forEach(button => {
                button.addEventListener('click', async () => {
                    const donorId = button.getAttribute('data-donor-id');
                    const ngoDetails = {
                        name: document.getElementById('ngoName').value,
                        mobile: document.getElementById('mobileNumber').value,
                        email: document.getElementById('email').value
                    };

                    try {
                        const requestResponse = await axios.post('/requests', {
                            donorId,
                            ...ngoDetails
                        });

                        button.disabled = true;
                        button.innerText = 'Request Sent';
                        alert(`Request sent to donor with ID: ${donorId}.`);
                    } catch (error) {
                        console.error('Error sending request:', error);
                        alert('Could not send request. Please try again.');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching donors:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'An error occurred.'}`);
            } else if (error.request) {
                alert('Network error. Please try again.');
            } else {
                alert('An unexpected error occurred.');
            }
        }
    });
});*/


/*document.addEventListener('DOMContentLoaded', () => {
    const findDonorsBtn = document.getElementById('findDonorsBtn');
    const saveNgoBtn = document.getElementById('saveNgoBtn');
    const donorList = document.getElementById('donorList');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('latitude').value = position.coords.latitude;
            document.getElementById('longitude').value = position.coords.longitude;
        }, () => {
            alert('Geolocation permission was denied. Please enter your location manually.');
        });
    } else {
        alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }

    // Function to validate the input fields
    const validateForm = () => {
        const ngoName = document.getElementById('ngoName').value.trim();
        const mobileNumber = document.getElementById('mobileNumber').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!ngoName) {
            alert('Please fill out the NGO Name field.');
            return false;
        }

        if (!mobileNumber) {
            alert('Please fill out the Mobile Number field.');
            return false;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            alert('Mobile Number must be 10 digits long.');
            return false;
        }

        if (!email) {
            alert('Please fill out the Email field.');
            return false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    };

    // Save NGO details to the database
    saveNgoBtn.addEventListener('click', async () => {
        if (!validateForm()) return;

        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!latitude || !longitude) {
            alert('Please enable location services and select your location.');
            return;
        }

        try {
            const response = await axios.post('/ngos', {
                name: document.getElementById('ngoName').value,
                mobile: document.getElementById('mobileNumber').value,
                email: document.getElementById('email').value,
                latitude: latitude,
                longitude: longitude
            });

            alert('NGO details saved successfully!');
        } catch (error) {
            console.error('Error saving NGO details:', error);
            alert('Could not save NGO details. Please try again.');
        }
    });

    findDonorsBtn.addEventListener('click', async () => {
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!latitude || !longitude) {
            alert('Please enable location services and select your location.');
            return;
        }

        donorList.innerHTML = '<tr><td colspan="5">Loading nearby donors...</td></tr>';

        try {
            const response = await axios.get(`/food-donations/donors?latitude=${latitude}&longitude=${longitude}`);
            const donors = response.data;

            donorList.innerHTML = '';

            if (donors.length === 0) {
                donorList.innerHTML = '<tr><td colspan="5">No nearby donors found.</td></tr>';
                return;
            }

            donors.forEach(donor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donor.name}</td>
                    <td>${donor.mobile}</td>
                    <td>${donor.quantity}</td>
                    <td>${donor.description}</td>
                    <td><button class="request-btn" data-donor-id="${donor._id}">Request Food</button></td>
                `;
                donorList.appendChild(row);
            });

            document.querySelectorAll('.request-btn').forEach(button => {
                button.addEventListener('click', async () => {
                    const donorId = button.getAttribute('data-donor-id');
                    const ngoDetails = {
                        name: document.getElementById('ngoName').value,
                        mobile: document.getElementById('mobileNumber').value,
                        email: document.getElementById('email').value
                    };

                    try {
                        const requestResponse = await axios.post('/requests', {
                            donorId,
                            ...ngoDetails
                        });

                        button.disabled = true;
                        button.innerText = 'Request Sent';
                        alert(`Request sent to donor with ID: ${donorId}.`);
                    } catch (error) {
                        console.error('Error sending request:', error);
                        alert('Could not send request. Please try again.');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching donors:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'An error occurred.'}`);
            } else if (error.request) {
                alert('Network error. Please try again.');
            } else {
                alert('An unexpected error occurred.');
            }
        }
    });
});*/


// request-donors.js

// Function to validate Indian mobile number
function isValidIndianMobileNumber(mobileNumber) {
    const regex = /^[789]\d{9}$/; // Starts with 7, 8, or 9 followed by 9 digits
    return regex.test(mobileNumber);
}

const saveNgoBtn = document.getElementById('saveNgoBtn');

saveNgoBtn.addEventListener('click', async () => {
    const ngoName = document.getElementById('ngoName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const email = document.getElementById('email').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!ngoName || !mobileNumber || !email || !latitude || !longitude) {
        alert('Please fill in all fields before saving.');
        return;
    }

    // Validate mobile number format
    if (!isValidIndianMobileNumber(mobileNumber)) {
        alert('Please enter a valid Indian mobile number.');
        return;
    }

    try {
        const response = await axios.post('/ngos', {
            name: ngoName,
            mobile: mobileNumber,
            email: email,
            latitude: latitude,
            longitude: longitude
        });

        alert('NGO details saved successfully!');
    } catch (error) {
        console.error('Error saving NGO details:', error);
        alert('Could not save NGO details. Please try again.');
    }
});


