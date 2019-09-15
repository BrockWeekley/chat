import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  public ids: string[];
  observe: Observable<any>;
  constructor(public db: AngularFirestore,
              public http: HttpClient) { }

  initDB() {
    let check: Observable<any>;
    check = this.db.collection('messages').valueChanges();
    this.getMessages();
    console.log(this.ids);
    return check;
  }

  date() {
    return this.http.get<any>('http://api.timezonedb.com/v2.1/get-time-zone?key=QSU8HCQU9BBY&format=json&by=zone&zone=CDT');
  }

  createMessage(value) {
    return this.db.collection('messages').add({
      msg: value
    });
  }

  deleteMessages() {
    console.log(this.ids);
    this.ids.forEach (function(e) {
      this.observe = this.db.collection('messages').doc(e).delete();
    }, this);
    return this.observe;
  }

  getMessages() {
    let data: string[];
    data = [];
    this.ids = [];
    let obs: Observable<any>;
    obs = from(this.db.collection('messages').get().toPromise()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        if (doc.data().msg !== null && doc.data().msg !== '') {
          data.push(doc.data().msg);
        }
        try {
          if (doc.id != null) {
            this.ids.push(doc.id);
          }
        } catch (e) {
          console.error(e);
        }
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    }));
    return obs;
  }
}
