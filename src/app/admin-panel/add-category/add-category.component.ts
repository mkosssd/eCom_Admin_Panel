import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  constructor(private data: DataService, private router: Router) {}
  cat: string[];
  categoryForm: FormGroup;
  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      category: new FormControl('', Validators.required),
    });

    this.data.getCategories().subscribe((res: any) => {
      this.cat = Object.values(res);
    });
  }
  formHandler() {
    let categoryName: string = this.categoryForm.value['category'];
    console.log(categoryName);

    this.cat.push(categoryName);
    this.data.setCategories({ ...this.cat });
    this.router.navigate(['/']);
  }
}
