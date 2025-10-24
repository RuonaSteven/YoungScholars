import Swal, { SweetAlertIcon } from "sweetalert2";
import "animate.css";

export const showAlert = (
  title: string,
  text: string,
  icon: SweetAlertIcon = "info"
) => {
  return Swal.fire({
    title,
    text,
    icon,
    background: "#f8fafc",
    color: "#1e293b",
    confirmButtonColor: "#7c3aed",
    confirmButtonText: "OK",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      title: "font-bold text-xl",
      confirmButton: "rounded-lg px-5 py-2 font-semibold",
    },
  });
};
