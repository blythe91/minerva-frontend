import Swal from 'sweetalert2';

export const showAlert = (title, text, icon) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,  // Puede ser 'success', 'error', 'warning', 'info', 'question'
    confirmButtonText: 'OK',

    //position: "top-end",
    //showConfirmButton: false,
    timer: 5000
  });
};
