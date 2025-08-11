import { getSingleVideoReq } from "./getSingleVideoReq.js";
import { addVotingFunctionality } from "./addVotingFunctionality.js";
import { updatedVideoReqStatus } from "./updatedVideoReqStatus.js";
import API from "./api.js";

const listOfCardsContainer = document.getElementById("listOfRequests");

export function loadAllVideoRequests(state) {
  API.videoReq.get(state).then((data) => {
    listOfCardsContainer.innerHTML = "";

    data.forEach((videoInfo) => {
      listOfCardsContainer.appendChild(getSingleVideoReq(videoInfo, state));
      addVotingFunctionality(videoInfo, state);

      if (state.isSuperUser) {
        const adminChangeStatusElm = document.getElementById(
          `admin_change_status_${videoInfo._id}`
        );

        const adminVideoResElm = document.getElementById(
          `admin_video_res_${videoInfo._id}`
        );

        const adminSaveVideoResElm = document.getElementById(
          `admin_save_video_res_${videoInfo._id}`
        );

        const adminDeleteVideoReqElm = document.getElementById(
          `admin_delete_video_req_${videoInfo._id}`
        );

        const adminSaveVideoContainerElm = document.getElementById(
          `admin_save_video_container_${videoInfo._id}`
        );

        adminChangeStatusElm.value = videoInfo.status;
        adminVideoResElm.value = videoInfo.video_ref.link;

        adminChangeStatusElm.addEventListener("change", (e) => {
          if (e.target.value === "done") {
            adminSaveVideoContainerElm.classList.remove("d-none");
          } else {
            updatedVideoReqStatus(videoInfo._id, e.target.value);
          }
        });

        adminSaveVideoResElm.addEventListener("click", (e) => {
          e.preventDefault();

          if (!adminVideoResElm.value) {
            adminVideoResElm.classList.add("is-invalid");
            adminVideoResElm.addEventListener("input", () => {
              adminVideoResElm.classList.remove("is-invalid");
            });

            return;
          }

          updatedVideoReqStatus(videoInfo._id, "done", adminVideoResElm.value);
        });

        adminDeleteVideoReqElm.addEventListener("click", () => {
          const bodyObject = JSON.stringify({ id: videoInfo._id });
          API.videoReq.delete(bodyObject).then((data) => {
            window.location.reload();
          });
        });
      }
    });
  });
}
