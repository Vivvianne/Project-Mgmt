document.getElementById("done-btn").addEventListener("click", function () {
  var taskName = document.getElementById("taskName").value;
  var projectId = document.getElementById("projectId").value;

  var url = `http://localhost:5000/user/done/${projectId}/${taskName}`;

  fetch(url, {
    method: "post",
  })
    .then((resp) => {
      resp.json();
    })
    .catch((err) => {
      console.error(err);
    });

  // reload after marking done
  window.location.reload();
});
