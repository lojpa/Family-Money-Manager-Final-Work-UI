import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;

  accounts: Account[] = [];
  @ViewChild('closeAccountModal') closeAccountModal: ElementRef;
  @ViewChild('closeEditAccountModal') closeEditAccountModal: ElementRef;

  cashAccounts: Account[] = [];
  creditAccounts: Account[] = [];
  bankAccounts: Account[] = [];
  assetAccounts: Account[] = [];
  cashAccountsTotal = 0;
  creditAccountsTotal = 0;
  bankAccountsTotal = 0;
  assetAccountsTotal = 0;
  currValue = 'BAM';
  currV = 'BAM';
  editAccount: Account = new Account();
  clicked = false;
  createAccountError = false;

  constructor(private accountService: AccountService, private fb: FormBuilder) {
  }
  showAccounts() {
    this.accountService.getAccounts()
      // clone the data object, using its known Config shape
      .subscribe(x => { this.accounts = x; this.populateAll(); });
  }

  fillModal(account: Account) {
    this.editAccount = account;
    this.currV = account.currencyValue;
    this.accountForm.get('amount').setValue(account.amount);
    this.accountForm.get('id').setValue(account.id);
    this.accountForm.get('accountGroupValue').setValue(account.accountGroupValue);
    this.accountForm.get('name').setValue(account.name);
    this.accountForm.get('currencyValue').setValue(this.currV);
  }

  clear() {
    this.accounts = [];
    this.cashAccounts = [];
    this.creditAccounts = [];
    this.assetAccounts = [];
    this.bankAccounts = [];
    this.accountForm.reset();
  }

  post(account: Account) {
    this.createAccountError = false;
    account.id = 0;
    account.currencyValue = this.currV;
    setTimeout(() => this.accountService.postAccount(account).subscribe(x => x, error => {
      if (error) {
        this.createAccountError = true;
      }
    }), 1000);
    setTimeout(() => this.clicked = true, 2000);
    this.clear();
    setTimeout(() => this.showAccounts(), 3000);
    setTimeout(() => this.clicked = false, 4000);
    this.closeAccountModal.nativeElement.click();
  }

  changeCur(value: string) {
    this.currV = value;
  }

  patchAccount(account: Account) {
    this.createAccountError = false;
    account.currencyValue = this.currV;
    setTimeout(() => this.accountService.patchAccount(account).subscribe(x => x, error => {
      if (error) {
        this.createAccountError = true;
      }
    }), 1000);
    setTimeout(() => this.clicked = true, 2000);
    this.clear();
    setTimeout(() => this.showAccounts(), 3000);
    setTimeout(() => this.clicked = false, 4000);
    this.closeEditAccountModal.nativeElement.click();
  }

  populateAll() {
    this.bankAccountsTotal = 0;
    this.cashAccountsTotal = 0;
    this.assetAccountsTotal = 0;
    this.creditAccountsTotal = 0;
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

  sumTotal(currencyValue, amount, total) {
    if (currencyValue === 'EUR') {
      total +=
        amount * 1.95;
    } else if (currencyValue === 'USD') {
      total +=
        amount * 1.72;
    } else {
      total +=
        amount;
    }
    return total;
  }

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      id: [undefined],
      name: [undefined],
      amount: [undefined],
      accountGroupValue: [undefined],
      expenseIncomes: [undefined],
      currencyValue: [undefined]
    });

    this.showAccounts();
  }
}
