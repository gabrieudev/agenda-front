export {};

declare global {
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt: Date;
  }

  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }

  export interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  export interface SignInData {
    email: string;
    password: string;
  }

  export interface Status {
    id: string;
    name: string;
    description: string;
  }

  export interface CommitmentCategory {
    id: string;
    name: string;
    description: string;
  }

  export interface Commitment {
    id: string;
    title: string;
    description: string;
    status: Status;
    category: CommitmentCategory;
    user: User;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    commitment: Commitment;
    user: User;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Role {
    id: string;
    name: string;
    description: string;
  }

  export interface Report {
    completedCommitments: Commitment[];
    completedTasks: Task[];
  }

  export interface Notification {
    id: string,
    message: string,
    commitment: Commitment,
    dueDate: Date | string,
    isSended: Boolean
  }

  export interface ReportRequestBody {
    userId: string,
    startDate: Date,
    endDate: Date
  }

  export interface Report {
    completedCommitments: Commitment[],
    completedTasks: Task[]
  }
  
  export interface NotificationInvitation {
    id: string,
    status: Status
    user: User,
    notification: Notification
  }
}
