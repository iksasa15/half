# لوحة التوأم الرقمي - ThingSpeak

مشروع React + TypeScript مبني بـ Vite لعرض Dashboard IoT (ملوحة، مد، حالة، كربون) مع:
- وضع تجريبي تلقائي بدون إعدادات.
- وضع مباشر من ThingSpeak عند إضافة متغيرات البيئة.
- جسر Python اختياري لاستقبال بيانات Arduino عبر Serial وإرسالها إلى ThingSpeak.

## المتطلبات

- Node.js 20+ (يفضل LTS)
- npm
- (اختياري للجسر) Python 3.10+

## تشغيل المشروع محليًا

```bash
npm install
npm run dev
```

ثم افتح الرابط الذي يظهر في الطرفية (عادة `http://localhost:5173`).

## أوامر مفيدة

```bash
npm run lint
npm run build
npm run preview
```

## إعداد الاتصال بـ ThingSpeak (اختياري)

إذا لم تضبط أي متغيرات، ستعمل اللوحة ببيانات وهمية.

1) انسخ ملف البيئة:

```bash
cp .env.example .env
```

2) عدل القيم داخل `.env`:

- `VITE_THINGSPEAK_CHANNEL_ID`: معرف القناة
- `VITE_THINGSPEAK_READ_API_KEY`: فقط إذا القناة خاصة
- `VITE_THINGSPEAK_POLL_MS`: زمن التحديث الدوري بالمللي ثانية
- `VITE_THINGSPEAK_STALE_MS`: متى تعتبر البيانات قديمة
- `VITE_THINGSPEAK_RESULTS`: عدد نقاط القراءة في الرسم (1-8000)

> ملاحظة: التطبيق يقرأ البيانات فقط. لا تضع مفتاح الكتابة في React.

## تشغيل جسر Arduino -> ThingSpeak (اختياري)

الملفات داخل `bridge/`.

1) تثبيت المتطلبات:

```bash
pip install -r bridge/requirements.txt
```

2) ضبط متغيرات البيئة:

```bash
export THINGSPEAK_WRITE_KEY="YOUR_WRITE_KEY"
export SERIAL_PORT="/dev/ttyUSB0"
export SERIAL_BAUD="9600"
```

على Windows (PowerShell):

```powershell
$env:THINGSPEAK_WRITE_KEY="YOUR_WRITE_KEY"
$env:SERIAL_PORT="COM3"
$env:SERIAL_BAUD="9600"
```

3) تشغيل الجسر:

```bash
python bridge/serial_to_thingspeak.py
```

## صيغة السطر المطلوب من الأردوينو

الجسر يتوقع سطرًا بالشكل:

```text
field1,field2,field3,field4
```

مثال:

```text
1.25,52.3,1,140
```

## تعيين الحقول

تعيين الحقول موجود في `src/config/channelFields.ts`:
- `field1`: Salinity
- `field2`: Tide
- `field3`: Status
- `field4`: Carbon

