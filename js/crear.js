const axios = require('axios');

window.onload = function (){
    const token = localStorage.getItem('token')
    const user_id = localStorage.getItem('username')
    let formData = document.getElementById('formData')
    let title = document.getElementById('title')
    let url = document.getElementById('url')
    let description = document.getElementById('description')

    formData.addEventListener('click', async (e) => {
        e.preventDefault()
        const obj = {
            title:title.value,
            url:url.value,
            description:description.value,
            user_id
        }
        try {
            await axios.post("http://localhost:5000/api/addLinks",obj, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
            })
            location.href = '../view/inicio.html'
        } catch (error) {
            const {response} = error
            document.getElementById('mensajeText').innerText = response.data.res
            document.getElementById('mensaje').classList.remove('ocultar')
            document.getElementById('mensaje').classList.add('visible')
            setTimeout(() => {
                document.getElementById('mensajeText').innerText = ''
                document.getElementById('mensaje').classList.remove('visible')
                document.getElementById('mensaje').classList.add('ocultar')
            }, 1500);
        }
            
    })
}

function logout(){
    localStorage.clear()
    location.href = '../view/login.html'
}