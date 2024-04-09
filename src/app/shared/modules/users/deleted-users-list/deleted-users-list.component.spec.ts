import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedUsersListComponent } from './deleted-users-list.component';

describe('DeletedUsersListComponent', () => {
  let component: DeletedUsersListComponent;
  let fixture: ComponentFixture<DeletedUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedUsersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletedUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
