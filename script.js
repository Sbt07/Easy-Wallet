let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

// Load data from local storage
document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("budgetData")) || {};
  if (storedData.tempAmount) {
    tempAmount = storedData.tempAmount;
    amount.innerText = tempAmount;
    balanceValue.innerText = tempAmount - storedData.expenditure;
    expenditureValue.innerText = storedData.expenditure;
    // Populate the list
    storedData.expenses.forEach((expense) => {
      listCreator(expense.name, expense.value);
    });
  }
});

// Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    amount.innerText = tempAmount;
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    totalAmount.value = "";

    // Save data to local storage
    saveToLocalStorage();
  }
});

// Function to save data to local storage
const saveToLocalStorage = () => {
  const dataToSave = {
    tempAmount,
    expenditure: parseInt(expenditureValue.innerText),
    expenses: [],
  };

  // Iterate through list items and save them
  const listItems = document.querySelectorAll(".sublist-content");
  listItems.forEach((item) => {
    const name = item.querySelector(".product").innerText;
    const value = item.querySelector(".amount").innerText;
    dataToSave.expenses.push({ name, value });
  });

  localStorage.setItem("budgetData", JSON.stringify(dataToSave));
};

// Function to disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Function to modify list elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;

  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }

  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();

  // Save data to local storage after modification
  saveToLocalStorage();
};

// Function to create list
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);

  // Save data to local storage after creation
  saveToLocalStorage();
};

// Function to add expenses
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  disableButtons(false);

  let expenditure = parseInt(userAmount.value);
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;

  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;

  listCreator(productTitle.value, userAmount.value);

  productTitle.value = "";
  userAmount.value = "";
});
