const apiUrl = 'https://moment3-api-joni2412.onrender.com/api/experiences';

document.addEventListener('DOMContentLoaded', () => {
  const workList = document.getElementById('work-list');

  // Hämta
  if (workList) {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${item.company}</strong> – ${item.role} (${item.duration})<br>
            ${item.description ? item.description : ''}
            <br><button data-id="${item._id}">Radera</button>
          `;
          workList.appendChild(li);
        });
      })
      .catch(err => {
        console.error('Fel vid hämtning:', err);
        workList.innerHTML = '<li>Det gick inte att ladda arbetserfarenheter.</li>';
      });

    // Radera
    workList.addEventListener('click', async (e) => {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.getAttribute('data-id');
        if (confirm('Vill du verkligen radera posten?')) {
          await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
          e.target.parentElement.remove();
        }
      }
    });
  }

  // Lägg till ny 
  const addForm = document.getElementById('addForm');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newExperience = {
        company: document.getElementById('company').value,
        role: document.getElementById('role').value,
        duration: document.getElementById('duration').value,
        description: document.getElementById('description').value
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExperience)
        });

        if (response.ok) {
          alert('Ny erfarenhet tillagd!');
          window.location.href = 'index.html';
        } else {
          const data = await response.json();
          alert('Fel: ' + (data.message || 'Misslyckades med att lägga till.'));
        }
      } catch (err) {
        console.error(err);
        alert('Tekniskt fel, försök igen senare.');
      }
    });
  }
});
