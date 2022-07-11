const axios = require('axios')
window.onload = function (){
    const token = localStorage.getItem('token')
    const user_id = localStorage.getItem('username')
    
    let BtnFormulario = document.getElementById('BtnFormulario')
    let username = document.getElementById('username')
    let password = document.getElementById('password')
    
    if(token && user_id){
        location.href = '../view/inicio.html'
        return
    }

    BtnFormulario.addEventListener('click', async (e)=>{
        e.preventDefault()
        const ingresar = { username: username.value, password: password.value }
        try {
            const res = await axios.post("http://localhost:5000/api/login",ingresar)
            console.log(res)
            const {token} = res.data
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