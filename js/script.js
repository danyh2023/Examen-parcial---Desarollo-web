var product = [];
var reciente = [];
var ordenesTemporales = [];
var ordenesrecientes = [];
var itemsOrdenesTemporales = [];
var recientesItemsnuevos = [];

// Funcion para las productos en la orden de compra
function objOrdenesItems(cOrdenes, CPro, Npro, Pre, cant) {
    this.cOrdenes = cOrdenes,
        this.CPro = CPro,
        this.Npro = Npro,
        this.Pre = Pre,
        this.cant = cant

}
//Valida que los campos esten llenos
function validar() {
    if (document.getElementById("idC").value == "") {
        alert("ingresar el código del producto!");
        return false;
    }
    if (document.getElementById("idN").value == "") {
        alert(" ingresar el nombre del producto!");
        return false;
    }
    if (document.getElementById("idP").value == "") {
        alert("ingresar el Precio del producto!");
        return false;
    }
    if (document.getElementById("idIm").value == "") {
        alert("ingresar el Precio del producto!");
        return false;
    }
}

function getFile() {
    var resultado = "";
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function() {
        resultado = reader.result;
        sessionStorage.setItem("url", resultado);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
//arreglo para el almacen de los productos
function poblarArreglo() {
    var codigo = document.getElementById("idC").value;
    var nombre = document.getElementById("idN").value;
    var Pre = document.getElementById("idP").value;
    var imagen = sessionStorage.getItem("url");
    var codigoExiste = false;
    //agregar en local storega
    if (localStorage.getItem("registro") != null) {
        productos = JSON.parse(localStorage.getItem("registro"));
        for (var i = 0; i < productos.length; i++) {
            if (productos[i].codigo == codigo) {
                codigoExiste = true;
                alert("El codigo ya existe!");
            }
        }
    }
    //valua si el codigo no existe
    if (codigoExiste == false) {
        //Crea el objeto y lo guarda en prod y luego limpia la pantalla 
        var prod = new objproducto(codigo, nombre, Pre, imagen, 0);
        reciente.push(prod);
        productos.push(prod);
        //localStorage.clear();
        localStorage.removeItem("registro");
        localStorage.setItem("registro", JSON.stringify(productos));
    }
}

function objproducto(codigo, nombre, Pre, imagen, cant = 0) {
    this.codigo = codigo,
        this.nombre = nombre,
        this.Pre = Pre,
        this.imagen = imagen,
        this.cant = cant
}
//Actualiza la tabla 
function actualizarTabla() {
    var scriptTabla = "";
    for (var index = 0; index < reciente.length; index++) {
        scriptTabla += "<tr>";
        scriptTabla += "<td>" + reciente[index].codigo + "</td>";
        scriptTabla += "<td>" + reciente[index].nombre + "</td>";
        scriptTabla += "<td>Q " + reciente[index].Pre + "</td>";
        scriptTabla += "<td><img src=\"" + reciente[index].imagen + "\" width=\"75px\"></td>";
        scriptTabla += "</tr>";
    }
    document.getElementById("idTableBody").innerHTML = scriptTabla;
}
//Limpia
function limpiar() {
    document.getElementById("idC").value = "";
    document.getElementById("idN").value = "";
    document.getElementById("idP").value = "";
    document.getElementById("idIm").value = "";
}
//Muestra todos los productos guardados
function mostrarProductos() {
    var guardados = [];
    guardados = JSON.parse(localStorage.getItem("registro"));
    var scriptTabla;
    //Recorre el arreglo de productos
    for (var index = 0; index < guardados.length; index++) {

        scriptTabla += "<tr>";
        scriptTabla += "<td>" + guardados[index].codigo + "</td>";
        scriptTabla += "<td>" + guardados[index].nombre + "<br><br><label for=\"" + guardados[index].codigo + "\">Cantidad: </label> <input type=\"number\" id=\"" + "c" + guardados[index].codigo + "\"></td>";
        scriptTabla += "<td>Q " + guardados[index].Pre + "<br><br><input type=\"button\" value=\"Agregar al carrito\" id=\"" + guardados[index].codigo + "\" onclick=\"agregarCarrito(this.id)\"></td>";
        scriptTabla += "<td><img src=\"" + guardados[index].imagen + "\" width=\"75px\"></td>";
        scriptTabla += "</tr>";
    }
    document.getElementById("idTableBody2").innerHTML = scriptTabla;
}
//Objeto para el pedido
function objpedido(codigo, nombre, Pre, imagen, cant) {
    this.codigo = codigo,
        this.nombre = nombre,
        this.Pre = Pre,
        this.imagen = imagen,
        this.cant = cant
}
//Funcion para el carro de compras
function agregarCarrito(id) {
    //variables
    var buscarProductos = [];
    var auxiliar = [];
    var getProducto = [];

    var codigo;
    var nombre;
    var Pre;
    var imagen;
    var cant;
    buscarProductos = JSON.parse(localStorage.getItem("registro"));
    for (var i = 0; i < buscarProductos.length; i++) {

        if (buscarProductos[i].codigo == id) {
            codigo = buscarProductos[i].codigo;
            nombre = buscarProductos[i].nombre;
            Pre = buscarProductos[i].Pre;
            imagen = buscarProductos[i].imagen;
            cant = document.getElementById("c" + id).value;
        }
    }
    //Valida que el carrito no este vacio
    if (cant != "" && cant > 0) {
        if (JSON.parse(sessionStorage.getItem("regPedido")) != null) {
            var actualizar = false;
            auxiliar = JSON.parse(sessionStorage.getItem("regPedido"));
            for (var y = 0; y < auxiliar.length; y++) {
                if (auxiliar[y].codigo == codigo) {
                    actualizar = true;
                    break;
                }
            }
            if (actualizar == true) {
                for (var z = 0; z < auxiliar.length; z++) {
                    if (auxiliar[z].codigo != codigo) {
                        getProducto.push(auxiliar[z]);
                    }
                }
                var ped = new objpedido(codigo, nombre, Pre, imagen, cant);
                getProducto.push(ped);
                sessionStorage.clear();
                sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
            } else {
                getProducto = auxiliar;
                var ped = new objpedido(codigo, nombre, Pre, imagen, cant);
                getProducto.push(ped);
                sessionStorage.clear();
                sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
            }
        } else {
            var ped = new objpedido(codigo, nombre, Pre, imagen, cant);
            getProducto.push(ped);
            sessionStorage.clear();
            sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
        }

    } else {
        alert("Ingrese cant!");
    }
}
//Metodo para confirmar pedido
function revisarPedido() {
    var carrito = [];
    var total = 0;
    carrito = JSON.parse(sessionStorage.getItem("regPedido"));
    var scriptTabla;
    for (var index = 0; index < carrito.length; index++) {
        scriptTabla += "<tr>";
        scriptTabla += "<td>" + carrito[index].codigo + "</td>";
        scriptTabla += "<td>" + carrito[index].nombre + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src=\"" + carrito[index].imagen + "\" width=\"75px\"></td>"
        scriptTabla += "<td>" + carrito[index].cant + "<br><br><label for=\"" + carrito[index].codigo + "\">Cantidad: </label> <input type=\"number\" id=\"" + "c" + carrito[index].codigo + "\" onchange=\"actualizarCantidad(this.id)\">&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"Descartar\" id=\"" + carrito[index].codigo + "\" onclick=\"quitarCarrito(this.id)\"></td>";
        scriptTabla += "<td>Q " + carrito[index].Pre + "</td>";
        scriptTabla += "<td>Q " + carrito[index].cant * carrito[index].Pre + "</td>";
        scriptTabla += "</tr>";
        total += carrito[index].cant * carrito[index].Pre;
    }
    document.getElementById("idTableBody3").innerHTML = scriptTabla;
    document.getElementById("total").innerHTML = "Total compra:&nbsp;&nbsp;&nbsp;&nbsp;Q " + total;
}

function actualizarCantidad(id) {
    var nuevoid = id.substring(1);
    agregarCarrito(nuevoid);
    revisarPedido();
}
//Funcion Eliminar del carro
function quitarCarrito(id) {
    var pedidoActual = [];
    var nuevoPedido = [];
    pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));
    for (var y = 0; y < pedidoActual.length; y++) {
        if (pedidoActual[y].codigo != id) {
            nuevoPedido.push(pedidoActual[y]);
        }
    }
    sessionStorage.clear();
    sessionStorage.setItem("regPedido", JSON.stringify(nuevoPedido));
    revisarPedido();
}
//Confirmar compra
function validarCompra() {
    var total = document.getElementById("total");
    var contenido = total.innerHTML;
    pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));
    if (pedidoActual == null) {
        alert("No hay productos en el carro")
        return;
    }
    if (document.getElementById("idN").value == "") {
        alert("Ingrese su nombre!");
        return false;
    }
    if (document.getElementById("idDir").value == "") {
        alert("Ingrese su direccion");
        return false;
    }
}
//Funcion de compra
function comprar() {
    if (validarCompra() == false) {
        return false;
    }
    document.getElementById("idNit").value = "";
    document.getElementById("idN").value = "";
    document.getElementById("idDir").value = "";
    pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));
    itemsStock = JSON.parse(localStorage.getItem("stock"));
    for (var m = 0; m < pedidoActual.length; m++) {
        for (var j = 0; j < itemsStock.length; j++) {
            //Verificar si hay un producto vigente en stock (estado 1)
            if (itemsStock[j].CPro == pedidoActual[m].codigo && itemsStock[j].estado == 1) {

                var cantidadAnt = parseInt(itemsStock[j].cant, 10);
                var cantidadNueva = cantidadAnt - parseInt(pedidoActual[m].cant, 10);
                console.log(cantidadNueva);
                var stock = new objStockItems(pedidoActual[m].codigo,
                    itemsStock[j].cOrdenes,
                    cantidadNueva,
                    itemsStock[j].Pre,
                    1);
                itemsStock[j].cant = cantidadNueva;
                registroAnterior = true;
                //itemsStock.push(stock);
                localStorage.removeItem("stock");
                localStorage.setItem("stock", JSON.stringify(itemsStock));
            }
        }
    }
    document.getElementById("idTableBody3").innerHTML = "";
    sessionStorage.removeItem("regPedido");
    alert("Su pedido se registro correctamente!\n Muchas gracias por su compra!");
    window.location.replace("mostrarProductos.html?msg=compra");
}

