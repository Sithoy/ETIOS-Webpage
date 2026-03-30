document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openContactModal");
  const closeModalBtn = document.getElementById("closeContactModal");
  const contactModal = document.getElementById("contactModal");

  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("formSuccess");

  if (!openModalBtn || !closeModalBtn || !contactModal) {
    console.error("Modal elements not found. Check IDs in your HTML.");
    return;
  }

  function openModal() {
    contactModal.classList.remove("hidden");
    contactModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  function closeModal() {
    contactModal.classList.add("hidden");
    contactModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  openModalBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);

  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  if (form && submitBtn && successMessage) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const originalButtonText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          form.classList.add("hidden");
          successMessage.classList.remove("hidden");

          setTimeout(() => {
            successMessage.classList.add("hidden");
            form.classList.remove("hidden");
            form.reset();
            submitBtn.textContent = originalButtonText;
            submitBtn.disabled = false;
            closeModal();
          }, 5000);
        } else {
          alert("Something went wrong. Please try again.");
          submitBtn.textContent = originalButtonText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        alert("Network error. Please try again.");
        submitBtn.textContent = originalButtonText;
        submitBtn.disabled = false;
      }
    });
  }
});