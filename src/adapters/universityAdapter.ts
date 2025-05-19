import { University } from "../models/university";

export class UniversityAdapter {
  static transform(raw: any): University {
    const name = String(raw?.name).replaceAll(', ', ' - ');
    return {
      countryCode: raw.alpha_two_code,
      name,
    };
  }
}