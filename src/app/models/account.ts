import { Transaction } from './transaction';

export class Account {
    id: number;
    name: string;
    accountGroupValue: string;
    currencyValue: string;
    amount: number;
    showOnDashboard: boolean;
    expenseIncomes: number;
}
