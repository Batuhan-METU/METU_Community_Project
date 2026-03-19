# METUHub – Yol Haritası

> ODTÜ topluluk etkinliklerini tek yerde toplayan web sitesi ve mobil uygulama için adım adım plan.

---

## Şu Anki Durum

- **Backend**: Express API, communities/events/users route’ları, PostgreSQL bağlantı havuzu hazır, veriler şu an örnek (in-memory)
- **Frontend**: Next.js ana sayfa, topluluklar ve etkinlikler listeleniyor
- **Hedef**: Web + mobil uygulama, ODTÜ hesabıyla giriş, ilgi alanlarına göre öneri, kolay başvuru, cüzdan, analitik vb.

---

# FAZA 0: Temeller (1–2 hafta)

## 0.1 Veritabanı Tasarımı

Gerçek veriyi PostgreSQL’e taşımadan önce schema’yı netleştirin.

**Tablo taslağı:**
- `users` — id, email, name, department, class_year, created_at, vb.
- `communities` — id, name, slug, description, category, created_at, vb.
- `events` — id, community_id, title, description, date_time, location, ticket_price, iban, capacity, created_at, vb.
- `user_hobbies` / `user_interests` — kullanıcı ilgi alanları
- `event_registrations` — etkinliğe kayıt / katılım
- `community_members` — topluluk üyelikleri

## 0.2 Migration ve Seed

- `node-pg-migrate` veya `knex` ile migration dosyaları
- Örnek topluluk ve etkinlik seed verisi
- Backend route’larını gerçek DB’ye bağlayın (sampleEvents/sampleCommunities → pool.query)

## 0.3 Frontend Routing

- Ana sayfa, topluluk detay (`/communities/[slug]`), etkinlik detay (`/events/[id]`)
- Temel layout (header, footer, navigation)

**Bu fazın çıktısı:** Gerçek DB + CRUD + temel sayfa yapısı.

---

# FAZA 1: MVP – Temel Deneyim (2–3 hafta)

## 1.1 Kimlik Doğrulama

- ODTÜ SSO entegrasyonu (OAuth2 veya basit SAML) veya başlangıçta **sahte ODTÜ girişi** (email ile test)
- JWT veya session tabanlı auth
- `/api/users/me` gerçek kullanıcıyı dönsün

## 1.2 Kullanıcı Profili

- Profil sayfası
- Hobiler / ilgi alanları seçim formu (checkbox’lar veya tag input)
- Backend’e `user_interests` kaydı

## 1.3 Alana Göre Filtreleme

- Etkinlik ve topluluk listelerinde filtre:
  - Kategori (Spor, Sanat, Teknoloji vb.)
  - Tarih aralığı
  - Konum
- Query parametreleri ile backend filtreleme (`?category=Sanat&from=2026-03-01`)

## 1.4 Topluluk Ana Sayfası

- Her topluluk için detay sayfası:
  - Açıklama, kategorisi, iletişim
  - O topluluğun etkinlikleri
  - “Takip et” veya “Üye ol” butonu (backend’de `community_members`)

## 1.5 Kolay Başvuru / Katılım

- Etkinlik detay sayfasında “Katıl” veya “Bilet Al” butonu
- Basit başvuru formu (ad, email, opsiyonel sorular)
- Backend: `event_registrations` tablosuna kayıt
- Kayıt sonrası onay mesajı veya e-posta (basit)

**Bu fazın çıktısı:** Giriş yapabilen, filtreleyebilen, topluluk/etkinlik gören ve başvuru yapabilen bir MVP.

---

# FAZA 2: Öneri Sistemi ve İlgi Alanı AI (2–3 hafta)

## 2.1 Kural Tabanlı Öneri (Önce)

- Kullanıcının `hobbies` + `department` + `class_year` ile eşleşen topluluk/etkinlik sorguları
- “Sana özel” bölümü: ilgi alanlarına göre sıralama

