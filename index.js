const {BrowserWindow, app, ipcMain} = require('electron');

let main = null
let edit = null
let datos = []
function mostrarVenta (){
    main = new BrowserWindow({
        height:700,
        width:400,
        icon: __dirname+'./img/task.png',
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        },
        center:true
    })

    main.loadURL(require('url').format({
        slashes:false,
        protocol:'file',
        pathname:require('path').join(__dirname, './view/login.html')
    }))

   main.setMenu(null)
        
}

function abrirVentanaEditar (){
    edit = new BrowserWindow({
        height:450,
        width:400,
        icon: __dirname+'./img/task.png',
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        },
        center:true
    })

    edit.loadURL(require('url').format({
        slashes:false,
        protocol:'file',
        pathname:require('path').join(__dirname, './view/editar.html')
    }))
    
    edit.setMenu(null)
}

app.once('ready', mostrarVenta)

app.on('window-all-closed', ()=>{
    if(process.platform!== "darwin"){
        app.quit()
    }
})

app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        mostrarVenta()
    }
})


ipcMain.handle('editarCard', (e, form)=>{
    datos = form
    abrirVentanaEditar()
})

ipcMain.handle('obtenerDatos', ()=>{
    return datos 
})

ipcMain.handle('cerrarVentana', ()=>{
    edit.close();
    main.webContents.send('actualizar', [])
})
