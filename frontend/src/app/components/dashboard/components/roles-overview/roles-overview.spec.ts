import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesOverview } from './roles-overview.component';

describe('RolesOverview', () => {
  let component: RolesOverview;
  let fixture: ComponentFixture<RolesOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
