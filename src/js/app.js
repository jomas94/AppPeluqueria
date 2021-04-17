let pagina = 1;

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();

    
});

function iniciarApp() {

    mostrarServicios();

    //Resalta el Vid Actual segun el tab al que se presiona
    mostrarSeccion();

    //Oculta o mmuestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //Paginacion 
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual para ocultar/mostrar botones
    botonesPaginador(); 
}

function mostrarSeccion() {

    //eliminar clase mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    
    const seccionActual = document.querySelector(`#tab-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    
    const tabAnterior = document.querySelector('.tabs .tabActual');
    if(tabAnterior){
        tabAnterior.classList.remove('tabActual');
    }

    //resaltar tab actual
    const tab = document.querySelector(`[data-tab="${pagina}"]`);
    tab.classList.add('tabActual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    
    enlaces.forEach(enlace =>{
        enlace.addEventListener('click', e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.tab);
                      
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        
        const {servicios} = db; //destructuring - crear la vareable a la vez que se extrae el contenido de db.servicios

        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;
            
            //DOM scripting
            
            //Genera los párafos y les añade las clases
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `${precio}€`;
            precioServicio.classList.add('precio-servicio');
            
            //genera el div de cada servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            
            //seleccionar el div
            servicioDiv.onclick = seleccionarServicio;
            
            //añade los párafos al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            
            //añade el div a la página
            const listado = document.querySelector('.listado-servicios');
            listado.appendChild(servicioDiv);
        });
        
    } catch (error) {
        console.log(error);
        
    }
}


function seleccionarServicio(e) {
    
    let elemento;
    
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }
    
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    }else{
        elemento.classList.add('seleccionado');
        
    }
    
    
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++;

        botonesPaginador();

    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    
    if(pagina === 1 ){
        paginaAnterior.classList.add('ocultar');
    }else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}