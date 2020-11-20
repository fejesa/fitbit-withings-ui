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

  public getUserName(): string {
    if (!this.isEmpty()) {
      return this.user.displayName;
    }
  }

  public getAge(): number {
    if (!this.isEmpty()) {
      return this.user.age;
    }
  }

  public getWeight(): number {
    if (!this.isEmpty()) {
      return this.user.height;
    }
  }

  public isEmpty(): boolean {
    return this.user == null;
  }
}
