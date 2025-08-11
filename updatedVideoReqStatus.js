import API from "./api.js";

export function updatedVideoReqStatus(id, status, resVideo = "") {
  API.videoReq.update(id, status, resVideo).then((data) => {
    window.location.reload();
  });
}
