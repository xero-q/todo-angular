import { CommonModule } from '@angular/common';
import { Component, Inject, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { TodosService } from '../../services/todos.service';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Todo } from '../../../shared/interfaces/todo.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-property-form',
  imports: [ReactiveFormsModule, RouterModule, MatInputModule, MatButtonModule, MatCardModule, CommonModule,MatSelectModule],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.scss'
})
export class PropertyFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PropertyFormComponent>);
  private readonly snackbar = inject(MatSnackBar);
  protected readonly isSubmitting = signal(false);
  private readonly propertiesService = inject(TodosService);
  
  private readonly fb = inject(FormBuilder);

  protected readonly id = signal<number | undefined>(undefined);

  protected readonly propertyForm = signal(
    this.fb.group({
      hostId: [0, [Validators.required, Validators.min(1)]],
      name: ['', Validators.required],
      location: ['', Validators.required],
      pricePerNight: [0, [Validators.required,Validators.min(1),Validators.pattern(/^\d+(\.\d{1,})?$/) ]],
      status:['',Validators.required]
    })
  );

  constructor(@Inject(MAT_DIALOG_DATA) public payload: {id:number}) {
    this.id.set(payload.id);
  }

  // ngOnInit(){
  //     this.hostsService.getAll().subscribe((data:Host[])=>{
  //         this.hosts.set(data);
  //     })
  // }

  // ngAfterViewInit(){
  //   if (this.id()){
  //     this.propertiesService.getOneProperty(this.id() ?? 0).subscribe((data:Property)=>{
  //       this.propertyForm().controls['hostId'].setValue(data.hostId);
  //       this.propertyForm().controls['name'].setValue(data.name);
  //       this.propertyForm().controls['location'].setValue(data.location);
  //       this.propertyForm().controls['pricePerNight'].setValue(data.pricePerNight);
  //       this.propertyForm().controls['status'].setValue(data.status.toString());
        
  //     })
  //   }
  // }

  // onSubmit() {
  //   if (this.propertyForm().valid) {
  //     this.isSubmitting.set(true);

  //     if (!this.id()){ //Creating property
  //         this.propertiesService
  //       .createProperty(
  //         Number(this.propertyForm().get('hostId')!.value ?? ''),
  //         this.propertyForm().get('name')!.value ?? '',
  //         this.propertyForm().get('location')!.value ?? '',
  //         Number(this.propertyForm().get('pricePerNight')!.value ?? ''),
  //         Number(this.propertyForm().get('status')!.value ?? '')
  //       )
  //       .subscribe({
  //         next: () => {
  //           this.isSubmitting.set(false);  
  //           this.closeDialog('CREATED');  
  //           this.snackbar.open('Property created successfully','Info',{
  //             duration:3000,
  //             panelClass:['snackbar-success']
  //           })        
  //         },
  //         error: (error: any) => {
  //           this.isSubmitting.set(false);
  //           const messages = error.error.title ?? error.error.errors.request;
  //           let messagesString = '';
  //           if (Array.isArray(messages)) {
  //             messagesString = messages.join('\n');
  //           } else {
  //             messagesString = messages;
  //           }
  //           this.snackbar.open(`Error:${messagesString}`,'Error',{
  //             duration:3000,
  //             panelClass:['snackbar-error']
  //           })
  //         },
  //       });
  //     }
  //     else { //Edit property
  //           this.propertiesService
  //       .updateProperty(
  //         this.id() ?? 0,
  //         Number(this.propertyForm().get('hostId')!.value ?? ''),
  //         this.propertyForm().get('name')!.value ?? '',
  //         this.propertyForm().get('location')!.value ?? '',
  //         Number(this.propertyForm().get('pricePerNight')!.value ?? ''),
  //         Number(this.propertyForm().get('status')!.value ?? '')
  //       )
  //       .subscribe({
  //         next: () => {
  //           this.isSubmitting.set(false);  
  //           this.closeDialog('UPDATWED'); 
  //           this.snackbar.open('Property updated successfully','Info',{
  //             duration:3000,
  //             panelClass:['snackbar-success']
  //           })         
  //         },
  //         error: (error: any) => {
  //           this.isSubmitting.set(false);
  //           const messages = error.error.title ?? error.error.errors.request;
  //           let messagesString = '';
  //           if (Array.isArray(messages)) {
  //             messagesString = messages.join('\n');
  //           } else {
  //             messagesString = messages;
  //           }
  //            this.snackbar.open(`Error:${messagesString}`,'Error',{
  //             duration:3000,
  //             panelClass:['snackbar-error']
  //           })
  //         },
  //       });
  //     }
      
  //   }
  // }
  // closeDialog(resp: string | null = null) {
  //   this.dialogRef.close(resp);
  // }
}
