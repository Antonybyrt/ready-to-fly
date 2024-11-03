import Swal from 'sweetalert2'


export class ErrorService {

    static successMessage = (title: string, msg: string) => {
        return Swal.fire({
            title: title,
            text: msg,
            icon: "success"
          });
    }

    static errorMessage = (title: string, msg: string) => {
        return Swal.fire({
            title: title,
            text: msg,
            icon: "error"
        });
    }

}
