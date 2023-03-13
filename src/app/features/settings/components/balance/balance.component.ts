import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  balanceForm: FormGroup;
  isLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  private _preConfig() {
    this._createMemberForm();
  }

  _createMemberForm() {
    this.balanceForm = this._fb.group({
      balanceAmount: ['', Validators.required],
    })
  }

  onSubmitBalanceForm() {
    this.isLoading = true;
    let balanceData = {
      "balanceAmount": this.balanceForm.value['balanceAmount'],
    }
    this._sharedService._addBalance(balanceData).subscribe((res: any) => {
      if (res) {
        this._sharedService.getToastPopup(`Balance added Successfully.`, 'Balance', 'success');
        this.isLoading = false;
      }
    })
  }


}
