import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AtmService } from '../../services/atm.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-add-new',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './add-new.component.html',
  styleUrl: './add-new.component.css'
})
export class AddNewComponent implements OnInit {
  atmForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private atmService: AtmService,
    private routes: Router,
    private toast: ToastrService
  ) { }
  ngOnInit(): void {
    this.atmForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      type: ['', Validators.required],
      serialNumber: ['', Validators.required],
      image: ['']
    });
  }

  onsubmit() {
    if (this.atmForm.valid) {
      this.atmService.postAtm(this.atmForm.value).subscribe(
        (res) => {
          this.routes.navigateByUrl('/')
          this.toast.success('Created Success', 'Success')
        },
        (err) => { }
      )
    }else{
      this.toast.error('Invalid Form', 'Error')
    }
  }

  validation_messages = {
    name: [
      { type: 'required', message: 'Please enter value here.' },
    ],
    manufacturer: [
      { type: 'required', message: 'Please enter value here.' },
    ],
    type: [
      { type: 'required', message: 'Please enter value here.' },
    ],
    serialNumber: [
      { type: 'required', message: 'Please enter value here.' },
    ]
  }
}
