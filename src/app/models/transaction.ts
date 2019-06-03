import { Category } from './category';

export enum TransactionEnum {
    Expense,
    Income,
    Transfer
}

export class Transaction {
    id: number;
    expenseOrIncome: TransactionEnum;
    categoryId: number;
    comment: string;
    amount: number;
    dateTime: string;
    accountId: number;
    currency: string;
}
