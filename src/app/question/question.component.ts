import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

export interface Question {
  user: string;
  title: string;
  body: string;
  answers: Array<{
    body: string;
    comments: Array<any>;
    rating: number;
    user: string;
    _id: string;
    upvotes: string[];
    approved: boolean;
  }>;
  _id: string;
}

@Component({
  selector: 'app-question',
  template: `
    <div class="question">
      <h2>{{ question.title }}</h2>
      <p>{{ question.body }}</p>
      <div class="answers">
        <div *ngFor="let ans of question.answers" class="answer">
          <h4>{{ getUserById(ans.user)?.name || "Anonyme" }}</h4>
          <span>{{ ans.body }}</span>
          <div class="upproved">
            <div>
              <button *ngIf="ans.upvotes ? !ans.upvotes.includes(user_id) : null" (click)="upvoteAnswer(ans._id)">Upvote - {{ans.upvotes ? ans.upvotes.length : 0}}</button>
              <button *ngIf="ans.upvotes ? ans.upvotes.includes(user_id) : null" (click)="upvoteAnswer(ans._id)">Downvote - {{ans.upvotes ? ans.upvotes.length : 0}}</button>
              <button *ngIf="!ans.approved" (click)="approveAnswer(ans._id)" class="approve">Approve answer</button>
            </div>
            <div>
              <span class="not-approved" *ngIf="!ans.approved">Answer not approved</span>
              <span class="approved" *ngIf="ans.approved">Answer approved</span>
            </div>
          </div>
          <button (click)="getCommentsById(ans._id)" *ngIf="!showComs">Display comments</button>
          <button (click)="showComs = false" *ngIf="showComs">Hide comments</button>
          <div class="comments" *ngIf="showComs">
            <div *ngIf="ans.comments">
              <div *ngFor="let com of comments" class="comment">
                <h4>{{ getUserById(com.user)?.name || "Anonyme" }}</h4>
                <span>{{ com.body }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button *ngIf="!showAnswer" (click)="toggleAnswer()">Answer</button>
      <div *ngIf="showAnswer">
        <button (click)="submitAnswer()">Submit</button>
        <button (click)="cancelAnswer()">Cancel</button>
        <textarea [(ngModel)]="answer"></textarea>
      </div>
    </div>
  `,
  styleUrls: ['./question.component.sass']
})
export class QuestionComponent {
  @Input() question!: Question;
  @Output() answered = new EventEmitter<string>();
  showAnswer = false;
  answer = '';
  user_id!: string;
  users!: any;
  showComs = false;
  comments!: any;
  
  constructor(
    private ConfigService: ConfigService,
    private sharedService: SharedService,
    private router: Router,
    ) {}

  ngOnInit() {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login'])
    }
    if (!this.sharedService.myUser) {
      const token = localStorage.getItem('authToken')
      if (token) {
        this.ConfigService.getUserFromToken(JSON.parse(token).token).subscribe({
          next: data => {
            this.sharedService.myUser = data
          },
          error: error => {
            console.error('There was an error login in!', error);
          }
        });
      }
    }
    if (!this.sharedService.allUser) {
      this.ConfigService.getUsers().subscribe({
        next: data => {
          this.sharedService.allUser = data
        },
        error: error => {
          console.error('There was an error login in!', error);
        }
      });
    }
    this.user_id = this.sharedService.myUser?._id;
    this.users = this.sharedService.allUser;
    this.sortByUpvotes()
  }

  getCommentsById(ans_id: string): any {
    const token = localStorage.getItem('authToken')
      if (token) {
        this.ConfigService.getComments(JSON.parse(token).token, this.question._id, ans_id).subscribe({
          next: data => {
            this.comments = data
            this.showComs = true
          },
          error: error => {
            console.error('There was an error login in!', error);
          }
        });
    }
  }

  getUserById(id: string) {
    return this.users?.find((u: any) => u._id === id);
  }

  sortByUpvotes() {
    this.question.answers.sort((a, b) => b.upvotes.length - a.upvotes.length);
  }

  toggleAnswer() {
    this.showAnswer = !this.showAnswer;
    if (!this.showAnswer) {
      this.answered.emit(this.answer);
      this.answer = '';
    }
  }

  approveAnswer(ans_id: string) {
    const token = localStorage.getItem('authToken');
    this.ConfigService.approve(JSON.parse(token ? token : "").token, this.question._id, ans_id).subscribe({
      next: data => {
            this.refresh()
      },
      error: error => {
          console.error('There was an error!', error);
      }
    });
  }

  refresh() {
    // Reload the current route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/questions']);
    });
  }

  upvoteAnswer(ans_id: string) {
    const token = localStorage.getItem('authToken');
    this.ConfigService.upvote(JSON.parse(token ? token : "").token, this.question._id, ans_id).subscribe({
      next: data => {
        this.refresh()
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

  submitAnswer() {
    const token = localStorage.getItem('authToken');
    this.ConfigService.postAnswer(JSON.parse(token ? token : "").token, this.question._id, {
      "answer": this.answer
    }).subscribe({
      next: data => {
        this.showAnswer = !this.showAnswer;
        this.refresh()
      },
      error: error => {
          console.error('There was an error!', error);
      }
    });
  }

  cancelAnswer() {
    this.showAnswer = !this.showAnswer;
  }
}
