import { Component, OnInit } from '@angular/core';
import { Question } from '../question/question.component';
import { ConfigService } from '../config/config.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  template: `
    <div *ngIf="data" class="questions">
      <div class="filter-buttons">
        <h3>Filter : </h3>
        <button (click)="sortByAnswered()">Answered</button>
        <button (click)="sortByUnanswered()">Not yet answered</button>
      </div>
      <app-question
        *ngFor="let question of data"
        [question]="question"
      ></app-question>
    </div>
  `,
  styles: [`
    .questions
      justify-content: center
    
    .filter-buttons
      margin-top: 1rem
      margin-left: 1rem
      margin-bottom: 1rem
      display: flex

      button
        padding: 5px
        margin-right: 1rem

      h3
        font-weight: 600
        margin-top: auto
        margin-bottom: auto
        margin-right: 1rem
  `]
})
export class QuestionsComponent implements OnInit {
  answeredQuestions!: Question[];
  unansweredQuestions!: Question[];
  data: any

  // Initiate services use in component
  constructor(
    private ConfigService: ConfigService,
    private sharedService: SharedService,
    private router: Router,
    ) {}

  // Do things on init of component
  ngOnInit() {
    // redirect to login if the user is not login
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login'])
    }
    // get all questions
    this.ConfigService.getQuestions().subscribe(data => {
      const qd = Object.values(data)
      this.answeredQuestions = qd.filter(q => q.answers.length > 0);
      this.unansweredQuestions = qd.filter(q => q.answers.length === 0);
      this.data = this.sharedService.searched ? this.sharedService.searched : [...this.unansweredQuestions, ...this.answeredQuestions];
    });
  }

  refresh() {
    // Reload the current route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/questions']);
    });
  }

  // return list of answered questions
  sortByAnswered() {
    this.data = [...this.answeredQuestions, ...this.unansweredQuestions]
  }

  // return list of unanswered questions
  sortByUnanswered() {
    this.data = [...this.unansweredQuestions, ...this.answeredQuestions]
  }
}
