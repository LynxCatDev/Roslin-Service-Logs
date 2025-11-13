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

export interface Draft {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: string;
  engineHours: string;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  lastSaved: string;
  isSaved: boolean;
}

export const ServiceType = {
  PLANNED: 'Planned',
  UNPLANNED: 'Unplanned',
  EMERGENCY: 'Emergency',
} as const;

export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];
