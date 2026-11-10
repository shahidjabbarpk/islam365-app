// Prayer time calculation (standard astronomical method, as in PrayTimes.org).
// Works in Node (require) and in the browser (window.PrayTimes).
(function (root) {
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const dsin = (d) => Math.sin(rad(d)), dcos = (d) => Math.cos(rad(d)), dtan = (d) => Math.tan(rad(d));
  const darcsin = (x) => deg(Math.asin(x));
  const darccos = (x) => (x < -1 || x > 1 ? NaN : deg(Math.acos(x)));
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
  // UTC offset (hours) of an IANA time zone on a given date (handles DST).
  function tzOffset(tzName, y, m, d) {
    const dt = new Date(Date.UTC(y, m - 1, d, 12));
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tzName, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      .formatToParts(dt).filter((x) => x.type !== 'literal').map((x) => [x.type, +x.value]));
    return (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute) - dt.getTime()) / 36e5;
  }

  // method: { fajr: angle, isha: angle | {min: n}, asr: 1 (Shafi) | 2 (Hanafi) }
  function compute(y, m, d, lat, lng, tz, method) {
    if (typeof tz === 'string') tz = tzOffset(tz, y, m, d);
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
    let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, asrHanafi: 13.5, maghrib: 18, isha: 18 };
    for (let i = 0; i < 2; i++) {
      const p = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, (isNaN(v) ? 12 : v) / 24]));
      t = {
        fajr: angleTime(method.fajr, p.fajr, true),
        sunrise: angleTime(0.833, p.sunrise, true),
        dhuhr: mid(p.dhuhr) + 1 / 60,
        asr: asrTime(1, p.asr),
        asrHanafi: asrTime(2, p.asrHanafi),
        maghrib: angleTime(0.833, p.maghrib),
        isha: typeof method.isha === 'number' ? angleTime(method.isha, p.isha) : 0,
      };
    }
    if (typeof method.isha !== 'number') t.isha = t.maghrib + method.isha.min / 60;
    // High latitudes (e.g. UK summer): angle-based night portion when twilight never ends.
    const night = 24 - (t.maghrib - t.sunrise);
    if (isNaN(t.fajr) || t.sunrise - t.fajr > (method.fajr / 60) * night) t.fajr = t.sunrise - (method.fajr / 60) * night;
    if (typeof method.isha === 'number' && (isNaN(t.isha) || t.isha - t.maghrib > (method.isha / 60) * night)) t.isha = t.maghrib + (method.isha / 60) * night;
    const adj = tz - lng / 15;
    const out = {};
    for (const k in t) out[k] = t[k] + adj;
    out.asrUsed = method.asr === 2 ? out.asrHanafi : out.asr;
    return out;
  }
  function fmt(h) {
    let m = Math.round(fix(h, 24) * 60); let hh = Math.floor(m / 60) % 24; const mm = m % 60;
    const ap = hh >= 12 ? 'PM' : 'AM'; hh = hh % 12 || 12;
    return `${hh}:${String(mm).padStart(2, '0')} ${ap}`;
  }
  // Qibla bearing (degrees from true north) and distance to the Kaaba (km).
  function qibla(lat, lng) {
    const kl = 21.4225, kg = 39.8262;
    const b = fix(darctan2(dsin(kg - lng), dcos(lat) * dtan(kl) - dsin(lat) * dcos(kg - lng)), 360);
    const dl = rad(kl - lat), dg = rad(kg - lng);
    const a = Math.sin(dl / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(kl)) * Math.sin(dg / 2) ** 2;
    return { bearing: b, km: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) };
  }
  const METHODS = {
    karachi: { fajr: 18, isha: 18, asr: 2, name: 'University of Islamic Sciences, Karachi · Hanafi Asr' },
    ummalqura: { fajr: 18.5, isha: { min: 90 }, asr: 1, name: 'Umm al-Qura, Makkah' },
    dubai: { fajr: 18.2, isha: 18.2, asr: 1, name: 'Dubai (UAE)' },
    qatar: { fajr: 18, isha: { min: 90 }, asr: 1, name: 'Qatar' },
    kuwait: { fajr: 18, isha: 17.5, asr: 1, name: 'Kuwait' },
    mwl: { fajr: 18, isha: 17, asr: 1, name: 'Muslim World League' },
    mwlh: { fajr: 18, isha: 17, asr: 2, name: 'Muslim World League · Hanafi Asr' },
    isna: { fajr: 15, isha: 15, asr: 1, name: 'ISNA (North America)' },
    egypt: { fajr: 19.5, isha: 17.5, asr: 1, name: 'Egyptian General Authority of Survey' },
    diyanet: { fajr: 18, isha: 17, asr: 1, name: 'Diyanet (Turkey)' },
    jakim: { fajr: 20, isha: 18, asr: 1, name: 'JAKIM (Malaysia)' },
    kemenag: { fajr: 20, isha: 18, asr: 1, name: 'Kemenag (Indonesia)' },
  };
  const api = { compute, fmt, tzOffset, qibla, METHODS };
  if (typeof module !== 'undefined') module.exports = api; else root.PrayTimes = api;
})(this);
