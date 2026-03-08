const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

const DEFAULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'form.submit': 'Submit',
    'form.reset': 'Reset',
    'form.cancel': 'Cancel',
    'form.add': 'Add',
    'form.remove': 'Remove',
    'form.required': 'Required',
    'form.optional': 'Optional',
    'form.submitting': 'Submitting...',
    'form.submitSuccess': 'Form submitted successfully',
    'form.submitError': 'An error occurred while submitting',
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.url': 'Please enter a valid URL',
    'validation.minLength': 'Minimum length is {value}',
    'validation.maxLength': 'Maximum length is {value}',
    'validation.min': 'Minimum value is {value}',
    'validation.max': 'Maximum value is {value}',
    'validation.pattern': 'Value does not match the required pattern',
    'field.select': 'Select an option',
    'field.fileUpload': 'Click to upload or drag and drop',
    'field.fileSize': 'Max file size: {value}',
    'field.peoplePicker': 'Search for people...',
    'field.taxonomy': 'Select a term...',
    'field.lookup': 'Select...',
    'section.collapse': 'Collapse',
    'section.expand': 'Expand',
  },
  ar: {
    'form.submit': 'إرسال',
    'form.reset': 'إعادة تعيين',
    'form.cancel': 'إلغاء',
    'form.add': 'إضافة',
    'form.remove': 'حذف',
    'form.required': 'مطلوب',
    'form.optional': 'اختياري',
    'form.submitting': 'جاري الإرسال...',
    'form.submitSuccess': 'تم إرسال النموذج بنجاح',
    'form.submitError': 'حدث خطأ أثناء الإرسال',
    'validation.required': 'هذا الحقل مطلوب',
    'validation.email': 'يرجى إدخال بريد إلكتروني صحيح',
    'validation.url': 'يرجى إدخال رابط صحيح',
    'validation.minLength': 'الحد الأدنى للطول هو {value}',
    'validation.maxLength': 'الحد الأقصى للطول هو {value}',
    'validation.min': 'الحد الأدنى للقيمة هو {value}',
    'validation.max': 'الحد الأقصى للقيمة هو {value}',
    'validation.pattern': 'القيمة لا تطابق النمط المطلوب',
    'field.select': 'اختر خياراً',
    'field.fileUpload': 'انقر للتحميل أو اسحب وأفلت',
    'field.fileSize': 'الحد الأقصى لحجم الملف: {value}',
    'field.peoplePicker': 'ابحث عن أشخاص...',
    'field.taxonomy': 'اختر مصطلحاً...',
    'field.lookup': 'اختر...',
    'section.collapse': 'طي',
    'section.expand': 'توسيع',
  },
};

export class I18nManager {
  private locale: string;
  private translations: Record<string, Record<string, string>>;

  constructor(locale = 'en') {
    this.locale = locale;
    this.translations = { ...DEFAULT_TRANSLATIONS };
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }

  getLocale(): string {
    return this.locale;
  }

  isRTL(): boolean {
    return RTL_LOCALES.includes(this.locale.split('-')[0]);
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.isRTL() ? 'rtl' : 'ltr';
  }

  t(key: string, params?: Record<string, string | number>): string {
    const langTranslations = this.translations[this.locale] || this.translations['en'];
    let text = langTranslations?.[key] || this.translations['en']?.[key] || key;

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }

    return text;
  }

  registerTranslations(locale: string, translations: Record<string, string>): void {
    this.translations[locale] = {
      ...this.translations[locale],
      ...translations,
    };
  }
}
