var projectId = document.getElementById("projectId").value;

var url = `http://localhost:5000/user/doneTasks/${projectId}`;

fetch(url, { method: "post" })
  .then((resp) => resp.json())
  .catch((err) => console.error(err));
