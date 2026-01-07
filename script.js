document.getElementById('profile-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  // Send to backend (server.js)
  await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  // Show saved data
  fetch('/data')
    .then(res => res.json())
    .then(data => {
      const display = `
        <h2>Saved Profile</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Birthdate:</strong> ${data.birthdate}</p>
        <p><strong>Favorite Color:</strong> ${data.favoriteColor}</p>
        <p><strong>Favorite Food:</strong> ${data.favoriteFood}</p>
        <p><strong>Favorite Place:</strong> ${data.favoritePlace}</p>
        <p><strong>College Level:</strong> ${data.collegeLevel}</p>
        <p><strong>Intelligence:</strong> ${data.intelligence}</p>
        <p><strong>Fun Level:</strong> ${data.funLevel}</p>
        <p><strong>Personality:</strong> ${data.personality}</p>
      `;
      document.getElementById('saved-profile').innerHTML = display;
    });
});
