const listOfCardsContainer = document.getElementById("listOfRequests");
const state = {
  sortBy: "newFirst",
  userId: "",
  searchTerm: "",
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
    <div class="card mb-4 shadow-sm border-0 rounded-3 overflow-hidden">
      <div class="card-body d-flex justify-content-between flex-row gap-3">
        <div class="d-flex flex-column">
          <h3 class="h3 fw-bold text-primary" style="font-size: 1.5rem;">${
            videoInfo.topic_title
          }</h3>
          <p class="text-muted mb-2" style="font-size: 1.1rem;">${
            videoInfo.topic_details
          }</p>
          ${
            videoInfo.expected_result &&
            `
              <p class="mb-0 text-muted" style="font-size: 1.1rem;">
                <strong>Expected results:</strong> ${videoInfo.expected_result}
              </p>
            `
          }
        </div>
        <div class="d-flex flex-column align-items-center justify-content-center">
          <a id="votes_ups_${
            videoInfo._id
          }" class="btn btn-sm text-success mb-1" style="font-size: 1.2rem;">🔺</a>
          <h4 class="my-0 fs-3" id="score_vote_${videoInfo._id}">${
    videoInfo.votes.ups.length - videoInfo.votes.downs.length
  }</h4>
          <a id="votes_downs_${
            videoInfo._id
          }" class="btn btn-sm text-danger mt-1" style="font-size: 1.2rem;">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between bg-light text-muted" style="font-size: 0.9rem;">
        <div>
          <span class="badge bg-info text-white" style="font-size: 1rem;">${String(
            videoInfo.status
          ).toLocaleUpperCase()}</span>
          &nbsp;• added by <strong>${videoInfo.author_name}</strong> on
          <strong>${new Date(
            videoInfo.submit_date
          ).toLocaleDateString()}</strong>
        </div>
        <div class="d-flex align-items-center">
          <div class="badge bg-success text-white px-3 py-2 fs-5">${
            videoInfo.target_level
          }</div>
        </div>
      </div>
    </div>
  `;

  return card;
}

function applyVoteStyle(video_id, votes_list) {
  const voteUpsElm = document.getElementById(`votes_ups_${video_id}`);
  const voteDownsElm = document.getElementById(`votes_downs_${video_id}`);

  voteUpsElm.style.opacity = "1";
  voteDownsElm.style.opacity = "1";

  console.log(votes_list);

  if (votes_list.ups.includes(state.userId)) {
    voteDownsElm.style.opacity = "0.5";
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
          userId: state.userId,
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
      });
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
