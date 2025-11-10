import Swal, { SweetAlertIcon } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const showAlert = (
  title: string,
  text: string,
  icon: SweetAlertIcon = "info"
) => {
  return Swal.fire({
    title,
    html: text, // allows HTML tags like <strong>
    icon,
    background: "#f9f5ff",
    color: "#2e1065",
    confirmButtonText: "Continue",
    confirmButtonColor: "purple",
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-purple-100",
      title: "text-2xl font-bold",
      confirmButton:
        "bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-500 transition-all duration-300",
    },
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    // customClass: {
    //   popup: "rounded-2xl shadow-2xl",
    //   title: "font-bold text-xl",
    //   confirmButton: "rounded-lg px-5 py-2 font-semibold",
    // },
  });
};
