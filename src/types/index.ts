export interface DomainData {
  domain: string;
  ip?: string[];
  http?: [number | null];
  https?: [number | null];
  cert?: [boolean, string?];
  cert_details?: CertificateDetails;
}

export interface CertificateDetails {
  subject_common_name?: string;
  issuer_common_name?: string;
  valid_from?: string;
  valid_to?: string;
  serial_number?: string;
  full_raw?: {
    subjectAltName?: Array<[string, string]>;
  };
  error?: string;
}

export interface SummaryStats {
  httpOnly: string[];
  expiringSoon: string[];
  noCert: string[];
}