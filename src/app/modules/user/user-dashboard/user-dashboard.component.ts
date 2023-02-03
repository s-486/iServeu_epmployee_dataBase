import { Component } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms'
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { EmployeeModel } from './admin-dash board.model';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  formValue !:FormGroup;
  employeeModelObj : EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd!:boolean;
  showUpdate !:boolean;
    // api: any;
  constructor(private formbuilber: FormBuilder , private router: Router,
    public api:ApiService){ }
    logout() {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('admin')
      this.router.navigate(['login'])
    }
  ngOnInit(): void {
    // if (JSON.parse(localStorage.getItem("admin") || "false")) {
    //   this.router.navigate(['dashboardadmin'])
    // } else if (!JSON.parse(localStorage.getItem("admin") || "false")) {
    //   this.router.navigate(['dashboard'])
    // } else {
    //   localStorage.removeItem('token')
    //   localStorage.removeItem('admin')
    // }
    this.formValue=this.formbuilber.group({
      firstName:['', [Validators.required, Validators.maxLength(15)]],
      lastName:['', [Validators.required,  Validators.maxLength(15)]],
      email:['', [Validators.required, Validators.email]],
      mobile:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      salary:['', [Validators.required]]
    })
  this.getAllEmployee();
  }
  clickAddEmploye(){
    this.formValue.reset();
    this.showAdd=true;
    this.showUpdate=false;
  }
  postEmployeeDetails(){
    this.employeeModelObj.firstName=this.formValue.value.firstName;
    this.employeeModelObj.lastName=this.formValue.value.lastName;
    this.employeeModelObj.email=this.formValue.value.email;
    this.employeeModelObj.mobile=this.formValue.value.mobile;
    this.employeeModelObj.salary=this.formValue.value.salary;

  this.api.postEmploye(this.employeeModelObj)
  .subscribe(res=>{
    console.log(res);
    alert("Employee added succesfully")
    let ref =document .getElementById('cancel')
    ref?.click();
    this.formValue.reset();
    this.getAllEmployee();
  },
    (err: any)=>{
    alert("Something Went Wrong")
  })

  }
  getAllEmployee(){
    this.api.getEmploye("http://localhost:3000/posts")
      .subscribe(res=>{
         this.employeeData=res;
    })
  }
  deleteEmployee(row :any){
    this.api.deleteEmploye(row.id)
    .subscribe(res=>{
      alert("Employee Deleted!!!!")
      this.getAllEmployee();
    })
  }
  onEdit(row:any){
    this.showAdd=false;
    this.showUpdate=true;
    this.employeeModelObj.id =row.id;
    this.formValue.controls['firstName'].setValue(row.firstName)
    this.formValue.controls['lastName'].setValue(row.lastName)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['mobile'].setValue(row.mobile)
    this.formValue.controls['salary'].setValue(row.salary)
  }
  updateEmployeeDetails(){
    this.employeeModelObj.firstName=this.formValue.value.firstName;
    this.employeeModelObj.lastName=this.formValue.value.lastName;
    this.employeeModelObj.email=this.formValue.value.email;
    this.employeeModelObj.mobile=this.formValue.value.mobile;
    this.employeeModelObj.salary=this.formValue.value.salary;

    this.api.updateEmploye(this.employeeModelObj,this.employeeModelObj.id)
    .subscribe(res=>{
      alert("Updated Succesfully !!!")
      let ref =document .getElementById('cancel')
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