## 2.2 İlgi Alanı AI Entegrasyonu (Sonra)

- Kullanıcı metinsel olarak ilgi alanlarını yazabilsin (örn: “müzik, salsa, startup”)
- Bu metni OpenAI / Gemini vb. ile analiz et, kategorilere çevir
- Bu kategorilere göre topluluk/etkinlik öner
- Alternatif: embedding tabanlı benzerlik (daha gelişmiş)

**Bu fazın çıktısı:** Kişiselleştirilmiş öneri akışı.

---

# FAZA 3: Topluluklar İçin Araçlar (2–3 hafta)

## 3.1 Topluluk Paneli

- Topluluk yöneticileri için dashboard (rol: `community_admin`)
- Kendi etkinliklerini ekleme / düzenleme / silme
- Basit onay akışı (gerekirse METU admin onayı)

## 3.2 Etkinlik İlgi Analizi

- Her etkinlik için:
  - Görüntülenme sayısı
  - Kayıt sayısı
  - “İlgi duyuyorum” tıklaması (opsiyonel)
- Topluluk panelinde “Hangi etkinlik daha çok ilgi gördü?” raporu
- Grafik: kayıt sayısı, görüntülenme vs. zaman

## 3.3 Üye Memnuniyet Oranı

- Etkinlik sonrası kısa anket (1–5 yıldız veya “Memnun kaldım / Kaldım / Kalmadım”)
- `event_feedback` tablosu
- Topluluk panelinde ortalama memnuniyet skoru
- Zaman içinde trend grafiği

## 3.4 İlan Verme

- Topluluklar için duyuru/ilan sistemi
- “X kişi arıyoruz”, “Y etkinliği için gönüllü”, “Z için ekip kuruyoruz”
- `announcements` tablosu, tarih + kategorize

**Bu fazın çıktısı:** Topluluklar kendi etkinliklerini yönetebilir, ilgi ve memnuniyet verilerini görebilir.

---

# FAZA 4: Çakışma, Katılım, Sosyal (2–3 hafta)

## 4.1 Çakışma Uyarısı

- Kullanıcı hangi etkinliklere kayıtlı → tarih/saat çakışması kontrolü
- “Bu etkinliğe kaydolursan X etkinliği ile çakışır” uyarısı
- Takvime ekleme (iCal / Google Calendar export) — çakışmayı kullanıcı da görebilir

## 4.2 Katılım Tahmini

- Geçmiş etkinliklerde kayıt sayısı vs. gerçek katılım oranı
- Yeni etkinlik için “Tahmini katılım: ~%70 (X kişi)” gösterimi
- Topluluk panelinde kapasite planlaması önerisi

## 4.3 Hazırlıklar İçin “Beraber Gidin”

- Etkinlik detayında “Beraber gidelim” / “Arkadaş ara” özelliği
- Kullanıcı “Bu etkinliğe beraber gitmek isteyenler” listesine eklenebilir
- Eşleşme: aynı etkinliğe kayıtlı, uyumlu kullanıcılar birbirini görebilir (anonim veya isteğe bağlı)
- Tablo: `event_companion_requests` veya benzeri

## 4.4 Yeni Topluluk Tayfa

- “Yeni topluluk kurmak isteyenler” formu
- Benzer ilgi alanlarına sahip kullanıcıları eşleştir
- “Sizinle aynı alanda topluluk kurmak isteyen X kişi var” bildirimi
- `community_formation_requests` tablosu


**Bu fazın çıktısı:** Daha sosyal, planlamaya yardımcı bir deneyim.

---

# FAZA 5: Cüzdan ve Ödeme (2–4 hafta)

## 5.1 Cüzdan Konsepti

- Önce netleştirin: **Gerçek para mı, sanal puan mı?**
  - Sanal puan: etkinliklere katılım, anket doldurma ile kazanılan “hub puanı”
  - Gerçek para: bilet satışı, bağış vb.
