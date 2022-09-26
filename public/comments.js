commentBtn = document.getElementsByClassName("comments-btn");
modalForm = document.getElementsByClassName("comments-modal");
closeBtn = document.getElementsByClassName("close");

for (let i = 0; i < commentBtn.length; i++) {
  commentBtn[i].onclick = () => {
    modalForm[i].style.display = "block";
  };
  closeBtn[i].onclick = () => {
    modalForm[i].style.display = "none";
  };
}
