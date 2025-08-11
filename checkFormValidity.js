export function checkFormValidity(formData) {
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
