import { applyVoteStyle } from "./applyVoteStyle.js";

export function addVotingFunctionality(videoInfo, state) {
  if (videoInfo.status === "done") return;

  applyVoteStyle(videoInfo._id, videoInfo.votes, state);

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
          applyVoteStyle(id, data, state);
        });
    })
  );
}
