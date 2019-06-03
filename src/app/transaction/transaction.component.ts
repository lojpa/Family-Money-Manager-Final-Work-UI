import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionEnum } from '../models/transaction';
import { Account } from '../models/account';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transactionForm: FormGroup;
  categoryForm: FormGroup;


  accounts: Account[] = [];
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('closePatchExpenseModal') closePatchExpenseModal: ElementRef;
  expenseActive = true;
  incomeActive = false;
  tlt = 'Add Expense';
  categoryButton = 'New category';
  transactions: Transaction[] = [];
  categories: Category[] = [];
  activeTab = 0;
  account: Account = {
    id: 0, name: 'test', accountGroupValue: 'Cash', amount: 0, expenseIncomes: 0,
    currencyValue: 'BAM', showOnDashboard: false
  };
  editTransaction: Transaction = {
    id: 1, amount: 0, accountId: 1, expenseOrIncome: TransactionEnum.Expense,
    comment: 'Comment', categoryId: 1, currency: 'USD', dateTime: '5/5/2015'
  };
  clicked = false;
  category: Category = { id: 0, name: 'test', expenseIncome: new Transaction() };
  createdCategory: Category = new Category();
  fromOrTo = 'From';
  createTransactionError = false;
  postClicked = false;


  constructor(private accountService: AccountService, private transactionService: TransactionService,
    private categoryService: CategoryService, private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.transactionForm = this.fb.group({
      id: [undefined],
      accountId: [undefined],
      amount: [undefined],
      currency: [undefined],
      categoryId: [undefined],
      dateTime: [undefined],
      comment: [undefined],
      name: [undefined]
    });

    this.getAccounts();
    this.getTransactions();
    this.getCategories();
  }

  fillDate() {
    const currentDate = new Date();
    this.transactionForm.get('dateTime').setValue(currentDate.toISOString().substring(0, 10));
  }

  fillModal(transaction: Transaction) {
    const currentDate = new Date(transaction.dateTime);
    currentDate.setDate(currentDate.getDate() + 1);
    transaction.dateTime = currentDate.toISOString().substring(0, 10);
    this.editTransaction = transaction;
    this.changeActiveTab(transaction.expenseOrIncome);
    this.tlt = 'Save';
    this.getAccountById(transaction.accountId);
    this.getCategoryById(transaction.categoryId);

    this.transactionForm.get('id').setValue(transaction.id);
    this.transactionForm.get('accountId').setValue(transaction.accountId);
    this.transactionForm.get('currency').setValue(transaction.currency);
    this.transactionForm.get('dateTime').setValue(transaction.dateTime);
    this.transactionForm.get('categoryId').setValue(transaction.categoryId);
    this.transactionForm.get('amount').setValue(transaction.amount);
    this.transactionForm.get('comment').setValue(transaction.comment);
  }

  getAccounts() {
    this.accountService.getAccounts()
      // clone the data object, using its known Config shape
      .subscribe(x => { this.accounts = x; });
  }

  getAccountById(id: number) {
    this.accountService.getAccountById(id)
      // clone the data object, using its known Config shape
      .subscribe(x => this.account = x);
  }

  getCategoryById(id: number) {
    this.categoryService.getCategoryById(id)
      // clone the data object, using its known Config shape
      .subscribe(x => this.category = x);
  }

  getTransactions() {
    this.transactionService.getTransactions()
      // clone the data object, using its known Config shape
      .subscribe(x => this.transactions = x);
  }


  getCategories() {
    this.transactionService.getCategories()
      // clone the data object, using its known Config shape
      .subscribe(x => this.categories = x);
  }

  categoryClick() {
    if (this.categoryButton === 'New category') {
      this.categoryButton = 'Select category';
    } else {
      this.categoryButton = 'New category';
    }

    this.clicked = !this.clicked;
  }

  clear() {
    this.accounts = [];
    this.transactions = [];
    this.categories = [];
    this.transactionForm.reset();
  }

  postTransaction(transaction: Transaction) {
    this.createTransactionError = false;
    const newTransaction: Transaction = new Transaction();
    if (this.clicked) {
      const category = new Category();
      category.id = 0;
      category.name = transaction.categoryId.toString();
      this.categoryService.postCategory(category).subscribe((cat) => {
        newTransaction.categoryId = cat.id;
        console.log(newTransaction.categoryId);
      });
    } else {
      newTransaction.categoryId = transaction.categoryId;
    }
    newTransaction.amount = transaction.amount;
    newTransaction.accountId = transaction.accountId;
    newTransaction.comment = transaction.comment;
    newTransaction.currency = transaction.currency;
    newTransaction.dateTime = transaction.dateTime ? transaction.dateTime : new Date().toISOString().substring(0, 10);
    newTransaction.expenseOrIncome = transaction.expenseOrIncome;
    newTransaction.expenseOrIncome = this.activeTab;
    newTransaction.id = 0;
    setTimeout(() => this.transactionService.postTransactions(newTransaction).subscribe(x => x, error => {
      if (error) {
        this.createTransactionError = true;
      }
    }), 1000);
    setTimeout(() => this.postClicked = true, 2000);
    this.clear();
    setTimeout(() => this.getAccounts(), 3000);
    setTimeout(() => this.getTransactions(), 3000);
    setTimeout(() => this.getCategories(), 3000);
    setTimeout(() => this.postClicked = false, 4000);
    this.closeAddExpenseModal.nativeElement.click();
  }

  patchTransaction(transaction: Transaction) {
    this.createTransactionError = false;
    transaction.expenseOrIncome = this.activeTab;
    setTimeout(() => this.transactionService.patchTransactions(transaction).subscribe(x => x, error => {
      if (error) {
        this.createTransactionError = true;
      }
    }), 1000);
    this.clear();
    setTimeout(() => this.postClicked = true, 2000);
    setTimeout(() => this.getAccounts(), 2000);
    setTimeout(() => this.getTransactions(), 2000);
    setTimeout(() => this.getCategories(), 2000);
    setTimeout(() => this.postClicked = false, 4000);
    this.closePatchExpenseModal.nativeElement.click();
  }

  openModal(id: string) {
  }

  changeActiveTab(dejo: number) {
    if (dejo === 0) {
      this.expenseActive = true;
      this.incomeActive = false;
      this.tlt = 'Add Expense';
      this.fromOrTo = 'From';
      this.activeTab = 0;
    } else {
      this.expenseActive = false;
      this.incomeActive = true;
      this.tlt = 'Add Income';
      this.fromOrTo = 'To';
      this.activeTab = 1;
    }
  }



}
