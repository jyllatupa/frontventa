import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function alertas(mensaje, icono, foco=''){
    onfocus(foco);
    const myswal = withReactContent(Swal);
    myswal.fire({
        title: mensaje,
        icon: icono
    });
}

function onfocus(foco){
    if(foco != ''){
        document.getElementById(foco).focus();
    }
}