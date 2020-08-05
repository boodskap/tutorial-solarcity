import { Component, OnInit } from '@angular/core';
import { SupportChartData1 } from './chart/support-chart-data-1';
import { SupportChartData2 } from './chart/support-chart-data-2';
import { SeoChart1 } from './chart/seo-chart-1';
import { SeoChart2 } from './chart/seo-chart-2';
import { SeoChart3 } from './chart/seo-chart-3';
import { PowerCardChart1 } from './chart/power-card-chart-1';
import { PowerCardChart2 } from './chart/power-card-chart-2';
import { CommonserviceService } from 'src/app/service/commonservice.service';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dash-default',
  templateUrl: './dash-default.component.html',
  styleUrls: ['./dash-default.component.scss']
})
export class DashDefaultComponent implements OnInit {
  public supportChartData1: any;
  public supportChartData2: any;
  public seoChartData1: any;
  public seoChartData2: any;
  public seoChartData3: any;
  public powerCardChartData1: any;
  public powerCardChartData2: any;

  public ats_generated: any = 0;
  public ats_consumed: any = 0;
  public ats_distributed: any = 0;
  public s_communities: any = 0;
  public s_households: any = 0;
  public s_solarpanels: any = 0;
  public topCommunity = {
    "community": "",
    "city": "",
    "state": "",
    "country": "",
    "totalgenerated": 0,
    "totalconsumed": 0,
    "totaldistributed": 0
  };
  public topCommunitDistributed: any = 0;
  public recentReportList: any = [];
  public setInterval: any;

  constructor(public commonService: CommonserviceService, public toastr: ToastrService) {
    this.supportChartData1 = SupportChartData1.supportChartData;
    this.supportChartData2 = SupportChartData2.supportChartData;
    this.seoChartData1 = SeoChart1.seoChartData;
    this.seoChartData2 = SeoChart2.seoChartData;
    this.seoChartData3 = SeoChart3.seoChartData;
    this.powerCardChartData1 = PowerCardChart1.powerCardChartData;
    this.powerCardChartData2 = PowerCardChart2.powerCardChartData;
  }

  ngOnInit() {
    this.getDashboardData();
    this.setInterval = setInterval(() => {
      this.getDashboardData();
    }, 5000);
  }
  getDashboardData() {
    const actionURL = 'dashboard/status';
    const sendObj = {};
    // const actionURL = 'dashboard/status/rule/' + environment.API_TOKEN;
    // const sendObj = {
    //   sessionId: this.commonService.guid(),
    //   scriptArgs: "",
    //   namedrule: "GetDashboard"
    // };
    this.commonService.postCall(actionURL, sendObj)
      .subscribe(res => {
        let resultData = res.data;
        if (res.status) {
          this.ats_generated = resultData.status.totalgenerated;
          this.ats_consumed = resultData.status.totalconsumed;
          this.ats_distributed = resultData.status.totaldistributed;
          this.s_communities = resultData.spread.communities;
          this.s_households = resultData.spread.households;
          this.s_solarpanels = resultData.spread.devices;
          this.topCommunity = resultData.top[0];
          this.topCommunitDistributed = resultData.top[0].totaldistributed.toFixed(2)
          this.recentReportList = resultData.recent;
        } else {
          this.toastr.error('Something went wrong! Please try again later.');
        }
        console.log(resultData)
      })
  }
}
