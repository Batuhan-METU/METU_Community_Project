## METUHub – ODTÜ Topluluk ve Etkinlik Platformu

**METUHub**, ODTÜ'deki tüm öğrenci topluluklarını ve etkinliklerini tek bir web sitesi ve (ileride) mobil uygulamada toplayan bir platformdur. Öğrenciler ODTÜ hesaplarıyla giriş yapar, hobilerini seçer ve kendilerine uygun topluluklar ile etkinlikler için öneriler alır.

### Özellikler (MVP)

- **Topluluklar**: ODTÜ topluluklarını listeleme, detay sayfası görüntüleme.
- **Etkinlikler**: Toplulukların etkinliklerini listeleme, detaylarını gösterme.
- **Öğrenci Profili**: Temel kullanıcı bilgileri ve hobiler (ileride).
- **Öneri Sistemi**: Hobiler ve ilgi alanlarına göre topluluk/etkinlik önerme (önce kural tabanlı, sonra AI ile geliştirilebilir).
- **Topluluk İşlemleri (ileride)**: Bilet satışı simülasyonu, başvuru formları, ilgilileri birleştirip yeni topluluk kurma önerisi vb.

### Proje Yapısı

- `backend/` – Node.js + Express tabanlı REST API
  - Örnek endpointler:
    - `GET /api/health` – servis durumu
    - `GET /api/communities` – topluluk listesi (şu an örnek veri)
    - `GET /api/events` – etkinlik listesi (şu an örnek veri)
    - `GET /api/users/me` – sahte current user bilgisi
- `frontend/` – Next.js tabanlı web arayüzü
  - Ana sayfada:
    - Öne çıkan topluluklar (backend'den çekilen)
    - Yaklaşan etkinlikler (backend'den çekilen)

İleride `app/` altında React Native / Expo ile mobil uygulama da eklenecektir.

### Geliştirme Ortamı

#### Backend çalıştırma

```bash
cd backend
npm install
npm run dev
```

Varsayılan olarak `http://localhost:8080` adresinde çalışır.

Önemli endpointler:

- `http://localhost:8080/api/health`
- `http://localhost:8080/api/communities`
- `http://localhost:8080/api/events`

#### Frontend (web) çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Varsayılan olarak `http://localhost:3000` adresinde çalışır ve backend'e bağlanır.

### Yol Haritası (Kısa Vadeli)

- Basit auth (fake ODTÜ hesabı) ve profil ekranı.
- Kullanıcının hobilerini seçebileceği profil formu.
- Hobiler + bölüm + sınıfa göre öneri algoritması.
- Topluluk detay sayfaları ve etkinlik başvuru / bilet alma akışı.

Bu dosya, proje fikrini ve mimarisini özetlemek için oluşturuldu; böylece farklı sohbetlerde veya ekip üyeleriyle çalışırken bağlamı hızlıca geri kazanabilirsiniz.

