import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActionSheetController } from '@ionic/angular';

const toolsMap = {
  0: {
    name: 'Word Cloud',
    endpoint: '/api/wordcloud',
    icon: 'cloud-outline'
    },
  1: {
    name: 'Account Information',
    endpoint: '/api/acc-info',
    icon: 'analytics-outline'
    },
  2: {
    name: 'Leading Tags',
    endpoint: '/api/topmost-tags',
    icon: 'pricetags-outline'
    }
};

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit{
  selected;
  loading = false;
  selectedIcon;
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    public actionSheetController: ActionSheetController
  ) {}

  url1: SafeUrl; // url to store base64 for the account information chart

  ngOnInit() {
    this.loadTool(0);
  }

  loadTool(id) {
    this.selected = toolsMap[id].name;
    this.selectedIcon = toolsMap[id].icon;
    this.loading = true;
    id = String(id);
    this.apiService.getAnalyticalTool(toolsMap[id].endpoint)
    .subscribe((data) => {
      this.url1 = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64, ${data.msg.imageData}`);
      this.loading = false;
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Analytical Tools',
      buttons: [{
        text: 'Word Cloud',
        role: 'destructive',
        icon: 'cloud-outline',
        handler: () => {
          this.selected = 'Word Cloud';
          this.loadTool(0);
        }
      }, {
        text: 'Account Information',
        icon: 'analytics-outline',
        handler: () => {
          this.selected = 'Account Information';
          this.loadTool(1);
        }
      }, {
        text: 'Leading Tags',
        icon: 'pricetags-outline',
        handler: () => {
          this.selected = 'Account Information';
          this.loadTool(2);
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
