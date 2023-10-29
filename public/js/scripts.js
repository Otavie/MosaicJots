const hamburgerContainer = document.querySelector('.hamburger-container');
const hamburgerLines = document.querySelector('.hamburger-lines');
const navLinksContainer = document.querySelector('.nav-links-container');
const navLinksContainerHide = document.querySelector('.nav-links-container.hide');
const copyRightSpan = document.querySelector('.copy-right span');

hamburgerContainer.addEventListener('click', () => {
    navLinksContainer.classList.toggle('hide');

    if (navLinksContainerHide.style.opacity === '1') {
        navLinksContainer.removeAttribute('style');
    } else {
        navLinksContainer.style.opacity = '1';
    }    

    hamburgerLines.classList.toggle('show');
    copyRightSpan.classList.toggle('black');

})

const header = document.querySelector('header');
let isScrolledDown = false;
const mosaicJots = document.querySelector('.mosaic-jots');

// Check if the current page requires scrolling effect
const isScrollPage = window.location.pathname === '/';

if (isScrollPage) {
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.scrollY;

        if (currentScrollPosition > 80 && !isScrolledDown) {
            header.classList.add('shrink');
            navLinksContainer.classList.add('shrink');
            isScrolledDown = true;
            mosaicJots.classList.remove('hide');
        } else if (currentScrollPosition < 10 && isScrolledDown) {
            header.classList.remove('shrink');
            navLinksContainer.classList.remove('shrink');
            isScrolledDown = false;
            mosaicJots.classList.add('hide');
        }
    });
} else {
    mosaicJots.classList.remove('hide');
}