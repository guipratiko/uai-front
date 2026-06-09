export type BreakdownRow = {
  label: string;
  total: number;
  checkedIn: number;
  rate: number;
};

export type HourSlotRow = {
  label: string;
  checkedIn: number;
};

export type AttendanceScope = {
  summary: { total: number; checkedIn: number; rate: number };
  byTicketType: BreakdownRow[];
  byLot: BreakdownRow[];
  byPayment: BreakdownRow[];
  byGender: BreakdownRow[];
  byCity: BreakdownRow[];
  byState: BreakdownRow[];
  byCheckInHour: HourSlotRow[];
};

export type AttendanceReport = {
  sale: AttendanceScope;
  all: AttendanceScope;
  courtesy: AttendanceScope;
  updatedAt: string;
};

export type EventAttendanceResponse = {
  eventId: string;
  eventTitle: string;
  attendance: AttendanceReport;
};
