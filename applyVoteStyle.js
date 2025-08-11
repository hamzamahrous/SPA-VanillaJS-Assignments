export function applyVoteStyle(video_id, votes_list, state) {
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
