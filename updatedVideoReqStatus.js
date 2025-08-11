export function updatedVideoReqStatus(id, status, resVideo = "") {
  fetch("http://localhost:7777/video-request", {
    method: "PUT",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status,
      resVideo,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
    });
}
