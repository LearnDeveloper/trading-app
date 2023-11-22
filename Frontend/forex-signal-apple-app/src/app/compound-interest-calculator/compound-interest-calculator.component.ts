import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-compound-interest-calculator',
  templateUrl: './compound-interest-calculator.component.html',
  styleUrls: ['./compound-interest-calculator.component.scss'],
  animations: [
    trigger('cardAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', animate('300ms ease-in')),
    ]),
  ],
})
export class CompoundInterestCalculatorComponent {
  principal: number = 1000; // Initial principal
  rate: number = 5; // Annual interest rate
  time: number = 1; // Time period (default: 1 year)
  showChart: boolean = false;
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  animationState: string = 'void';

  chart: any;

  // calculateCompoundInterest() {
  //   const numberOfPeriods = this.timePeriod;
  //   const monthlyInterestRate = this.interestRate / 100 / 12;
  //   let principal = this.principal;
  //   const labels = [];
  //   const data = [];

  //   for (let i = 0; i <= numberOfPeriods; i++) {
  //     labels.push(i);
  //     data.push(principal);
  //     principal = principal * (1 + monthlyInterestRate);
  //   }

  //   this.createChart(labels, data);
  //   this.showChart = true;
  // }

  // ngOnInit()
  // {
  //   this.calculateCompoundInterest();
  // }

  compoundFrequency: number = 12;
  result: any;
  calculateCompoundInterest() {
    const principal = this.principal;
    const annualRate = this.rate / 100; // Annual interest rate as a decimal
    const compoundingFrequency = this.compoundFrequency;
    const totalMonths = this.time * 12 * 12; // Convert years to months
  
    const monthlyRate = annualRate / compoundingFrequency; // Monthly interest rate
  
    const labels: string[] = [];
    const balanceData: number[] = [];
  
    let currentBalance = principal;
  
    for (let month = 1; month <= totalMonths; month++) {
      labels.push(`Month ${month}`);
  
      const interestForMonth = currentBalance * monthlyRate;
      currentBalance += interestForMonth;
      balanceData.push(currentBalance);
    }
  
    // Calculate the future value
    const futureValue = currentBalance;
  
    // Calculate the total interest earned
    const totalInterestEarned = futureValue - principal;
  
    // Calculate the all-time rate of return
    const allTimeRateOfReturn = ((futureValue / principal) - 1) * 100;
  
    // Set the results
    this.futureValue = futureValue;
    this.totalInterestEarned = totalInterestEarned;
    this.allTimeRateOfReturn = allTimeRateOfReturn;
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Amount',
            data: balanceData,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            yAxisID: 'y-axis-1',
            pointRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount'
            },
            beginAtZero: true,
          }
        }
      }
    });
  }
  
  ngOnChanges() {
    this.animationState = this.principal ? '*' : 'void';
  }
  

  createChart(labels: number[], data: number[]) {
    if (this.chartCanvas) {
      // this.chart = new Chart(this.chartCanvas.nativeElement, {
      //   type: 'bar',
      //   data: {
      //     labels: labels,
      //     datasets: [
      //       {
      //         label: 'investments',
      //         data: data,
      //         borderColor: 'rgba(75, 192, 192, 1)',
      //         borderWidth: 2
      //       }
      //     ]
      //   },
      //   options: {
      //     scales: {
      //       x: {
      //         type: 'linear',
      //         position: 'bottom'
      //       },
      //       y: {
      //         beginAtZero: true
      //       }
      //     }
      //   }
      // });
     
    }
  }

  futureInvestmentValue: number = 0;
  totalInterestEarned: number = 0;
    // Add properties for the provided data
    futureValue: number;
    allTimeRateOfReturn: number;


}
