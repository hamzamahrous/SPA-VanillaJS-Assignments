const listOfCardsContainer = document.getElementById("listOfRequests");

function getSingleVideoReq(videoInfo) {
  let card = document.createElement("div");
  card.innerHTML = `
    <div class="card mb-3">
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${videoInfo.topic_title}</h3>
          <p class="text-muted mb-2">${videoInfo.topic_details}</p>
          ${
            videoInfo.expected_result &&
            `
              <p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${videoInfo.expected_result}
              </p>
            `
          }
        </div>
        <div class="d-flex flex-column text-center">
          <a id="votes_ups_${videoInfo._id}" class="btn btn-link">🔺</a>
          <h3 id="score_vote_${videoInfo._id}" >${
    videoInfo.votes.ups - videoInfo.votes.downs
  }</h3>
          <a id="votes_downs_${videoInfo._id}" class="btn btn-link">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div>
          <span class="text-info">${String(
            videoInfo.status
          ).toLocaleUpperCase()}</span>
          &bullet; added by <strong>${videoInfo.author_name}</strong> on
          <strong>${new Date(
            videoInfo.submit_date
          ).toLocaleDateString()}</strong>
        </div>
        <div
          class="d-flex justify-content-center flex-column 408ml-auto mr-2"
        >
          <div class="badge badge-success">${videoInfo.target_level}</div>
        </div>
      </div>
    </div>
  `;

  return card;
}

function addVotingFunctionality(videoInfo) {
  const voteUpsEle = document.getElementById(`votes_ups_${videoInfo._id}`);
  const voteDownsEle = document.getElementById(`votes_downs_${videoInfo._id}`);
  const scoreVote = document.getElementById(`score_vote_${videoInfo._id}`);

  voteUpsEle.addEventListener("click", (e) => {
    fetch("http://localhost:7777/video-request/vote", {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },

      body: JSON.stringify({
        id: videoInfo._id,
        vote_type: "ups",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        scoreVote.textContent = data.ups - data.downs;
      });
  });

  voteDownsEle.addEventListener("click", (e) => {
    fetch("http://localhost:7777/video-request/vote", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        id: videoInfo._id,
        vote_type: "downs",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        scoreVote.textContent = data.ups - data.downs;
      });
  });
}

function loadAllVideoRequests(sortedByOption = "newFirst") {
  fetch(`http://localhost:7777/video-request?sortBy=${sortedByOption}`)
    .then((response) => response.json())
    .then((data) => {
      listOfCardsContainer.innerHTML = "";

      data.forEach((videoInfo) => {
        listOfCardsContainer.appendChild(getSingleVideoReq(videoInfo));
        addVotingFunctionality(videoInfo);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const videoRequestForm = document.getElementById("form_video_request");
  const sortByElements = document.querySelectorAll("[id*=sort_by_]");

  loadAllVideoRequests();

  sortByElements.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();

      const sortBy = this.querySelector("input");
      loadAllVideoRequests(sortBy.value);

      sortByElements.forEach((ele) => {
        ele.classList.remove("active");
      });

      e.currentTarget.classList.add("active");
    });
  });

  videoRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestForm);

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
