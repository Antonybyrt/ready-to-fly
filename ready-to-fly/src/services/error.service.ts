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

    static confirmDelete = (): Promise<boolean> => {
        return Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete fthis flight ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            return result.isConfirmed;
        });
    }

}
