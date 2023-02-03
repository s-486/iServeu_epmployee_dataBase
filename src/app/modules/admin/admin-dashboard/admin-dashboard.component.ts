import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EmployeeModel } from './admin-dash board.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableDataSourcePaginator} from '@angular/material/table';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  data = this.api.getData();

  
  

  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  displayedColumns: string[] = ['Employee Id', 'First Name', 'Last Name', 'Email Id', 'Mob No.', 'Salary', ' '];


  formValue !: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd!: boolean;
  showUpdate !: boolean;
  // api: any;
  err: any;
  res: any;
  term ! : any;
  searchText:any
  _value = "nothing";

  dataSource = new MatTableDataSource(this.employeeData);
  emptyData = new MatTableDataSource([{ empty: "row" }]);
  

  toggleData() {
    this.dataSource = new MatTableDataSource(
      this.dataSource.data.length > 0 ? [] : this.employeeData
    );
  }

  onKey(event: any) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    
  }

  constructor(private formbuilber: FormBuilder, private router: Router, private http: HttpClient,
    public api: ApiService) { 
    }
  logout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('admin')
    this.router.navigate(['login'])
  }
  ngOnInit(): void {
    this.formValue = this.formbuilber.group({
      firstName: ['', [Validators.required, Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      salary: ['', [Validators.required]]
    })
    this.getAllEmployee();
  }
  
  clickAddEmploye() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  postEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    this.api.postEmploye(this.employeeModelObj)
      .subscribe(res => {
        console.log(res);
        alert("Employee added succesfully")
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
      },
        (_err: any) => {
          alert("Something Went Wrong")
        })

  }
  getAllEmployee() {
    this.api.getEmploye("http://localhost:3000/posts")
      .subscribe(res => {
        this.employeeData = res;
        console.log(this.employeeData);
        this.dataSource = this.employeeData;
        console.log(this.dataSource);
        
      })
  }


  deleteEmployee(row: any) {
    this.api.deleteEmploye(row.id)
      .subscribe(_res => {
        alert("Employee Deleted!!!!")
        this.getAllEmployee();
        
      })
  }
  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id;
    this.formValue.controls['firstName'].setValue(row.firstName)
    this.formValue.controls['lastName'].setValue(row.lastName)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['mobile'].setValue(row.mobile)
    this.formValue.controls['salary'].setValue(row.salary)
  }
  updateEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    this.api.updateEmploye(this.employeeModelObj, this.employeeModelObj.id)
      .subscribe(_res => {
        alert("Updated Succesfully !!!")
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
      })
  }
  get firstName() {
    return this.formValue.get(`firstName`)
  }
  get lastName() {
    return this.formValue.get(`lastName`)
  }
  get email() {
    return this.formValue.get(`email`)
  }
  get mobile() {
    return this.formValue.get(`mobile`)
  }
  get salary() {
    return this.formValue.get(`salary`)
  }
}
function getData() {
  throw new Error('Function not implemented.');
}




