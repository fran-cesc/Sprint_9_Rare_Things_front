import { Component, inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';
import { UsersService } from '../../services/users.service';
import { ValidatorsService } from '../../services/validators.service';
import { CommentService } from '../../services/comment.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ ReactiveFormsModule, NgClass],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  @Input() thing_id!: number;
  @Input() user_id!: number;

  activeModal = inject(NgbActiveModal);
  usersService = inject(UsersService);
  customValidators = inject(ValidatorsService);
  router = inject(Router);
  modalService = inject(NgbModal);
  alertService = inject(AlertService);
  commentService = inject(CommentService);

  public userCommentForm: FormGroup;

  constructor() {
    this.userCommentForm = new FormGroup({
      comment: new FormControl('', [
        Validators.required
      ]),
    });
  }

  public onSubmit() {
    if (this.userCommentForm.invalid) {
      return;
    }

    const { comment } = this.userCommentForm.value;

    console.log(comment);

    this.commentService.addComment(this.thing_id, this.user_id, comment).subscribe({
      next: () => {
            this.userCommentForm.reset();
            setTimeout(() => {
              this.alertService.showAlert({
                text: `Comment posted successfuly`,
                icon: 'success',
              });
            }, 100);
            this.router.navigate([`/pages/thing-page/${this.thing_id}`]);
            this.activeModal.close();
      },
      error: (error: Error) => {
            console.log(error);
            setTimeout(() => {
              this.alertService.showAlert({
                text: 'Could not write comment',
                icon: 'error',
              });
            }, 100);
            this.userCommentForm.reset();
            this.activeModal.close();
      },
    });
  }

  public cancel() {
    this.activeModal.close();
  }

}
