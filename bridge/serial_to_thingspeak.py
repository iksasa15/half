#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
جسر بسيط: يقرأ سطرًا من منفذ السيريال (مخرجات الأردوينو) ويرسلها إلى ThingSpeak.

المتغيرات البيئية (مثال على الطرفية قبل التشغيل):
  export THINGSPEAK_WRITE_KEY="مفتاح_الكتابة_من_قناتك"
  export SERIAL_PORT="/dev/ttyUSB0"          # أو COM3 على ويندوز
  export SERIAL_BAUD="9600"

صيغة السطر من الأردوينو (متوافقة مع src/config/channelFields.ts):
  field1,field2,field3,field4
  مثال: 1.25,52.3,1,140
  — field1 ملوحة %، field2 مستوى المد، field3 حالة (1/0)، field4 كربون

لا تضع مفتاح الكتابة في مشروع React؛ استخدمه هنا أو على خادمك فقط.
"""

from __future__ import annotations

import os
import sys
import time

import requests
import serial


UPDATE_URL = "https://api.thingspeak.com/update"


def main() -> int:
    write_key = os.environ.get("THINGSPEAK_WRITE_KEY", "").strip()
    port = os.environ.get("SERIAL_PORT", "").strip()
    baud = int(os.environ.get("SERIAL_BAUD", "9600"))

    if not write_key or not port:
        print(
            "ضبط THINGSPEAK_WRITE_KEY و SERIAL_PORT في البيئة ثم أعد التشغيل.",
            file=sys.stderr,
        )
        return 1

    try:
        ser = serial.Serial(port, baud, timeout=2)
    except serial.SerialException as exc:
        print(f"تعذر فتح المنفذ {port}: {exc}", file=sys.stderr)
        return 1

    print(f"متصل بـ {port} @ {baud} — في انتظار أسطر من الأردوينو…")

    try:
        while True:
            raw = ser.readline()
            if not raw:
                continue
            line = raw.decode(errors="replace").strip()
            if not line or line.startswith("#"):
                continue

            parts = [p.strip() for p in line.split(",")]
            if len(parts) < 4:
                print(f"تجاهل سطر غير مكتمل ({len(parts)} حقول): {line!r}")
                continue

            f1, f2, f3, f4 = parts[0], parts[1], parts[2], parts[3]
            params = {
                "api_key": write_key,
                "field1": f1,
                "field2": f2,
                "field3": f3,
                "field4": f4,
            }
            try:
                r = requests.get(UPDATE_URL, params=params, timeout=15)
                r.raise_for_status()
                print(f"تم الإرسال: {line!r} ← {r.text.strip()}")
            except requests.RequestException as exc:
                print(f"خطأ HTTP: {exc}", file=sys.stderr)

            time.sleep(15)  # ThingSpeak المجاني يحدّث كل 15 ثانية كحد أدنى
    except KeyboardInterrupt:
        print("\nتوقف.")
        return 0
    finally:
        ser.close()


if __name__ == "__main__":
    raise SystemExit(main())
