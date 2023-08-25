import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { Observable } from 'rxjs';
import { SettingsService } from '../services/settings.service';

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
    private _settingsService: SettingsService,
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
      balanceAmount: [null, Validators.required],
    })
  }

  onSubmitBalanceForm() {
    this.isLoading = true;
    this._settingsService._updateSuperAdminBalanceApi(this.balanceForm.value['balanceAmount']).subscribe((res: any) => {
      if (res) {
        // this._sharedService.sharedSubject.next({
        //   'updateAdminDetails': true
        // });
        this._sharedService.callAdminDetails.next(true);
        this._sharedService.getToastPopup(`Balance updated Successfully.`, 'Balance', 'success');
        this.isLoading = false;
        this.balanceForm.patchValue({
          balanceAmount: [null, Validators.required]
        })
      }
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
