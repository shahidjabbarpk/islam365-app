// Prayer time calculation (standard astronomical method, as in PrayTimes.org).
// Works in Node (require) and in the browser (window.PrayTimes).
(function (root) {
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const dsin = (d) => Math.sin(rad(d)), dcos = (d) => Math.cos(rad(d)), dtan = (d) => Math.tan(rad(d));
  const darcsin = (x) => deg(Math.asin(x)), darccos = (x) => deg(Math.acos(Math.max(-1, Math.min(1, x))));
  const darctan2 = (y, x) => deg(Math.atan2(y, x)), darccot = (x) => deg(Math.atan(1 / x));
  const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sun(jd) {
    const D = jd - 2451545.0;
    const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    const L = fix(q + 1.915 * dsin(g) + 0.020 * dsin(2 * g), 360);
    const e = 23.439 - 0.00000036 * D;
    const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
    return { decl: darcsin(dsin(e) * dsin(L)), eqt: q / 15 - fix(RA, 24) };
  }

  // method: { fajr: angle, isha: angle | {min: n}, asr: 1 (Shafi) | 2 (Hanafi) }
  function compute(y, m, d, lat, lng, tz, method) {
    const jd = julian(y, m, d) - lng / (15 * 24);
    const mid = (t) => fix(12 - sun(jd + t).eqt, 24);
    const angleTime = (angle, t, ccw) => {
      const { decl } = sun(jd + t);
      const T = darccos((-dsin(angle) - dsin(decl) * dsin(lat)) / (dcos(decl) * dcos(lat))) / 15;
      return mid(t) + (ccw ? -T : T);
    };
    const asrTime = (f, t) => {
      const { decl } = sun(jd + t);
      return angleTime(-darccot(f + dtan(Math.abs(lat - decl))), t);
    };
    let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
    for (let i = 0; i < 2; i++) {
      const p = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v / 24]));
      t = {
        fajr: angleTime(method.fajr, p.fajr, true),
        sunrise: angleTime(0.833, p.sunrise, true),
        dhuhr: mid(p.dhuhr) + 1 / 60,
        asr: asrTime(method.asr, p.asr),
        maghrib: angleTime(0.833, p.maghrib),
        isha: typeof method.isha === 'number' ? angleTime(method.isha, p.isha) : 0,
      };
    }
    if (typeof method.isha !== 'number') t.isha = t.maghrib + method.isha.min / 60;
    const adj = tz - lng / 15;
    const out = {};
    for (const k in t) out[k] = t[k] + adj;
    return out;
  }
  function fmt(h) {
    let m = Math.round(fix(h, 24) * 60); let hh = Math.floor(m / 60) % 24; const mm = m % 60;
    const ap = hh >= 12 ? 'PM' : 'AM'; hh = hh % 12 || 12;
    return `${hh}:${String(mm).padStart(2, '0')} ${ap}`;
  }
  const METHODS = {
    karachi: { fajr: 18, isha: 18, asr: 2, name: 'University of Islamic Sciences, Karachi · Hanafi Asr' },
    ummalqura: { fajr: 18.5, isha: { min: 90 }, asr: 1, name: 'Umm al-Qura, Makkah' },
    dubai: { fajr: 18.2, isha: 18.2, asr: 1, name: 'Dubai (UAE)' },
  };
  const api = { compute, fmt, METHODS };
  if (typeof module !== 'undefined') module.exports = api; else root.PrayTimes = api;
})(this);
