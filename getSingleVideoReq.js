export function getSingleVideoReq(videoInfo, state) {
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

      ${
        videoInfo.status === "done"
          ? `
            <div class="ml-auto mr-3">
              <iframe width='240' height='135' src="https://www.youtube.com/embed/${videoInfo.video_ref}" frameborder="0" allowfullscreen>
              </iframe>
            </div>
        `
          : ""
      }


      ${
        videoInfo.status !== "done"
          ? `      <div class="d-flex flex-column align-items-center justify-content-center">
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
      </div>`
          : ""
      }

    </div>
    <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center px-4 py-3 small text-secondary">
      <div>
        <span class="badge rounded-pill bg-primary-subtle text-primary me-2 px-3 py-2 fw-medium">
          ${String(videoInfo.status).toLocaleUpperCase()} ${
    videoInfo.status === "done"
      ? "on " + new Date(videoInfo.video_ref.date).toLocaleDateString()
      : ""
  }
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
