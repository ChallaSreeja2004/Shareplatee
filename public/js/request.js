// request.js

// Assuming the donorId is stored in localStorage after the donor logs in
const donorId = localStorage.getItem('donorId');

// Function to fetch requests for the donor
async function fetchRequests() {
  try {
    const response = await axios.get(`/requests/donor/${donorId}`);
    console.log(response.data);
    if (response.length == 0) {
      alert('records not found');
    }
    if (response.status === 200) {
      // alert(response.data.length);
      // alert(response.status);
      displayRequests(response.data);
    } else {
      alert('Failed to fetch requests. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching requests:', error);
    alert('Error fetching requests. Please try again later.');
  }
}

// Function to display the requests in the HTML table
function displayRequests(requests) {
  const requestTableBody = document.querySelector('#requestTable tbody');
  requestTableBody.innerHTML = ''; // Clear existing content
  //alert(Object.keys(requests).length);
  console.log(requests);

  if (requests.length === 0) {
    requestTableBody.innerHTML =
      '<tr><td colspan="6">No requests available.</td></tr>';
    return;
  }

  requests.data.forEach((request) => {
    const requestRow = document.createElement('tr');

    requestRow.innerHTML = `
            <td>${request.ngoName}</td>
            <td>${request.mobileNumber}</td>
            <td>${request.email}</td>
            <td>${new Date(request.createdAt).toLocaleString()}</td>
            <td>${request.foodDetails.description}</td>
            <td>${request.foodDetails.foodQuantity}</td>
            <td>
                <button onclick="acceptRequest('${
                  request._id
                }')">Accept</button>
                <button onclick="rejectRequest('${
                  request._id
                }')">Reject</button>
            </td>
        `;

    requestTableBody.appendChild(requestRow);
  });
}

// Function to handle accepting requests
async function acceptRequest(requestId) {
  const confirmation = confirm(
    `Are you sure you want to accept request ${requestId}?`,
  );
  if (!confirmation) return;

  try {
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  }, error => {
      return Promise.reject(error);
  });

    await axios.patch(`/requests/${requestId}`, { status: 'accepted' });
    alert(`Request ${requestId} accepted!`);
    fetchRequests(); // Refresh requests after updating
  } catch (error) {
    console.error('Error accepting request:', error);
    alert('Failed to accept request. Please try again later.');
  }
}

// Function to handle rejecting requests
async function rejectRequest(requestId) {
  const confirmation = confirm(
    `Are you sure you want to reject request ${requestId}?`,
  );
  if (!confirmation) return;

  try {
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  }, error => {
      return Promise.reject(error);
  });
    await axios.patch(`/requests/${requestId}`, { status: 'rejected' });
    alert(`Request ${requestId} rejected!`);
    fetchRequests(); // Refresh requests after updating
  } catch (error) {
    console.error('Error rejecting request:', error);
    alert('Failed to reject request. Please try again later.');
  }
}

// Fetch requests on page load
document.addEventListener('DOMContentLoaded', fetchRequests);
