const axios = require('axios');
const {shell, ipcRenderer} = require('electron');
const {format, register} = require('timeago.js');


register('es_ES', (number, index, total_sec) => [
    ['justo ahora', 'ahora mismo'],
    ['hace %s segundos', 'en %s segundos'],
    ['hace 1 minuto', 'en 1 minuto'],
    ['hace %s minutos', 'en %s minutos'],
    ['hace 1 hora', 'en 1 hora'],
    ['hace %s horas', 'in %s horas'],
    ['hace 1 dia', 'en 1 dia'],
    ['hace %s dias', 'en %s dias'],
    ['hace 1 semana', 'en 1 semana'],
    ['hace %s semanas', 'en %s semanas'],
    ['1 mes', 'en 1 mes'],
    ['hace %s meses', 'en %s meses'],
    ['hace 1 año', 'en 1 año'],
    ['hace %s años', 'en %s años']
][index]);

const timeago = timestamp => format(timestamp, 'es_ES');

window.onload = function (){
    const token = localStorage.getItem('token')
    let divContenedor = document.getElementById('divContenedor')
    
    const links = async function(){
        const res = await axios.get("http://localhost:5000/api/links", {
            headers: {
              Authorization: 'Bearer ' + token
            }
        })
        divContenedor.innerHTML =''
        if(res.data.links.length < 1){
            let card = document.createElement('div')
                card.classList.add('card')
                card.classList.add('card-body')
                card.classList.add('text-center')
            let p = document.createElement('p')
            p.innerText="No hay información para mostrar."
            card.append(p)
            let a = document.createElement('a')
            a.href = '../view/crear.html'
            a.innerText = 'Crear nuevo Link'
            card.append(a)
            divContenedor.append(card)
            return
        }

        divContenedor.innerHTML =''

        let tarjetaNuevo = document.createElement('div')
        tarjetaNuevo.classList.add('card')
        tarjetaNuevo.style= 'min-width: 18rem; margin: 20px; flex-grow: 1; flex-basis: 0; min-height: 180px;'
        let tarjetaNuevoBody = document.createElement('div')
            tarjetaNuevoBody.classList.add('card-body')
        let h5Titulo = document.createElement('h5')
            h5Titulo.classList.add('card-title')
            h5Titulo.innerText = 'Crea tu Enlace'
        let pDescripcion = document.createElement('p')
            pDescripcion.classList.add('card-text')
            pDescripcion.innerText = '¿Que descripción tiene?'
        let divBoton = document.createElement('div')
            divBoton.style= 'position: absolute; bottom: 20px;'
            let enlaceCrear = document.createElement('a')
                enlaceCrear.classList.add('btn')
                enlaceCrear.classList.add('btn-success')
                enlaceCrear.href = '../view/crear.html'
                enlaceCrear.innerText= 'Crear'
        divBoton.append(enlaceCrear)
        tarjetaNuevoBody.append(h5Titulo)
        tarjetaNuevoBody.append(pDescripcion)
        tarjetaNuevoBody.append(divBoton)
        tarjetaNuevo.append(tarjetaNuevoBody)
        divContenedor.append(tarjetaNuevo)

        res.data.links.forEach(element => {

            let tarjetaNuevo_ = document.createElement('div')
            tarjetaNuevo_.classList.add('card')
            tarjetaNuevo_.style= 'min-width: 18rem; margin: 20px; flex-grow: 1; flex-basis: 0; min-height: 180px;'
            let tarjetaNuevoBody_ = document.createElement('div')
                tarjetaNuevoBody_.classList.add('card-body')
            let enlace = document.createElement('a')
                enlace.style= "cursor: pointer"
                enlace.addEventListener('click', function(){ shell.openPath(element.url) })
            let h5Titulo_ = document.createElement('h5')
                h5Titulo_.classList.add('card-title')
                h5Titulo_.style= 'font-weight: 700;'
                h5Titulo_.innerText = element.title
            enlace.append(h5Titulo_)
            let pDescripcion_ = document.createElement('p')
                pDescripcion_.classList.add('card-text')
                pDescripcion_.innerText = element.description
            let horaCreacion_ = document.createElement('p')
                horaCreacion_.style= 'font-size: 0.8rem; color: grey;'
                horaCreacion_.innerText = timeago(element.create_at)
            let enlaceEditar_ = document.createElement('a')
                enlaceEditar_.classList.add('btn')
                enlaceEditar_.classList.add('btn-warning')
                enlaceEditar_.addEventListener('click', function(){ editatLink(element.id) })
                enlaceEditar_.style= 'margin: 5px'
                enlaceEditar_.innerText= 'Editar'
            let enlaceBorrar_ = document.createElement('a')
                enlaceBorrar_.classList.add('btn')
                enlaceBorrar_.classList.add('btn-danger')
                enlaceBorrar_.addEventListener('click', function(){ borrarEnlace(element.id) })
                enlaceBorrar_.style= 'margin: 5px'
                enlaceBorrar_.innerText= 'Borrar'
            
            tarjetaNuevoBody_.append(enlace)
            tarjetaNuevoBody_.append(pDescripcion_)
            tarjetaNuevoBody_.append(horaCreacion_)
            tarjetaNuevoBody_.append(enlaceEditar_)
            tarjetaNuevoBody_.append(enlaceBorrar_)
            tarjetaNuevo_.append(tarjetaNuevoBody_)
            divContenedor.append(tarjetaNuevo_)

        });
    }
    links()

    const borrarEnlace = async function(id){
        try {
            const res = await axios.delete("http://localhost:5000/api/deleteLinks/" + id, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
               })
            if(res.status){
                links()        
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
    }

    const editatLink = async function(id){
        try {
            const res = await axios.get("http://localhost:5000/api/getLink/"+id, {
                headers: {
                  Authorization: 'Bearer ' + token
                }
               })
            ipcRenderer.invoke('editarCard', res.data.link)
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
    }

    ipcRenderer.on('actualizar',()=>{
        links()
    })

}

function logout(){
    localStorage.clear()
    location.href = '../view/login.html'
}

function crearNuevoLink(){
    location.href= '../view/crear.html'
}