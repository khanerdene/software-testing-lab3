import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20, duration: '1m',
  thresholds: {
    'http_req_duration{name:cart}': ['p(95)<5'],   // Performance SLO
    'http_req_duration{name:report}': ['p(95)<100'],   // Performance SLO 2
    'http_req_failed{name:pay}':    ['rate<0.07'],   // Reliability SLO
    'checks':                       ['rate>0.85'],   // Availability SLO
  },
};

export default function () {
  const base = 'http://localhost:3000';
  const c = http.post(`${base}/cart/add`, null, { tags: { name: 'cart' } });
  const r = http.get(`${base}/report`,        { tags: { name: 'report' } });
  const p = http.post(`${base}/pay`, null,      { tags: { name: 'pay' } });
  check(c, { 'cart 200': (x) => x.status === 200 });
  check(r, { 'report 200': (x) => x.status === 200 });
  check(p, { 'pay 200': (x) => x.status === 200 });
  sleep(1);
}
