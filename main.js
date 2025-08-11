import { debounce } from "./debounce.js";
import { getSingleVideoReq } from "./getSingleVideoReq.js";
import { addVotingFunctionality } from "./addVotingFunctionality.js";
import { loadAllVideoRequests } from "./loadAllVideoRequests.js";
import { checkFormValidity } from "./checkFormValidity.js";
import API from "./api.js";

const state = {
  sortBy: "newFirst",
  userId: "",
  filterBy: "all",
  searchTerm: "",
  isSuperUser: false,
};

const SUPER_USER_ID = "20030611";

const listOfCardsContainer = document.getElementById("listOfRequests");

document.addEventListener("DOMContentLoaded", () => {
  const videoRequestForm = document.getElementById("form_video_request");
  const Elements = document.querySelectorAll("[id*=sort_by_]");
  const searchEle = document.getElementById("search_box");
  const filterByElms = document.querySelectorAll("[id^=filter_by_]");

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

  loadAllVideoRequests(state);
  filterByElms.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      state.filterBy = e.target.getAttribute("id").split("_")[2];
      filterByElms.forEach((ele) => ele.classList.remove("active"));
      loadAllVideoRequests(state);
      this.classList.add("active");
    });
  });

  Elements.forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();

      state.sortBy = this.querySelector("input").value;
      loadAllVideoRequests(state);

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
      loadAllVideoRequests(state);
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

    API.videoReq.post(formData).then((videoInfo) => {
      listOfCardsContainer.prepend(getSingleVideoReq(videoInfo, state));
      addVotingFunctionality(videoInfo, state);
    });
  });
});
