/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Sarı gelme olasılığı?', en: 'The chance of amber?',
      note: 'Torbada 3 sarı ve 7 siyah top var. Bir top çekiyoruz. A olayı: sarı top çekmek.' },
    { scene: 2, start: 10.8, end: 20.4, tr: 'P(A) = 3/10, P(A′) = 7/10', en: 'P(A) = 3/10, P(A′) = 7/10',
      note: 'Olası tüm çıktılar 10 top. A’nın olasılığı 3 bölü 10. Sarı top çekmemek A’nın tümleyeni, A üssü: olasılığı 7 bölü 10.' },
    { scene: 2, start: 20.6, end: 27.8, tr: 'Toplam 1', en: 'The sum is 1',
      note: 'Her çıktı ya A’da ya da A üssünde. 3 bölü 10 artı 7 bölü 10, 10 bölü 10, yani 1.' },
    { scene: 3, start: 28.8, end: 39.4, tr: 'Zar ve çark', en: 'A die and a spinner',
      note: 'Bir zarda 6 gelmesi 1 bölü 6, gelmemesi 5 bölü 6: toplam 1. Sekiz bölmeli çarkta çift sayı 4 bölü 8, çift olmayan 4 bölü 8: toplam 1.' },
    { scene: 3, start: 39.6, end: 45.8, tr: 'Kartlar: yine 1', en: 'Cards: 1 again',
      note: '1’den 20’ye kartlarda asal sayı 8 bölü 20, asal olmayan 12 bölü 20. Toplam yine 1.' },
    { scene: 4, start: 46.8, end: 55.8, tr: 'A ve A′ tüm çıktıları paylaşır', en: 'A and A′ share all outcomes',
      note: 'A ve A üssü bütün çıktıları paylaşır. Biri büyüyünce öteki küçülür; toplamları hep 1.' },
    { scene: 4, start: 56.0, end: 63.8, tr: 'P(A′) = 1 − P(A)', en: 'P(A′) = 1 − P(A)',
      note: 'Genelleyelim: bir olayın tümleyeninin olasılığı, 1 eksi olayın olasılığı.' },
    { scene: 5, start: 64.8, end: 73.8, tr: 'Tümleyenle hesap', en: 'Using the complement',
      note: 'Yağmur yağma olasılığı 0,35 ise yağmama olasılığı 1 eksi 0,35, yani 0,65. Zarda 1 gelmeme olasılığı 1 eksi 1 bölü 6, 5 bölü 6.' },
    { scene: 5, start: 74.0, end: 79.8, tr: 'Olmama = 1 − olma', en: 'Not happening = 1 − happening',
      note: 'Hedefi vurma olasılığı 0,8 ise ıskalama 0,2. Olmama olasılığı, 1 eksi olma olasılığı.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'P(A) + P(A′) = 1', en: 'P(A) + P(A′) = 1',
      note: 'Aklında kalsın: bir olay ile tümleyeninin olasılıklarının toplamı 1.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'P(A′) = 1 − P(A)', en: 'P(A′) = 1 − P(A)',
      note: 'Tümleyenin olasılığı: 1 eksi olayın olasılığı!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
