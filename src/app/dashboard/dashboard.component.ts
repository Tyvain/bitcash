import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FEED_ADD, FEED_REMOVE, FEED_ADD_COMMENT } from '../store/feed/feed.actions';
import { IAppState } from '../store';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {
  form: FormGroup;

  feeds$: Observable<{}>;

  constructor(public fb: FormBuilder, public store: Store<IAppState>) {

    this.feeds$ = store.select('feed');

    this.form = fb.group({
      text: ['Congratulations ALS, you just sent an email with Mailgun!', Validators.required],
      name: ['nameMachinTruc', Validators.required],
      from: ['Mailgun Sandbox <postmaster@sandbox41db17f981b345018e03f5b1dbc281fa.mailgun.org>', Validators.required],
      to: ['ALS <tyvain@gmail.com>', Validators.required],
      subject: ['Hello!', Validators.required]
    });

  }

  submitFeed(): void {

    if (this.form.valid) {

      this.store.dispatch({
        type: FEED_ADD,
        payload: this.form.value
      });

      this.form.reset();
    }
  }

  submitCommentOnFeed(id: string, commentForm: FormGroup): void {

    if (commentForm.valid) {

      this.store.dispatch({
        type: FEED_ADD_COMMENT,
        payload: {
          id,
          comment: commentForm.value
        }
      });

      commentForm.reset();
    }

  }

  removeFeed(feed: {}): void {

    this.store.dispatch({
      type: FEED_REMOVE,
      payload: feed
    });

  }
}
