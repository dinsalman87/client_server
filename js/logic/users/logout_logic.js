
const logoutBtn = document.getElementById('logout-btn')

if (logoutBtn != null) {

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault()

        localStorage.clear()
        location.href = 'login'
    })


}