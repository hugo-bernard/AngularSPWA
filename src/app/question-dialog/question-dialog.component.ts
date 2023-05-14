import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface AddQuestionData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.sass']
})
export class QuestionDialogComponent {
  addQuestionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddQuestionData,
    private formBuilder: FormBuilder
  ) {
    this.addQuestionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.addQuestionForm.valid) {
      const { title, description } = this.addQuestionForm.value;
      this.dialogRef.close({ title, description });
    }
  }
}
