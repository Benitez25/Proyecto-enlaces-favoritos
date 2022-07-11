const axios = require('axios');
const {ipcRenderer} = require('electron');

window.onload = function (){
    const token = localStorage.getItem('token')
    let txtTitle = document.getElementById('title')
    let txtUrl = document.getElementById('url')
    let txtDescription = document.getElementById('description')
    let id 
    ipcRenderer.invoke('obtenerDatos', [])
        .then(
            v => {
                const { title, url, description, id: key } = v
                txtTitle.value = title
                txtUrl.value = url
                txtDescription.value = description
                id = key
            }
        )

    document.getElementById('formData').addEventListener('click', async  function(e){
        e.preventDefault()
        const obj = {
            id,
            title:txtTitle.value,
            url:txtUrl.value,
            description:txtDescription.value
        }
        try {
            const res = await axios.put("http://localhost:5000/api/updateLink", obj, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
               })
            if(res.status){
                ipcRenderer.invoke('cerrarVentana', [])   
            }
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