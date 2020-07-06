const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name='productId']").value;
  const csrfValue = btn.parentNode.querySelector("[name='_csrf']").value;
  const parentElement = btn.closest("article");
  fetch(`/admin/delete/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfValue,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      parentElement.parentNode.removeChild(parentElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
