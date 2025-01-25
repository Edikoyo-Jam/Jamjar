export type PlatformType = "Windows" | "MacOS" | "Linux" | "Web" | "Mobile" | "Other";
export interface DownloadLinkType {
  id: number;
  url: string;
  platform: PlatformType;
}