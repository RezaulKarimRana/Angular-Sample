import { CodeNamePair } from "./codenamepair.model";

export class TAdAModel {
    Id: number;
    DesignationId: number;
    DesignationName: string;
    BreakfastMajor: number;
    BreakfastMinor: number;
    LunchMajor: number;
    LunchMinor: number;
    DinnerMajor: number;
    DinnerMinor: number;
    SnacksMajor: number;
    SnacksMinor: number;
    TotalFoodMajor: number;
    TotalFoodMinor: number;
    HotelMajor: number;
    HotelMinor: number;
    LocalTransPortMajor: number;
    LocalTransPortMinor: number;
    TotalAllownaceMajor: number;
    TotalAllownaceMinor: number;
}
export class TAdAInitModel {
    DesignationList: CodeNamePair[];
}