function agregandoProducto() {
    if (validar() == false) {
        return false;
    }
    poblarArreglo();
    actualizarTabla();
    limpiar();
}

function AgregarOC() {
    var fecha = new Date();
    var cOrdenes = document.getElementById("idOrden").value;
    var fechaEntrega = document.getElementById("fechaE").value;
    var idProveedor = document.getElementById("idProv").value;
    var fechaActual = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();

    var codigoProd = document.getElementById("idProd").value;
    var cantProd = document.getElementById("cantP").value;

    if (cOrdenes === "" || fechaEntrega === "" || idProveedor === "" || codigoProd === "" || cantProd === "") {

        alert("No se han compleatado los datos requeridos");
        return false;
    }
    var codigoExiste = false;
    //Verificar si existe la orden 
    var existeOrden = false;
    var ordenes = JSON.parse(localStorage.getItem("ordenes"))
    if (ordenes != null) {
        ordenesTemp = JSON.parse(localStorage.getItem("ordenes"));

        for (var i = 0; i < ordenes.length; i++) {
            if (ordenes[i].cOrdenes == cOrdenes) {
                existeOrden = true;
            }
        }
    }
    if (!existeOrden) {
        var orden = new objOrden(cOrdenes, fechaActual, fechaEntrega, idProveedor, 1);
        recienteOrdenes.push(orden);
        ordenesTemp.push(orden);
        localStorage.removeItem("ordenes");
        localStorage.setItem("ordenes", JSON.stringify(ordenesTemp));
    }
    if (localStorage.getItem("registro") != null) {
        productos = JSON.parse(localStorage.getItem("registro"));
        for (var i = 0; i < productos.length; i++) {
            //validando codigos
            if (productos[i].codigo == codigoProd) {

                if (localStorage.getItem("ordenItems") != null) {
                    itemsOrdenesTemp = JSON.parse(localStorage.getItem("ordenItems"));
                }
                var prod = new objOrdenesItems(cOrdenes, productos[i].codigo, productos[i].nombre, productos[i].Pre, cantProd);
                recientesItems.push(prod);
                itemsOrdenesTemp.push(prod);
                localStorage.removeItem("ordenItems");
                localStorage.setItem("ordenItems", JSON.stringify(itemsOrdenesTemp));

                codigoExiste = true;
            }

        }
    }
    if (!codigoExiste) {
        alert("No se encontró el producto solicitado");
    } else {

        var scriptTabla = "";
        for (var index = 0; index < recientesItems.length; index++) {
            scriptTabla += "<tr>";
            scriptTabla += "<td>" + recientesItems[index].CPro + "</td>";
            scriptTabla += "<td>" + recientesItems[index].Npro + "</td>";
            scriptTabla += "<td>Q " + recientesItems[index].Pre + "</td>";
            scriptTabla += "<td>" + recientesItems[index].cant + "</td>";

            var subTotal = recientesItems[index].Pre * recientesItems[index].cant;

            scriptTabla += "<td>Q " + subTotal + "</td>";
            scriptTabla += "</tr>";
        }

        document.getElementById("tablaProductosBody").innerHTML = scriptTabla;
        document.getElementById("idProd").value = "";
        document.getElementById("cantP").value = "";
        document.getElementById("idProd").select();

    }
}
//Funcion para almacenar las ordenes
function objOrdenes(cOrdenes, fechaCreacion, fechaEntrega, idProveedor, estado) {

    this.cOrdenes = cOrdenes,
        this.fechaCreacion = fechaCreacion,
        this.fechaEntrega = fechaEntrega,
        this.idProveedor = idProveedor,
        this.estado = estado

}

