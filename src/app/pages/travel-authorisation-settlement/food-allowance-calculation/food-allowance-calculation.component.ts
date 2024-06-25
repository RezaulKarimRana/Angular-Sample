import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-food-allowance-calculation',
  templateUrl: './food-allowance-calculation.component.html',
  styleUrls: ['./food-allowance-calculation.component.scss']
})
export class FoodAllowanceCalculationComponent implements OnInit {

  @Input() public ItemObj: any;
  @Input() public initModel: any;
  @Input() public CanEdit: any;

  isSameDistrict: boolean = false;
  DateRangeList: any = [];

  perBreakfastRate:number = 0;
  perLunchRate:number = 0;
  perSnackRate:number = 0;
  perDinnerRate:number = 0;
  perNightRate:number = 0;

  noOfBreakfast:number = 0;
  noOfLunch:number = 0;
  noOfSnack:number = 0;
  noOfDinner:number = 0;
  noOfNight:number = 0;

  totalBreakfast:number = 0;
  totalLunch:number = 0;
  totalSnack:number = 0;
  totalDinner:number = 0;
  totalNight:number = 0;

  totalCost:number = 0;

  constructor(
    public toaster: ToastrService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if(this.ItemObj.TotalCost == 0)
    this.calculateTADA();
  }
  closeModal() {
    if(this.ItemObj.TotalDistance <= 0 || this.ItemObj.SiteCode == undefined || this.ItemObj.SiteCode == ''){
      this.toaster.info('Please Provide Both Way Distance/Site Code','info');
      return;
    }
    if((this.ItemObj.TravelCost > 0 || this.ItemObj.EntertainmentCost > 0 || this.ItemObj.MiscellaneousCost > 0) && this.ItemObj.DeductionRemarks.length <= 0){
      this.toaster.info('Please Provide Remarks','info');
      return;
    }
    this.calculateAmount();
    this.activeModal.close(this.ItemObj);
  }
  onChangeBreakFast(){
    if(this.ItemObj.ActualBreakFast > this.ItemObj.TotalBreakFast)
    {
      this.ItemObj.ActualBreakFast = this.ItemObj.TotalBreakFast;
      this.toaster.info('Actual Breakfast is too much, it should not exceed '+this.ItemObj.TotalBreakFast,'info');
    }
    else{
      this.calculateAmount();
    }
  }
  onChangeLunch(){
    if(this.ItemObj.ActualLunch > this.ItemObj.TotalLunch)
    {
      this.ItemObj.ActualLunch = this.ItemObj.TotalLunch;
      this.toaster.info('Lunch is too much, it should not exceed '+this.ItemObj.TotalLunch,'info');
    }
    else{
      this.calculateAmount();
    }
  }
  onChangeSnacks(){
    if(this.ItemObj.ActualSnacks > this.ItemObj.TotalSnacks)
    {
      this.ItemObj.ActualSnacks = this.ItemObj.TotalSnacks;
      this.toaster.info('Snacks is too much, it should not exceed '+this.ItemObj.TotalSnacks,'info');
    }
    else{
      this.calculateAmount();
    }
  }
  onChangeDinner(){
    if(this.ItemObj.ActualDinner > this.ItemObj.TotalDinner)
    {
      this.ItemObj.ActualDinner = this.ItemObj.TotalDinner;
      this.toaster.info('Dinner is too much, it should not exceed '+this.ItemObj.TotalDinner,'info');
    }
    else{
      this.calculateAmount();
    }
  }
  onChangeNightStay(){
    if(this.ItemObj.IsNightStay)
    {
      this.ItemObj.ActualNight = this.ItemObj.TotalNight;
    }
    else{
      this.ItemObj.ActualNight = 0;
    }
    this.calculateAmount();
  }
  onChangeNight(){
    if(this.ItemObj.ActualNight > this.ItemObj.TotalNight)
    {
      this.ItemObj.ActualNight = this.ItemObj.TotalNight;
      this.toaster.info('Night is too much, it should not exceed '+this.ItemObj.TotalNight,'info');
    }
    else{
      this.calculateAmount();
    }
  }
  calculateAmount(){
    if(Number(this.ItemObj.TotalDistance) <= 0 || this.ItemObj.TotalDistance == undefined){
      this.ItemObj.TotalDistance = 0;
    }
    if(Number(this.ItemObj.TravelCost) <= 0 || this.ItemObj.TravelCost == undefined){
      this.ItemObj.TravelCost = 0;
    }
    if(Number(this.ItemObj.EntertainmentCost) <= 0 || this.ItemObj.EntertainmentCost == undefined){
      this.ItemObj.EntertainmentCost = 0;
    }
    if(Number(this.ItemObj.MiscellaneousCost) <= 0 || this.ItemObj.MiscellaneousCost == undefined){
      this.ItemObj.MiscellaneousCost = 0;
    }
    if(this.ItemObj.TotalDistance <= 0 || this.ItemObj.SiteCode == undefined || this.ItemObj.SiteCode == ''){
      this.toaster.info('Please Provide Both Way Distance/Site Code','info');
      this.ItemObj.TotalBreakFastAmount = 0;
      this.ItemObj.TotalLunchAmount = 0;
      this.ItemObj.TotalSnacksAmount = 0;
      this.ItemObj.TotalDinnerAmount = 0;
      this.ItemObj.TotalNightAmount = 0;
      this.ItemObj.TotalCost = 0;
      return;
    }
    this.isSameDistrict = this.initModel?.OfficeLocationDistrictId == this.ItemObj.LocationToDistrictId;
    if(this.ItemObj.TaskTypeDetailsId != 52 &&((this.isSameDistrict && Number(this.ItemObj.TotalDistance) < 100) || (!this.isSameDistrict && Number(this.ItemObj.TotalDistance) < 80))){
      this.ItemObj.TotalBreakFastAmount = 0;
      this.ItemObj.TotalLunchAmount = 0;
      this.ItemObj.TotalSnacksAmount = 0;
      this.ItemObj.TotalDinnerAmount = 0;
      this.ItemObj.TotalNightAmount = 0;
      this.ItemObj.TotalCost = 0;
      return;
    }
    if(this.ItemObj.IsNightStay)
    {
      this.ItemObj.ActualNight = this.ItemObj.TotalNight;
    }
    else{
      this.ItemObj.ActualNight = 0;
    }
    if(this.ItemObj.TaskTypeDetailsId == 52 || ((this.isSameDistrict && Number(this.ItemObj.TotalDistance) >= 100) || (!this.isSameDistrict && Number(this.ItemObj.TotalDistance) >= 80))){
      this.ItemObj.TotalBreakFastAmount = Number(this.ItemObj.BreakFastAllowance*this.ItemObj.ActualBreakFast);
      this.ItemObj.TotalLunchAmount = Number(this.ItemObj.LunchAllowance*this.ItemObj.ActualLunch);
      this.ItemObj.TotalSnacksAmount = Number(this.ItemObj.SnacksAllowance*this.ItemObj.ActualSnacks);
      this.ItemObj.TotalDinnerAmount = Number(this.ItemObj.DinnerAllowance*this.ItemObj.ActualDinner);
      this.ItemObj.TotalNightAmount = Number(this.ItemObj.LunchAllowance*this.ItemObj.ActualNight);
      this.ItemObj.TotalCost = Number(this.ItemObj.TotalBreakFastAmount)+
                              Number(this.ItemObj.TotalLunchAmount)+
                              Number(this.ItemObj.TotalSnacksAmount)+
                              Number(this.ItemObj.TotalDinnerAmount)+
                              Number(this.ItemObj.TotalNightAmount)+
                              Number(this.ItemObj.TravelCost)+
                              Number(this.ItemObj.EntertainmentCost)+
                              Number(this.ItemObj.MiscellaneousCost)+
                              Number(this.ItemObj.LocalConveyanceAmount);
    }
  }
  private calculateTADA() {

    var tada = this.initModel?.TADAList[0];
    var startDate = this.ItemObj.StartDate;
    var returnDate = this.ItemObj.EndDate;
    var workingDistrictId = this.ItemObj.WorkingDistrictId;
    var workingDistrict = this.initModel?.DistrictList.find(x => x.Id === workingDistrictId);
    var isMajor = workingDistrict.IsMajor;

    this.DateRangeList = [];
    let startDateMoment = moment(startDate);
    let returnDateMoment = moment(returnDate);
    let isSameDate = startDateMoment.isSame(returnDateMoment, "day");
    if (isSameDate) {
      let startDateAsMinute = moment.duration(startDateMoment.format("HH:mm")).asMinutes();
      let reutrnDateAsMinute = moment.duration(returnDateMoment.format("HH:mm")).asMinutes();
      this.countSingleDayTAAllowance(startDateAsMinute, reutrnDateAsMinute);
    }
    else {
      if (startDate != null && returnDate != null) {
        var start = new Date(startDate);
        var end = new Date(returnDate);
        while (start < end) {
          start.setHours(0);
          start.setMinutes(0);
          start.setSeconds(0);
          start.setMilliseconds(0);
          this.DateRangeList.push(new Date(start));
          var newDate = start.setDate(start.getDate() + 1);
          start = new Date(newDate);
        }
      }
      if (this.DateRangeList.length > 0) {
        this.DateRangeList[0] = new Date(startDate);
        this.DateRangeList[this.DateRangeList.length - 1] = new Date(returnDate);
        for (var i = 0; i < this.DateRangeList.length; i++) {
          if (i == 0) {
            let firstdateAsMinute = moment.duration(moment(this.DateRangeList[i]).format("HH:mm")).asMinutes();
            this.countStartDayTAAllowance(firstdateAsMinute);
          }
          else if ((i == this.DateRangeList.length - 1)) {
            let lastdateAsMinute = moment.duration(moment(this.DateRangeList[i]).format("HH:mm")).asMinutes();
            this.countReturnDayTAAllowance(lastdateAsMinute);
          }
          else {
            var timehour = this.addZero(this.DateRangeList[i].getHours());
            let timeMin = this.addZero(this.DateRangeList[i].getMinutes());
            let timespan = timehour + ":" + timeMin;
            this.countAllDayTAAllowance(timespan);
          }
        }
      }
    }
    this.perBreakfastRate = isMajor ? tada.BreakfastMajor : tada.BreakfastMinor;
    this.perLunchRate = isMajor ? tada.LunchMajor : tada.LunchMinor;
    this.perSnackRate = isMajor ? tada.SnacksMajor : tada.SnacksMinor;
    this.perDinnerRate = isMajor ? tada.DinnerMajor : tada.DinnerMinor;
    this.perNightRate = isMajor ? tada.LunchMajor : tada.LunchMinor;

    this.totalBreakfast = this.perBreakfastRate * this.noOfBreakfast;
    this.totalLunch = this.perLunchRate * this.noOfLunch;
    this.totalSnack = this.perSnackRate * this.noOfSnack;
    this.totalDinner = this.perDinnerRate * this.noOfDinner;
    this.totalNight = this.perNightRate * this.noOfNight;

    this.totalCost = this.totalBreakfast + this.totalLunch + this.totalSnack + this.totalDinner + this.totalNight;
    
    this.ItemObj.BreakFastAllowance = this.perBreakfastRate;
    this.ItemObj.LunchAllowance = this.perLunchRate;
    this.ItemObj.SnacksAllowance = this.perSnackRate;
    this.ItemObj.DinnerAllowance = this.perDinnerRate;
    this.ItemObj.NightAllowance = this.perNightRate;

    this.ItemObj.TotalBreakFast = this.noOfBreakfast;
    this.ItemObj.TotalLunch = this.noOfLunch;
    this.ItemObj.TotalSnacks = this.noOfSnack;
    this.ItemObj.TotalDinner = this.noOfDinner;
    this.ItemObj.TotalNight = this.noOfNight;

    this.ItemObj.TotalBreakFastAmount = this.totalBreakfast;
    this.ItemObj.TotalLunchAmount = this.totalLunch;
    this.ItemObj.TotalSnacksAmount = this.totalSnack;
    this.ItemObj.TotalDinnerAmount = this.totalDinner;
    this.ItemObj.TotalNightAmount = this.totalNight;
    
    this.ItemObj.ActualBreakFast = this.noOfBreakfast;
    this.ItemObj.ActualLunch = this.noOfLunch;
    this.ItemObj.ActualSnacks = this.noOfSnack;
    this.ItemObj.ActualDinner = this.noOfDinner;
    this.ItemObj.ActualNight = this.noOfNight;
    this.calculateAmount();
    this.resetAllowance();
  }
  private countSingleDayTAAllowance(timeStart, timeEnd) {
    if (timeStart <= 240 && timeEnd >= 120) {
      this.noOfNight++;
    }
    if (timeStart <= 540 && timeEnd >= 360) {
      this.noOfBreakfast++;
    }
    if (timeStart <= 900 && timeEnd >= 780) {
      this.noOfLunch++;
    }
    if (timeStart <= 1200 && timeEnd >= 1020) {
      this.noOfSnack++;
    }
    if (timeEnd >= 1320) {
      this.noOfDinner++;
    }
  }
  private countStartDayTAAllowance(timeNow) {
    if ((timeNow <= 240)) {
      this.noOfNight++;
    }
    if ((timeNow <= 540)) {
      this.noOfBreakfast++;
    }
    if ((timeNow <= 900)) {
      this.noOfLunch++;
    }
    if ((timeNow <= 1200)) {
      this.noOfSnack++;
    }
    if ((timeNow <= 1380)) {
      this.noOfDinner++;
    }
  }
  private countReturnDayTAAllowance(timeNow) {
    if ((timeNow >= 120)) {
      this.noOfNight++;
    }
    if (timeNow >= 360) {
      this.noOfBreakfast++;
    }
    if ((timeNow >= 780)) {
      this.noOfLunch++;
    }
    if ((timeNow >= 1020)) {
      this.noOfSnack++;
    }
    if ((timeNow >= 1320)) {
      this.noOfDinner++;
    }
  }
  private countAllDayTAAllowance(timeNow) {
    if (timeNow == "00:00") {
      this.noOfBreakfast++;
      this.noOfLunch ++;
      this.noOfSnack++;
      this.noOfDinner++;
      this.noOfNight++;
    }
  }
  private resetAllowance() {
    this.noOfBreakfast = 0;
    this.noOfLunch = 0;
    this.noOfSnack = 0;
    this.noOfDinner = 0;
    this.noOfNight = 0;

    this.perBreakfastRate = 0;
    this.perLunchRate = 0;
    this.perSnackRate = 0;
    this.perDinnerRate = 0;
    this.perNightRate = 0;

    this.totalBreakfast = 0;
    this.totalLunch = 0;
    this.totalSnack = 0;
    this.totalDinner = 0;
    this.totalNight = 0;

    this.totalCost = 0;
  }
  private addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
  }
}