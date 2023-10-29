const sortSelect = document.getElementById('sort');
sortSelect.addEventListener('change', handleSortChange);

function handleSortChange(e) {
    const selected = e.target.value;
    window.location.href = `/?sort=${selected}`;
}