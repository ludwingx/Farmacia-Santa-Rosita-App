import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { IRoles } from '../../../../core/interfaces/roles.interface';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  newImage!: File ; 
  previewImage: any = null;
  currentImageSource: any;
  roles: IRoles[] = [];
  constructor(private router: Router, 
    private sanitizer: DomSanitizer,
    private rolesservices: RolesService){

  }
  ngOnInit(){
    this.getRoleslist()
  }
  goToUserList(){
    this.router.navigate(['users']).then(() => {
      window.scrollTo(0, 0);
    })
  }
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.newImage = files[0];
      // Mostrar la vista previa de la nueva imagen
      this.previewImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.newImage));
      // Actualizar la fuente de la imagen actual
      this.currentImageSource = this.previewImage;
    }
  }
  getRoleslist() {
    this.rolesservices.getRoles().subscribe(
      (data) => {
        this.roles = data;
        console.log(this.roles);
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }
  createUser(){
    
  }
}
