import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import {
  FEED_ADD, FEED_ADD_FAIL, FEED_ADD_SUCCESS, FEED_REMOVE, FEED_REMOVE_FAIL,
  FEED_REMOVE_SUCCESS, FEED_ADD_COMMENT, FEED_ADD_COMMENT_FAIL, FEED_ADD_COMMENT_SUCCESS
} from './feed.actions';
import { Http, Response, Request, RequestMethod, Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class FeedEffects {
  mailgunApiKey: string;

  @Effect()
  addFeed$ = this.actions$
    .ofType(FEED_ADD)
    .switchMap((action: Action) => {

      this.mailgunApiKey = window.btoa("api:key-1bc8e06e56d6badefb12b3df86832abb");

      console.log('From : ' + action.payload.from);

      var requestHeaders = new Headers();
              requestHeaders.append("Authorization", "Basic " + this.mailgunApiKey);
              requestHeaders.append("Content-Type", "application/x-www-form-urlencoded");

              this.http.request(new Request({
                  method: RequestMethod.Post,
                  url: "https://api.mailgun.net/v3/sandbox41db17f981b345018e03f5b1dbc281fa.mailgun.org/messages",
                  body: "from=" + action.payload.from
                        + "&to=" + action.payload.to
                        + "&subject=" + action.payload.subject
                        + "&text=" + action.payload.text,
                  headers: requestHeaders
              }))
              .subscribe(success => {
                  console.log("SUCCESS -> " + JSON.stringify(success));
              }, error => {
                  console.log("ERROR -> " + JSON.stringify(error));
              });
              
      return this.http.post('/api/feed', action.payload)
        .catch(() => Observable.of(({ type: FEED_ADD_FAIL })))
        .map((response: Response) => response.json())
        .map((response) => ({type: FEED_ADD_SUCCESS, payload: response}));

    });

  @Effect()
  addFeedComment$ = this.actions$
    .ofType(FEED_ADD_COMMENT)
    .switchMap((action: Action) => {

      return this.http.post('/api/feed/' + action.payload.id + '/comment', action.payload.comment)
        .catch(() => Observable.of(({ type: FEED_ADD_COMMENT_FAIL })))
        .map((response: Response) => response.json())
        .map((response) => ({type: FEED_ADD_COMMENT_SUCCESS, payload: response}));

    });

  @Effect()
  removeFeed$ = this.actions$
    .ofType(FEED_REMOVE)
    .switchMap((action: Action) => {

      return this.http.delete('/api/feed/' + action.payload)
        .catch(() => Observable.of(({ type: FEED_REMOVE_FAIL })))
        .map((response: Response) => response.json())
        .map((response) => ({type: FEED_REMOVE_SUCCESS, payload: response}));

    });

  constructor(private actions$: Actions, private http: Http) {}
}
