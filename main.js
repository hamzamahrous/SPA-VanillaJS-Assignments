const listOfCardsContainer = document.getElementById("listOfRequests");
const SUPER_USER_ID = "20030611";

const state = {
  sortBy: "newFirst",
  userId: "",
  searchTerm: "",
  isSuperUser: false,
};

function debounce(fn, time) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), time);
  };
}

function getSingleVideoReq(videoInfo) {
  let card = document.createElement("div");
  card.innerHTML = `
  <div class="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
    ${
      state.isSuperUser
        ? `<div class="card-header d-flex justify-content-between align-items-center gap-3 bg-light border-0 shadow-sm rounded">
      <!-- Status Select -->
      <label for="status-select" class="visually-hidden">Change status</label>
      <select name="status" aria-label="Change status" class="form-select form-select-sm w-auto" id="admin_change_status_${
        videoInfo._id
      }">
        <option value="new">New</option>
        <option value="planned">Planned</option>
        <option value="done">Done</option>
      </select>

      <!-- YouTube Input -->
      <div class="input-group input-group-sm flex-grow-1 shadow-sm rounded ${
        videoInfo.video_ref.link ? "" : "d-none"
      }" style="max-width: 380px;" id="admin_save_video_container_${
            videoInfo._id
          }">
        <input
          type="text"
          class="form-control border-0 focus:outline-none"
          placeholder="Paste YouTube video URL"
          id="admin_video_res_${videoInfo._id}"
        />
        <button class="btn btn-primary d-flex align-items-center gap-1 px-3" type="button" id="admin_save_video_res_${
          videoInfo._id
        }">
          <i class="bi bi-link-45deg"></i>
          <span>Save</span>
        </button>
      </div>

      <!-- Delete Button -->
      <button class="btn btn-sm btn-danger px-3" id="admin_delete_video_req_${
        videoInfo._id
      }">
        <i class="bi bi-trash-fill"></i> Delete
      </button>
    </div>`
        : ""
    }

    <div class="card-body d-flex justify-content-between gap-4 p-4">
      <div class="d-flex flex-column">
        <h3 class="fw-semibold text-dark mb-2" style="font-size:1.4rem;">
          ${videoInfo.topic_title}
        </h3>
        <p class="text-secondary mb-3" style="font-size:1rem;">
          ${videoInfo.topic_details}
        </p>
        ${
          videoInfo.expected_result &&
          `
            <p class="mb-0 text-muted" style="font-size:0.95rem;">
              <strong>Expected results:</strong> ${videoInfo.expected_result}
            </p>
          `
        }
      </div>
      <div class="d-flex flex-column align-items-center justify-content-center">
        <a id="votes_ups_${videoInfo._id}" 
           class="btn btn-light border-0 rounded-circle mb-2 shadow-sm vote-btn"
           title="Upvote">
          🔺
        </a>
        <h4 class="my-0 " id="score_vote_${videoInfo._id}">
          ${videoInfo.votes.ups.length - videoInfo.votes.downs.length}
        </h4>
        <a id="votes_downs_${videoInfo._id}" 
           class="btn btn-light border-0 rounded-circle mt-2 shadow-sm vote-btn"
           title="Downvote">
          🔻
        </a>
      </div>
    </div>
    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center px-4 py-3 small text-secondary">
      <div>
        <span class="badge rounded-pill bg-primary-subtle text-primary me-2 px-3 py-2 fw-medium">
          ${String(videoInfo.status).toLocaleUpperCase()}
        </span>
        added by <strong>${videoInfo.author_name}</strong> on
        <strong>${new Date(videoInfo.submit_date).toLocaleDateString()}</strong>
      </div>
      <div>
        <span class="badge rounded-pill bg-success-subtle text-success px-3 py-2">
          ${videoInfo.target_level}
        </span>
      </div>
    </div>
  </div>
`;

  return card;
}

function applyVoteStyle(video_id, votes_list) {
  const voteUpsElm = document.getElementById(`votes_ups_${video_id}`);
  const voteDownsElm = document.getElementById(`votes_downs_${video_id}`);

  if (state.isSuperUser) {
    voteDownsElm.style.opacity = "0.5";
    voteDownsElm.style.cursor = "not-allowed";
    voteUpsElm.style.cursor = "not-allowed";
    voteUpsElm.style.opacity = "0.5";

    return;
  }

  voteUpsElm.style.opacity = "1";
  voteDownsElm.style.opacity = "1";

  if (votes_list.ups.includes(state.userId)) {
    voteUpsElm.style.opacity = "0.5";
  } else if (votes_list.downs.includes(state.userId)) {
    voteDownsElm.style.opacity = "0.5";
  }
}

