import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {alertas} from '../function';

const ListadoVentas = () => {
    const url = 'http://localhost/api/ventas';
    const [ventas, setListaVentas] = useState([]);
    const [codventa, setCodventa] = useState('');
    const [vendedor, setVendedor] = useState('');
    const [nrodocumento, setNrodocumento] = useState('');
    const [producto, setProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [operation, setOperacion] = useState(1);
    const [title, setTitle] = useState('');
    const configToken = {
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJub21icmUiOiJKb25hdGhhblkiLCJlbWFpbCI6Imp5bGxhdHVwYWxAZ21haWwuY29tIn0sImlhdCI6MTY3NDc1NTI4NX0.hvP0byY6dgdpcoTpNU7AebN8ihgux-RWvp67o64M3do"
        }
    }

    useEffect(() => {
        getLista('');
    },[]);

    const getLista = async (valor) => {
        var respuesta;
        if(valor === ''){
            respuesta = await axios.get(url, configToken);
        }else{
            respuesta = await axios.get(url+'/'+valor, configToken);
        }
        
        setListaVentas(respuesta.data);
        console.log(respuesta.data);
    }

    const openModal = (op, codventa, vendedor, nrodocumento, producto, cantidad, precio) =>{
        setCodventa('');
        setVendedor('');
        setNrodocumento('');
        setProducto('');
        setCantidad('');
        setPrecio('');
        setOperacion(op);

        if(op === 1){
            setTitle('Registrar Venta');
        }else if(op === 2){
            setTitle('Editar Venta');
            setCodventa(codventa);
            setVendedor(vendedor);
            setNrodocumento(nrodocumento);
            setProducto(producto);
            setCantidad(cantidad);
            setPrecio(precio);
        }

        window.setTimeout(function(){
            document.getElementById('idRow').style.display = "none";
            document.getElementById('vendedor').focus();
        }, 500);
    }

    const validar = () =>{
        var parametros;
        var metodo;
        if(vendedor.trim() === ''){
            alertas('Ingrese el nombre del vendedor','warning');
        }else if(nrodocumento.trim() === ''){
            alertas('Ingrese el nro.documento del vendedor','warning');
        }else if(producto.trim() === ''){
            alertas('Ingrese el producto','warning');
        }else if(cantidad === ''){
            alertas('Ingrese la cantidad','warning');
        }else if(precio === ''){
            alertas('Ingrese el precio del producto','warning');
        }else{
            if(operation === 1){
                parametros = {vendedor: vendedor, nrodocumento: nrodocumento, producto: producto, cantidad: cantidad, precio: precio}
                metodo = "POST";
            }else{
                parametros = {codventa: codventa, vendedor: vendedor, nrodocumento: nrodocumento, producto: producto, cantidad: cantidad, precio: precio}
                metodo = "PUT";
            }

            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async(metodo, parametros) => {
        await axios({method: metodo, url: url, data:parametros, headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJub21icmUiOiJKb25hdGhhblkiLCJlbWFpbCI6Imp5bGxhdHVwYWxAZ21haWwuY29tIn0sImlhdCI6MTY3NDc1NTI4NX0.hvP0byY6dgdpcoTpNU7AebN8ihgux-RWvp67o64M3do"
        }}).then(function(respuesta){
            var msj = respuesta.data;
            alertas("Guardado correctamente", 'info');
            if(msj === "ok"){
                document.getElementById('btnCerrar').click();
                getLista('');
            }
        })
        .catch(function(error){
            alertas("Se produjo un error en la solicitud",'error');
            console.log(error);
        })
    }

    const Eliminar = (codventa, producto) => {
        const myswal = withReactContent(Swal);
        myswal.fire({
            title: '¿Esta seguro de eliminar el producto '+producto+'?',
            icon: 'question', text: 'Alerta',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                setCodventa(codventa);
                enviarSolicitud('DELETE', {codventa:codventa});
            }else{
                alertas('El producto no fue eliminado', 'info');
            }
        });
    }

    const [search, setSearch] = useState('');
    const handleChange = (event) => {
        setSearch(event.target.value);
        var parametro;

        parametro = event.target.value;
        getLista(parametro);
    }

    return(
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <label>Buscador</label>
                        <input type="text" className="form-control mb-3" id="inputDocumento" placeholder="Ingrese nro. documento del vendedor" value={search} onChange={handleChange}></input>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalLista">
                                <i className="fa-solid fa-circle-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>VENDEDOR</th>
                                        <th>NRO DOCUMENTO</th>
                                        <th>PRODUCTO</th>
                                        <th>CANTIDAD</th>
                                        <th>PRECIO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {ventas.map((venta, i) => (
                                        <tr key={venta.codventa}>
                                            <td>{venta.codventa}</td>
                                            <td>{venta.vendedor}</td>
                                            <td>{venta.nrodocumento}</td>
                                            <td>{venta.producto}</td>
                                            <td>{venta.cantidad}</td>
                                            <td>${new Intl.NumberFormat('es-mx').format(venta.precio)}</td>
                                            <td>
                                                <button onClick={() => openModal(2, venta.codventa, venta.vendedor, venta.nrodocumento, venta.producto, venta.cantidad, venta.precio)} className="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalLista">
                                                    <i className="fa-solid fa-edit"></i>
                                                </button> 
                                                <button onClick={() => Eliminar(venta.codventa, venta.producto)} className="btn btn-danger">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id="modalLista" className="modal fade" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id"></input>
                            <div id="idRow" className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="text" id="codventa" className="form-control" placeholder="Codigo de venta" value={codventa}
                                onChange={(e) => setCodventa(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-person"></i></span>
                                <input type="text" id="vendedor" className="form-control" placeholder="Nombre del vendedor" value={vendedor}
                                onChange={(e) => setVendedor(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-address-card"></i></span>
                                <input type="text" id="nrodocumento" className="form-control" placeholder="nro. documento del vendedor" value={nrodocumento}
                                onChange={(e) => setNrodocumento(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-clipboard"></i></span>
                                <input type="text" id="producto" className="form-control" placeholder="producto" value={producto}
                                onChange={(e) => setProducto(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-hashtag"></i></span>
                                <input type="text" id="cantidad" className="form-control" placeholder="cantidad" value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-dollar-sign"></i></span>
                                <input type="text" id="precio" className="form-control" placeholder="precio" value={precio}
                                onChange={(e) => setPrecio(e.target.value)}></input>
                            </div>
                            <div className="d-grid col-6 mx-auto">
                                <button onClick={() => validar()} className="btn btn-success">
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnCerrar" className="btn btn-secondary" data-bs-dismiss="modal">
                                <i className="fa-sharp fa-solid fa-circle-xmark"></i> Salir</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListadoVentas