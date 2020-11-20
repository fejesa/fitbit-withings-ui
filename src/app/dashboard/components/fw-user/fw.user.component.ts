import {Component, Input} from '@angular/core';
import {FitbitUser} from '../../../model/data/fw.model';

@Component({
  selector: 'app-fw-user',
  templateUrl: './fw.user.component.html',
  styleUrls: ['./fw.user.component.css']
})
export class FWUserComponent {

  @Input()
  user: FitbitUser;

  getUserName(): string {
    if (!this.isEmpty()) {
      return this.user.displayName;
    }
  }

  getAge(): number {
    if (!this.isEmpty()) {
      return this.user.age;
    }
  }

  getWeight(): number {
    if (!this.isEmpty()) {
      return this.user.height;
    }
  }

  isEmpty(): boolean {
    return this.user == null;
  }
}
