import { DomainData } from '../types';

// Mock data to simulate the original backend response format
export const mockDomainData: DomainData[] = [
  {
    domain: 'academics.iitm.ac.in',
    ip: ['10.21.160.11'],
    http: [200],
    https: [200],
    cert: [true, '2025-06-15'],
    cert_details: {
      subject_common_name: 'academics.iitm.ac.in',
      issuer_common_name: 'Let\'s Encrypt Authority X3',
      valid_from: '2024-03-15T00:00:00Z',
      valid_to: '2025-06-15T23:59:59Z',
      serial_number: '03:4B:9C:8A:2F:1E:7D:9A:3C:5E:8F:2A:6D:4B:1C:9E',
      full_raw: {
        subjectAltName: [
          ['DNS', 'academics.iitm.ac.in'],
          ['DNS', '*.academics.iitm.ac.in']
        ]
      }
    }
  },
  {
    domain: 'moodle.iitm.ac.in',
    ip: ['10.21.160.25'],
    http: [200],
    https: [200],
    cert: [true, '2025-01-20'],
    cert_details: {
      subject_common_name: 'moodle.iitm.ac.in',
      issuer_common_name: 'DigiCert Inc',
      valid_from: '2024-01-20T00:00:00Z',
      valid_to: '2025-01-20T23:59:59Z',
      serial_number: '07:8F:2A:6D:4B:1C:9E:3C:5E:8F:2A:6D:4B:1C:9E:07',
      full_raw: {
        subjectAltName: [
          ['DNS', 'moodle.iitm.ac.in']
        ]
      }
    }
  },
  {
    domain: 'library.iitm.ac.in',
    ip: ['10.21.160.45'],
    http: [200],
    https: [null],
    cert: [false],
    cert_details: {
      error: 'No SSL certificate found'
    }
  },
  {
    domain: 'placement.iitm.ac.in',
    ip: ['10.21.160.78'],
    http: [null],
    https: [500],
    cert: [true, '2024-12-31'],
    cert_details: {
      subject_common_name: 'placement.iitm.ac.in',
      issuer_common_name: 'Expired Certificate Authority',
      valid_from: '2023-12-31T00:00:00Z',
      valid_to: '2024-12-31T23:59:59Z',
      serial_number: '0A:1B:2C:3D:4E:5F:60:71:82:93:A4:B5:C6:D7:E8:F9',
      full_raw: {
        subjectAltName: [
          ['DNS', 'placement.iitm.ac.in']
        ]
      }
    }
  },
  {
    domain: 'research.iitm.ac.in',
    ip: ['10.21.160.92'],
    http: [200],
    https: [200],
    cert: [true, '2025-08-10'],
    cert_details: {
      subject_common_name: 'research.iitm.ac.in',
      issuer_common_name: 'GlobalSign Organization Validation CA',
      valid_from: '2024-08-10T00:00:00Z',
      valid_to: '2025-08-10T23:59:59Z',
      serial_number: '1C:9E:3C:5E:8F:2A:6D:4B:1C:9E:07:8F:2A:6D:4B:1C',
      full_raw: {
        subjectAltName: [
          ['DNS', 'research.iitm.ac.in'],
          ['DNS', 'www.research.iitm.ac.in']
        ]
      }
    }
  },
  {
    domain: 'alumni.iitm.ac.in',
    ip: ['10.21.160.105'],
    http: [200],
    https: [200],
    cert: [true, '2025-01-05'],
    cert_details: {
      subject_common_name: 'alumni.iitm.ac.in',
      issuer_common_name: 'Amazon',
      valid_from: '2024-01-05T00:00:00Z',
      valid_to: '2025-01-05T23:59:59Z',
      serial_number: '2A:6D:4B:1C:9E:07:8F:2A:6D:4B:1C:9E:3C:5E:8F:2A',
      full_raw: {
        subjectAltName: [
          ['DNS', 'alumni.iitm.ac.in']
        ]
      }
    }
  },
  {
    domain: 'sports.iitm.ac.in',
    ip: ['10.21.160.118'],
    http: [200],
    https: [200],
    cert: [true, '2025-01-15'],
    cert_details: {
      subject_common_name: 'sports.iitm.ac.in',
      issuer_common_name: 'Cloudflare Inc ECC CA-3',
      valid_from: '2024-01-15T00:00:00Z',
      valid_to: '2025-01-15T23:59:59Z',
      serial_number: '4B:1C:9E:07:8F:2A:6D:4B:1C:9E:3C:5E:8F:2A:6D:4B',
      full_raw: {
        subjectAltName: [
          ['DNS', 'sports.iitm.ac.in'],
          ['DNS', '*.sports.iitm.ac.in']
        ]
      }
    }
  },
  {
    domain: 'hostel.iitm.ac.in',
    ip: ['10.21.160.131'],
    http: [404],
    https: [404],
    cert: [false],
    cert_details: {
      error: 'Connection refused - no certificate available'
    }
  },
  {
    domain: 'events.iitm.ac.in',
    ip: ['10.21.160.144'],
    http: [200],
    https: [null],
    cert: [false],
    cert_details: {
      error: 'HTTPS not available'
    }
  },
  {
    domain: 'portal.iitm.ac.in',
    ip: ['10.21.160.157'],
    http: [200],
    https: [200],
    cert: [true, '2025-03-20'],
    cert_details: {
      subject_common_name: 'portal.iitm.ac.in',
      issuer_common_name: 'Let\'s Encrypt Authority X3',
      valid_from: '2024-03-20T00:00:00Z',
      valid_to: '2025-03-20T23:59:59Z',
      serial_number: '5C:2D:8E:4F:1A:6B:9C:3D:7E:5F:2A:8B:4C:1D:9E:6F',
      full_raw: {
        subjectAltName: [
          ['DNS', 'portal.iitm.ac.in']
        ]
      }
    }
  }
];

export const fetchMockResults = (): Promise<DomainData[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockDomainData);
    }, 1200);
  });
};