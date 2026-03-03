const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

function fetchResults(input) {
    const resultDiv = document.getElementById('results');
    if (!resultDiv) return;
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const matches = [];

            // if user searches 'country', show all countries
            if (input === 'country') {
                data.countries.forEach(country => {
                    matches.push({
                        name: country.name,
                        type: 'Country',
                        cities: country.cities
                    });
                });
                renderCountries(resultDiv, matches);
                return;
            }

            // if user searches 'beach', show only beaches
            if (input === 'beach') {
                if (Array.isArray(data.beaches)) {
                    data.beaches.forEach(item => {
                        matches.push({
                            name: item.name,
                            imageUrl: item.imageUrl,
                            description: item.description,
                            type: 'Beach'
                        });
                    });
                }
                if (matches.length === 0) {
                    resultDiv.innerHTML = '<p>No beaches found.</p>';
                    return;
                }
                renderCards(resultDiv, matches);
                return;
            }

            if (input === 'temple') {
                if (Array.isArray(data.temples)) {
                    data.temples.forEach(item => {
                        matches.push({
                            name: item.name,
                            imageUrl: item.imageUrl,
                            description: item.description,
                            type: 'Temple'
                        });
                    });
                }
                if (matches.length === 0) {
                    resultDiv.innerHTML = '<p>No temples found.</p>';
                    return;
                }
                renderCards(resultDiv, matches);
                return;
            }

            // default search: search across cities, temples, and beaches
            const terms = input.split(/\s+/).filter(t => t);

            // search cities
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    const nameLc = city.name.toLowerCase();
                    const descLc = city.description.toLowerCase();
                    if (nameLc.includes(input) || descLc.includes(input) ||
                        terms.some(term => descLc.includes(term))) {
                        matches.push({
                            name: city.name,
                            imageUrl: city.imageUrl,
                            description: city.description,
                            type: 'City'
                        });
                    }
                });
            });

            // search temples
            if (Array.isArray(data.temples)) {
                data.temples.forEach(item => {
                    const nameLc = item.name.toLowerCase();
                    const descLc = item.description.toLowerCase();
                    if (nameLc.includes(input) || descLc.includes(input) ||
                        terms.some(term => descLc.includes(term))) {
                        matches.push({
                            name: item.name,
                            imageUrl: item.imageUrl,
                            description: item.description,
                            type: 'Temple'
                        });
                    }
                });
            }

            // search beaches
            if (Array.isArray(data.beaches)) {
                data.beaches.forEach(item => {
                    const nameLc = item.name.toLowerCase();
                    const descLc = item.description.toLowerCase();
                    if (nameLc.includes(input) || descLc.includes(input) ||
                        terms.some(term => descLc.includes(term))) {
                        matches.push({
                            name: item.name,
                            imageUrl: item.imageUrl,
                            description: item.description,
                            type: 'Beach'
                        });
                    }
                });
            }

            if (matches.length === 0) {
                resultDiv.innerHTML = '<p>No results found. Please try another destination.</p>';
                return;
            }
            renderCards(resultDiv, matches);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultDiv.innerHTML = '<p>Sorry, there was an error fetching the data. Please try again later.</p>';
        });
}

function renderCountries(resultDiv, countries) {
    let html = '';
    countries.forEach(country => {
        html += `<div class="country-group">
                    <h3 class="country-name">${country.name}</h3>
                    <div class="country-cities-grid">`;
        country.cities.forEach(city => {
            html += `<div class="result-card">
                        <img src="${city.imageUrl}" alt="${city.name}">
                        <div class="result-card-body">
                            <h4>${city.name}</h4>
                            <p>${city.description}</p>
                        </div>
                    </div>`;
        });
        html += `</div></div>`;
    });
    resultDiv.innerHTML = html;
}

function renderCards(resultDiv, items) {
    let html = '';
    items.forEach(item => {
        html += `<div class="result-card">
                    <img src="${item.imageUrl}" alt="${item.name}" class="thumb">
                    <div class="result-card-body">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <small>${item.type}</small>
                    </div>
                </div>`;
    });
    resultDiv.innerHTML = html;
}

function searchDestinations() {
    const inputEl = document.getElementById('destination');
    const raw = inputEl ? inputEl.value.trim() : '';
    if (!raw) return;
    const encoded = encodeURIComponent(raw);
    window.location.href = `search.html?destination=${encoded}`;
}

btnSearch.addEventListener('click', searchDestinations);

// clear button logic stays the same (if defined)
function clearResults() {
    const inputEl = document.getElementById('destination');
    if (inputEl) inputEl.value = '';
    const resultDiv = document.getElementById('results');
    if (resultDiv) resultDiv.innerHTML = '';
}

if (btnClear) {
    btnClear.addEventListener('click', clearResults);
}

// on load, check for query param and run lookup if present
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get('destination');
    if (dest) {
        const lower = dest.toLowerCase();
        const input = document.getElementById('destination');
        if (input) input.value = dest;
        fetchResults(lower);
    }
});