export interface HtmlContentDto {
  id: string;
  subject: string;
  description: string;
  builderJson?: string;
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

export interface AdminFileDto {
  id: string;
  name: string;
  file: string;
  contentType: string;
  url: string | null;
}
