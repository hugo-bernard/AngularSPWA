import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ConfigService } from './config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';
import { SharedService } from './shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  saved!: boolean;
  excludeRoutes = ['/login', '/signup']; // add routes you want to exclude here
  currentRoute!: string;
  searchValue!: string;

  constructor(
    private router: Router,
    private ConfigService: ConfigService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private route: ActivatedRoute
    ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  refresh() {
    // Reload the current route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/questions']);
    });
  }

  searchQuestion() {
    this.ConfigService.getQuestions().subscribe(data => {
      const qd = Object.values(data)
      this.sharedService.searched = qd.filter(q => q.title.includes(this.searchValue));
      if (this.sharedService.searched) {
        this.refresh()
      }
    });
  }

  openAddQuestionDialog() {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      data: {
        title: "",
        description: ""
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ConfigService.postQuestion({
          "title": result.title,
          "description": result.description
        }).subscribe({
          next: data => {
            this.refresh()
          },
          error: error => {
              console.error('There was an error posting your question!', error);
          }
      });
      }
    });
  }
}
