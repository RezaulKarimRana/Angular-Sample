import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-travel-allowance-calculation',
  templateUrl: './travel-allowance-calculation.component.html',
  styleUrls: ['./travel-allowance-calculation.component.scss']
})
export class TravelAllowanceCalculationComponent implements OnInit {

  @Input() public ItemObj: any;
  @Input() public initModel: any;
  @Input() public CanEdit: any;

  isDisabled: boolean = true;
  DateRangeList: any = [];
  perBreakfastRate:number = 0;
  perLunchRate:number = 0;
  perSnackRate:number = 0;
  perDinnerRate:number = 0;
  perHotelRate:number = 0;
  perLocalTravelRate:number = 0;
  noOfBreakfast:number = 0;
  noOfLunch:number = 0;
  noOfSnack:number = 0;
  noOfDinner:number = 0;
  noOfHotel:number = 0;
  noOfLocalTravel:number = 0;
  totalBreakfast:number = 0;
  totalLunch:number = 0;
  totalSnack:number = 0;
  totalDinner:number = 0;
  totalHotel:number = 0;
  totalLocalTravel:number = 0;
  totalCost:number = 0;

  constructor(
    public toaster: ToastrService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.resetAllowance();
    if(this.ItemObj.TotalCost == 0)
    this.calculateTADA();
  }
  closeModal() {
    //If not stay on Hotel and not Own Accomodation Return
    if((this.ItemObj.IsStayOnHotel && this.ItemObj.HasOwnAccomodation)||(!this.ItemObj.IsStayOnHotel && !this.ItemObj.HasOwnAccomodation)){
      this.toaster.info('Please choose Hotel/Own Accomodation','info');
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
  onChangeLocalTravel(){
    if(this.ItemObj.ActualLocalTravel > this.ItemObj.TotalLocalTravel)
    {
      this.ItemObj.ActualLocalTravel = this.ItemObj.TotalLocalTravel;
      this.toaster.info('Local Travel is too much, it should not exceed '+this.ItemObj.TotalLocalTravel,'info');
    }
    else{
      this.calculateAmount();
    }
  }
  onChangeTravel(){
    let totalTravel = Number(this.ItemObj.TotalOfficeVehicle) + Number(this.ItemObj.TotalLocalConveyance);
    if(totalTravel > this.ItemObj.TotalLocalTravel)
    {
      this.ItemObj.TotalOfficeVehicle = 0;
      this.ItemObj.TotalLocalConveyance = 0;
      this.ItemObj.LocalConveyanceAmount = 0;
      this.ItemObj.ActualLocalTravel = this.ItemObj.TotalLocalTravel;
      this.toaster.info('Office Vehicle/ Local Conveyance should not exceed '+this.ItemObj.TotalLocalTravel,'info');
    }
    else{
      this.ItemObj.ActualLocalTravel = this.ItemObj.TotalLocalTravel - totalTravel;
    }
    this.calculateAmount();
  }
  calculateAmount(){
    //If not stay on Hotel and not Own Accomodation Return
    if((this.ItemObj.IsStayOnHotel && this.ItemObj.HasOwnAccomodation)||(!this.ItemObj.IsStayOnHotel && !this.ItemObj.HasOwnAccomodation)){
      this.toaster.info('Please choose Hotel/Own Accomodation','info');
      return;
    }
    //If not stay on hotel or use Own Accomodation
    if(!this.ItemObj.IsStayOnHotel && this.ItemObj.HasOwnAccomodation)
    {
      this.ItemObj.ActualHotelStay = 0;
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
    if(this.ItemObj.IsOfficeVehicleUsed || this.ItemObj.HasLocalConveyance)
    {
      this.ItemObj.ActualLocalTravel = this.ItemObj.TotalLocalTravel - this.ItemObj.TotalLocalConveyance - this.ItemObj.TotalOfficeVehicle;
    }
    this.ItemObj.TotalBreakFastAmount = Number(this.ItemObj.BreakFastAllowance*this.ItemObj.ActualBreakFast);
    this.ItemObj.TotalLunchAmount = Number(this.ItemObj.LunchAllowance*this.ItemObj.ActualLunch);
    this.ItemObj.TotalSnacksAmount = Number(this.ItemObj.SnacksAllowance*this.ItemObj.ActualSnacks);
    this.ItemObj.TotalDinnerAmount = Number(this.ItemObj.DinnerAllowance*this.ItemObj.ActualDinner);
    this.ItemObj.TotalHotelStayAmount = Number(this.ItemObj.HotelAllowance*this.ItemObj.ActualHotelStay);
  if(this.ItemObj.HasOwnAccomodation){
    this.ItemObj.TotalHotelStayAmount = Number(this.ItemObj.HotelAllowance*this.ItemObj.TotalHotelStay);
    this.ItemObj.TotalHotelStayAmount = this.ItemObj.TotalHotelStayAmount/2;
  }
  this.ItemObj.TotalLocalTravelAmount = Number(this.ItemObj.LocalTravelAllowance*this.ItemObj.ActualLocalTravel);
  this.ItemObj.TotalCost = Number(this.ItemObj.TotalBreakFastAmount)+
                          Number(this.ItemObj.TotalLunchAmount)+
                          Number(this.ItemObj.TotalSnacksAmount)+
                          Number(this.ItemObj.TotalDinnerAmount)+
                          Number(this.ItemObj.TotalHotelStayAmount)+
                          Number(this.ItemObj.TotalLocalTravelAmount)+
                          Number(this.ItemObj.TravelCost)+
                          Number(this.ItemObj.EntertainmentCost)+
                          Number(this.ItemObj.MiscellaneousCost)+
                          Number(this.ItemObj.LocalConveyanceAmount);
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
    this.noOfHotel = this.noOfDinner;
    this.noOfLocalTravel = this.noOfDinner;
    this.perBreakfastRate = isMajor ? tada.BreakfastMajor : tada.BreakfastMinor;
    this.perLunchRate = isMajor ? tada.LunchMajor : tada.LunchMinor;
    this.perSnackRate = isMajor ? tada.SnacksMajor : tada.SnacksMinor;
    this.perDinnerRate = isMajor ? tada.DinnerMajor : tada.DinnerMinor;
    this.perHotelRate = isMajor ? tada.HotelMajor : tada.HotelMinor;
    this.perLocalTravelRate = isMajor ? tada.LocalTransPortMajor : tada.LocalTransPortMinor;

    this.totalBreakfast = this.perBreakfastRate * this.noOfBreakfast;
    this.totalLunch = this.perLunchRate * this.noOfLunch;
    this.totalSnack = this.perSnackRate * this.noOfSnack;
    this.totalDinner = this.perDinnerRate * this.noOfDinner;
    this.totalHotel = this.perHotelRate * this.noOfHotel;
    this.totalLocalTravel = this.perLocalTravelRate * this.noOfLocalTravel;

    this.totalCost = this.totalBreakfast + this.totalLunch + this.totalSnack + this.totalDinner + this.totalHotel + this.totalLocalTravel;
    
    this.ItemObj.BreakFastAllowance = this.perBreakfastRate;
    this.ItemObj.LunchAllowance = this.perLunchRate;
    this.ItemObj.SnacksAllowance = this.perSnackRate;
    this.ItemObj.DinnerAllowance = this.perDinnerRate;
    this.ItemObj.HotelAllowance = this.perHotelRate;
    this.ItemObj.LocalTravelAllowance = this.perLocalTravelRate;

    this.ItemObj.TotalBreakFast = this.noOfBreakfast;
    this.ItemObj.TotalLunch = this.noOfLunch;
    this.ItemObj.TotalSnacks = this.noOfSnack;
    this.ItemObj.TotalDinner = this.noOfDinner;
    this.ItemObj.TotalHotelStay = this.noOfHotel;
    this.ItemObj.TotalLocalTravel = this.noOfLocalTravel;

    this.ItemObj.TotalBreakFastAmount = this.totalBreakfast;
    this.ItemObj.TotalLunchAmount = this.totalLunch;
    this.ItemObj.TotalSnacksAmount = this.totalSnack;
    this.ItemObj.TotalDinnerAmount = this.totalDinner;
    this.ItemObj.TotalHotelStayAmount = this.totalHotel;
    this.ItemObj.TotalLocalTravelAmount = this.totalLocalTravel;
    
    this.ItemObj.ActualBreakFast = this.noOfBreakfast;
    this.ItemObj.ActualLunch = this.noOfLunch;
    this.ItemObj.ActualSnacks = this.noOfSnack;
    this.ItemObj.ActualDinner = this.noOfDinner;
    this.ItemObj.ActualHotelStay = this.noOfHotel;
    this.ItemObj.ActualLocalTravel = this.noOfLocalTravel;

    this.calculateAmount();
    this.resetAllowance();
  }
  private countSingleDayTAAllowance(timeStart, timeEnd) {
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
    }
  }
  private resetAllowance() {
    this.noOfBreakfast = 0;
    this.noOfLunch = 0;
    this.noOfSnack = 0;
    this.noOfDinner = 0;
    this.noOfHotel = 0;
    this.noOfLocalTravel = 0;

    this.perBreakfastRate = 0;
    this.perLunchRate = 0;
    this.perSnackRate = 0;
    this.perDinnerRate = 0;
    this.perHotelRate = 0;
    this.perLocalTravelRate = 0;

    this.totalBreakfast = 0;
    this.totalLunch = 0;
    this.totalSnack = 0;
    this.totalDinner = 0;
    this.totalHotel = 0;
    this.totalLocalTravel = 0;

    this.totalCost = 0;
  }
  private addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
  }
}
