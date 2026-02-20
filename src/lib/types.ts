export interface ErrorRule {
  pathPattern: string;
  statusCode: number;
  remaining: number;
}

export interface ProviderRouteInfo {
  method: string;
  url: string;
  description: string;
}

export interface ProviderInfo {
  name: string;
  prefix: string;
  routes: ProviderRouteInfo[];
}
