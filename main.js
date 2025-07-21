document.addEventListener("DOMContentLoaded", () => {
  const videoRequestForm = document.getElementById("form_video_request");
  videoRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestForm);

    fetch("http://localhost:7777/video-request", {
      method: "POST",
      body: formData,
    })
      .then((request) => request.json())
      .then((data) => {
        console.log(data);
      });
  });
});
