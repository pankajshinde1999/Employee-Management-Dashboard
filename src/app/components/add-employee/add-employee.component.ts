import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee, EmployeeService } from 'src/app/services/employee.service';
// Make sure you have this model

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar ,// Inject MatSnackBar
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      joiningDate: ['', Validators.required],
      package:['',Validators.required]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
        // Generate the next ID as a string
        const nextId = employees.length > 0 
          ? (Math.max(...employees.map(emp => Number(emp.id) || 0)) + 1).toString()
          : '1';
  
        // Create a new employee object with the new string ID
        const newEmployee: Employee = {
          id: nextId,
          ...this.employeeForm.value
        };
  
        this.employeeService.addEmployee(newEmployee).subscribe(() => {
          this.snackBar.open('Employee added successfully!', 'Close', {
            duration: 3000, // 3 seconds
          });
          this.employeeForm.reset();
          this.router.navigate(['']); // Adjust route as necessary
        });
      });
    } else {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
        duration: 3000, // 3 seconds
      });
    }
  }
  
  
}
