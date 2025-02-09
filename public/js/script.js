(() => {
  "use strict";
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})(); //The () at the end of the function is used to immediately invoke the function expression. This pattern is known as an Immediately Invoked Function Expression (IIFE). It allows the function to run as soon as it is defined.

// Confirm Deletion with SweetAlert2 in index.ejs.....................................

function confirmDelete(taskId, event) {
  event.preventDefault(); // Prevent form submission immediately

  Swal.fire({
    title: "Delete Task?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff6b6b",
    cancelButtonColor: "#4a90e2",
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "No, keep it",
    backdrop: `rgba(255,0,0,0.4) url("/img/warning.gif") left top no-repeat`,
  }).then((result) => {
    if (result.isConfirmed) {
      // Wait for 500ms before submitting to let the alert stay visible
      setTimeout(() => {
        document.getElementById(`deleteForm-${taskId}`).submit();
      }, 500);
    }
  });
}
