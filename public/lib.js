document.addEventListener("DOMContentLoaded", () => {
let dropArea = document.getElementById("dropArea");
dropArea.addEventListener("dragenter", (e) => {
  e.target.classList.add("dragenter");
});
dropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.target.classList.remove("dragenter");
});

});

function dropImage(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("test");
    let avatar = document.getElementById("avatar");
    avatar.current.files = e.dataTransfer.files;
    avatarChange({ target: avatar });
  }
function avatarChange(e) {
  let imagePreview = document.querySelector("div.preview img");
  imagePreview.src = URL.createObjectURL(e.target.files[0]);
}
