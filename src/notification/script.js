const aElList = document.querySelectorAll('.select');

aElList.forEach(aEl =>{
    aEl.addEventListener('click', () => {
        document.querySelector('.focus')?.classList.remove('focus');
        aEl.classList.add('focus');
    });
});