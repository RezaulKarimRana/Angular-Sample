export class ConstantMessages {
	static readonly formFieldsErrorMessage = 'Please fix the error(s) and try again.';
	static readonly refreshAndTryAgainMessage = 'An unexpected error has occurred. Please refresh and try again. If the problem persists, please contact support.';
	static readonly loginErrorMessage = "Hmm, we don't recognize that HR ID/Password Please try again.";
	static readonly Login = 'login';
	static readonly ResetPasswordByEmail = 'resetpassword';
	static readonly ResetPassworErrorMessage = "Hmm, we don't recognize that HR ID/Password Please try again.";
	static readonly EmailPattern = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
	static readonly DefaultPassword = "Scl@123";
	static readonly In_House_Civil_Works = 'In House Civil Works';
}
export class ApplicationConstant {
	static readonly SCOMM = 'SCOMM';
	static readonly STL = 'STL';
	static readonly Regular = 'Regular';
	static readonly In_House_Civil = 'IN-HOUSE CIVIL';
	static readonly Under_In_House_Civil = 'Under_In_House_Civil';
	static readonly Except_In_House_Civil = 'Except_In_House_Civil';
}

export enum UserRoles {
	'SUPERADMIN' = 'SuperAdmin',
	'ADMIN' = 'Admin',
	'MODERATOR' = 'Moderator',
	'BASIC' = 'Basic',
	'APPROVER' = 'Approver',
	'DELIGATEUSER' = 'DeligateUser',
    'STL' = 'STL',
	'SCOMM' = 'SComm',
	'RSL' = 'RSL',
    'EZONE' = 'Ezone',
}

export enum UserRoleType {
    'SUPERADMIN' = 1,
	'ADMIN' =2,
	'MODERATOR' = 3,
	'BASIC' = 4,
	'APPROVER' = 5,
	'DELIGATEUSER' = 6,
    'STL' = 7,
	'SCOMM' = 8,
	'RSL' = 9,
    'EZONE' = 10,
}
export enum ApproversGroupName {
	'CREATOR'= 'CREATOR',
	'CHECKER'= 'CHECKER',
	'ACKNOWLEDGER'= 'ACKNOWLEDGER',
	'VERIFIER'= 'VERIFIER',
	'RECOMMANDER'= 'RECOMMANDER',
	'APPROVER'= 'APPROVER',
	'FINANCE CHECK'= 'FINANCE CHECK',
	'FINANCE COMPLETE'= 'FINANCE COMPLETE',
	'HOD INPUT'= 'HOD INPUT',
	'HR HOD CHECKER'= 'HR HOD CHECKER',
	'INTERNAL CONTROL'= 'INTERNAL CONTROL'
}
export class CodeNamePairApiEndPoints {
	static readonly company = 'company';
	static readonly employeetype = 'employeetype';
	static readonly designation = 'designation';
	static readonly department = 'department';
	static readonly officeLocation = 'officeLocation';
	static readonly taskType = 'taskType';
	static readonly taskTypeDetails = 'taskTypeDetails';
	static readonly thana = 'thana';
	
}
export enum RunningApproverMatrixStatus {
	'Due' = 1,
	'Pending' = 2,
	'Approved' = 100,
	'Return' = -404,
	'Hold' =-301
}
export enum ApplicationStatus {
	'All' = 0,
	'Pending' = 2,
	'Completed' = 100,
	'Return' = -404,
	'Hold'= -301
}
export enum TravelAuthorizationType {
	'WithAdvance' = 1,
	'WithoutAdvance' = 2
}
export enum AdvanceType {
	'PettyCash' = 1,
	'Advance' = 2
}
export enum OutstationParticularCategory {
	'TravelAllowance' = 'Travel Allowance',
	'TravelConveyance' = 'Travel Conveyance',
	'FoodAllowance' = 'Food Allowance',
	'LocalConveyance' = 'Local Conveyance',
	'NightAllowance' = 'Night Allowance',
}
export enum OutstationParticularConstants {
	'TravelAllowance' = 1,
	'TravelConveyance' = 2,
	'FoodAllowance' = 3,
	'LocalConveyance' = 4,
	'NightAllowance' = 6,
}
export enum SettlementParticularCategory {
	'Outstation_Service_Allowance' = 'Outstation Service Allowance',
	'Electricity_Bill' = 'Electricity Bill'
}
export enum RequestType {
	'Advance' = 'Advance',
	'Outstation' = 'Outstation',
	'Settlement' = 'Settlement',
}
export enum TaskTypes {
	'Project' = 'Project',
	'Implementation' = 'Implementation',
	'Others' = 'Others',
}
export class FileTypeSize {
	static readonly fileSize = 10 * 1024 * 1024; // 10 MB
	static readonly fileSize2MB = 2 * 1024 * 1024; // 2 MB
	static readonly fileTypes = [
		'image/gif',
		'image/png',
		'image/jpg',
		'image/jpeg',
		'text/plain',
		'application/pdf',
		'application/x-pdf',
		'application/msword',
		'application/vnd.ms-excel',
		'application/vnd.ms-powerpoint',
		'application/vnd.ms-outlook',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
		'application/vnd.ms-word.document.macroEnabled.12',
		'application/vnd.ms-word.template.macroEnabled.12',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
		'application/vnd.ms-excel.sheet.macroEnabled.12',
		'application/vnd.ms-excel.template.macroEnabled.12',
		'application/vnd.ms-excel.addin.macroEnabled.12',
		'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/vnd.openxmlformats-officedocument.presentationml.template',
		'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
		'application/vnd.ms-powerpoint.addin.macroEnabled.12',
		'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
		'application/vnd.ms-powerpoint.template.macroEnabled.12',
		'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
		'audio/wav',
		'audio/ogg',
		'audio/webm',
		'audio/mpeg',
		'video/3gpp',
		'video/mp4',
		'video/quicktime',
		'video/x-ms-wmv',
		'application/x-rar-compressed',
		'application/zip',
		''
	];
}