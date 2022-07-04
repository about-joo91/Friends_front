const modalButton = document.querySelector(".modalButton");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".closeModal");
const modal_overlay = document.querySelector(".modal_overlay");

modalButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
});
modal_overlay.addEventListener("click", () => {
    modal.classList.add("hidden");
});




