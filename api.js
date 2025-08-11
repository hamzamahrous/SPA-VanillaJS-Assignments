const apiUrl = "http://localhost:7777";

export default {
  videoReq: {
    get: (state) => {
      return fetch(
        `${apiUrl}/video-request?sortBy=${state.sortBy}&searchTerm=${state.searchTerm}&filterBy=${state.filterBy}`
      ).then((response) => response.json());
    },

    post: (formData) => {
      return fetch(`${apiUrl}/video-request`, {
        method: "POST",
        body: formData,
      }).then((request) => request.json());
    },

    update: (id, status, resVideo) => {
      return fetch(`${apiUrl}/video-request`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ id, status, resVideo }),
      }).then((res) => res.json());
    },

    delete: (bodyObject) => {
      return fetch(`${apiUrl}/video-request`, {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
        },
        body: bodyObject,
      }).then((res) => res.json());
    },
  },

  vote: {
    update: (id, vote_type, userId) => {
      return fetch(`${apiUrl}/video-request/vote`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
          vote_type,
          user_id: userId,
        }),
      }).then((res) => res.json());
    },
  },
};
