import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcidSearchComponent } from './ucid-search.component';

describe('UcidSearchComponent', () => {
  let component: UcidSearchComponent;
  let fixture: ComponentFixture<UcidSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UcidSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UcidSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
