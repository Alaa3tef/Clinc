import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  readonly currentLang = signal<'ar' | 'en'>('ar');
  readonly direction = signal<'rtl' | 'ltr'>('rtl');

  private translations: Record<'ar' | 'en', Record<string, any>> = {
    ar: {},
    en: {}
  };

  constructor() {
    // Load persisted language or default to Arabic
    const saved = localStorage.getItem('lumiere_lang') as 'ar' | 'en' | null;
    const initialLang = saved === 'en' ? 'en' : 'ar';
    this.currentLang.set(initialLang);
    this.direction.set(initialLang === 'ar' ? 'rtl' : 'ltr');

    // Update document attributes whenever currentLang changes
    effect(() => {
      const lang = this.currentLang();
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      this.direction.set(dir);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem('lumiere_lang', lang);
    });

    this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      const [arRes, enRes] = await Promise.all([
        fetch('i18n/ar.json'),
        fetch('i18n/en.json')
      ]);
      if (arRes.ok) this.translations.ar = await arRes.json();
      if (enRes.ok) this.translations.en = await enRes.json();
    } catch (e) {
      console.warn('Failed to load external i18n JSON files, using in-memory fallbacks', e);
    }
  }

  translate(path: string): string {
    const lang = this.currentLang();
    const dict = this.translations[lang];
    if (!dict || Object.keys(dict).length === 0) {
      return this.fallback(path, lang);
    }
    const value = path.split('.').reduce((acc, part) => acc && acc[part], dict);
    return typeof value === 'string' ? value : (this.fallback(path, lang) || path);
  }

  toggleLanguage() {
    const next = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.currentLang.set(next);
  }

  setLanguage(lang: 'ar' | 'en') {
    this.currentLang.set(lang);
  }

  private fallback(path: string, lang: 'ar' | 'en'): string {
    const fallbacks: Record<string, { ar: string; en: string }> = {
      'BRAND.NAME': { ar: 'لوميير', en: 'Lumière' },
      'BRAND.SUBTITLE': { ar: 'مركز التجميل والليزر', en: 'Cosmetic & Laser Center' },
      'MENU.DASHBOARD': { ar: 'لوحة التحكم', en: 'Dashboard' },
      'MENU.PATIENTS': { ar: 'المرضى', en: 'Patients' },
      'MENU.APPOINTMENTS': { ar: 'المواعيد', en: 'Appointments' },
      'MENU.TREATMENTS': { ar: 'العلاجات', en: 'Treatments' },
      'MENU.SESSIONS': { ar: 'الجلسات', en: 'Sessions' },
      'MENU.DEVICES': { ar: 'أجهزة الليزر', en: 'Laser Devices' },
      'MENU.PAYMENTS': { ar: 'المدفوعات', en: 'Payments' },
      'MENU.STAFF': { ar: 'فريق العمل', en: 'Staff' },
      'MENU.REPORTS': { ar: 'التقارير', en: 'Reports' },
      'MENU.INVENTORY': { ar: 'المخزون', en: 'Inventory' },
      'MENU.SETTINGS': { ar: 'الإعدادات', en: 'Settings' }
    };
    return fallbacks[path] ? fallbacks[path][lang] : path;
  }
}
