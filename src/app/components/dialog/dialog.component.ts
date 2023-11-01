import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished"]
  productForm !: FormGroup;

  actionBtn: string = 'Save'

  constructor(
    private formBuilder: FormBuilder,
    private api :ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialog: MatDialogRef<DialogComponent>,

  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price:['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    })

    if(this.editData){
      this.actionBtn = 'Update'
      this.productForm.controls['productName'].setValue(this.editData.productName)
      this.productForm.controls['category'].setValue(this.editData.category)
      this.productForm.controls['freshness'].setValue(this.editData.freshness)
      this.productForm.controls['comment'].setValue(this.editData.comment)
      this.productForm.controls['date'].setValue(this.editData.date)
      this.productForm.controls['price'].setValue(this.editData.price)
    }

  }

  addProduct(){

   if(!this.editData){
    if(this.productForm.valid){{
      this.api.postProcut(this.productForm.value )
      .subscribe({
        next:(res)=>{
          alert("Product added successfully")
          this.productForm.reset();
          this.dialog.close()
        },
        error:()=>{
          alert("Error while adding the product")
        }
      })
    }}
   }else{
    this.updateProduct()
   }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:()=>{
        alert("Product updated successfully")
        this.productForm.reset()
        this.dialog.close('update')
      },
      error:()=>{
        alert("Error while updating the records")
      }
    })
  }


}
