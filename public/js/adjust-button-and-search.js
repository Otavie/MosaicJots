
document.addEventListener('DOMContentLoaded', () => {
    const latestBlogButton = document.querySelector('.latest-blog-button');

    function adjustButtonClasses () {
        const width = window.innerWidth;
        if (width >= 650) { // Large Screen
            latestBlogButton.classList.remove('btn-sm');
        } else {
            latestBlogButton.classList.add('btn-sm')
        }
    }

    adjustButtonClasses();

    window.addEventListener('resize', adjustButtonClasses);


    const faMagnifyingGlass = document.querySelector('.fa-magnifying-glass');
    const searchForm = document.querySelector('.search-form');
    
    faMagnifyingGlass.addEventListener('click', () => {
        searchForm.classList.toggle('active')
    })


})
