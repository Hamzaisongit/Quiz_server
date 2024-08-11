async function loadData() {
    try {
        const response = await fetch('/data'); // Fetch the JSON file from the server
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data loaded:', data);
        processData(data);
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

function processData(data) {
    const tableBody = document.querySelector('#results tbody');
    tableBody.innerHTML = '';

    const sorted = new Set(data.splice(0).sort((a,b)=>b.score-a.score))

    sorted.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

// Load the data when the script runs
loadData();