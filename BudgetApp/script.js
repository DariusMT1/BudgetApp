let salary = 0;
let budget = {};
let expenses = [];
let totalSpent = 0;
let categories = new Set();

const salaryInput = document.getElementById('salary');
const categoryInput = document.getElementById('category');
const budgetAmountInput = document.getElementById('budgetAmount');
const expenseCategoryInput = document.getElementById('expenseCategory');
const expenseAmountInput = document.getElementById('expenseAmount');
const notificationsDiv = document.getElementById('notifications');
const historyList = document.getElementById('history');
const totalSalaryElement = document.getElementById('totalSalary');
const totalBudgetElement = document.getElementById('totalBudget');
const totalSpentElement = document.getElementById('totalSpent');
const remainingBalanceElement = document.getElementById('remainingBalance');
const categoryHistoryList = document.getElementById('categoryHistory');
const investmentAmountElement = document.getElementById('investment-ammount');
const economyAmountElement = document.getElementById('economy-ammount');
const budgetChartElement = document.getElementById('budgetChart');

const users = JSON.parse(localStorage.getItem('users')) || {};

let budgetChart;

function setSalary() {
  salary = parseFloat(salaryInput.value);
  if (isNaN(salary) || salary <= 0) {
    alert('Please enter a valid salary.');
    return;
  }
  totalSalaryElement.textContent = salary.toFixed(2);
  resetBudgetAndExpenses();
}

function addBudget() {
  const category = categoryInput.value.trim();
  const amount = parseFloat(budgetAmountInput.value);

  if (!category || isNaN(amount) || amount <= 0) {
    alert('Please enter valid category and amount.');
    return;
  }

  budget[category] = amount;
  categories.add(category);
  updateBudgetDisplay();
  updateCategoryHistory();
  updateExpenseCategoryList();
  categoryInput.value = '';
  budgetAmountInput.value = '';
}

function updateBudgetDisplay() {
  let totalBudget = 0;
  for (let category in budget) {
    totalBudget += budget[category];
  }
  totalBudgetElement.textContent = totalBudget.toFixed(2);

  // Check if total salary is enough
  if (totalBudget > salary) {
    notificationsDiv.textContent = 'Warning: Your budget exceeds your salary!';
    notificationsDiv.style.backgroundColor = '#ffcccb';
  } else {
    notificationsDiv.textContent = '';
  }
}

function addExpense() {
  const category = expenseCategoryInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (!category || isNaN(amount) || amount <= 0) {
    alert('Please enter valid category and amount.');
    return;
  }

  if (!budget[category]) {
    alert('No budget set for this category.');
    return;
  }

  totalSpent += amount;
  expenses.push({ category, amount, date: new Date().toLocaleString() });
  updateExpenseHistory();
  updateSpendingSummary();
  checkOverBudget();
  expenseCategoryInput.value = '';
  expenseAmountInput.value = '';
}

function updateExpenseHistory() {
  historyList.innerHTML = '';
  expenses.forEach(exp => {
    const li = document.createElement('li');
    li.textContent = `${exp.date}: ${exp.category} - $${exp.amount.toFixed(2)}`;
    historyList.appendChild(li);
  });
}

function updateSpendingSummary() {
  totalSpentElement.textContent = totalSpent.toFixed(2);
  const remainingBalance = salary - totalSpent;
  remainingBalanceElement.textContent = remainingBalance.toFixed(2);
  updateChart();
}

function checkOverBudget() {
  let totalBudget = 0;
  for (let category in budget) {
    totalBudget += budget[category];
  }

  if (totalSpent > totalBudget) {
    notificationsDiv.textContent = 'Warning: You have exceeded your budget!';
    notificationsDiv.style.backgroundColor = '#ffcccb';
  } else {
    notificationsDiv.textContent = '';
  }
}

function resetBudgetAndExpenses() {
  budget = {};
  expenses = [];
  totalSpent = 0;
  categories.clear();
  updateBudgetDisplay();
  updateExpenseHistory();
  updateSpendingSummary();
  updateCategoryHistory();
  updateExpenseCategoryList();
  notificationsDiv.textContent = '';
}

