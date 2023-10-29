const filterOptions = document.querySelector('.filter-options');
function handleStateChange() {
    console.log('Clicked!');
    filterOptions.classList.toggle('active');
}

const filterButtons = document.querySelector('.filter-buttons');
filterButtons.addEventListener('click', handleStateChange);
