import Swal from 'sweetalert2';

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

let toastHandler: ((toast: ToastOptions & { type: 'success' | 'error' | 'warning' | 'info' }) => void) | null = null;

export class ErrorService {
  static setToastHandler(handler: typeof toastHandler) {
    toastHandler = handler;
  }

  static successMessage = (title: string, message?: string) => {
    if (toastHandler) {
      toastHandler({
        type: 'success',
        title,
        message,
        duration: 4000
      });
    } else {
      return Swal.fire({
        title: title,
        text: message || '',
        icon: "success",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#10b981',
        color: '#ffffff'
      });
    }
  };

  static errorMessage = (title: string, message?: string) => {
    if (toastHandler) {
      toastHandler({
        type: 'error',
        title,
        message,
        duration: 5000
      });
    } else {
      return Swal.fire({
        title: title,
        text: message || '',
        icon: "error",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: '#ef4444',
        color: '#ffffff'
      });
    }
  };

  static warningMessage = (title: string, message?: string) => {
    if (toastHandler) {
      toastHandler({
        type: 'warning',
        title,
        message,
        duration: 4000
      });
    } else {
      return Swal.fire({
        title: title,
        text: message || '',
        icon: "warning",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#f59e0b',
        color: '#ffffff'
      });
    }
  };

  static infoMessage = (title: string, message?: string) => {
    if (toastHandler) {
      toastHandler({
        type: 'info',
        title,
        message,
        duration: 4000
      });
    } else {
      return Swal.fire({
        title: title,
        text: message || '',
        icon: "info",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#3b82f6',
        color: '#ffffff'
      });
    }
  };

  static confirmDelete = (): Promise<boolean> => {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff'
    }).then((result) => {
      return result.isConfirmed;
    });
  };

  static confirmAction = (title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel'): Promise<boolean> => {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      background: '#1f2937',
      color: '#ffffff'
    }).then((result) => {
      return result.isConfirmed;
    });
  };
}
