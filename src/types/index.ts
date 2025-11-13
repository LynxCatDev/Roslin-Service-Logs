export interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  createdAt: string;
  updatedAt: string;
}

export enum ServiceType {
  PLANNED = 'Planned',
  UNPLANNED = 'Unplanned',
  EMERGENCY = 'Emergency',
}