function updateCategoryHistory() {
  categoryHistoryList.innerHTML = '';
  categories.forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    categoryHistoryList.appendChild(li);
  });
}

function updateExpenseCategoryList() {
  expenseCategoryInput.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    expenseCategoryInput.appendChild(option);
  });
}

function allocateRemainingBalance() {
  const remainingBalance = salary - totalSpent;
  if (remainingBalance <= 0) {
    alert('No remaining balance to allocate.');
    return;
  }

  const investmentAmount = remainingBalance * 0.20;
  const economyAmount = remainingBalance * 0.20;

  if (!budget['Investments']) {
    budget['Investments'] = 0;
  }
  if (!budget['Economy']) {
    budget['Economy'] = 0;
  }

  budget['Investments'] += investmentAmount;
  budget['Economy'] += economyAmount;

  categories.add('Investments');
  categories.add('Economy');

  updateBudgetDisplay();
  updateCategoryHistory();
  updateSpendingSummary();
  updateInvestmentAndEconomyDisplay(investmentAmount, economyAmount);
}

function updateInvestmentAndEconomyDisplay(investmentAmount, economyAmount) {
  investmentAmountElement.innerHTML = `<li>$${investmentAmount.toFixed(2)}</li>`;
  economyAmountElement.innerHTML = `<li>$${economyAmount.toFixed(2)}</li>`;
}

function updateChart() {
  const remainingBalance = salary - totalSpent;
  const investmentAmount = remainingBalance * 0.20;
  const economyAmount = remainingBalance * 0.20;

  const data = {
    labels: ['Total Salary', 'Total Budget', 'Total Spent', 'Remaining Balance', 'Investments', 'Economy'],
    datasets: [{
      label: 'Amount',
      data: [salary, Object.values(budget).reduce((a, b) => a + b, 0), totalSpent, remainingBalance, investmentAmount, economyAmount],
      backgroundColor: ['#007bff', '#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0'],
      borderColor: ['#0056b3', '#388e3c', '#d32f2f', '#1976d2', '#f57c00', '#7b1fa2'],
      borderWidth: 1
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  if (budgetChart) {
    budgetChart.destroy();
  }

  budgetChart = new Chart(budgetChartElement, config);
}

function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

function register() {
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value.trim();

  if (!username || !password) {
    alert('Please enter a valid username and password.');
    return;
  }

  if (users[username]) {
    alert('Username already exists. Please choose another one.');
    return;
  }

  users[username] = { password, budget: {}, expenses: [], salary: 0 };
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! Please log in.');
  showLoginForm();
}

function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    alert('Please enter a valid username and password.');
    return;
  }

  const user = users[username];

  if (!user || user.password !== password) {
    alert('Invalid username or password.');
    return;
  }

  localStorage.setItem('currentUser', username);
  loadUserData(username);
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
}

function loadUserData(username) {
  const user = users[username];
  salary = user.salary;
  budget = user.budget;
  expenses = user.expenses;
  totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  categories = new Set(Object.keys(budget));

  totalSalaryElement.textContent = salary.toFixed(2);
  updateBudgetDisplay();
  updateExpenseHistory();
  updateSpendingSummary();
  updateCategoryHistory();
  updateExpenseCategoryList();
}

function saveUserData() {
  const username = localStorage.getItem('currentUser');
  if (username) {
    users[username] = { password: users[username].password, budget, expenses, salary };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

// Override existing functions to save user data
const originalSetSalary = setSalary;
setSalary = function() {
  originalSetSalary();
  saveUserData();
};

const originalAddBudget = addBudget;
addBudget = function() {
  originalAddBudget();
  saveUserData();
};

const originalAddExpense = addExpense;
addExpense = function() {
  originalAddExpense();
  saveUserData();
};

const originalAllocateRemainingBalance = allocateRemainingBalance;
allocateRemainingBalance = function() {
  originalAllocateRemainingBalance();
  saveUserData();
};
