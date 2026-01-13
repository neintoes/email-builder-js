export interface HtmlContentDto {
  id: string;
  subject: string;
  description: string;
  title: string;
  showAsTemplate: boolean;
  isUserCreated: boolean;
  order?: number;
  isActivityTemplate: boolean;
  activityName: string;
  activityVariant: string;
  type?: number;
  archived: boolean;
  isAutomatedEmail?: boolean;
  lastUpdated?: string;
}
