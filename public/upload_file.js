var files = [];

var title = document.getElementById("title").value;
var progessDiv = document.getElementsByClassName("uploading-progress-div");

document.getElementById("files").addEventListener("change", (e) => {
  console.log(e.target.files);
  files = e.target.files;
});

document.getElementById("send").addEventListener("click", () => {
  let name = document.getElementById("name").value;
  let desc = document.getElementById("desc").value;

  console.log(title, name, desc);
  var url = `http://localhost:8080/admin/${title}/new-task`;
  const formData = new FormData();

  formData.append("myFile", files[0]);
  formData.append("name", name);
  formData.append("desc", desc);

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      response.json();
    })
    .then((data) => {
      console.log(data.path);
    })
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  var message = document.createElement("p");
  message.innerText = "Page will reload after 10 seconds!";
  progessDiv[0].appendChild(message);
  progessDiv[0].style.display = "block";
  setTimeout(() => {
    window.location.replace(`/projects/${title}`);
  }, 10000);
});
