import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginTabsPage } from './login-tabs.page';

describe('LoginTabsPage', () => {
  let component: LoginTabsPage;
  let fixture: ComponentFixture<LoginTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginTabsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
