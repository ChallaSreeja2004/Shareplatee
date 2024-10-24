document.addEventListener('DOMContentLoaded', () => {
    const findDonorsBtn = document.getElementById('findDonorsBtn');
    const saveNgoBtn = document.getElementById('saveNgoBtn');
    const donorList = document.getElementById('donorList');

    // Get the user's location
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

    // Save NGO details
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

            const ngoId = response.data.id; // Get the NGO ID
            alert(`NGO details saved successfully! Your NGO ID is ${ngoId}.`);
            localStorage.setItem('ngoId', ngoId); // Store the NGO ID
        } catch (error) {
            console.error('Error saving NGO details:', error);
            alert('Could not save NGO details. Please try again.');
        }
    });

    // Find nearby donors
    findDonorsBtn.addEventListener('click', async () => {
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;

        if (!latitude || !longitude) {
            alert('Please enable location services and select your location.');
            return;
        }

        donorList.innerHTML = '<tr><td colspan="5">Loading nearby donors...</td></tr>';

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to log in first.');
            window.location.href = '/login-ngo.html';
            return;
        }

        try {
            const response = await axios.get(`/food-donations/donors?latitude=${latitude}&longitude=${longitude}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
                    <td><button class="request-btn" data-donor-id="${donor._id}" data-quantity="${donor.quantity}">Request Food</button></td>
                `;
                donorList.appendChild(row);
            });

            // Request food from donors
            document.querySelectorAll('.request-btn').forEach(button => {
                button.addEventListener('click', async () => {
                    const donorId = button.getAttribute('data-donor-id');
                    const quantity = button.getAttribute('data-quantity');

                    const ngoId = localStorage.getItem('ngoId');
                    if (!ngoId) {
                        alert('NGO ID not found. Please save your NGO details first.');
                        return;
                    }

                    const ngoDetails = {
                        name: document.getElementById('ngoName').value,
                        mobile: document.getElementById('mobileNumber').value,
                        email: document.getElementById('email').value
                    };

                    if (!ngoDetails.name || !ngoDetails.mobile || !ngoDetails.email) {
                        alert('Please fill in your NGO details before making a request.');
                        return;
                    }

                    try {
                        const donor = donors.find(d => d._id === donorId);
                        const requestPayload = {
                            ngoName: ngoDetails.name,
                            mobileNumber: ngoDetails.mobile,
                            email: ngoDetails.email,
                            location: {
                                type: 'Point',
                                coordinates: [parseFloat(longitude), parseFloat(latitude)]
                            },
                            donorId: donor._id,
                            ngoId: ngoId,
                            foodDetails: {
                                foodQuantity: parseInt(quantity, 10),
                                description: `Requesting ${quantity} units of food`
                            },
                            donorName: donor.name,
                            donorMobile: donor.mobile,
                            donorEmail: donor.email // Ensure donor object has email
                        };

                        console.log('Request Payload:', requestPayload);

                        await axios.post('/requests', requestPayload, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        button.disabled = true;
                        button.innerText = 'Request Sent';
                        alert(`Request sent to donor with ID: ${donorId}.`);
                    } catch (error) {
                        console.error('Error sending request:', error);
                        if (error.response) {
                            alert(`Error: ${error.response.data.message || 'Could not send request.'}`);
                        } else if (error.request) {
                            alert('Network error. Please try again.');
                        } else {
                            alert('An unexpected error occurred. Please try again.');
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Error fetching donors:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'An error occurred while fetching donors.'}`);
            } else if (error.request) {
                alert('Network error. Please try again.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        }
    });
});
