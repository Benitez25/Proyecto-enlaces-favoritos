const axios = require('axios')
window.onload = function(){
    let BtnFormulario = document.getElementById('BtnFormulario')
    let fullname = document.getElementById('fullname')
    let username = document.getElementById('username')
    let password = document.getElementById('password')  

    BtnFormulario.addEventListener('click', async   (e)=>{
        e.preventDefault()
        const nuevoUsuario = {
            fullname: fullname.value,
            username: username.value,
            password: password.value,
        }
        const ingresar = {
            username: username.value,
            password: password.value,
        }
        try {
            await axios.post("http://localhost:5000/api/createUser",nuevoUsuario)   
            const res1 = await axios.post("http://localhost:5000/api/login",ingresar)
            const {token} = res1.data
            localStorage.setItem('token', token)
            localStorage.setItem('username', ingresar.username)
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