function addVotingFunctionality(videoInfo) {
  applyVoteStyle(videoInfo._id, videoInfo.votes);

  const scoreElms = document.querySelectorAll(
    `[id^=votes_][id$=_${videoInfo._id}]`
  );
  const scoreVote = document.getElementById(`score_vote_${videoInfo._id}`);

  scoreElms.forEach((ele) =>
    ele.addEventListener("click", function (e) {
      if (state.isSuperUser) return;

      e.preventDefault();
      const [, vote_type, id] = e.target.getAttribute("id").split("_");
      fetch("http://localhost:7777/video-request/vote", {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
          vote_type,
          user_id: state.userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          scoreVote.textContent = data.ups.length - data.downs.length;
          applyVoteStyle(id, data);
        });
    })
  );
}

function loadAllVideoRequests(sortedByOption = "newFirst", searchTerm = "") {
  fetch(
    `http://localhost:7777/video-request?sortBy=${sortedByOption}&searchTerm=${searchTerm}`
  )
    .then((response) => response.json())
    .then((data) => {
      listOfCardsContainer.innerHTML = "";

      data.forEach((videoInfo) => {
        listOfCardsContainer.appendChild(getSingleVideoReq(videoInfo));
        addVotingFunctionality(videoInfo);

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
            console.log(adminSaveVideoResElm);

            if (!adminVideoResElm.value) {
              adminVideoResElm.classList.add("is-invalid");
              adminVideoResElm.addEventListener("input", () => {
                adminVideoResElm.classList.remove("is-invalid");
              });

              return;
            }

            updatedVideoReqStatus(
              videoInfo._id,
              "done",
              adminVideoResElm.value
            );
          });

          adminDeleteVideoReqElm.addEventListener("click", () => {
            console.log(videoInfo);
            fetch("http://localhost:7777/video-request", {
              method: "DELETE",
              headers: {
                "content-Type": "application/json",
              },
              body: JSON.stringify({
                id: videoInfo._id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                window.location.reload();
              });
          });
        }
      });
    });
}

function updatedVideoReqStatus(id, status, resVideo = "") {
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

function checkFormValidity(formData) {
  const topic = formData.get("topic_title");
  const topic_details = formData.get("topic_details");

  if (!topic || topic.length > 50) {
    document.querySelector('[name="topic_title"]').classList.add("is-invalid");
  }

  if (!topic_details) {
    document
      .querySelector('[name="topic_details"]')
      .classList.add("is-invalid");
  }

  let allInvalidElms = document.querySelectorAll(".is-invalid");

  if (allInvalidElms.length) {
    allInvalidElms.forEach((ele) => {
      ele.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });

    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  const videoRequestForm = document.getElementById("form_video_request");
  const Elements = document.querySelectorAll("[id*=sort_by_]");
  const searchEle = document.getElementById("search_box");

  const formLoginElm = document.querySelector("#login-form");
  const appContentElm = document.querySelector(".app-content");

  if (window.location.search) {
    state.userId = new URLSearchParams(window.location.search).get("id");

    if (state.userId === SUPER_USER_ID) {
      state.isSuperUser = true;
      document.querySelector(".normal-user").classList.add("d-none");
    }

    formLoginElm.classList.add("d-none");
    appContentElm.classList.remove("d-none");
  }

  loadAllVideoRequests();

  Elements.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();

      state.sortBy = this.querySelector("input").value;
      loadAllVideoRequests(state.sortBy, state.searchTerm);

      Elements.forEach((ele) => {
        ele.classList.remove("active");
      });

      e.currentTarget.classList.add("active");
    });
  });

  searchEle.addEventListener(
    "input",
    debounce(function (e) {
      state.searchTerm = e.target.value;
      loadAllVideoRequests(state.sortBy, state.searchTerm);
    }, 300)
  );

  videoRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestForm);
    formData.append("author_id", state.userId);

    const is_valid = checkFormValidity(formData);
    if (!is_valid) {
      return;
    }

    fetch("http://localhost:7777/video-request", {
      method: "POST",
      body: formData,
    })
      .then((request) => request.json())
      .then((videoInfo) => {
        listOfCardsContainer.prepend(getSingleVideoReq(videoInfo));
        addVotingFunctionality(videoInfo);
      });
  });
});
