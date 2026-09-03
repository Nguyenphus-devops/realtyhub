export interface IServicePackageService {
  create(dto: string): Promise<void>;
}
