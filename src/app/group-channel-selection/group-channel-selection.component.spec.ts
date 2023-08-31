import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChannelSelectionComponent } from './group-channel-selection.component';

describe('GroupChannelSelectionComponent', () => {
  let component: GroupChannelSelectionComponent;
  let fixture: ComponentFixture<GroupChannelSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupChannelSelectionComponent]
    });
    fixture = TestBed.createComponent(GroupChannelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
