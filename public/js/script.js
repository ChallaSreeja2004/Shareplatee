// Ensure Axios is included in your HTML if not already
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

document
  .getElementById('donation-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    const userId = localStorage.getItem('donorId');

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
        userId,
      });

      alert('Donation request submitted successfully!');
      // Reset the form or redirect as needed
      document.getElementById('donation-form').reset();
    } catch (error) {
      alert(
        error.response.data.message ||
          'Donation request failed. Please try again.',
      );
    }
  });