function ordenNueva() {
    document.getElementById("tablaProductosBody").innerHTML = "";
    document.getElementById("idOrden").value = "";
    document.getElementById("fechaE").value = "";
    document.getElementById("idProv").value = "";

    document.getElementById("idOrden").select();
    recientesItems = [];
}
//ver orden de compra
function cargarOrdenes() {
    ordenes = JSON.parse(localStorage.getItem("ordenes"));
    if (ordenes != null) {

        var scriptTabla = "";
        for (var index = 0; index < ordenes.length; index++) {
            scriptTabla += "<tr>";
            scriptTabla += "<td>" + ordenes[index].cOrdenes + "</td>";
            scriptTabla += "<td>" + ordenes[index].idProveedor + "</td>";
            scriptTabla += "<td>" + ordenes[index].fechaCreacion + "</td>";
            scriptTabla += "<td>" + ordenes[index].fechaEntrega + "</td>";
            var estado = "Solicidado";
            if (ordenes[index].estado == 2) {
                estado = "En ruta";
            }
            if (ordenes[index].estado == 3) {
                estado = "Entregado";
            }
            // Recorrer loy luego hacer el total
            var totalOrden = 0;
            var ordenesItems = JSON.parse(localStorage.getItem("ordenItems"));
            if (ordenesItems != null) {

                for (var indexItems = 0; indexItems < ordenesItems.length; indexItems++) {

                    if (ordenesItems[indexItems].cOrdenes == ordenes[index].cOrdenes) {

                        totalOrden += (ordenesItems[indexItems].Pre * ordenesItems[indexItems].cant);
                    }
                }
            }
            var listaEstado = "<select class='form-control estadoOrden' id='" + ordenes[index].cOrdenes + "' ";
            if (ordenes[index].estado == 3) {
                listaEstado += " disabled ";
            }
            listaEstado += ">" +
                "<option value='1' ";

            if (ordenes[index].estado == 1) {
                listaEstado += "selected"
            }

            listaEstado += ">Solicitado</option>" +
                "<option value='2' ";

            if (ordenes[index].estado == 2) {
                listaEstado += "selected"
            }

            listaEstado += ">En Ruta</option>" +
                "<option value='3' ";

            if (ordenes[index].estado == 3) {
                listaEstado += "selected"
            }
            listaEstado += ">Entregado</option></select>"

            scriptTabla += "<td>" + listaEstado + "</td>";

            scriptTabla += "<td>Q" + totalOrden + "</td>";

            scriptTabla += "</tr>";
        }
        document.getElementById("tablaOrdenesBody").innerHTML = scriptTabla;
    }
}
$(document).on('change', '.estadoOrden', function() {

    var idSelectOrden = this.id;
    var nuevoEstado = this.value;
    var temp = [];
    console.log(nuevoEstado);

    var busquedaOrdenes = JSON.parse(localStorage.getItem("ordenes"));
    if (busquedaOrdenes != null) {
        for (var i = 0; i < busquedaOrdenes.length; i++) {

            if (busquedaOrdenes[i].cOrdenes == idSelectOrden) {
                busquedaOrdenes[i].estado = nuevoEstado;
                localStorage.removeItem("ordenes");
                localStorage.setItem("ordenes", JSON.stringify(busquedaOrdenes));

                //console.log("encontrado "  + busquedaOrdenes[i].idProveedor)

                if (nuevoEstado == 3) {


                    $(this).attr('disabled');

                    if (JSON.parse(localStorage.getItem("stock") != null)) {
                        itemsStock = JSON.parse(localStorage.getItem("stock"));
                    }
                    var ordenesItems = JSON.parse(localStorage.getItem("ordenItems"));

                    if (ordenesItems != null) {

                        for (var q = 0; q < ordenesItems.length; q++) {
                            console.log(q)
                            if (ordenesItems[q].cOrdenes == busquedaOrdenes[i].cOrdenes) {
                                var registroAnterior = false;
                                //verificar que el stock no esté vacío
                                if (itemsStock != null) {

                                    for (var j = 0; j < itemsStock.length; j++) {

                                        //Verificar si hay un producto vigente en stock (estado 1)
                                        if (itemsStock[j].CPro == ordenesItems[q].CPro && itemsStock[j].estado == 1) {
                                            itemsStock[j].estado = 0;
                                            var cantidadAnt = parseInt(itemsStock[j].cant, 10);
                                            var cantidadNueva = cantidadAnt + parseInt(ordenesItems[q].cant, 10);
                                            console.log(cantidadAnt);
                                            var stock = new objStockItems(ordenesItems[q].CPro,
                                                ordenesItems[q].cOrdenes,
                                                cantidadNueva,
                                                ordenesItems[q].Pre,
                                                1);

                                            registroAnterior = true;

                                        }


                                    }

                                }

                                if (registroAnterior == false) {

                                    var stock = new objStockItems(ordenesItems[q].CPro,
                                        ordenesItems[q].cOrdenes,
                                        ordenesItems[q].cant,
                                        ordenesItems[q].Pre,
                                        1);

                                }

                                //console.log(stock)
                                itemsStock.push(stock);
                                localStorage.removeItem("stock");
                                localStorage.setItem("stock", JSON.stringify(itemsStock));


                            }

                        }

                    }

                }

                alert("Se ha cambiado el estado correctamente a la orden No " + idSelectOrden);
            }

        }

    }

    itemsStock = []

});

function obtenerStock() {

    itemsStock = JSON.parse(localStorage.getItem("stock"));
    //console.log(itemsStock.length)
    productos = JSON.parse(localStorage.getItem("registro"));

    if (itemsStock != null) {
        var tablaStock = "";
        for (var k = 0; k < itemsStock.length; k++) {

            if (itemsStock[k].estado == 1) {

                if (productos != null) {

                    for (var l = 0; l < productos.length; l++) {

                        if (itemsStock[k].CPro == productos[l].codigo) {
                            tablaStock += "<tr>" +
                                "<td>" + itemsStock[k].CPro + "</td>" +
                                "<td>" + productos[l].nombre + "</td>" +
                                "<td>" + itemsStock[k].cant + "</td>" +
                                "<td>" + itemsStock[k].Pre + "</td></tr>";
                        }
                    }

                }
                //console.log(itemsStock[k].cant);
            }
        }
        //Mostrar los datos en la tabla
        document.getElementById("tablaStockBody").innerHTML = tablaStock;
    }

}