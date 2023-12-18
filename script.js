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

const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};


// Load data from localStorage on page load
window.addEventListener('load', () => {
    const savedTempAmount = localStorage.getItem('tempAmount');
    // Parse the value to an integer
    expenditureValue.innerText = parseInt(savedExpenditureValue) || 0;

    const savedExpenditureValue = localStorage.getItem('expenditureValue');
    const savedList = localStorage.getItem('list');

    if (savedTempAmount && savedExpenditureValue && savedList) {
        tempAmount = parseFloat(savedTempAmount);
        amount.innerHTML = tempAmount;
        expenditureValue.innerText = savedExpenditureValue;
        balanceValue.innerText = tempAmount - savedExpenditureValue;
        list.innerHTML = savedList;
    }
});

// Setting function for budget
totalAmountButton.addEventListener("click", () => {
    tempAmount = totalAmount.value;
    if (tempAmount === "" || tempAmount < 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        amount.innerHTML = tempAmount;
        balanceValue.innerText = tempAmount - expenditureValue.innerText;
        totalAmount.value = "";

        // Save to localStorage
        localStorage.setItem('tempAmount', tempAmount);
    }
});


//Function To Create List
const listCreator = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list.appendChild(sublistContent);
    sublistContent.innerHTML = `<p class="product">${expenseName}</p> - <p class="amount">${expenseValue}</p>`;
    sublistContent.style.marginBottom = "18px";
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

    // Save to localStorage
    localStorage.setItem('list', list.innerHTML);
};

checkAmountButton.addEventListener("click", () => {
    //empty checks
    if (!userAmount.value || !productTitle.value) {
      productTitleError.classList.remove("hide");
      return false;
    }
    //Enable buttons
    disableButtons(false);
    //Expense
    let expenditure = parseInt(userAmount.value);
    //Total expense (existing + new)
    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;
    //Total balance(budget - total expense)
    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;
    //Create list
    listCreator(productTitle.value, userAmount.value);
    //Empty inputs
    productTitle.value = "";
    userAmount.value = "";
    localStorage.setItem('expenditureValue', expenditureValue.innerText);
  });

