import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../canvasjs.min';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { TransactionService } from '../services/transaction.service';
import { CategoryAmount } from '../models/category-amount';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {


  categories: Array<Category> = new Array<Category>();
  amountOfExpenseByCategory: Array<CategoryAmount> = new Array<CategoryAmount>();
  amountOfExpenseByCategoryAm: Array<number> = new Array<number>();
  dp: Array<any> = new Array<any>();
  vs: Array<number> = new Array<number>();
  // var CanvasJS = require('./canvasjs.min');

  constructor(private categoryService: CategoryService, private expenseIncomeService: TransactionService) {}

  getCategoriesData() {
    this.categoryService.getExpenseCategories().subscribe(x => this.categories = x);
  }

  getTransactionsPerMonth() {
    this.expenseIncomeService.getTransactionsPerMonth().subscribe(x => this.vs = x);
  }

  getExpenseData() {
    this.categories.forEach(element => {
      const categoryAmount: CategoryAmount = new CategoryAmount();
      categoryAmount.category = element;
      this.expenseIncomeService.getTransactionsAmountByCategory(element.id).subscribe(x => {
        categoryAmount.amount = x; this.amountOfExpenseByCategory.push(categoryAmount);
      });
    });
  }

  populate() {
    this.amountOfExpenseByCategory.forEach(element => {
      this.dp.push({ y: element.amount, name: element.category.name });
    });
  }

  renderChart() {
    const chart = new CanvasJS.Chart('chartContainer1', {
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Total expense by categories'
      },
      data: [{
        type: 'pie',
        showInLegend: true,
        toolTipContent: '<b>{name}</b>: ${y} (#percent%)',
        indexLabel: '{name} - #percent%',
        dataPoints: this.dp
      }]
    });
    const chart2 = new CanvasJS.Chart('chartContainer2', {
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Expense per month'
      },
      data: [{
        type: 'column',
        dataPoints: [
          { y: this.vs[0], label: 'January' },
          { y: this.vs[1], label: 'February' },
          { y: this.vs[2], label: 'March' },
          { y: this.vs[3], label: 'April' },
          { y: this.vs[4], label: 'May' },
          { y: this.vs[5], label: 'June' },
          { y: this.vs[6], label: 'July' },
          { y: this.vs[7], label: 'August' },
          { y: this.vs[8], label: 'September' },
          { y: this.vs[9], label: 'October' },
          { y: this.vs[10], label: 'November' },
          { y: this.vs[11], label: 'December' }
        ]
      }]
    });
    chart.render();
    chart2.render();
  }

  ngOnInit() {
     this.getCategoriesData();
     setTimeout(() => this.getTransactionsPerMonth(), 500);
     setTimeout(() => this.getExpenseData(), 1000);
     setTimeout(() => this.populate(), 1500);
     setTimeout(() => this.renderChart(), 2500);
  }
}
