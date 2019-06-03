import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { Account } from '../models/account';
import { Transaction, TransactionEnum } from '../models/transaction';
import { Category } from '../models/category';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { SettingsComponent } from '../settings/settings.component';
import { ItemCart } from '../models/item-cart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  transactionForm: FormGroup;

  constructor(private accountService: AccountService, private fb: FormBuilder, private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService) { }


  accounts: Account[];
  transactions: Transaction[] = [];
  shoppingCarts: ShoppingCart[] = [];

  cashAccounts: Account[] = [];
  creditAccounts: Account[] = [];
  bankAccounts: Account[] = [];
  assetAccounts: Account[] = [];
  cashAccountsTotal = 0;
  creditAccountsTotal = 0;
  bankAccountsTotal = 0;
  assetAccountsTotal = 0;
  networth = true;
  nTransaction = true;
  rTransaction = true;
  expenseActive = true;
  incomeActive = false;
  transferActive = false;
  categories: Category[] = [];
  tlt = 'Add Expense';
  activeTab = 0;
  priceChange = false;
  itemCartSelected: ItemCart = new ItemCart();
  inputText: string;

  getShoppingCarts() {
    this.shoppingCartService.getShoppingCarts().subscribe(x => { this.shoppingCarts = x; console.log(x); });
  }

  saveNewPrice(itemCart: ItemCart) {
    let shoppingCart: ShoppingCart = new ShoppingCart();
    this.shoppingCarts.forEach(element => {
      element.items.forEach(el => {
        if (el === itemCart) {
          shoppingCart = element;
        }
      });
    });

    shoppingCart.items.forEach(element => {
      if (element === itemCart) {
        element.item.price = parseFloat(this.inputText);
      }
    });

    this.shoppingCartService.updateShoppingCart(shoppingCart).subscribe(x => x);

    this.priceChange = false;
    this.itemCartSelected = new ItemCart();
  }

  ngOnInit() {
    this.transactionForm = this.fb.group({
      id: [undefined],
      accountId: [undefined],
      amount: [undefined],
      currency: [undefined],
      categoryId: [undefined],
      toAccName: [''],
      toAmount: [undefined],
      toCurrency: [undefined],
      dateTime: [undefined],
      comment: [undefined],
      toDate: ['']
    });
    this.getShoppingCarts();
    this.showAccounts();
    this.showTransactions();
    this.getCategories();
  }

  doubleClick(itemCart: ItemCart) {
    this.itemCartSelected = itemCart;
    this.priceChange = !this.priceChange;
  }

  removeShoppingCart(shoppingCart: ShoppingCart) {
    const transaction: Transaction = new Transaction();
    transaction.amount = 0;
    shoppingCart.items.forEach(element => {
      transaction.amount += element.item.price * element.counter;
    });
    transaction.id = 0;
    // should ask user for account
    transaction.accountId = 7;
    // should ask for currency
    transaction.currency = 'USD';
    transaction.dateTime = new Date().toISOString().substring(0, 10);
    transaction.expenseOrIncome = TransactionEnum.Expense;
    transaction.comment = `Shopping cart - ${shoppingCart.id}`;
    transaction.categoryId = 60;

    this.transactionService.postTransactions(transaction).subscribe(x => x);

    this.shoppingCarts.splice(this.shoppingCarts.indexOf(shoppingCart), 1);
    this.shoppingCartService.removeShoppingCart(shoppingCart.id).subscribe(x => x);
  }

  postTransaction(transaction: Transaction) {
    transaction.expenseOrIncome = this.activeTab;
    this.transactionService.postTransactions(transaction).subscribe(x => x);
  }

  getCategories() {
    this.transactionService.getCategories()
      // clone the data object, using its known Config shape
      .subscribe(x => this.categories = x);
  }

  changeActiveTab(dejo) {
    if (dejo === 0) {
      this.expenseActive = true;
      this.incomeActive = false;
      this.transferActive = false;
      this.tlt = 'Add Expense';
      this.activeTab = 0;
    } else if (dejo === 1) {
      this.expenseActive = false;
      this.incomeActive = true;
      this.transferActive = false;
      this.tlt = 'Add Income';
      this.activeTab = 1;
    } else {
      this.expenseActive = false;
      this.incomeActive = false;
      this.transferActive = true;
      this.tlt = 'Add Transfer';
      this.activeTab = 2;
    }

  }

  toggleDiv() {
    this.networth = !this.networth;
  }
  toggleDiv2() {
    this.nTransaction = !this.nTransaction;
  }
  toggleDiv3() {
    this.rTransaction = !this.rTransaction;
  }

  showAccounts() {
    this.accountService.getAccounts()
      // clone the data object, using its known Config shape
      .subscribe(x => { this.accounts = x; this.populateAll(); });
  }

  showTransactions() {
    this.transactionService.getTransactions().subscribe(x => this.transactions = x.length > 5 ? x.slice(x.length - 5, x.length) : x);
  }

  populateAll() {
    for (let i = 0; i < this.accounts.length; i++) {
      const cValue = this.accounts[i].currencyValue;
      const amount = this.accounts[i].amount;
      if (this.accounts[i].accountGroupValue === 'BankAccount') {
        this.bankAccounts.push(this.accounts[i]);
        this.bankAccountsTotal = this.sumTotal(cValue, amount, this.bankAccountsTotal);
      } else if (this.accounts[i].accountGroupValue === 'Credit') {
        this.creditAccounts.push(this.accounts[i]);
        this.creditAccountsTotal = this.sumTotal(cValue, amount, this.creditAccountsTotal);
      } else if (this.accounts[i].accountGroupValue === 'Asset') {
        this.assetAccounts.push(this.accounts[i]);
        this.assetAccountsTotal = this.sumTotal(cValue, amount, this.assetAccountsTotal);
      } else {
        this.cashAccounts.push(this.accounts[i]);
        this.cashAccountsTotal = this.sumTotal(cValue, amount, this.cashAccountsTotal);
      }
    }
  }

  sumTotal(currency, amount, total) {
    if (currency === 'EUR') {
      total +=
        amount * 1.95;
    } else if (currency === 'USD') {
      total +=
        amount * 1.72;
    } else {
      total +=
        amount;
    }
    return total;
  }



}
