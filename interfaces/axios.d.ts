import "axios";
import type { CacheProperties } from "axios-cache-interceptor";

declare module "axios" {
  export interface AxiosRequestConfig {
    cache?: false | Partial<CacheProperties<any, any>>;
  }
}