- `user_wallet` tablosu: balance, currency, transactions

## 5.2 Bilet / Katılım Ücreti

- Ücretli etkinliklerde bilet fiyatı zaten var (`ticket_price`, `iban`)
- Cüzdan ile: bakiye üzerinden ödeme
- Veya: Stripe / iyzico entegrasyonu (gerçek ödeme)
- Ödeme kaydı ve bilet / QR kodu üretimi

## 5.3 Ödül / Gamification (Opsiyonel)

- Etkinlik katılımı → puan
- Anket doldurma → puan
- Puan ile rozet veya özel etkinliklere erken erişim

**Bu fazın çıktısı:** Ücretli etkinliklerde ödeme ve basit cüzdan deneyimi.

---

# FAZA 6: Mobil Uygulama (3–4 hafta)

## 6.1 Strateji

- **React Native + Expo** veya **Flutter**
- Mevcut REST API’yi kullan; ek endpoint gerekirse backend’e ekleyin
- Paylaşılan tip tanımları (TypeScript) `shared/types` benzeri bir pakette tutulabilir

## 6.2 Mobil Özellik Seti

- Giriş (ODTÜ SSO veya deep link)
- Ana sayfa: topluluklar + etkinlikler
- Filtreleme
- Profil, hobiler
- Etkinlik detayı ve başvuru
- Push bildirimleri (yaklaşan etkinlik, çakışma uyarısı, yeni ilan)
- Takvim görünümü
- Cüzdan (varsa)

## 6.3 App Store / Play Store

- TestFlight / internal testing
- Store metadata, ekran görüntüleri, gizlilik politikası

**Bu fazın çıktısı:** Web ile aynı temel deneyimi sunan bir mobil uygulama.

---

# Özet Tablo

| Faz | Odak | Tahmini Süre |
|-----|------|--------------|
| **0** | DB, migration, temel routing | 1–2 hafta |
| **1** | Auth, profil, filtre, topluluk sayfası, başvuru | 2–3 hafta |
| **2** | Öneri sistemi + AI ilgi alanı | 2–3 hafta |
| **3** | Topluluk paneli, ilgi/memnuniyet, ilan | 2–3 hafta |
| **4** | Çakışma uyarısı, katılım tahmini, beraber git, yeni kulüp | 2–3 hafta |
| **5** | Cüzdan, ödeme, bilet | 2–4 hafta |
| **6** | Mobil uygulama | 3–4 hafta |

**Toplam kabaca:** 14–22 hafta (3.5–5.5 ay), 2 kişi part-time çalışırsanız.

---

# Öncelik Önerisi

En hızlı değer için:

1. **Faza 0 + Faza 1** — Temel akışı çalışır hale getirin.
2. **Faza 3 (3.1, 3.2)** — Topluluklar kendi etkinliklerini girsin, ilgi verisi toplansın.
3. **Faza 2** — AI/öneri ile fark yaratın.
4. **Faza 4** — Çakışma ve “beraber git” ile sosyal katmanı ekleyin.
5. **Faza 5** — Cüzdan/ödeme ihtiyaç olursa.
6. **Faza 6** — Mobil, web stabil olduktan sonra.

---

# Teknik Notlar

- **ODTÜ SSO**: Resmi OAuth2/SAML dokümantasyonunu ODTÜ IT’ten almanız gerekir.
- **AI**: Başlangıç için OpenAI veya Gemini API yeterli; maliyet için rate limit ve caching düşünün.
- **Cüzdan**: Gerçek para için Türkiye’de lisans gereklilikleri var; önce sanal puan ile başlamak daha güvenli.
- **Mobil**: Expo ile hızlı başlayın; native modüller gerekirse bare workflow’a geçersiniz.

---

Bu yol haritası değiştirilebilir; her fazın sonunda kullanıcı geri bildirimi ile öncelikleri güncelleyebilirsiniz.
