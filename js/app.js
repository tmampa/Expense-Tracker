let state = {
    income: 0, expense: 0, balance: 0, transactions: []
}

const income = document.getElementById('income');

const expense = document.getElementById('expense');
const balance = document.getElementById('balance');
let incomeTransaction = 0;

let expenseTransaction = 0;
let balanceTransaction = 0;
function addTransaction() {

    const id = Date.now().toString()
    const transactionType = document.getElementById('transactionType').value

    const transactionDetail = document.getElementById('detailsInput').value
    const transactionAmount = document.getElementById('amountInput').value

    if (transactionDetail === '' || transactionAmount === '') {
        alert('Please provide transaction details and amount')
        return
    }

    if (transactionType === 'income') {
        incomeTransaction += parseInt(transactionAmount)
    }

    if (transactionType === 'expense') {
        expenseTransaction += parseInt(transactionAmount)
    }

    balanceTransaction = incomeTransaction - expenseTransaction

    const transaction = {
        id, type: transactionType, detail: transactionDetail, amount: parseInt(transactionAmount)
    }

    state.transactions.push(transaction)

    render()

    document.getElementById('detailsInput').value = ''
    document.getElementById('amountInput').value = ''
}

function deleteBtn(id) {
    const index = state.transactions.findIndex(transaction => transaction.id === id);

    if (index !== -1) {
        const transaction = state.transactions[index];
        if (transaction.type === 'income') {
            incomeTransaction -= transaction.amount;
        } else if (transaction.type === 'expense') {
            expenseTransaction -= transaction.amount;
        }
        balanceTransaction = incomeTransaction - expenseTransaction;

        state.transactions.splice(index, 1);
        render();
    }
}

const display = () => {
    income.innerHTML = 'R ' + incomeTransaction
    expense.innerHTML = 'R ' + expenseTransaction
    balance.innerHTML = 'R ' + balanceTransaction

    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = ''

    const transactions = state.transactions

    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        let transactionDiv = document.createElement('div');
        transactionDiv.classList.add('transaction');
        if (transaction.type === 'income') {
            transactionDiv.classList.add('income');
            transactionDiv.innerHTML = `
            <div class="border border-l-8 bg-green-50 border-green-400 py-4 px-2 flex items-center justify-between">
                <h2 class="text-xl font-semibold" id="detail">${transaction.detail}</h2>
                <p class="text-lg font-semibold text-green-400" id="amount">R ${transaction.amount}</p>
                <button onclick="deleteBtn('${transaction.id}')" class="py-2 px-4 text-white bg-green-400 hover:bg-green-600">X</button>
            </div>
           
        `
        }
        if (transaction.type === 'expense') {
            transactionDiv.classList.add('expense');
            transactionDiv.innerHTML = `
            <div class="border border-l-8 border-red-400 bg-red-50 py-4 px-2 flex items-center justify-between">
                <h2 class="text-xl font-semibold" id="detail">${transaction.detail}</h2>
                <p class="text-lg font-semibold text-red-400" id="amount">R ${transaction.amount}</p>
                <button onclick="deleteBtn('${transaction.id}')" class="py-2 px-4 text-white bg-red-400 hover:bg-red-600">X</button>
            </div>
           
        `
        }
        transactionsDiv.appendChild(transactionDiv);
    }
}

const render = () => {
    display()
    saveToLocalStorage()
}
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(state))
}

function loadFromLocalStorage() {
    const savedState = localStorage.getItem('transactions')
    if (savedState) {
        state = JSON.parse(savedState)
        incomeTransaction = 0;
        expenseTransaction = 0;

        for (let transaction of state.transactions) {
            if (transaction.type === 'income') {
                incomeTransaction += transaction.amount;
            } else if (transaction.type === 'expense') {
                expenseTransaction += transaction.amount;
            }
        }
        balanceTransaction = incomeTransaction - expenseTransaction;
    }
}

loadFromLocalStorage()
render()
