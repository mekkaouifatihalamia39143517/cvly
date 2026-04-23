function selectType(type) {
  localStorage.setItem("cvType", type);
  window.location.href = "cv-builder.html";
}