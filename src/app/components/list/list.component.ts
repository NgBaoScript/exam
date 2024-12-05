import { Component, inject, Inject, OnInit } from '@angular/core';
import { AtmService } from '../../services/atm.service';
import { Atm } from '../../models/Atm';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormControlOptions, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx'



declare var bootstrap: any;
@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  atmList: Atm[] = [];
  paginatedAtmList: Atm[] = [];
  atm!: Atm;
  atmForm!: FormGroup;
  searchs!: FormGroup;
  atmId: any;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(
    private atmService: AtmService,
    private fb: FormBuilder,
    private toast: ToastrService,
  ) {
    this.searchs = new FormGroup({
      name: new FormControl(''),
    });
    this.atmForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      type: ['', Validators.required],
      serialNumber: ['', Validators.required],
    } as FormControlOptions);
  }

  ngOnInit(): void {
    this.getAllAtm();
    this.setupSearchListener();
  }

  getAllAtm() {
    this.atmService.getAllAtm().subscribe((atm) => {
      this.atmList = atm;
      this.updatePagination();
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.atmList.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAtmList = this.atmList.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openModal(id: any) {
    this.atmId = id;
    this.atmService.getId(id).subscribe((data: any) => {
      this.atm = data;
      this.atmForm.patchValue({
        id: data.id,
        name: data.name,
        manufacturer: data.manufacturer,
        type: data.type,
        serialNumber: data.serialNumber,
      });
    });
  }

  updateAtm() {
    if (this.atmForm.valid) {
      this.atmService.updateAtm(this.atmForm.value.id, this.atmForm.value).subscribe({
        next: () => {
          this.getAllAtm();
          this.toast.success('ATM updated successfully', 'Success')
        },
        error: (err) => {
          console.error('Error updating ATM:', err);
        },
      });
    } else {
      this.toast.error('Invalid Form', 'Error')
    }

  }

  deleteAtm() {
    this.atmService.deleteAtm(this.atmId).subscribe(() => {
      this.getAllAtm();
      this.toast.success('ATM deleted successfully', 'Success')
    });
  }

  getWithName(name: string) {
    this.atmService.searchByName(name).subscribe((dt: Atm[]) => {
      this.atmList = dt;
      this.updatePagination();
    });
  }

  setupSearchListener() {
    this.searchs.get('name')?.valueChanges.subscribe((name: string) => {
      this.getWithName(name);
    });
  }

  fileName = "ExcelSheet.xlsx";
  exportData() {
    console.log(this.atmList)
    let data = document.getElementById("table-data");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    XLSX.writeFile(wb, this.fileName)

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



