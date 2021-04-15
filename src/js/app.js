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

}

function mostrarSeccion() {
    const seccionActual = document.querySelector(`#tab-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //resaltar tab actual
    const tab = document.querySelector(`[data-tab="${pagina}"]`);
    tab.classList.add('tabActual');
}

function cambiarSeccion(params) {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace =>{
        enlace.addEventListener('click', e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.tab);

            //eliminar clase mostrar-seccion de la sección anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');


            //agrega mostrar-seccion donde se da el click
            const seccion = document.querySelector(`#tab-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            
            document.querySelector('.tabActual').classList.remove('tabActual');

            //agrega mostrar-seccion donde se da el click
            const tab = document.querySelector(`[data-tab="${pagina}"]`);
            tab.classList.add('tabActual');
        });
    });
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