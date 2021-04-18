
let pagina = 1;

const cita = {
    nombre: '',
    // email: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    //muestra el resumen de la cita(o error si no valida)
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();
    
    //deshabilitar fecha anterior
    deshabilitarFechaAnterior();

    //validar Hora
    horaCita();
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
        const id = parseInt(elemento.dataset.idServicio);


        eliminarServicio(id);
        
    }else{
        elemento.classList.add('seleccionado');
        
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        
        agregarServicio(servicioObj);
        
    }
    
}
function eliminarServicio(id) {

    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
}

function agregarServicio(servicioObj) {

    const {servicios} = cita;

    cita.servicios = [...servicios,servicioObj]
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
        mostrarResumen();
    }else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen(){
    //destructiring
    const {nombre, fecha, hora, servicios} = cita;

    //seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild)
    }
    // resumenDiv.innerHTML = '';

    // validacion
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, Hora, Fecha, Nombre o Email';

        noServicios.classList.add('invalidar-cita');
         
        resumenDiv.appendChild(noServicios);
        return;
    }

    //Mostrar Resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    const nombreCita = document.createElement('P');
    nombreCita.insertAdjacentHTML('afterbegin',`<span>Nombre:</span> ${nombre}`);
    
    const fechaCita = document.createElement('P');
    fechaCita.insertAdjacentHTML('afterbegin',`<span>Fecha:</span> ${fecha}`);

    const horaCita = document.createElement('P');
    horaCita.insertAdjacentHTML('afterbegin',`<span>Hora:</span> ${hora}`);
    
    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);
    
    let totalServicios=0;
    //iterar sobre el arreglo de servicios 
    servicios.forEach( function (servicio) {
        const{nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const valorServicio = precio.split('€');
        totalServicios += parseInt(valorServicio[0].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const totalAPagar = document.createElement('P');
    totalAPagar.classList.add('total');
    totalAPagar.insertAdjacentHTML('afterbegin',`<span>Total a Pagar: </span>${totalServicios}€`);

    resumenDiv.appendChild(totalAPagar);


}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();

        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('nombreNoValido', 'error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta) alerta.remove();
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    // insertar en el form
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta)

    //eliminar alerta
    setTimeout(() =>{
        alerta.remove();
    },3000);

}

function emailCita(){
    TODO
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');

    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value ='';
            mostrarAlerta('Elegiste un dia invalido', 'error');
        }else{
            cita.fecha = fecha.value;
        }
    })
}

function deshabilitarFechaAnterior() {

    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() +1;
    const dia = fechaAhora.getDate();
    const hoy = `${year}-${mes < 10 ?  `0${mes}`: mes }-${dia <10 ? `0${dia}`:dia}`;

    inputFecha.min = hoy;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', e =>{

        const horaCita = e.target.value;
        const horas = e.target.value.split(':');

        if(horas[0] < 9  || horas[0] > 19 ){
            mostrarAlerta('Hora no es valida', 'error');
            setTimeout(()=>{
                
                inputHora.value = '';
            },3000)
        }else{
            cita.hora = horaCita;
        }


    });

    
}