import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewWordPage } from './view-word.page';

describe('ViewWordPage', () => {
  let component: ViewWordPage;
  let fixture: ComponentFixture<ViewWordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewWordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
