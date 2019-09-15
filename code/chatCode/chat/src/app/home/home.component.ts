import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    messages: string[];
    toSend = '';
    dates: string[];
    hold: string[];

  constructor(private db: AngularFirestore,
              private firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    this.messages = [];
    this.dates = [];
    this.hold = [];
    this.init();
  }
    refresh() {
      this.firebaseService.getMessages();
      console.log(this.messages);
    }

    init() {
      const obs = this.firebaseService.initDB();
      obs.subscribe(res => {
        this.messages = res;
        this.dates = [];
        this.hold = [];
        this.messages.forEach (function(e) {
          // @ts-ignore
          let incstring = e.msg;
          incstring = incstring.substr (incstring.indexOf (':') - 2);
          this.dates.push(incstring);
        }, this);

        this.dates.sort ((val1, val2) => {
          return val1 > val2 ? 1 : -1;
        });

        this.messages.forEach (function(e) {
          // @ts-ignore
          let incstring = e.msg;
          incstring = incstring.substr (incstring.indexOf (':') - 2);
          let i;
          for (i = 0; this.dates.length > i; i++) {
            if (incstring === this.dates[i]) {
              this.hold[i] = e;
            }            }
        }, this);

        console.log (this.hold);
        this.messages = this.hold;
        console.log (this.dates);
        console.log (this.messages);
      });
    }

    delete() {
      let obs1: Observable<any>;
      let obs: Observable<any>;
      obs1 = this.firebaseService.getMessages();
      obs1.subscribe(resi => {
        obs = this.firebaseService.deleteMessages();
        obs.subscribe(res => {
          this.messages = [];
          this.dates = [];
          this.hold = [];
          this.init();
          this.refresh();
        });
      });
    }

    send() {
      let obs: Observable<any>;

      obs = this.firebaseService.date();
      obs.subscribe(res => {
        this.toSend = this.toSend + ' ' + res.formatted;
        this.firebaseService.createMessage(this.toSend)
        .then(
          resi => {
            this.toSend = '';
          }
        );
      });
        // this.date = null;
        // let hour = null;
        // let minute = null;
        // let second = null;
        // let fullSecond = null;
        // let meridies = null;

        // this.date = new Date();
        // hour = this.date.getHours();
        // minute = this.date.getMinutes();
        // second = this.date.getSeconds();
        // fullSecond = '';
        // meridies = 'am';
        // if (hour > 12) {
        //     hour = hour - 12;
        //     meridies = 'pm';
        // }
        // fullSecond = second.toString();
        // if (parseInt (fullSecond, 10) < 10) {
        //     fullSecond = '0' + second.toString();
        // }

    }
}
