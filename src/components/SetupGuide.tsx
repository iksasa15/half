export function SetupGuide() {
  return (
    <details className="setup-guide">
      <summary className="setup-guide__summary">
        دليل الربط السريع (أردوينو → ThingSpeak → هذه اللوحة)
      </summary>
      <ol className="setup-guide__list">
        <li>
          أوصل الحساسات بالأردوينو واقرأ القيم في الحلقة الرئيسية، ثم أرسل سطرًا
          واحدًا عبر السيريال (مثلاً قيم مفصولة بفاصلة تطابق ترتيب الحقول في
          القناة).
        </li>
        <li>
          استخدم <code className="setup-guide__code">Serial.println(...)</code>{' '}
          لطباعة السطر؛ على الكمبيوتر شغّل جسر Python من مجلد{' '}
          <code className="setup-guide__code">bridge/</code> لقراءة المنفذ وإرسال
          طلب HTTP إلى ThingSpeak.
        </li>
        <li>
          صيغة التحديث في السحابة:{' '}
          <code className="setup-guide__code">
            https://api.thingspeak.com/update?api_key=WRITE_KEY&amp;field1=...&amp;field2=...
          </code>
          — مفتاح الكتابة لا يُوضع أبدًا في واجهة React، فقط في السكربت أو
          على الخادم.
        </li>
        <li>
          عيّن في ملف <code className="setup-guide__code">.env</code> معرف القناة{' '}
          <code className="setup-guide__code">VITE_THINGSPEAK_CHANNEL_ID</code> واختياريًا
          مفتاح القراءة للقنوات الخاصة؛ هذه الصفحة تقرأ فقط من Channel Feed.
        </li>
        <li>
          للتنبيهات البريدية أو الويبهوكس استخدم{' '}
          <strong>ThingHTTP</strong> أو تطبيقات React داخل لوحة ThingSpeak — منفصلة
          عن هذا المشروع ولا تتطلب تعديل الكود هنا.
        </li>
      </ol>
    </details>
  )
}
